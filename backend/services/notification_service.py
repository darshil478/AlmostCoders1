from database import notifications
from datetime import datetime


def create_notification(notification_type, message):

    notification = {

        "id": len(notifications) + 1,

        "type": notification_type,

        "message": message,

        "time": datetime.now().strftime("%H:%M:%S")

    }

    notifications.append(notification)

    return notification


def get_notifications():

    return notifications


def clear_notifications():

    notifications.clear()