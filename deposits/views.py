import base64
import json
import logging

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import DepositEvent, Device
from .utils.mobilenet_validation import (
    CONFIDENCE_THRESHOLD,
    PAPER_LABEL,
    validate_material_with_mobilenet,
)

logger = logging.getLogger(__name__)


def _parse_request_payload(request):
    """
    Accept JSON payloads with `image_base64` or multipart uploads with `image`.
    """
    if request.content_type and "multipart/form-data" in request.content_type:
        payload = {
            "device_id": request.POST.get("device_id"),
            "ir_sensor_detected": _coerce_bool(request.POST.get("ir_sensor_detected")),
            "capacitive_sensor_triggered": _coerce_bool(
                request.POST.get("capacitive_sensor_triggered")
            ),
            "weight_grams": request.POST.get("weight_grams"),
            "image_base64": request.POST.get("image_base64"),
        }
        image_file = request.FILES.get("image")
        if image_file is not None:
            payload["image_bytes"] = image_file.read()
        return payload

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ValueError("Request body must be valid JSON.") from exc

    payload["ir_sensor_detected"] = _coerce_bool(payload.get("ir_sensor_detected"))
    payload["capacitive_sensor_triggered"] = _coerce_bool(
        payload.get("capacitive_sensor_triggered")
    )
    return payload


def _coerce_bool(value):
    if isinstance(value, bool):
        return value
    if value is None:
        return None
    if isinstance(value, str):
        normalized = value.strip().lower()
        if normalized in {"1", "true", "yes", "on"}:
            return True
        if normalized in {"0", "false", "no", "off"}:
            return False
    if isinstance(value, (int, float)):
        return bool(value)
    return None


def _extract_image_bytes(payload):
    if payload.get("image_bytes"):
        return payload["image_bytes"]

    image_base64 = payload.get("image_base64")
    if not image_base64:
        return None

    if isinstance(image_base64, str) and image_base64.startswith("data:"):
        _, encoded = image_base64.split(",", 1)
        image_base64 = encoded

    try:
        return base64.b64decode(image_base64, validate=True)
    except (ValueError, TypeError) as exc:
        raise ValueError("image_base64 must be a valid base64-encoded image string.") from exc


def _reject(message, *, status=400, log_message=None):
    if log_message:
        logger.warning(log_message)
    return JsonResponse({"accepted": False, "error": message}, status=status)


@csrf_exempt
@require_POST
def ingest_telemetry(request):
    """
    Ingest device telemetry and validate deposit events.

    Expected JSON payload keys:
    - device_id (str)
    - ir_sensor_detected (bool)
    - capacitive_sensor_triggered (bool)
    - weight_grams (float)
    - image_base64 (str, optional if multipart `image` file is supplied)
    """
    try:
        payload = _parse_request_payload(request)
    except ValueError as exc:
        return _reject(str(exc))

    device_id = payload.get("device_id")
    if not device_id:
        return _reject("device_id is required.")

    if payload.get("ir_sensor_detected") is not True:
        return _reject("IR sensor validation failed: object not detected.")

    if payload.get("capacitive_sensor_triggered") is not True:
        return _reject("Capacitive sensor validation failed: paper material not detected.")

    try:
        weight_grams = float(payload.get("weight_grams"))
    except (TypeError, ValueError):
        return _reject("weight_grams must be a numeric value.")

    try:
        image_bytes = _extract_image_bytes(payload)
    except ValueError as exc:
        return _reject(str(exc))

    if not image_bytes:
        return _reject("An image file or image_base64 payload is required.")

    try:
        classification = validate_material_with_mobilenet(image_bytes)
    except ValueError as exc:
        return _reject(str(exc))

    if not classification.passed:
        logger.warning(
            "Material Classification Validation Failure: device=%s label=%s confidence=%.4f threshold=%.2f",
            device_id,
            classification.label,
            classification.confidence,
            CONFIDENCE_THRESHOLD,
        )
        return JsonResponse(
            {
                "accepted": False,
                "error": "Material Classification Validation Failure",
                "material_label": classification.label,
                "classification_confidence": classification.confidence,
                "confidence_threshold": CONFIDENCE_THRESHOLD,
            },
            status=422,
        )

    device, _ = Device.objects.get_or_create(device_id=device_id)
    previous_weight = device.last_weight_grams
    weight_delta_grams = round(weight_grams - previous_weight, 3)

    verification_payload = {
        "device_id": device_id,
        "ir_sensor_detected": payload["ir_sensor_detected"],
        "capacitive_sensor_triggered": payload["capacitive_sensor_triggered"],
        "material_label": PAPER_LABEL,
        "classification_confidence": classification.confidence,
        "confidence_threshold": CONFIDENCE_THRESHOLD,
        "image_format": classification.image_structure.format,
        "image_dimensions": {
            "width": classification.image_structure.width,
            "height": classification.image_structure.height,
        },
        "weight_grams": weight_grams,
        "previous_weight_grams": previous_weight,
        "weight_delta_grams": weight_delta_grams,
        "status": "verified",
    }
    print("Verification payload:", json.dumps(verification_payload, sort_keys=True))

    deposit = DepositEvent.objects.create(
        device=device,
        ir_sensor_detected=payload["ir_sensor_detected"],
        capacitive_sensor_triggered=payload["capacitive_sensor_triggered"],
        weight_grams=weight_grams,
        weight_delta_grams=weight_delta_grams,
        material_label=classification.label,
        classification_confidence=classification.confidence,
    )

    device.last_weight_grams = weight_grams
    device.save(update_fields=["last_weight_grams", "updated_at"])

    return JsonResponse(
        {
            "accepted": True,
            "deposit_id": deposit.id,
            "verification": verification_payload,
        },
        status=201,
    )
