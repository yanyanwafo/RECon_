from django.urls import path
from .views import connect_wifi_view, DepositListView, BinListView, SystemSettingListView

urlpatterns = [
    path('connect/', connect_wifi_view, name='connect-wifi'),
    path('deposits/', DepositListView.as_view(), name='deposit-list'),
    path('bins/', BinListView.as_view(), name='bin-list'),
    path('settings/', SystemSettingListView.as_view(), name='system-settings'),
]