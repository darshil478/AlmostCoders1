import json
from ai.providers.router import query_llm

SYSTEM_INSTRUCTION = (
    "You are a Senior Diagnostics AI. Analyze the patient symptoms and vitals. "
    "Respond strictly in JSON format matching the schema: "
    '{"health_score": int, "grade": "Excellent"|"Good"|"Average"|"Poor", '
    '"risk": "Low"|"Elevated"|"High", "prediction": "string", "medications": ["string"], "followUp": "string"}'
)

def run_health_agent(symptoms: str, vitals: dict = None) -> dict:
    """
    Analyzes patient symptoms and vitals to predict health score and risk factors.
    """
    vitals_str = json.dumps(vitals) if vitals else "Default vitals (HR: 75, BP: 120/80, Temp: 98.6°F, SpO2: 98%)"
    
    prompt = (
        f"Patient Symptoms: {symptoms}\n"
        f"Patient Vitals: {vitals_str}\n\n"
        f"Evaluate the medical state, compute a health score (0-100), identify the risk level, "
        f"suggest primary medications, and provide a follow-up advisory."
    )
    
    try:
        response_text = query_llm(prompt, SYSTEM_INSTRUCTION)
        data = json.loads(response_text)
        if "health_score" in data and "risk" in data:
            return data
    except Exception as e:
        print(f"Health agent JSON parse failed: {e}. Using rule fallback.")
        
    # Baseline rule-based fallback
    s_lower = symptoms.lower()
    score = 90
    risk = "Low"
    grade = "Excellent"
    prediction = "Vitals and symptoms appear normal."
    meds = ["Multivitamins"]
    followup = "Routine annual checkup."
    
    if any(k in s_lower for k in ["chest pain", "breathing", "heart", "stroke", "severe"]):
        score = 45
        risk = "High"
        grade = "Poor"
        prediction = "High probability of critical cardiovascular/respiratory event. Requires immediate triage."
        meds = ["Aspirin", "Oxygen therapy"]
        followup = "Refer to emergency unit immediately."
    elif any(k in s_lower for k in ["fever", "cough", "ache", "pain", "vomit", "diarrhea"]):
        score = 68
        risk = "Elevated"
        grade = "Average"
        prediction = "Symptoms suggest acute seasonal infection. Monitor temperature closely."
        meds = ["Paracetamol 650mg", "ORS Packets"]
        followup = "Return if fever persists over 48 hours."
        
    return {
        "health_score": score,
        "grade": grade,
        "risk": risk,
        "prediction": prediction,
        "medications": meds,
        "followUp": followup
    }
