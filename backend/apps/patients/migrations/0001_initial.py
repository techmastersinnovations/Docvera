# Generated manually to restore dependency graph balance
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('authentication', '__first__'),
        ('auth', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, related_name='patient_profile', to=settings.AUTH_USER_MODEL)),
                ('full_name', models.CharField(max_length=150)),
                ('gender', models.CharField(choices=[('MALE', 'Male'), ('FEMALE', 'Female'), ('OTHER', 'Other')], max_length=10)),
                ('date_of_birth', models.DateField()),
                ('blood_group', models.CharField(blank=True, choices=[('A_POSITIVE', 'A+'), ('A_NEGATIVE', 'A-'), ('B_POSITIVE', 'B+'), ('B_NEGATIVE', 'B-'), ('O_POSITIVE', 'O+'), ('O_NEGATIVE', 'O-'), ('AB_POSITIVE', 'AB+'), ('AB_NEGATIVE', 'AB-')], max_length=10, null=True)),
                ('emergency_contact', models.CharField(blank=True, max_length=15, null=True)),
                ('profile_photo', models.ImageField(blank=True, null=True, upload_to='patient_photos/')),
                ('city', models.CharField(max_length=100)),
                ('pin_code', models.CharField(max_length=10)),
                ('address', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
    ]