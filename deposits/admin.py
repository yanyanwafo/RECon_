from django.contrib import admin

from .models import DepositEvent, Device


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ("device_id", "last_weight_grams", "updated_at")
    search_fields = ("device_id",)


@admin.register(DepositEvent)
class DepositEventAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "device",
        "weight_delta_grams",
        "material_label",
        "classification_confidence",
        "created_at",
    )
    list_filter = ("material_label", "ir_sensor_detected", "capacitive_sensor_triggered")
