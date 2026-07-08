def detect_outbreak(patients):

    fever = 0

    cough = 0

    for patient in patients:

        symptoms = patient["symptoms"].lower()

        if "fever" in symptoms:
            fever += 1

        if "cough" in symptoms:
            cough += 1

    return {

        "fever_cases": fever,

        "cough_cases": cough,

        "possible_outbreak": fever >= 5

    }