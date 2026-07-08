HIGH_RISK = [

    "chest pain",

    "breathing",

    "bleeding",

    "stroke",

    "heart"

]


def detect_risk(symptoms):

    symptoms = symptoms.lower()

    for word in HIGH_RISK:

        if word in symptoms:

            return {

                "risk": "HIGH",

                "priority": "Emergency"

            }

    return {

        "risk": "LOW",

        "priority": "Normal"

    }