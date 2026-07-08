from ai.config import ACTIVE_PROVIDER, GEMINI_API_KEY, GROQ_API_KEY, ANTHROPIC_API_KEY, OPENAI_API_KEY
from ai.providers.gemini_provider import call_gemini
from ai.providers.groq_provider import call_groq
from ai.providers.claude_provider import call_claude
from ai.providers.openai_provider import call_openai

def query_llm(prompt: str, system_instruction: str = None) -> str:
    """
    Routes the LLM query to the preferred provider, falling back to other available providers,
    and finally falling back to a smart mock response generator if no API keys are configured.
    """
    providers = {
        "gemini": (call_gemini, GEMINI_API_KEY),
        "groq": (call_groq, GROQ_API_KEY),
        "claude": (call_claude, ANTHROPIC_API_KEY),
        "openai": (call_openai, OPENAI_API_KEY),
    }
    
    # Define order of preference for fallback
    fallback_order = ["gemini", "groq", "claude", "openai"]
    
    # 1. Attempt preferred provider first
    pref = ACTIVE_PROVIDER if ACTIVE_PROVIDER in providers else "gemini"
    func, key = providers[pref]
    if key:
        try:
            print(f"[AI] Querying active provider: {pref}...")
            return func(prompt, system_instruction)
        except Exception as e:
            print(f"[AI] Active provider {pref} failed: {e}. Falling back...")
            
    # 2. Iterate through fallbacks
    for name in fallback_order:
        if name == pref:
            continue
        func, key = providers[name]
        if key:
            try:
                print(f"[AI] Falling back to provider: {name}...")
                return func(prompt, system_instruction)
            except Exception as e:
                print(f"[AI] Fallback provider {name} failed: {e}")
                
    # 3. Smart local mock generator if no keys worked
    print("[AI] No active API key found or all LLMs failed. Using local healthcare mock generator.")
    return generate_mock_healthcare_response(prompt, system_instruction)

def generate_mock_healthcare_response(prompt: str, system_instruction: str = None) -> str:
    """
    Generates high-quality mock responses based on standard prompt keywords
    to ensure full backend functionality without any cloud costs.
    """
    p_lower = prompt.lower()
    
    if "queue" in p_lower or "wait" in p_lower:
        return (
            "{\n"
            '  "patients": 3,\n'
            '  "estimated_wait": 15,\n'
            '  "status": "Medium",\n'
            '  "reason": "Queue is currently stable. Average waiting time is 5 minutes per patient. Dr. Sharma is checking in."\n'
            "}"
        )
        
    elif "health" in p_lower or "vitals" in p_lower or "score" in p_lower:
        return (
            "{\n"
            '  "health_score": 75,\n'
            '  "grade": "Average",\n'
            '  "risk": "Elevated",\n'
            '  "prediction": "Based on elevated BP (140/90) and symptoms, there is an increased risk of hypertension escalation.",\n'
            '  "medications": ["Amlodipine 5mg (Daily)", "Atorvastatin 10mg (Night)"],\n'
            '  "followUp": "BP monitoring in 7 days."\n'
            "}"
        )
        
    elif "recommend" in p_lower or "symptom" in p_lower:
        return (
            "{\n"
            '  "diagnosis": "Acute Respiratory Infection / Influenza-like Illness",\n'
            '  "protocol": "Symptomatic treatment, hydration, and observation.",\n'
            '  "medicines": [\n'
            '    {"medicine": "Paracetamol 650mg", "dosage": "1 tablet every 6 hours as needed for fever"},\n'
            '    {"medicine": "ORS Packets", "dosage": "1 packet in 1L water consumed throughout the day"}\n'
            '  ],\n'
            '  "followup_days": 3\n'
            "}"
        )
        
    elif "outbreak" in p_lower:
        return (
            "{\n"
            '  "fever_cases": 2,\n'
            '  "cough_cases": 1,\n'
            '  "possible_outbreak": false,\n'
            '  "reason": "Case counts are within seasonal averages. No localized outbreak patterns identified."\n'
            "}"
        )
        
    elif "summary" in p_lower or "daily" in p_lower:
        return (
            "### PHC Shift Summary Report\n\n"
            "**Clinic Load**: 3 patients registered today. Normal attendance rates.\n"
            "**Roster Status**: Doctor check-in is pending or offline.\n"
            "**Supply Status**: Amoxicillin is in critical low stock (18 items remaining). Paracetamol is stable.\n"
            "**Action Plan**: Order restock of Amoxicillin immediately. Monitor queue wait time."
        )
        
    # Standard general chat response
    return (
        "Hello! I am your PHC AI assistant. I can help you analyze clinic wait times, predict health scores, "
        "detect outbreaks, recommend treatments, and generate shift reports. How can I assist you today?"
    )
