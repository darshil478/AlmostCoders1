from datetime import datetime
from services.firebase import db


def log_event(message, level="INFO"):

    db.collection("events").add({

        "message": message,

        "level": level,

        "time": datetime.now().strftime("%d-%m-%Y %H:%M:%S")

    })