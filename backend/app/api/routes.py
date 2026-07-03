from fastapi import APIRouter, HTTPException
from ..models.schemas import ReportCreate, ReportResponse, AnalysisResponse
from ..services.analyzer import analyze_issue
from ..services.store import reports_store

router = APIRouter()


@router.get("/reports", response_model=list[ReportResponse])
def get_reports():
    return reports_store.get_all()


@router.get("/reports/{report_id}", response_model=ReportResponse)
def get_report(report_id: str):
    report = reports_store.get(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.post("/reports", response_model=ReportResponse)
def create_report(report: ReportCreate):
    return reports_store.add(report)


@router.post("/analyze", response_model=AnalysisResponse)
def analyze(text: str):
    return analyze_issue(text)


@router.patch("/reports/{report_id}/status")
def update_status(report_id: str, status: str):
    report = reports_store.update_status(report_id, status)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.get("/stats")
def get_stats():
    return reports_store.get_stats()
