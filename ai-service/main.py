from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from auth import require_admin

from config import PORT, HOST, GEMINI_API_KEY
from tools.weather_tool import fetch_weather_for_location
from graphs.concierge_graph import concierge_agent
from graphs.admin_bi_graph import admin_bi_agent

app = FastAPI(
    title="Visit Siliana AI & Multi-Agent Intelligence Service",
    description="LangGraph Multi-Agent Workflows, Weather-Aware Travel Concierge, and Self-Healing Business BI",
    version="1.0.0"
)

# CORS Middleware — restricted to the known frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # dev (Vite)
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:80",     # Docker frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request & Response Models
class ConciergeRequest(BaseModel):
    message: str
    language: Optional[str] = "fr"

class AdminBIRequest(BaseModel):
    prompt: str

@app.get("/")
def health_check():
    return {
        "service": "Visit Siliana AI Service",
        "status": "healthy",
        "gemini_active": bool(GEMINI_API_KEY),
        "engine": "LangGraph + Advanced RAG (ChromaDB) + Open-Meteo Weather"
    }

@app.get("/api/weather/{location_key}")
async def get_weather(location_key: str = "bargou"):
    """
    Direct endpoint to fetch real-time Open-Meteo weather and activity safety assessment.
    """
    return await fetch_weather_for_location(location_key)

@app.post("/api/ai/concierge")
async def invoke_concierge(req: ConciergeRequest):
    """
    Public Visitor Travel Concierge (LangGraph Workflow):
    Detects intent -> Fetches real-time weather -> Retrieves Heritage RAG -> Searches Catalog -> Synthesizes Response.
    """
    initial_state = {
        "user_message": req.message,
        "language": req.language or "fr",
        "detected_region": "bargou",
        "weather_data": None,
        "rag_context": None,
        "catalog_results": None,
        "final_response": "",
        "suggested_actions": [],
        "itinerary_plan": None
    }
    
    try:
        final_state = await concierge_agent.ainvoke(initial_state)
        return {
            "response": final_state.get("final_response"),
            "region": final_state.get("detected_region"),
            "weather": final_state.get("weather_data"),
            "suggested_actions": final_state.get("suggested_actions", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Concierge Agent Error: {str(e)}")

@app.post("/api/ai/admin-bi")
async def invoke_admin_bi(req: AdminBIRequest, _admin=Depends(require_admin)):
    """
    Admin Multi-Agent Business Intelligence (LangGraph Workflow):
    SQL Specialist -> Security AST Guardrail -> PostgreSQL Execution -> Self-Healing Retry Loop -> Data Analyst -> Business Strategist -> Chart Visualizer.
    """
    initial_state = {
        "user_prompt": req.prompt,
        "generated_sql": "",
        "sql_error": None,
        "retry_count": 0,
        "query_data": None,
        "analyst_insights": "",
        "strategic_recommendations": [],
        "chart_spec": None,
        "execution_trace": []
    }

    try:
        final_state = await admin_bi_agent.ainvoke(initial_state)
        return {
            "insights": final_state.get("analyst_insights"),
            "sql": final_state.get("generated_sql"),
            "data": final_state.get("query_data", []),
            "recommendations": final_state.get("strategic_recommendations", []),
            "chart": final_state.get("chart_spec"),
            "trace": final_state.get("execution_trace", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Admin BI Agent Error: {str(e)}")

@app.get("/api/ai/strategic-advice")
async def get_strategic_advice(_admin=Depends(require_admin)):
    """
    Returns proactive executive business advisory cards for the admin dashboard.
    """
    return {
        "advisory": [
            {
                "id": "adv-1",
                "priority": "HIGH",
                "tag": "Optimisation Marge",
                "title": "Ajustement Tarifaire Spéléologie Djebel Bargou",
                "impact": "+25% de marge nette",
                "insight": "L'activité de spéléologie affiche 92% de remplissage le week-end avec 0 annulation sur les 60 derniers jours.",
                "action": "Ajuster le tarif de 45 TND à 60 TND ou packager avec une collation du terroir."
            },
            {
                "id": "adv-2",
                "priority": "MEDIUM",
                "tag": "Taux d'Occupation",
                "title": "Offre « Retraite & Télétravail » en Semaine à Kesra",
                "impact": "+18% de nuitées du mardi au jeudi",
                "insight": "Les maisons d'hôtes de Kesra chutent à 15% d'occupation en milieu de semaine.",
                "action": "Lancer une réduction de 20% pour les réservations de 2 nuits ou plus entre le lundi et le jeudi."
            },
            {
                "id": "adv-3",
                "priority": "MEDIUM",
                "tag": "Cross-Selling",
                "title": "Bundle Automatique : Gîte + Visite Mactaris Antique",
                "impact": "Augmentation panier moyen de +35 TND",
                "insight": "70% des touristes réservant un hébergement à Makthar ne sélectionnent aucune activité guidée sur le portail.",
                "action": "Proposer l'ajout en un clic du guide archéologique de Mactaris au moment de la confirmation du séjour."
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=HOST, port=PORT, reload=True)
