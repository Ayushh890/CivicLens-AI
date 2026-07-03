from datetime import datetime
from ..services.analyzer import analyze_issue, DEPT_MAP


class ReportsStore:
    def __init__(self):
        self._reports = []
        self._counter = 0

    def get_all(self):
        return self._reports

    def get(self, report_id: str):
        return next((r for r in self._reports if r["id"] == report_id), None)

    def add(self, report):
        self._counter += 1
        analysis = analyze_issue(report.description)
        r = {
            "id": f"RPT-{self._counter:04d}",
            "title": report.title,
            "description": report.description,
            "issue_type": analysis["issue_type"],
            "severity_score": analysis["severity_score"],
            "status": "submitted",
            "latitude": report.latitude,
            "longitude": report.longitude,
            "address": report.address,
            "ward": report.ward,
            "citizen_id": report.citizen_id,
            "citizen_name": report.citizen_name,
            "created_at": datetime.now().isoformat(),
            "department": analysis["department"],
            "reasoning": analysis["reasoning"],
        }
        self._reports.insert(0, r)
        return r

    def update_status(self, report_id: str, status: str):
        report = self.get(report_id)
        if report:
            report["status"] = status
        return report

    def get_stats(self):
        total = len(self._reports)
        submitted = sum(1 for r in self._reports if r["status"] == "submitted")
        in_progress = sum(1 for r in self._reports if r["status"] in ("verified", "assigned", "in_progress"))
        resolved = sum(1 for r in self._reports if r["status"] == "resolved")
        return {"total": total, "submitted": submitted, "in_progress": in_progress, "resolved": resolved}


reports_store = ReportsStore()
