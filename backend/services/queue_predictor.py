def predict_queue(patients):

    total = len(patients)

    estimated_wait = total * 5

    if estimated_wait < 15:
        status = "Low"

    elif estimated_wait < 30:
        status = "Medium"

    else:
        status = "High"

    return {

        "patients": total,

        "estimated_wait": estimated_wait,

        "status": status

    }