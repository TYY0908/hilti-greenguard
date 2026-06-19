from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from telemetry import generate_workloads
from engine import analyze_workload, recommend

app = FastAPI(title="Hilti GreenGuard API")

# -----------------------------
# CORS (Frontend connection)
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://hilti-greenguard.vercel.app/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.get("/")
def home():
    return {
        "status": "running",
        "service": "Hilti GreenGuard API"
    }

# -----------------------------
# MAIN LIVE WORKLOAD ENDPOINT
# -----------------------------
@app.get("/workloads")
def get_workloads():

    try:
        workloads = generate_workloads()

        result = []

        total_risk = 0
        total_cost = 0
        total_carbon = 0

        for w in workloads:
            analysis = analyze_workload(w)

            total_risk += analysis["overall"]
            total_cost += analysis["cost"]
            total_carbon += analysis["carbon"]

            result.append({
                **w,
                "analysis": analysis,
                "recommendation": recommend(w, analysis)
            })

        avg_risk = round(total_risk / len(result), 2) if result else 0

        return JSONResponse({
            "timestamp": "live",
            "summary": {
                "avg_risk": avg_risk,
                "total_cost": round(total_cost, 2),
                "total_carbon": round(total_carbon, 2),
                "workload_count": len(result)
            },
            "workloads": result
        })

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "error": "Backend failure",
                "details": str(e)
            }
        )

# -----------------------------
# OPTIONAL: SINGLE WORKLOAD
# -----------------------------
@app.get("/workloads/{workload_id}")
def get_single_workload(workload_id: int):

    workloads = generate_workloads()

    for w in workloads:
        if w["id"] == workload_id:
            analysis = analyze_workload(w)

            return {
                **w,
                "analysis": analysis,
                "recommendation": recommend(w, analysis)
            }

    return {"error": "Workload not found"}

# -----------------------------
# OPTIONAL: FORCE REFRESH ENDPOINT
# -----------------------------
@app.post("/refresh")
def refresh_data():
    return {
        "message": "Telemetry refreshed (simulated)"
    }