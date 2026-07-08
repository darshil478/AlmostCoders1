from fastapi import APIRouter

router = APIRouter()

@router.get("/emergency/status")
def get_emergency_status():
    return {
        "status": "normal",
        "icu_beds_free": 12,
        "ventilators_free": 4,
        "active_ambulances": 8,
        "trauma_teams": 3,
        "active_emergencies": []
    }
