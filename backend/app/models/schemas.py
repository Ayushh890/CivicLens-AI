from pydantic import BaseModel
from typing import Optional


class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    pincode: str
    role: str = "citizen"
    adminCode: Optional[str] = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    pincode: str


class TokenResponse(BaseModel):
    token: str
    user: UserResponse


class ReportCreate(BaseModel):
    title: str
    description: str
    latitude: float = 28.6139
    longitude: float = 77.2090
    address: str = ""
    ward: str = ""
    photoData: Optional[str] = None


class StatusUpdate(BaseModel):
    status: str


class StatusHistoryEntry(BaseModel):
    status: str
    timestamp: str
    note: str


class AnalysisResponse(BaseModel):
    issueType: str
    severityScore: int
    severityLevel: str
    reasoning: str
    suggestedTitle: str
    department: str
