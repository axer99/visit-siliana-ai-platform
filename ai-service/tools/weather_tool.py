import httpx
from typing import Dict, Any, Optional
from config import SILIANA_COORDS

WMO_WEATHER_CODES = {
    0: ("Ciel Dégagé / Ensoleillé", "sunny", True),
    1: ("Principalement Dégagé", "mostly_sunny", True),
    2: ("Partiellement Nuageux", "partly_cloudy", True),
    3: ("Couvert", "cloudy", True),
    45: ("Brouillard", "fog", False),
    48: ("Brouillard Givrant", "fog", False),
    51: ("Bruine Légère", "light_rain", True),
    53: ("Bruine Modérée", "rain", False),
    55: ("Bruine Dense", "rain", False),
    61: ("Pluie Faible", "light_rain", True),
    63: ("Pluie Modérée", "rain", False),
    65: ("Pluie Forte", "heavy_rain", False),
    80: ("Averses Faibles", "rain", True),
    81: ("Averses Modérées", "rain", False),
    82: ("Averses Violentes", "heavy_rain", False),
    95: ("Orage", "thunderstorm", False),
    96: ("Orage avec Grêle Légère", "thunderstorm", False),
    99: ("Orage Violent avec Grêle", "thunderstorm", False),
}

async def fetch_weather_for_location(location_key: str = "bargou") -> Dict[str, Any]:
    """
    Fetch live weather data from Open-Meteo for a given region in Siliana governorate.
    Free, open-source, no API key required.
    """
    coords = SILIANA_COORDS.get(location_key, SILIANA_COORDS["bargou"])
    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={coords['lat']}&longitude={coords['lon']}"
        f"&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m"
        f"&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code"
        f"&timezone=Africa/Tunis"
    )

    try:
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()

        current = data.get("current", {})
        code = current.get("weather_code", 0)
        desc, condition_type, outdoor_safe = WMO_WEATHER_CODES.get(
            code, ("Conditions Inconnues", "variable", True)
        )
        
        temp = current.get("temperature_2m", 20.0)
        wind = current.get("wind_speed_10m", 10.0)
        precip = current.get("precipitation", 0.0)

        # Safety Assessment for Mountain activities (caving, trekking Djebel Bargou)
        caving_safe = precip == 0 and code < 60
        climbing_safe = precip == 0 and wind < 30 and code < 50
        hiking_safe = precip < 2.0 and wind < 40 and code < 80

        safety_advisory = []
        if not caving_safe:
            safety_advisory.append("⚠️ Spéléologie déconseillée : risque d'infiltration d'eau dans les cavités.")
        if not climbing_safe:
            safety_advisory.append("⚠️ Escalade / Tyrolienne déconseillée : parois humides ou rafales de vent.")
        if precip > 0:
            safety_advisory.append("💡 Privilégiez les visites culturelles couvertes (Musée archéologique de Makthar, Musée des traditions de Kesra, dégustations du terroir).")
        else:
            safety_advisory.append("✅ Conditions idéales pour la randonnée et la découverte des crêtes de Bargou et Kesra.")

        return {
            "region": coords["name"],
            "coordinates": {"lat": coords["lat"], "lon": coords["lon"]},
            "temperature_c": temp,
            "condition": desc,
            "condition_type": condition_type,
            "wind_speed_kmh": wind,
            "precipitation_mm": precip,
            "is_outdoor_safe": outdoor_safe and wind < 35,
            "activity_safety": {
                "caving_safe": caving_safe,
                "climbing_safe": climbing_safe,
                "hiking_safe": hiking_safe,
            },
            "advisory": safety_advisory,
            "forecast_today": {
                "max_temp": data.get("daily", {}).get("temperature_2m_max", [temp])[0],
                "min_temp": data.get("daily", {}).get("temperature_2m_min", [temp])[0],
                "rain_sum_mm": data.get("daily", {}).get("precipitation_sum", [precip])[0],
            }
        }
    except Exception as e:
        # Fallback offline graceful weather response
        return {
            "region": coords["name"],
            "temperature_c": 22.0,
            "condition": "Ciel Dégagé (Mode Hors-Ligne)",
            "condition_type": "sunny",
            "wind_speed_kmh": 12.0,
            "precipitation_mm": 0.0,
            "is_outdoor_safe": True,
            "activity_safety": {
                "caving_safe": True,
                "climbing_safe": True,
                "hiking_safe": True,
            },
            "advisory": ["✅ Conditions tempérées favorables à l'éco-tourisme."],
            "fallback": True,
            "error_detail": str(e)
        }
