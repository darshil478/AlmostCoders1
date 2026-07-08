import json
from ai.providers.router import query_llm

SYSTEM_INSTRUCTION = (
    "You are an Epidemic Surveillance Agent. Analyze the patient symptom records for anomalous patterns. "
    "Respond strictly in JSON format matching the schema: "
    '{"fever_cases": int, "cough_cases": int, "possible_outbreak": bool, "reason": "string"}'
)

def run_outbreak_agent(patients: list) -> dict:
    """
    Scans the patient data to identify outbreak clusters.
    """
    # Count occurrences locally
    fevers = 0
    coughs = 0
    for p in patients:
        s = p.get("symptoms", "").lower()
        if "fever" in s or "temp" in s:
            fevers += 1
        if "cough" in s or "cold" in s:
            coughs += 1
            
    prompt = (
        f"Scan the patient symptoms dataset for potential disease outbreaks:\n"
        f"Total Patients: {len(patients)}\n"
        f"Symptoms list: {[p.get('symptoms', '') for p in patients]}\n\n"
        f"Report aggregated fever and cough cases, evaluate outbreak likelihood, and explain findings."
    )
    
    try:
        response_text = query_llm(prompt, SYSTEM_INSTRUCTION)
        data = json.loads(response_text)
        if "possible_outbreak" in data:
            return data
    except Exception as e:
        print(f"Outbreak agent JSON parse failed: {e}. Using rule fallback.")
        
    return {
        "fever_cases": fevers,
        "cough_cases": coughs,
        "possible_outbreak": fevers >= 5 or coughs >= 5,
        "reason": f"Analyzed {len(patients)} records. Fever cases: {fevers}. Cough cases: {coughs}. Trigger threshold is 5."
    }
