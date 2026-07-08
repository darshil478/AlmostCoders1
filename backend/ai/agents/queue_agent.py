import json
from ai.providers.router import query_llm

SYSTEM_INSTRUCTION = (
    "You are a Clinical Flow Architect. Your job is to predict the queue wait times and "
    "operational load at a Primary Health Centre. You must respond strictly in JSON format matching "
    "the schema: "
    '{"patients": int, "estimated_wait": int, "status": "Low"|"Medium"|"High", "reason": "string"}'
)

def run_queue_agent(patients: list, doctor_present: bool) -> dict:
    """
    Predicts queue stats and waiting times based on current patients list and doctor presence.
    """
    total_patients = len(patients)
    
    # Calculate simple deterministic baseline as fallback
    est_wait = total_patients * 5
    if not doctor_present:
        est_wait += 30  # delay if doctor is absent
        
    status = "Low"
    if est_wait >= 30:
        status = "High"
    elif est_wait >= 15:
        status = "Medium"
        
    prompt = (
        f"Analyze the clinic status:\n"
        f"- Registered Patients: {total_patients}\n"
        f"- Doctor Present: {doctor_present}\n\n"
        f"List of patient symptoms: {[p.get('symptoms', 'general') for p in patients]}\n\n"
        f"Calculate the total estimated wait time in minutes and provide a short reason."
    )
    
    try:
        response_text = query_llm(prompt, SYSTEM_INSTRUCTION)
        # Try parsing JSON
        data = json.loads(response_text)
        # Validate keys
        if "estimated_wait" in data and "status" in data:
            return data
    except Exception as e:
        print(f"Queue agent JSON parse failed: {e}. Using rule fallback.")
        
    # Return structured fallback if LLM is rule-based or failed
    return {
        "patients": total_patients,
        "estimated_wait": est_wait,
        "status": status,
        "reason": f"Estimated based on clinic load of {total_patients} patients. Doctor present: {doctor_present}."
    }
