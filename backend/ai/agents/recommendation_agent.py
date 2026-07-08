import json
from ai.providers.router import query_llm

SYSTEM_INSTRUCTION = (
    "You are a Clinical Pharmacist Agent. Analyze the symptoms and recommend safe treatments "
    "according to standard national guidelines. Respond strictly in JSON format matching the schema: "
    '{"diagnosis": "string", "protocol": "string", "medicines": [{"medicine": "string", "dosage": "string"}], "followup_days": int}'
)

def run_recommendation_agent(symptoms: str) -> dict:
    """
    Recommends safe medications and patient protocols based on symptoms.
    """
    prompt = (
        f"Symptoms: {symptoms}\n\n"
        f"Recommend primary diagnosis, supportive care protocols, dosage instructions, and follow-up timeline."
    )
    
    try:
        response_text = query_llm(prompt, SYSTEM_INSTRUCTION)
        data = json.loads(response_text)
        if "medicines" in data and "protocol" in data:
            return data
    except Exception as e:
        print(f"Recommendation agent JSON parse failed: {e}. Using rule fallback.")
        
    # Baseline rule-based fallback
    s_lower = symptoms.lower()
    diagnosis = "General consultation"
    protocol = "Maintain fluid intake and get sufficient rest."
    medicines = [{"medicine": "ORS Packets", "dosage": "1 packet daily"}]
    followup_days = 5
    
    if "fever" in s_lower or "temp" in s_lower or "body" in s_lower:
        diagnosis = "Acute Febrile Illness"
        protocol = "Monitor body temperature. Tepid sponging. Rest."
        medicines = [
            {"medicine": "Paracetamol 650mg", "dosage": "1 tablet every 6 hours if fever > 100 F"},
            {"medicine": "ORS Packets", "dosage": "As needed for hydration"}
        ]
        followup_days = 3
    elif "cough" in s_lower or "cold" in s_lower or "sneeze" in s_lower:
        diagnosis = "Upper Respiratory Tract Infection"
        protocol = "Warm water gargles. Steam inhalation."
        medicines = [
            {"medicine": "Cough Syrup", "dosage": "10ml thrice a day"},
            {"medicine": "Amoxicillin 500mg", "dosage": "1 tablet twice a day for 5 days (if bacterial)"}
        ]
        followup_days = 5
        
    return {
        "diagnosis": diagnosis,
        "protocol": protocol,
        "medicines": medicines,
        "followup_days": followup_days
    }
