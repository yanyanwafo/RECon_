import uuid

def calculate_wifi_time(weight_delta_grams):

    if weight_delta_grams < 5.0:
        return 0

    if 5.0 <= weight_delta_grams <= 19.0:
        return int(weight_delta_grams * 3)
        
    elif 20.0 <= weight_delta_grams <= 49.0:
        return int(60 + (weight_delta_grams - 20.0) * 2)
        
    elif weight_delta_grams >= 50.0:
        return 480
        
    return 0

def generate_voucher_code():
    return f"REC-{uuid.uuid4().hex[:8].upper()}"