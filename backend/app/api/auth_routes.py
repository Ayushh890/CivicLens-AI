from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends
from ..models.schemas import UserRegister, UserLogin, UserResponse, TokenResponse
from ..services.auth import (
    hash_password, verify_password, create_token,
    get_current_user, VALID_PINCODES, ADMIN_ACCESS_CODE,
)
from ..database import users_collection

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
async def register(data: UserRegister):
    if not data.name or not data.email or not data.password or not data.pincode:
        raise HTTPException(status_code=400, detail="All fields are required")

    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    if data.pincode not in VALID_PINCODES:
        raise HTTPException(
            status_code=400,
            detail="Invalid pincode. Only New Delhi pincodes (110001-110096) are accepted",
        )

    existing = await users_collection.find_one({"email": data.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    if data.role == "admin":
        if not data.adminCode or data.adminCode != ADMIN_ACCESS_CODE:
            raise HTTPException(status_code=400, detail="Invalid admin access code")

    prefix = "ADM" if data.role == "admin" else "CIT"
    count = await users_collection.count_documents({"role": data.role})
    user_id = f"{prefix}-{str(count + 1).zfill(3)}"

    user = {
        "id": user_id,
        "name": data.name,
        "email": data.email.lower(),
        "passwordHash": hash_password(data.password),
        "role": data.role,
        "pincode": data.pincode,
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }

    await users_collection.insert_one(user)
    token = create_token(user_id, data.role)

    return {
        "token": token,
        "user": {"id": user_id, "name": data.name, "email": data.email.lower(), "role": data.role, "pincode": data.pincode},
    }


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    if not data.email or not data.password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    user = await users_collection.find_one({"email": data.email.lower()})
    if not user:
        raise HTTPException(status_code=400, detail="No account found with this email")

    if not verify_password(data.password, user["passwordHash"]):
        raise HTTPException(status_code=400, detail="Incorrect password")

    token = create_token(user["id"], user["role"])

    return {
        "token": token,
        "user": {
            "id": user["id"], "name": user["name"], "email": user["email"],
            "role": user["role"], "pincode": user["pincode"],
        },
    }


@router.get("/me", response_model=UserResponse)
async def me(user=Depends(get_current_user)):
    return user
