import json
import base64
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from .models import Device, DepositEvent, WifiSession
from .utils.mobilenet_validation import validate_material_with_mobilenet, PAPER_LABEL, CONFIDENCE_THRESHOLD
from .utils.incentive_logic import calculate_wifi_time, generate_voucher_code

def _coerce_bool(val):
    if val is None: return False
    return str(val).lower() in ("true", "1", "yes", "t")

@csrf_exempt
@require_POST
def ingest_telemetry(request):
    # 1. Parse payload context
    if "multipart/form-data" in request.content_type:
        device_id = request.POST.get("device_id")
        ir_sensor = _coerce_bool(request.POST.get("ir_sensor_detected"))
        cap_sensor = _coerce_bool(request.POST.get("capacitive_sensor_triggered"))
        weight_grams = float(request.POST.get("weight_grams", 0.0))
        fill_level = float(request.POST.get("current_fill_level_pct", 0.0))
        image_file = request.FILES.get("image")
        image_bytes = image_file.read() if image_file else None
    else:
        try:
            data = json.loads(request.body)
            device_id = data.get("device_id")
            ir_sensor = _coerce_bool(data.get("ir_sensor_detected"))
            cap_sensor = _coerce_bool(data.get("capacitive_sensor_triggered"))
            weight_grams = float(data.get("weight_grams", 0.0))
            fill_level = float(data.get("current_fill_level_pct", 0.0))
            image_bytes = base64.b64decode(data.get("image_base64", "")) if data.get("image_base64") else None
        except Exception:
            return JsonResponse({"error": "Request body must be valid JSON"}, status=400)

    if not device_id:
        return JsonResponse({"error": "device_id is required"}, status=400)

    device, _ = Device.objects.get_or_create(device_id=device_id)
    device.current_fill_level_pct = fill_level
    
    if fill_level >= 90.0:
        device.status = "FULL"
        device.save()
        return JsonResponse({"accepted": False, "reason": "BIN FULL - Sorry, not accepting deposits"}, status=400)
    else:
        device.status = "READY"

    if not ir_sensor:
        device.save()
        return JsonResponse({"accepted": False, "reason": "INVALID - Non-paper material detected (IR fail)"}, status=400)
    if not cap_sensor:
        device.save()
        return JsonResponse({"accepted": False, "reason": "INVALID - Non-paper material detected (Capacitive fail)"}, status=400)

    if not image_bytes:
        device.save()
        return JsonResponse({"error": "An image or image_base64 payload is required"}, status=400)
        
    try:
        classification = validate_material_with_mobilenet(image_bytes)
        if not classification.passed:
            device.save()
            return JsonResponse({
                "accepted": False, 
                "reason": "Material Classification Validation Failure",
                "label": classification.label,
                "confidence": classification.confidence
            }, status=422)
    except Exception as e:
        return JsonResponse({"error": f"ML pipeline processing fault: {str(e)}"}, status=400)

    previous_weight = device.last_weight_grams
    weight_delta_grams = weight_grams - previous_weight

    if weight_delta_grams < 5.0:
        device.save()
        return JsonResponse({"accepted": False, "reason": "Deposit too light. Under 5g threshold."}, status=400)

    deposit = DepositEvent.objects.create(
        device=device,
        ir_sensor_detected=ir_sensor,
        capacitive_sensor_triggered=cap_sensor,
        weight_grams=weight_grams,
        weight_delta_grams=weight_delta_grams,
        material_label=classification.label,
        classification_confidence=classification.confidence
    )

    minutes_reward = calculate_wifi_time(weight_delta_grams)
    voucher_code = generate_voucher_code()

    session = WifiSession.objects.create(
        session_id=voucher_code,
        deposit=deposit,
        minutes_allocated=minutes_reward,
        time_remaining_minutes=minutes_reward,
        status="ACTIVE"
    )

    device.last_weight_grams = weight_grams
    device.save()

    return JsonResponse({
        "accepted": True,
        "deposit_id": deposit.id,
        "weight_collected_g": weight_delta_grams,
        "wifi_voucher": session.session_id,
        "minutes_allocated": session.minutes_allocated,
        "status": "session_active"
    }, status=201)