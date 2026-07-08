from fastapi import APIRouter
import database

router = APIRouter()

@router.get("/notifications")
def all_notifications():
    return database.get_notifications()

@router.post("/notifications/test")
def test_notification():
    n = database.add_notification("success", "Test Notification Created")
    return {
        "message": "Notification Added",
        "notification": n
    }

@router.delete("/notifications")
def delete_notifications():
    database.clear_notifications()
    return {
        "message": "Notifications Cleared"
    }
