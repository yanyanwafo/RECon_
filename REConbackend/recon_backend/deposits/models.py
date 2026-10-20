from django.db import models

class Deposit(models.Model):
    deposit_code = models.CharField(max_length=50, unique=True)
    bin_id = models.CharField(max_length=50)
    weight_g = models.FloatField(default=0.0, help_text="Weight of paper in grams")
    status = models.CharField(
        max_length=20, 
        choices=[
            ('VALID', 'Valid'),
            ('TOO_LIGHT', 'Too Light'),
            ('INVALID', 'Invalid / Non-paper')
        ],
        default='VALID'
    )
    min_earned = models.FloatField(default=0.0, help_text="WiFi reward minutes earned")
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        weight = float(self.weight_g)
        
        if weight < 5.0:
            self.status = 'TOO_LIGHT'
            self.min_earned = 0.0
        elif 5.0 <= weight < 20.0:
            self.status = 'VALID'
            self.min_earned = weight * 3.0
        elif 20.0 <= weight < 50.0:
            self.status = 'VALID'
            self.min_earned = 60.0 + (weight - 20.0) * 2.0
        else:  # weight >= 50.0
            self.status = 'VALID'
            self.min_earned = 480.0  # Maximum cap per transaction

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.deposit_code} - {self.weight_g}g ({self.status})"

class WiFiSession(models.Model):
    session_code = models.CharField(max_length=50, unique=True)
    deposit = models.ForeignKey(Deposit, on_delete=models.CASCADE, null=True, blank=True)
    deposit_code = models.CharField(max_length=50, blank=True, null=True)
    mac_address = models.CharField(max_length=50, blank=True, null=True)
    minutes_allocated = models.IntegerField(default=30)
    time_remaining_sec = models.IntegerField(default=1800)
    status = models.CharField(
        max_length=20,
        choices=[
            ('ACTIVE', 'Active'),
            ('PAUSED', 'Paused'),
            ('EXPIRED', 'Expired')
        ],
        default='ACTIVE'
    )
    session_start = models.DateTimeField(blank=True, null=True)
    session_end = models.DateTimeField(blank=True, null=True)
    paused_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.session_code} - {self.status}"

class Bin(models.Model):
    bin_code = models.CharField(max_length=50, unique=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('READY', 'Ready'),
            ('FULL', 'Full'),
            ('MAINTENANCE', 'Maintenance')
        ],
        default='READY'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bin_code} ({self.status})"

class SystemSetting(models.Model):
    minimum_deposit_grams = models.DecimalField(max_digits=6, decimal_places=2, default=5.00)
    tier_one_max_grams = models.DecimalField(max_digits=6, decimal_places=2, default=20.00)
    tier_one_multiplier = models.DecimalField(max_digits=4, decimal_places=2, default=3.00)
    tier_two_max_grams = models.DecimalField(max_digits=6, decimal_places=2, default=50.00)
    tier_two_base_minutes = models.IntegerField(default=60)
    tier_two_multiplier = models.DecimalField(max_digits=4, decimal_places=2, default=2.00)
    maximum_minutes_per_transaction = models.IntegerField(default=480)
    session_expiry_hours = models.IntegerField(default=24)
    bin_fill_alert_threshold = models.DecimalField(max_digits=5, decimal_places=2, default=90.00)
    updated_at = models.DateTimeField(auto_now=True)