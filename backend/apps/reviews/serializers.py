from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    
    class Meta:
        model = Review
        fields = ('id', 'appointment', 'patient', 'doctor', 'rating', 'comment', 'patient_name', 'created_at')
