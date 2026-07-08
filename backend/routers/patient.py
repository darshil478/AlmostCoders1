from fastapi import APIRouter
from pydantic import BaseModel
import database
from ai.agents.health_agent import run_health_agent

router = APIRouter()

class PatientInput(BaseModel):
    name: str
    symptoms: str

@router.get("/patient")
def get_patients():
    return database.get_patients()

@router.post("/patient")
def add_patient(patient: PatientInput):
    # Run the Health AI Agent to calculate score, risk, and predictions
    ai_results = run_health_agent(patient.symptoms)
    
    # Structure new patient record
    new_patient = {
        "name": patient.name,
        "symptoms": patient.symptoms,
        "age": 35,  # default age
        "gender": "M",  # default gender
        "blood": "O+",  # default blood
        "phone": "+91 99999 88888",
        "address": "Indore",
        "emergency": "Family - 99999 99999",
        "insurance": "Ayushman Bharat - Active",
        "vitals": { "hr": 80, "bp": "120/80", "temp": "98.6°F", "o2": "98%" },
        "healthScore": ai_results.get("health_score", 80),
        "risk": ai_results.get("risk", "Low"),
        "prediction": ai_results.get("prediction", "No anomalies predicted."),
        "medications": ai_results.get("medications", ["Multivitamins"]),
        "followUp": ai_results.get("followUp", "Regular checkup."),
        "timeline": [
            { "date": "Today", "event": f"Check-in: {patient.symptoms}", "type": "visit" }
        ]
    }
    
    saved_patient = database.add_patient(new_patient)
    
    # Log events and create notification
    database.add_event(f"Patient {patient.name} checked in", "INFO")
    database.add_notification("success", f"{patient.name} checked in successfully")
    
    return {
        "message": "Patient Checked In",
        "patient": saved_patient
    }