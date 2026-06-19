def analyze_workload(w):

    security = 0
    carbon = 0
    cost = 0

    # SECURITY
    if not w["encryption"]:
        security += 40
    if w["cpu"] > 85:
        security += 30
    if w["idle"]:
        security += 20

    # CARBON
    region_factor = {
        "us-east": 20,
        "us-west": 25,
        "eu-west": 10,
        "asia-south": 35
    }

    carbon += region_factor.get(w["region"], 20)

    if w["idle"]:
        carbon += 30

    if w["cpu"] > 80:
        carbon += 20

    # COST
    cost = w["cost_per_hour"] * (w["cpu"] / 10)

    overall = (security * 0.4) + (carbon * 0.4) + (cost * 0.2)

    return {
        "security": security,
        "carbon": carbon,
        "cost": round(cost, 2),
        "overall": round(overall, 2)
    }


def recommend(w, a):

    if a["overall"] > 70:
        return "CRITICAL: Immediate optimization required"

    if w["idle"]:
        return "Recommendation: Shut down idle workload"

    if not w["encryption"]:
        return "Recommendation: Enable encryption for security"

    if w["cpu"] > 85:
        return "Recommendation: Scale workload or migrate region"

    return "System optimized"