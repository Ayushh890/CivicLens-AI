KEYWORDS = {
    "pothole": ["pothole", "pit", "hole in road", "crater", "sinkhole"],
    "garbage_dump": ["garbage", "trash", "waste", "dump", "rubbish", "litter"],
    "water_leak": ["water leak", "pipe burst", "flooding", "water seepage", "leaking"],
    "broken_signal": ["signal", "traffic light", "blinking", "not working signal"],
    "street_light": ["street light", "lamp", "light not working", "dark area"],
    "sewage": ["sewage", "sewer", "drain", "foul smell", "sewage overflow"],
    "road_damage": ["road damage", "crack", "broken road", "road surface"],
    "illegal_parking": ["parking", "parked", "blocking", "double park"],
    "fallen_tree": ["tree", "fallen tree", "branch", "uprooted"],
    "encroachment": ["encroachment", "illegal construction", "footpath blocked"],
    "open_manhole": ["manhole", "open manhole", "cover missing"],
    "noise": ["noise", "loud", "construction noise", "honking"],
}

BASE_SEVERITY = {
    "pothole": 40, "garbage_dump": 30, "water_leak": 55, "broken_signal": 60,
    "street_light": 35, "sewage": 65, "road_damage": 50, "illegal_parking": 20,
    "fallen_tree": 45, "encroachment": 25, "open_manhole": 75, "noise": 15,
}

DEPT_MAP = {
    "pothole": "public_works", "garbage_dump": "sanitation", "water_leak": "water",
    "broken_signal": "traffic", "street_light": "electricity", "sewage": "water",
    "road_damage": "public_works", "illegal_parking": "traffic", "fallen_tree": "municipal",
    "encroachment": "municipal", "open_manhole": "public_works", "noise": "environment",
}

LABELS = {
    "pothole": "Pothole", "garbage_dump": "Garbage Dump", "water_leak": "Water Leakage",
    "broken_signal": "Broken Signal", "street_light": "Street Light", "sewage": "Sewer Overflow",
    "road_damage": "Road Damage", "illegal_parking": "Illegal Parking", "fallen_tree": "Fallen Tree",
    "encroachment": "Encroachment", "open_manhole": "Open Manhole", "noise": "Noise Pollution",
}


def analyze_issue(text: str) -> dict:
    lower = text.lower()
    best_type = "road_damage"
    best_score = 0

    for issue_type, words in KEYWORDS.items():
        count = sum(1 for w in words if w in lower)
        if count > best_score:
            best_score = count
            best_type = issue_type

    severity = BASE_SEVERITY.get(best_type, 30)
    boost_words = {
        25: ["dangerous", "emergency", "urgent", "child", "children", "school"],
        15: ["major", "large", "flood", "overflow", "hospital"],
        10: ["growing", "worse", "multiple", "several"],
        -10: ["small", "minor", "little"],
    }

    for boost, words in boost_words.items():
        for w in words:
            if w in lower:
                severity += boost
                break

    severity = max(5, min(100, severity))

    if severity <= 25:
        level = "low"
    elif severity <= 50:
        level = "medium"
    elif severity <= 75:
        level = "high"
    else:
        level = "critical"

    label = LABELS.get(best_type, "Road Damage")
    reasoning = f"Classified as {label}. Severity {severity}/100 ({level})."

    return {
        "issue_type": best_type,
        "severity_score": severity,
        "severity_level": level,
        "reasoning": reasoning,
        "suggested_title": f"{label} reported",
        "department": DEPT_MAP.get(best_type, "municipal"),
    }
