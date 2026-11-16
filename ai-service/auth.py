import os
import jwt
from fastapi import Header, HTTPException


def require_admin(authorization: str = Header(None)):
    """
    FastAPI dependency: verifies the same JWT token used by the Express backend.
    Inject with Depends(require_admin) on any protected route.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token missing or malformed")
    token = authorization[7:]
    secret = os.environ.get("JWT_SECRET")
    if not secret:
        raise HTTPException(status_code=500, detail="Server misconfiguration: JWT_SECRET not set")
    try:
        return jwt.decode(token, secret, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
