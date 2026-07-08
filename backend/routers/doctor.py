from fastapi import APIRouter
import database

router = APIRouter()

@router.get("/doctor")
def get_doctors():
    return database.get_doctors()

@router.post("/doctor/{doctor_id}/checkin")
def checkin_by_id(doctor_id: str):
    updated = database.update_doctor_presence(doctor_id, True, "09:00 AM")
    if updated:
        database.add_event(f"{updated['name']} Checked In", "INFO")
        database.add_notification("success", f"{updated['name']} has checked in")
        return {"message": "Doctor Checked In", "doctor": updated}
    return {"message": "Doctor not found", "doctor": None}

@router.post("/doctor/{doctor_id}/checkout")
def checkout_by_id(doctor_id: str):
    updated = database.update_doctor_presence(doctor_id, False, None)
    if updated:
        database.add_event(f"{updated['name']} Checked Out", "WARNING")
        database.add_notification("warning", f"{updated['name']} has checked out")
        return {"message": "Doctor Checked Out", "doctor": updated}
    return {"message": "Doctor not found", "doctor": None}

@router.post("/doctor/checkin")
def checkin():
    # Backward compatibility: check in Dr. Sharma (DOC-010)
    updated = database.update_doctor_presence("DOC-010", True, "09:00 AM")
    database.add_event("Doctor Checked In", "INFO")
    database.add_notification("success", "Doctor has checked in")
    return {"message": "Doctor Checked In", "doctor": updated}

@router.post("/doctor/checkout")
def checkout():
    # Backward compatibility: check out Dr. Sharma (DOC-010)
    updated = database.update_doctor_presence("DOC-010", False, None)
    database.add_event("Doctor Checked Out", "WARNING")
    database.add_notification("warning", "Doctor has checked out")
    return {"message": "Doctor Checked Out", "doctor": updated}