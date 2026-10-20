from rest_framework import serializers
from .models import Deposit, WiFiSession, Bin, SystemSetting

class DepositSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deposit
        fields = '__all__'

class WiFiSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WiFiSession
        fields = '__all__'

class BinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bin
        fields = '__all__'

class SystemSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSetting
        fields = '__all__'