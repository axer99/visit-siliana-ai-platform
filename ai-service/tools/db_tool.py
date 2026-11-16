import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any, List, Tuple
from config import DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
from tools.sql_guardrail import validate_sql_safety, enforce_safety_limit

DB_SCHEMA_PROMPT = """
Database Schema (PostgreSQL):
1. activities (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    type VARCHAR,
    difficulty VARCHAR,
    duration_hours NUMERIC,
    price NUMERIC,
    description TEXT,
    image_url VARCHAR,
    created_at TIMESTAMP
)

2. stays (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    type VARCHAR,
    capacity INTEGER,
    price_per_night NUMERIC,
    description TEXT,
    image_url VARCHAR,
    created_at TIMESTAMP
)

3. events (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    description TEXT,
    event_date DATE,
    location VARCHAR,
    image_url VARCHAR,
    created_at TIMESTAMP
)

4. bookings (
    id SERIAL PRIMARY KEY,
    activity_id INTEGER REFERENCES activities(id),
    stay_id INTEGER REFERENCES stays(id),
    event_id INTEGER REFERENCES events(id),
    full_name VARCHAR,
    email VARCHAR,
    phone VARCHAR,
    people_count INTEGER,
    booking_date DATE,
    total_price NUMERIC,
    status VARCHAR DEFAULT 'pending' (values: 'pending', 'confirmed', 'cancelled'),
    created_at TIMESTAMP
)
"""

def execute_safe_query(query: str) -> Tuple[bool, Any, str]:
    """
    Validates and executes a SQL query on PostgreSQL in a STRICT READ-ONLY session.
    
    Returns:
        (success: bool, data_or_error: Any, message: str)
    """
    is_safe, reason = validate_sql_safety(query)
    if not is_safe:
        return False, None, f"Security Guardrail Rejected: {reason}"

    safe_query = enforce_safety_limit(query)

    conn = None
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            dbname=DB_NAME,
            connect_timeout=4
        )
        # Enforce read-only at the PostgreSQL driver level
        conn.set_session(readonly=True, autocommit=True)
        
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(safe_query)
            rows = cursor.fetchall()
            # Convert rows to serializable dicts
            clean_rows = [dict(r) for r in rows]
            return True, clean_rows, "Query executed successfully."

    except psycopg2.Error as pg_err:
        error_msg = f"PostgreSQL Error [{pg_err.pgcode}]: {str(pg_err).strip()}"
        return False, None, error_msg
    except Exception as e:
        return False, None, f"Database Connection/Execution Error: {str(e)}"
    finally:
        if conn:
            conn.close()

def search_catalog_items(category: str = None, max_price: float = None, query_text: str = None) -> List[Dict[str, Any]]:
    """
    Helper for the Concierge Agent to search both activities and stays simultaneously.
    """
    items = []
    
    act_sql = "SELECT id, title, type, difficulty, duration_hours, price, description, 'activity' as item_category FROM activities WHERE 1=1"
    params = []
    
    if max_price:
        act_sql += f" AND price <= {float(max_price)}"
    if query_text:
        clean_text = query_text.replace("'", "''")
        act_sql += f" AND (title ILIKE '%{clean_text}%' OR description ILIKE '%{clean_text}%')"
    
    success, act_rows, _ = execute_safe_query(act_sql)
    if success and act_rows:
        items.extend(act_rows)

    stay_sql = "SELECT id, title, type, capacity, price_per_night as price, description, 'stay' as item_category FROM stays WHERE 1=1"
    if max_price:
        stay_sql += f" AND price_per_night <= {float(max_price)}"
    if query_text:
        clean_text = query_text.replace("'", "''")
        stay_sql += f" AND (title ILIKE '%{clean_text}%' OR description ILIKE '%{clean_text}%')"

    success, stay_rows, _ = execute_safe_query(stay_sql)
    if success and stay_rows:
        items.extend(stay_rows)

    return items
