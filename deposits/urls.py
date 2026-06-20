from django.urls import path

from . import views

urlpatterns = [
    path("telemetry/ingest/", views.ingest_telemetry, name="ingest_telemetry"),
]
