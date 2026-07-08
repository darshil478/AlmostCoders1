def recommend(symptoms):

    text = symptoms.lower()

    medicines = []

    disease = "General"

    if "fever" in text:

        medicines.append("Paracetamol")

        disease = "Viral Fever"

    if "dehydration" in text:

        medicines.append("ORS")

    if "cough" in text:

        medicines.append("Cough Syrup")

    return {

        "possible_disease": disease,

        "recommended_medicines": medicines

    }