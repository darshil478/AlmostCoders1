def stock_forecast(stock, daily_usage):

    if daily_usage == 0:

        return {

            "days_remaining": "Unlimited",

            "status": "Safe"

        }

    days = stock / daily_usage

    if days <= 3:
        status = "Critical"

    elif days <= 7:
        status = "Low"

    else:
        status = "Healthy"

    return {

        "days_remaining": round(days),

        "status": status

    }