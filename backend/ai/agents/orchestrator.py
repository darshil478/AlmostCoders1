from ai.providers.router import query_llm
import database

SYSTEM_INSTRUCTION = (
    "You are the PHC AI Copilot, a master medical and clinic management advisor. "
    "Use the provided clinical context to assist the clinic administrator with roster scheduling, "
    "low stock notifications, patient triage, and health surveillance advice."
)

def run_orchestrator(chat_message: str) -> str:
    """
    Orchestrates the chat request by loading current database contexts and querying the LLM.
    """
    # Load brief database status to inject into LLM context
    patients = database.get_patients()
    inventory = database.get_inventory()
    doctor = database.get_doctor()
    
    low_stock_count = len([i for i in inventory if i.get("stock", 0) < 20])
    
    clinic_context = (
        f"[Clinic Context]\n"
        f"- Registered Patients: {len(patients)}\n"
        f"- Doctor present: {doctor.get('present', False)}\n"
        f"- Low-stock items count: {low_stock_count}\n"
        f"- Total inventory items: {len(inventory)}\n\n"
    )
    
    full_prompt = f"{clinic_context}User Query: {chat_message}"
    
    try:
        return query_llm(full_prompt, SYSTEM_INSTRUCTION)
    except Exception as e:
        print(f"Orchestrator LLM query failed: {e}")
        return "I apologize, but I am unable to connect to the AI model right now. Please check your internet connection or API settings."
