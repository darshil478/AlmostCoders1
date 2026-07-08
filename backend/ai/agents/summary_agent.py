from ai.providers.router import query_llm

SYSTEM_INSTRUCTION = (
    "You are a Health Administrator Chief. You compile executive clinic summaries in clear Markdown format. "
    "Include clinic load metrics, low-stock warnings, roster notes, and operational recommendations."
)

def run_summary_agent(patients_count: int, inventory: list, doctor_status: dict) -> str:
    """
    Generates a daily operational summary for the PHC.
    """
    low_stock_items = [
        f"{i.get('medicine')} ({i.get('stock')} remaining)"
        for i in inventory
        if i.get("stock", 0) < 20
    ]
    
    prompt = (
        f"Generate a daily summary report based on clinic metrics:\n"
        f"- Registered Patients: {patients_count}\n"
        f"- Doctor present: {doctor_status.get('present', False)}\n"
        f"- Doctor check-in: {doctor_status.get('check_in')}\n"
        f"- Critical Low-Stock medicines: {low_stock_items if low_stock_items else 'None'}\n\n"
        f"Provide a structured executive briefing in markdown."
    )
    
    try:
        return query_llm(prompt, SYSTEM_INSTRUCTION)
    except Exception as e:
        print(f"Summary agent LLM call failed: {e}. Using fallback.")
        
    # Markdown fallback if API key is missing or fails
    low_stock_str = ", ".join(low_stock_items) if low_stock_items else "None"
    doc_present_str = "Checked In" if doctor_status.get("present") else "Not Present"
    
    return (
        f"### PHC Operational Daily Summary\n\n"
        f"**Clinic Load**: {patients_count} patients registered today.\n"
        f"**Workforce Presence**: Doctor is **{doc_present_str}**.\n"
        f"**Inventory Health**: Low stock items: `{low_stock_str}`.\n"
        f"**Action Plan**: Ensure restocking of low items. Normal queue flows expected."
    )
