from django.contrib import admin
from .models import Deposit, WiFiSession, Bin, SystemSetting

admin.site.register(Deposit)
admin.site.register(WiFiSession)
admin.site.register(Bin)
admin.site.register(SystemSetting)