"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/admin/', include('apps.admin.urls')),

    # Auth Routes
    path('api/auth/', include('apps.authentication.urls')),

    # Doctor Routes
    path('api/doctors/', include('apps.doctors.urls')),

    # Hospital Routes
    path('api/hospitals/', include('apps.hospitals.urls')),

    # Appointment Routes
    path('api/appointments/', include('apps.appointments.urls')),

    # Payment Routes
    path('api/payments/', include('apps.payments.urls')),

    # Review Routes
    path('api/reviews/', include('apps.reviews.urls')),

    # Patient Profile Routes
    path('api/patients/', include('apps.patients.urls')),
    path('api/consultations/', include('apps.consultations.urls')),
    path('api/prescriptions/', include('apps.prescriptions.urls')),
    path('api/medical-records/', include('apps.medical_records.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/chats/', include('apps.chats.urls')),
    path('api/ai-assistant/', include('apps.ai_assistant.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)