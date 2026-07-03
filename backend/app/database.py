import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/civiclens")

client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=10000, tlsCAFile=certifi.where())
db = client.civiclens

users_collection = db.users
reports_collection = db.reports


async def init_db():
    try:
        await users_collection.create_index("email", unique=True)
        await reports_collection.create_index("citizenId")
        await reports_collection.create_index("status")
        await reports_collection.create_index("issueType")
        await reports_collection.create_index("createdAt")

        from .services.auth import hash_password
        existing = await users_collection.find_one({"email": "admin@civiclens.gov.in"})
        if not existing:
            await users_collection.insert_one({
                "id": "ADM-001",
                "name": "Municipal Admin",
                "email": "admin@civiclens.gov.in",
                "passwordHash": hash_password("admin123"),
                "role": "admin",
                "pincode": "110001",
                "createdAt": "2026-01-01T00:00:00.000Z",
            })
        print("MongoDB connected successfully")
    except Exception as e:
        print(f"MongoDB connection error: {e}")
        print("Server will start but database operations will fail until MongoDB is reachable")
