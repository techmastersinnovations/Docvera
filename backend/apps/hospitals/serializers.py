from rest_framework import serializers
from .models import Hospital, DoctorHospital

class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = '__all__'

class DoctorHospitalSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)
    
    class Meta:
        model = DoctorHospital
        fields = ('id', 'doctor', 'hospital', 'hospital_name')
