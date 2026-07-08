def generate_summary(data):

    return (
        f"Today {data['patients']} patients visited. "
        f"{data['low_stock']} medicines are low in stock. "
        f"Doctor Present: {data['doctor']}."
    )