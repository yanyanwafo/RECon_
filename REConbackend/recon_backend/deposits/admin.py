from django.contrib import admin
from .models import Deposit, WiFiSession, Bin, SystemSetting

@admin.register(Deposit)
class DepositAdmin(admin.ModelAdmin):
    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }

@admin.register(WiFiSession)
class WiFiSessionAdmin(admin.ModelAdmin):
    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }

@admin.register(Bin)
class BinAdmin(admin.ModelAdmin):
    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }

@admin.register(SystemSetting)
class SystemSettingAdmin(admin.ModelAdmin):
    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }