import json
import re
from typing import TypedDict, Optional, List, Dict, Any
from langgraph.graph import StateGraph, END
from tools.weather_tool import fetch_weather_for_location
from tools.db_tool import search_catalog_items
from rag.vector_store import retrieve_heritage_context
from config import GEMINI_API_KEY

class ConciergeState(TypedDict):
    user_message: str
    language: str
    detected_region: str
    weather_data: Optional[Dict[str, Any]]
    rag_context: Optional[str]
    catalog_results: Optional[List[Dict[str, Any]]]
    final_response: str
    suggested_actions: List[Dict[str, Any]]
    itinerary_plan: Optional[List[Dict[str, Any]]]

async def detect_intent_and_region(state: ConciergeState) -> Dict[str, Any]:
    msg = state["user_message"].lower()
    
    # Simple, reliable region detector
    region = "bargou"
    if "kesra" in msg:
        region = "kesra"
    elif "makthar" in msg or "mactaris" in msg:
        region = "makthar"
    elif "zama" in msg or "ville" in msg:
        region = "siliana_center"

    # Detect language if not specified
    lang = state.get("language") or "fr"
    if any("\u0600" <= c <= "\u06FF" for c in msg):
        lang = "ar"
    elif any(w in msg for w in ["what", "how", "weather", "book", "trip", "where", "stay"]):
        lang = "en"

    return {"detected_region": region, "language": lang}

async def fetch_weather_node(state: ConciergeState) -> Dict[str, Any]:
    region = state.get("detected_region", "bargou")
    weather = await fetch_weather_for_location(region)
    return {"weather_data": weather}

async def retrieve_rag_node(state: ConciergeState) -> Dict[str, Any]:
    msg = state["user_message"]
    region = state.get("detected_region")
    context = retrieve_heritage_context(query=msg, top_k=2, region=region if region != "bargou" else None)
    return {"rag_context": context}

async def search_catalog_node(state: ConciergeState) -> Dict[str, Any]:
    msg = state["user_message"].lower()
    # If the user is looking for activities, stays, or price
    max_p = None
    price_match = re.search(r"(\d+)\s*(tnd|dt|dinars?)", msg)
    if price_match:
        try:
            max_p = float(price_match.group(1))
        except ValueError:
            pass

    items = search_catalog_items(max_price=max_p, query_text=state.get("detected_region"))
    return {"catalog_results": items[:4]}

async def generate_response_node(state: ConciergeState) -> Dict[str, Any]:
    msg = state["user_message"]
    lang = state.get("language", "fr")
    weather = state.get("weather_data") or {}
    rag = state.get("rag_context") or ""
    catalog = state.get("catalog_results") or []
    
    temp = weather.get("temperature_c", 22)
    cond = weather.get("condition", "Ciel Dégagé")
    precip = weather.get("precipitation_mm", 0)
    advisory = " ".join(weather.get("advisory", []))
    region_name = weather.get("region", "Siliana")

    # If GEMINI_API_KEY is available, use Google GenAI
    if GEMINI_API_KEY:
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            llm = ChatGoogleGenerativeAI(
                model="gemini-2.0-flash",
                google_api_key=GEMINI_API_KEY,
                temperature=0.4
            )
            prompt = f"""
Tu es l'assistant de voyage intelligent officiel et guide expert pour la région de Siliana en Tunisie (« Visit Siliana AI Concierge »).
Langue de réponse attendue : {'Arabe tunisien/standard' if lang == 'ar' else 'Anglais' if lang == 'en' else 'Français'}.

Informations Météo En Direct ({region_name}) :
- Température : {temp}°C
- Condition : {cond} (Précipitations : {precip} mm)
- Avis de sécurité plein air : {advisory}

Documentation Patrimoine et Histoire (RAG certifié) :
{rag}

Catalogue d'hébergements et activités disponibles :
{json.dumps(catalog, ensure_ascii=False, indent=2)}

Demande du voyageur : « {msg} »

Instructions :
1. Salue chaleureusement en mentionnant la météo actuelle à {region_name} et les recommandations de sécurité adaptées.
2. Réponds précisément à la question en t'appuyant sur les faits historiques ou naturels certifiés.
3. Si le voyageur cherche des activités ou hébergements, propose 1 à 2 options concrètes du catalogue avec prix en TND.
4. Reste convivial, éco-responsable et valorise le terroir local.
"""
            res = await llm.ainvoke(prompt)
            final_text = res.content
        except Exception as e:
            final_text = None
    else:
        final_text = None

    # Deterministic high-quality fallback if no API key or network error
    if not final_text:
        if lang == "ar":
            final_text = (
                f"مرحباً بك في ولاية سليانة! 🌤️\n\n"
                f"حالة الطقس الحالية في {region_name} : {temp}°C مع {cond}. {advisory}\n\n"
                f"بناءً على طلبك، نوصيك باستكشاف قمم جبل برقو وقرية كسرة المعلقة وآثار مكثر (ماكتاريس). "
                f"تتوفر لدينا خيارات إقامة وأنشطة بيئية بأسعار تناسب تطلعاتك."
            )
        elif lang == "en":
            final_text = (
                f"Welcome to Siliana! 🌤️\n\n"
                f"Live weather in {region_name}: {temp}°C with {cond}. {advisory}\n\n"
                f"Based on your request, we recommend exploring Djebel Bargou trails, the cliffside village of Kesra, "
                f"and the historic Roman-Numidian ruins of Mactaris in Makthar. Check out our verified eco-stays and guided tours below!"
            )
        else:
            final_text = (
                f"Bienvenue en terre de Siliana ! 🌤️\n\n"
                f"Météo en direct à {region_name} : {temp}°C ({cond}). {advisory}\n\n"
                f"Pour votre visite, nous vous conseillons de combiner la découverte historique (vestiges de Makthar, mémoire de Zama) "
                f"avec les merveilles naturelles du Djebel Bargou et les sources de Kesra. "
                f"Voici les suggestions personnalisées de notre catalogue ci-dessous."
            )

    # Format suggested 1-click booking actions
    actions = []
    for item in catalog[:2]:
        cat = item.get("item_category", "activity")
        actions.append({
            "type": "booking_link",
            "url": f"/booking/{cat}/{item.get('id', 1)}",
            "title": item.get("title", "Offre Siliana"),
            "price": item.get("price"),
            "category": cat
        })

    return {
        "final_response": final_text,
        "suggested_actions": actions
    }

# Build the LangGraph StateGraph
workflow = StateGraph(ConciergeState)
workflow.add_node("detect_intent", detect_intent_and_region)
workflow.add_node("fetch_weather", fetch_weather_node)
workflow.add_node("retrieve_rag", retrieve_rag_node)
workflow.add_node("search_catalog", search_catalog_node)
workflow.add_node("generate_response", generate_response_node)

workflow.set_entry_point("detect_intent")
workflow.add_edge("detect_intent", "fetch_weather")
workflow.add_edge("fetch_weather", "retrieve_rag")
workflow.add_edge("retrieve_rag", "search_catalog")
workflow.add_edge("search_catalog", "generate_response")
workflow.add_edge("generate_response", END)

concierge_agent = workflow.compile()
