import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from backend first (for shared JWT_SECRET), then ai-service/.env
# override=False preserves container-level environment variables (e.g. DB_HOST=postgres in Docker)
backend_env_path = Path(__file__).resolve().parent.parent / "backend" / ".env"
env_path = Path(__file__).resolve().parent / ".env"
if backend_env_path.exists():
    load_dotenv(backend_env_path, override=False)
if env_path.exists():
    load_dotenv(env_path, override=False)

PORT = int(os.getenv("AI_SERVICE_PORT", os.getenv("PORT", "8000")))
HOST = os.getenv("HOST", "0.0.0.0")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# PostgreSQL Settings
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "siliana123")
DB_NAME = os.getenv("DB_NAME", "visit_siliana")

# Siliana Coordinates for Open-Meteo
SILIANA_COORDS = {
    "siliana_center": {"lat": 36.0849, "lon": 9.3708, "name": "Siliana Ville"},
    "kesra": {"lat": 35.8156, "lon": 9.3644, "name": "Kesra (Village perché)"},
    "bargou": {"lat": 36.0917, "lon": 9.5833, "name": "Djebel Bargou (1260m)"},
    "makthar": {"lat": 35.8567, "lon": 9.2064, "name": "Makthar (Mactaris Antique)"},
}
