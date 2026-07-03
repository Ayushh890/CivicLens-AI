from pydantic import BaseModel
from typing import Optional


class ReportCreate(BaseModel):
    title: str
    description: str
    issue_type: str = ""
    latitude: float = 28.6139
    longitude: float = 77.2090
    address: str = ""
    ward: str = ""
    citizen_id: str = "CIT-001"
    citizen_name: str = "Anonymous"
    photo_data: Optional[str] = None


class ReportResponse(BaseModel):
    id: str
    title: str
    description: str
    issue_type: str
    severity_score: int
    status: str
    latitude: float
    longitude: float
    address: str
    ward: str
    citizen_id: str
    citizen_name: str
    created_at: str
    department: str
    reasoning: str


class AnalysisResponse(BaseModel):
    issue_type: str
    severity_score: int
    severity_level: str
    reasoning: str
    suggested_title: str
    department: str
