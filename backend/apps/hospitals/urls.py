from django.urls import path
from .views import HospitalSearchView, HospitalCreateView, HospitalDetailView

urlpatterns = [
    path('search/', HospitalSearchView.as_view(), name='hospital_search'),
    path('<uuid:pk>/', HospitalDetailView.as_view(), name='hospital_detail'),
    path('create/', HospitalCreateView.as_view(), name='hospital_create'),
]