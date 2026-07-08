def calculate_health_score(
    patients,
    doctor_present,
    low_stock
):

    score = 100

    score -= len(patients)

    score -= low_stock * 10

    if not doctor_present:

        score -= 20

    return max(score, 0)