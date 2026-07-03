from datetime import datetime, timezone
from ..database import reports_collection, users_collection
from .analyzer import analyze_issue
from .cloudinary_service import upload_photo

DEPT_MAP = {
    "pothole": "public_works", "garbage_dump": "sanitation", "water_leak": "water",
    "broken_signal": "traffic", "street_light": "electricity", "sewage": "water",
    "road_damage": "public_works", "illegal_parking": "traffic", "fallen_tree": "municipal",
    "encroachment": "municipal", "open_manhole": "public_works", "noise": "environment",
}

DEPT_RESPONSE = {
    "water": "24-48 hours", "public_works": "3-5 days", "sanitation": "24 hours",
    "electricity": "12-24 hours", "traffic": "2-6 hours", "municipal": "3-7 days",
    "environment": "5-7 days",
}

SEVERITY_LEVELS = {range(0, 26): "low", range(26, 51): "medium", range(51, 76): "high", range(76, 101): "critical"}


def get_severity_level(score):
    for r, level in SEVERITY_LEVELS.items():
        if score in r:
            return level
    return "medium"


def serialize_report(doc):
    if not doc:
        return None
    doc.pop("_id", None)
    return doc


async def get_next_report_id():
    count = await reports_collection.count_documents({})
    return f"RPT-{str(count + 1).padStart(4, '0') if hasattr(str, 'padStart') else str(count + 1).zfill(4)}"


async def create_report(data, user):
    analysis = analyze_issue(data.description)

    photo_url = None
    if data.photoData:
        photo_url = upload_photo(data.photoData)

    report_id = f"RPT-{str(await reports_collection.count_documents({}) + 1).zfill(4)}"
    now = datetime.now(timezone.utc).isoformat()
    dept = analysis["department"]

    report = {
        "id": report_id,
        "title": data.title or analysis["suggested_title"],
        "description": data.description,
        "issueType": analysis["issue_type"],
        "severityScore": analysis["severity_score"],
        "severityLevel": analysis["severity_level"],
        "reasoning": analysis["reasoning"],
        "department": dept,
        "status": "submitted",
        "latitude": data.latitude,
        "longitude": data.longitude,
        "address": data.address,
        "ward": data.ward,
        "citizenId": user["id"],
        "citizenName": user["name"],
        "createdAt": now,
        "updatedAt": now,
        "resolvedAt": None,
        "estimatedResponse": DEPT_RESPONSE.get(dept, "3-5 days"),
        "statusHistory": [{"status": "submitted", "timestamp": now, "note": "Report submitted"}],
        "photoUrl": photo_url,
    }

    await reports_collection.insert_one(report)
    return serialize_report(report)


async def get_reports(user, filters=None):
    query = {}

    if user["role"] != "admin":
        query["citizenId"] = user["id"]

    if filters:
        if filters.get("type"):
            query["issueType"] = filters["type"]
        if filters.get("status"):
            query["status"] = filters["status"]
        if filters.get("ward"):
            query["ward"] = filters["ward"]
        if filters.get("severity"):
            level = filters["severity"]
            ranges = {"low": (0, 25), "medium": (26, 50), "high": (51, 75), "critical": (76, 100)}
            if level in ranges:
                lo, hi = ranges[level]
                query["severityScore"] = {"$gte": lo, "$lte": hi}

    cursor = reports_collection.find(query).sort("createdAt", -1)
    reports = []
    async for doc in cursor:
        reports.append(serialize_report(doc))
    return reports


async def get_all_reports():
    cursor = reports_collection.find({}).sort("createdAt", -1)
    reports = []
    async for doc in cursor:
        reports.append(serialize_report(doc))
    return reports


async def get_report(report_id):
    doc = await reports_collection.find_one({"id": report_id})
    return serialize_report(doc)


async def update_report_status(report_id, new_status, user):
    now = datetime.now(timezone.utc).isoformat()
    status_labels = {
        "submitted": "Submitted", "verified": "Verified", "assigned": "Assigned",
        "in_progress": "In Progress", "resolved": "Resolved",
    }

    update = {
        "$set": {
            "status": new_status,
            "updatedAt": now,
        },
        "$push": {
            "statusHistory": {
                "status": new_status,
                "timestamp": now,
                "note": f"Status updated to {status_labels.get(new_status, new_status)}",
            }
        },
    }

    if new_status == "resolved":
        update["$set"]["resolvedAt"] = now

    result = await reports_collection.update_one({"id": report_id}, update)
    if result.modified_count == 0:
        return None
    return await get_report(report_id)


async def get_stats():
    total = await reports_collection.count_documents({})
    submitted = await reports_collection.count_documents({"status": "submitted"})
    in_progress = await reports_collection.count_documents(
        {"status": {"$in": ["verified", "assigned", "in_progress"]}}
    )
    resolved = await reports_collection.count_documents({"status": "resolved"})

    pipeline = [{"$group": {"_id": "$issueType", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}]
    by_type = {}
    async for doc in reports_collection.aggregate(pipeline):
        by_type[doc["_id"]] = doc["count"]

    pipeline_ward = [{"$group": {"_id": "$ward", "count": {"$sum": 1}}}, {"$sort": {"count": -1}}]
    by_ward = {}
    async for doc in reports_collection.aggregate(pipeline_ward):
        if doc["_id"]:
            by_ward[doc["_id"]] = doc["count"]

    pipeline_dept = [
        {"$group": {"_id": "$department", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
    ]
    by_dept = {}
    async for doc in reports_collection.aggregate(pipeline_dept):
        by_dept[doc["_id"]] = doc["count"]

    avg_severity = 0
    if total > 0:
        pipeline_avg = [{"$group": {"_id": None, "avg": {"$avg": "$severityScore"}}}]
        async for doc in reports_collection.aggregate(pipeline_avg):
            avg_severity = round(doc["avg"])

    return {
        "total": total,
        "submitted": submitted,
        "inProgress": in_progress,
        "resolved": resolved,
        "avgSeverity": avg_severity,
        "resolutionRate": round((resolved / total) * 100) if total > 0 else 0,
        "byType": by_type,
        "byWard": by_ward,
        "byDept": by_dept,
    }


async def export_csv():
    reports = await get_all_reports()
    if not reports:
        return "No reports found"

    headers = [
        "ID", "Title", "Description", "Issue Type", "Severity Score", "Severity Level",
        "Status", "Department", "Address", "Ward", "Latitude", "Longitude",
        "Citizen ID", "Citizen Name", "Created At", "Updated At", "Resolved At",
        "Estimated Response", "Photo URL",
    ]

    rows = [",".join(headers)]
    for r in reports:
        row = [
            r.get("id", ""), r.get("title", "").replace(",", ";"),
            r.get("description", "").replace(",", ";").replace("\n", " ")[:200],
            r.get("issueType", ""), str(r.get("severityScore", "")),
            r.get("severityLevel", ""), r.get("status", ""), r.get("department", ""),
            r.get("address", "").replace(",", ";"), r.get("ward", "").replace(",", ";"),
            str(r.get("latitude", "")), str(r.get("longitude", "")),
            r.get("citizenId", ""), r.get("citizenName", "").replace(",", ";"),
            r.get("createdAt", ""), r.get("updatedAt", ""), r.get("resolvedAt", "") or "",
            r.get("estimatedResponse", ""), r.get("photoUrl", "") or "",
        ]
        rows.append(",".join(row))

    return "\n".join(rows)
