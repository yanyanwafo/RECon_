from django.db import models

class Device(models.Model):
    device_id = models.CharField(max_length=64, unique=True)
    location_name = models.CharField(max_length=100, default="USTP Campus")
    last_weight_grams = models.FloatField(default=0.0)
    current_fill_level_pct = models.FloatField(default=0.0) 
    status = models.CharField(max_length=16, default="READY") # READY / FULL
    last_emptied_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.device_id} ({self.status})"


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
        return f"Deposit {self.id} - {self.weight_delta_grams}g"


class WifiSession(models.Model):
    session_id = models.CharField(max_length=64, unique=True)
    deposit = models.OneToOneField(DepositEvent, on_delete=models.CASCADE, related_name="wifi_session")
    mac_address = models.CharField(max_length=17, blank=True, null=True)
    minutes_allocated = models.IntegerField()
    time_remaining_minutes = models.IntegerField()
    status = models.CharField(max_length=16, default="ACTIVE")
    session_start = models.DateTimeField(auto_now_add=True)
    session_end = models.DateTimeField(null=True, blank=True)
    paused_timestamp = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-session_start"]

    def __str__(self):
        return f"Session {self.session_id} - {self.status}"