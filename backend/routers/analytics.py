from fastapi import APIRouter
import database

router = APIRouter()

@router.get("/analytics")
def analytics():
    patients_list = database.get_patients()
    inventory_list = database.get_inventory()
    events_list = database.get_events()
    notifications_list = database.get_notifications()
    doctor_status = database.get_doctor()
    
    # Fetch multi-doctor stats
    doctors_list = database.get_doctors()
    total_doctors = len(doctors_list)
    present_doctors = len([d for d in doctors_list if d.get("present", False)])
    
    low_stock = len([item for item in inventory_list if item.get("stock", 0) < 20])
    
    return {
        "patients": len(patients_list),
        "inventory": len(inventory_list),
        "events": len(events_list),
        "notifications": len(notifications_list),
        "doctor_present": doctor_status.get("present", False),
        "doctor_check_in": doctor_status.get("check_in"),
        "total_doctors": total_doctors,
        "present_doctors": present_doctors,
        "low_stock": low_stock
    }