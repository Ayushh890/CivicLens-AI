from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import PlainTextResponse
from ..models.schemas import ReportCreate, StatusUpdate, AnalysisResponse
from ..services.auth import get_current_user
from ..services.analyzer import analyze_issue
from ..services import store

router = APIRouter()


@router.get("/reports")
async def get_reports(
    type: str = Query(None),
    status: str = Query(None),
    ward: str = Query(None),
    severity: str = Query(None),
    user=Depends(get_current_user),
):
    filters = {}
    if type:
        filters["type"] = type
    if status:
        filters["status"] = status
    if ward:
        filters["ward"] = ward
    if severity:
        filters["severity"] = severity

    return await store.get_reports(user, filters if filters else None)


@router.get("/reports/export")
async def export_reports(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    csv = await store.export_csv()
    return PlainTextResponse(csv, media_type="text/csv", headers={
        "Content-Disposition": "attachment; filename=civiclens_reports.csv"
    })


@router.get("/reports/{report_id}")
async def get_report(report_id: str, user=Depends(get_current_user)):
    report = await store.get_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.post("/reports")
async def create_report(data: ReportCreate, user=Depends(get_current_user)):
    return await store.create_report(data, user)


@router.patch("/reports/{report_id}/status")
async def update_status(report_id: str, data: StatusUpdate, user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    report = await store.update_report_status(report_id, data.status, user)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze(data: ReportCreate, user=Depends(get_current_user)):
    result = analyze_issue(data.description)
    return {
        "issueType": result["issue_type"],
        "severityScore": result["severity_score"],
        "severityLevel": result["severity_level"],
        "reasoning": result["reasoning"],
        "suggestedTitle": result["suggested_title"],
        "department": result["department"],
    }


@router.get("/stats")
async def get_stats(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return await store.get_stats()


@router.get("/leaderboard")
async def get_leaderboard(user=Depends(get_current_user)):
    all_reports = await store.get_all_reports()

    citizens = {}
    for r in all_reports:
        cid = r.get("citizenId", "")
        if cid not in citizens:
            citizens[cid] = {"id": cid, "name": r.get("citizenName", ""), "reports": []}
        citizens[cid]["reports"].append(r)

    leaderboard = []
    for cid, data in citizens.items():
        reports = data["reports"]
        filed = min(30, len(reports) * 3)
        verified = min(30, len([r for r in reports if r.get("status") in ("verified", "assigned", "in_progress", "resolved")]) * 5)
        resolved_count = len([r for r in reports if r.get("status") == "resolved"])
        resolved_score = min(20, resolved_count * 4)
        consistency = min(10, 10 if len(reports) >= 5 else len(reports) * 2)
        age = 10
        score = min(100, filed + verified + resolved_score + consistency + age)

        level = "New"
        if score >= 80:
            level = "Champion"
        elif score >= 60:
            level = "Verified"
        elif score >= 40:
            level = "Trusted"
        elif score >= 20:
            level = "Active"

        leaderboard.append({
            "id": cid,
            "name": data["name"],
            "score": score,
            "level": level,
            "totalReports": len(reports),
            "resolvedReports": resolved_count,
            "breakdown": {"filed": filed, "verified": verified, "resolved": resolved_score, "consistency": consistency, "age": age},
        })

    leaderboard.sort(key=lambda x: x["score"], reverse=True)
    return leaderboard
