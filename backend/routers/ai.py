from fastapi import APIRouter
from pydantic import BaseModel
import database
from services.forecast import stock_forecast
from ai.agents.orchestrator import run_orchestrator
from ai.agents.summary_agent import run_summary_agent
from ai.agents.queue_agent import run_queue_agent
from ai.agents.health_agent import run_health_agent
from ai.agents.outbreak_agent import run_outbreak_agent
from ai.agents.recommendation_agent import run_recommendation_agent

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

class RecommendRequest(BaseModel):
    symptoms: str

@router.post("/ai/chat")
def chat(data: ChatRequest):
    return {"response": run_orchestrator(data.question)}

@router.get("/ai/summary")
def summary():
    patients = database.get_patients()
    inventory = database.get_inventory()
    doctor = database.get_doctor()
    summary_text = run_summary_agent(len(patients), inventory, doctor)
    return {"summary": summary_text}

@router.get("/ai/queue")
def queue_prediction():
    patients = database.get_patients()
    doctor = database.get_doctor()
    return run_queue_agent(patients, doctor.get("present", False))

@router.get("/ai/health")
def health():
    patients = database.get_patients()
    if not patients:
        return {"health_score": 100, "grade": "Excellent"}
    avg_score = sum([p.get("healthScore", 80) for p in patients]) // len(patients)
    grade = "Excellent"
    if avg_score < 50:
        grade = "Poor"
    elif avg_score < 75:
        grade = "Average"
    elif avg_score < 90:
        grade = "Good"
    return {"health_score": avg_score, "grade": grade}

@router.get("/ai/outbreak")
def outbreak():
    patients = database.get_patients()
    return run_outbreak_agent(patients)

@router.post("/ai/recommend")
def recommendation(data: RecommendRequest):
    return run_recommendation_agent(data.symptoms)

@router.get("/ai/forecast")
def forecast():
    inventory = database.get_inventory()
    forecasts = []
    DAILY_USAGE = 5
    for medicine in inventory:
        prediction = stock_forecast(medicine.get("stock", 0), DAILY_USAGE)
        forecasts.append({
            "medicine": medicine.get("medicine"),
            "stock": medicine.get("stock"),
            "days_remaining": prediction["days_remaining"],
            "status": prediction["status"]
        })
    return forecasts