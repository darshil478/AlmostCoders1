from fastapi import APIRouter
import database

router = APIRouter()

@router.get("/events")
def get_events():
    return database.get_events()