from django.db import models


class Device(models.Model):
    device_id = models.CharField(max_length=64, unique=True)
    last_weight_grams = models.FloatField(default=0.0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.device_id


class DepositEvent(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name="deposits")
    ir_sensor_detected = models.BooleanField()
    capacitive_sensor_triggered = models.BooleanField()
    weight_grams = models.FloatField()
    weight_delta_grams = models.FloatField()
    material_label = models.CharField(max_length=32, default="paper")
    classification_confidence = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.device.device_id} deposit ({self.weight_delta_grams}g)"
