import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import Routers
from routers.patient import router as patient_router
from routers.inventory import router as inventory_router
from routers.doctor import router as doctor_router
from routers.events import router as event_router
from routers.analytics import router as analytics_router
from routers.ai import router as ai_router
from routers.notifications import router as notification_router
from routers.firebase_test import router as firebase_router
from routers.emergency import router as emergency_router
from routers.disease_surveillance import router as disease_surveillance_router


app = FastAPI(
    title="🏥 PHC AI Copilot API",
    description="""
AI Powered Primary Health Centre Management System Backend.
Features:
- Patient Triage & Health Score Diagnostics
- Medicine Inventory & Expiry Alerts
- Doctor Roster Management & Attendance Tracker
- Real-time Clinic Load & Waiting Time Predictions
- Regional Disease Outbreak Surveillance
- Multi-Model LLM Core (Gemini, Groq, Claude, OpenAI)
""",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for all local development servers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins for easy frontend integration
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    print("PHC AI Copilot Backend Started successfully!")

@app.on_event("shutdown")
def shutdown():
    print("PHC AI Copilot Backend Stopped.")

@app.get("/")
def home():
    return {
        "project": "PHC AI Copilot",
        "status": "Running",
        "version": "1.0.0",
        "backend": "FastAPI"
    }

@app.get("/health")
def health():
    return {
        "status": "Healthy",
        "server": "Running"
    }

# Register Routers
app.include_router(patient_router, prefix="/api", tags=["Patients"])
app.include_router(inventory_router, prefix="/api", tags=["Inventory"])
app.include_router(doctor_router, prefix="/api", tags=["Doctor"])
app.include_router(event_router, prefix="/api", tags=["Events"])
app.include_router(analytics_router, prefix="/api", tags=["Analytics"])
app.include_router(ai_router, prefix="/api", tags=["AI"])
app.include_router(notification_router, prefix="/api", tags=["Notifications"])
app.include_router(firebase_router, prefix="/api", tags=["Firebase"])
app.include_router(emergency_router, prefix="/api", tags=["Emergency"])
app.include_router(disease_surveillance_router, prefix="/api", tags=["Disease Surveillance"])