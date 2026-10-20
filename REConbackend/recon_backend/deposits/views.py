from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils import timezone
from rest_framework import generics

from .models import WiFiSession, Deposit, Bin, SystemSetting
from .serializers import (
    DepositSerializer,
    WiFiSessionSerializer,
    BinSerializer,
    SystemSettingSerializer
)

@api_view(['POST'])
def connect_wifi_view(request):
    session_code = request.data.get('session_code')
    mac_address = request.data.get('mac_address', '')

    if not session_code:
        return Response({"error": "Session code is required."}, status=400)

    try:
        session = WiFiSession.objects.get(session_code=session_code)
        session.status = 'ACTIVE'
        session.mac_address = mac_address
        session.session_start = timezone.now()
        session.save()

        return Response({
            "success": True,
            "message": "Successfully connected to WiFi!",
            "session_code": session.session_code,
            "time_remaining_sec": session.time_remaining_sec,
            "status": session.status
        }, status=200)

    except WiFiSession.DoesNotExist:
        return Response({"error": "Invalid session code."}, status=404)

class DepositListView(generics.ListCreateAPIView):
    queryset = Deposit.objects.all().order_by('-created_at')
    serializer_class = DepositSerializer

class BinListView(generics.ListCreateAPIView):
    queryset = Bin.objects.all()
    serializer_class = BinSerializer

class SystemSettingListView(generics.ListAPIView):
    queryset = SystemSetting.objects.all()
    serializer_class = SystemSettingSerializer