//src/components/patients/components/PatientProfile.tsx
"use client";

import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Droplet, Edit, Save, X, Image as ImageIcon, Loader, AlertCircle, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";

interface PatientProfileProps {
  profile: any;
  onUpdate: (updatedProfile: any) => void;
}

export default function PatientProfile({ profile, onUpdate }: PatientProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(profile?.profile_photo || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
    setProfilePhoto(null);
    setPhotoPreview(profile?.profile_photo || null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      Object.keys(editedProfile).forEach(key => {
        if (key !== 'profile_photo' && key !== 'user') {
          formData.append(key, editedProfile[key]);
        }
      });
      if (profilePhoto) formData.append('profile_photo', profilePhoto);

      const response = await api.put("/patients/profile/", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        onUpdate(response.data.data);
        setIsEditing(false);
        setSuccess("Profile updated successfully!");
        setProfilePhoto(null);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-card shadow-xl shadow-black/50/50 border border-white/10 rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
          <User className="h-6 w-6 text-foreground" />
          My Profile
        </h2>
        {!isEditing ? (
          <button onClick={handleEdit} className="flex items-center space-x-2 px-4 py-2 bg-card shadow-xl shadow-black/50/50 hover:bg-telehealth-blue text-xs font-bold rounded-xl transition-colors">
            <Edit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button onClick={handleCancel} className="flex items-center space-x-2 px-4 py-2 bg-card shadow-xl shadow-black/50/50 hover:bg-telehealth-blue text-xs font-bold rounded-xl transition-colors text-foreground">
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button onClick={handleSave} disabled={loading} className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-500 text-foreground text-xs font-bold rounded-xl transition-all disabled:opacity-50">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs flex items-center gap-2"><AlertCircle className="h-4 w-4" />{error}</div>}
      {success && <div className="mb-4 p-3 bg-card border border-blue-100 rounded-xl text-blue-700 text-xs flex items-center gap-2"><CheckCircle className="h-4 w-4" />{success}</div>}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Photo */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-card shadow-xl shadow-black/50/50 border-2 border-telehealth-blue overflow-hidden flex items-center justify-center">
              {photoPreview ? <img src={photoPreview} alt="Profile" className="h-full w-full object-cover" /> : <User className="h-12 w-12 text-foreground" />}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-2 bg-card shadow-xl shadow-black/50/50 rounded-full cursor-pointer hover:bg-card shadow-xl shadow-black/50/50 transition-colors">
                <ImageIcon className="h-4 w-4 text-trust-blue" />
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            )}
          </div>
          {isEditing && <p className="text-[10px] text-foreground text-center">Click icon to upload photo</p>}
        </div>

        {/* Profile Details */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-foreground uppercase">Full Name</label>
            {isEditing ? (
              <input type="text" value={editedProfile.full_name || ''} onChange={(e) => setEditedProfile({...editedProfile, full_name: e.target.value})} className="w-full bg-card border border-white/10 focus:border-blue-100 rounded-lg px-3 py-2 text-sm text-foreground outline-none" />
            ) : <p className="text-sm font-medium text-foreground">{profile?.full_name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-foreground uppercase flex items-center gap-1"><Mail className="h-3 w-3" /> Email</label>
            <p className="text-sm text-foreground">{profile?.email}</p>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-foreground uppercase flex items-center gap-1"><Phone className="h-3 w-3" /> Phone</label>
            {isEditing ? (
              <input type="tel" value={editedProfile.phone || profile?.phone || ''} onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})} className="w-full bg-card border border-white/10 focus:border-blue-100 rounded-lg px-3 py-2 text-sm text-foreground outline-none" />
            ) : <p className="text-sm text-foreground">{profile?.phone || 'Not set'}</p>}
          </div>

          {/* Blood Group */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-foreground uppercase flex items-center gap-1"><Droplet className="h-3 w-3 text-red-500" /> Blood Group</label>
            {isEditing ? (
              <select value={editedProfile.blood_group || ''} onChange={(e) => setEditedProfile({...editedProfile, blood_group: e.target.value})} className="w-full bg-card border border-white/10 focus:border-blue-100 rounded-lg px-3 py-2 text-sm text-foreground outline-none">
                <option value="">Select Blood Group</option>
                <option value="A_POSITIVE">A+</option><option value="A_NEGATIVE">A-</option>
                <option value="B_POSITIVE">B+</option><option value="B_NEGATIVE">B-</option>
                <option value="O_POSITIVE">O+</option><option value="O_NEGATIVE">O-</option>
                <option value="AB_POSITIVE">AB+</option><option value="AB_NEGATIVE">AB-</option>
              </select>
            ) : <p className="text-sm text-foreground">{profile?.blood_group || 'Not set'}</p>}
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-foreground uppercase">Gender</label>
            {isEditing ? (
              <select value={editedProfile.gender || ''} onChange={(e) => setEditedProfile({...editedProfile, gender: e.target.value})} className="w-full bg-card border border-white/10 focus:border-blue-100 rounded-lg px-3 py-2 text-sm text-foreground outline-none">
                <option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option>
              </select>
            ) : <p className="text-sm text-foreground">{profile?.gender}</p>}
          </div>

          {/* Date of Birth */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-foreground uppercase">Date of Birth</label>
            {isEditing ? (
              <input type="date" value={editedProfile.date_of_birth || ''} onChange={(e) => setEditedProfile({...editedProfile, date_of_birth: e.target.value})} className="w-full bg-card border border-white/10 focus:border-blue-100 rounded-lg px-3 py-2 text-sm text-foreground outline-none" />
            ) : <p className="text-sm text-foreground">{profile?.date_of_birth}</p>}
          </div>

          {/* City */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-foreground uppercase">City</label>
            {isEditing ? (
              <input type="text" value={editedProfile.city || ''} onChange={(e) => setEditedProfile({...editedProfile, city: e.target.value})} className="w-full bg-card border border-white/10 focus:border-blue-100 rounded-lg px-3 py-2 text-sm text-foreground outline-none" />
            ) : <p className="text-sm text-foreground">{profile?.city}</p>}
          </div>

          {/* PIN Code */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-foreground uppercase">PIN Code</label>
            {isEditing ? (
              <input type="text" value={editedProfile.pin_code || ''} onChange={(e) => setEditedProfile({...editedProfile, pin_code: e.target.value})} className="w-full bg-card border border-white/10 focus:border-blue-100 rounded-lg px-3 py-2 text-sm text-foreground outline-none" />
            ) : <p className="text-sm text-foreground">{profile?.pin_code}</p>}
          </div>

          {/* Address */}
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] font-semibold text-foreground uppercase flex items-center gap-1"><MapPin className="h-3 w-3" /> Address</label>
            {isEditing ? (
              <textarea rows={2} value={editedProfile.address || ''} onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})} className="w-full bg-card border border-white/10 focus:border-blue-100 rounded-lg px-3 py-2 text-sm text-foreground outline-none resize-none" />
            ) : <p className="text-sm text-foreground">{profile?.address}</p>}
          </div>

          {/* Emergency Contact */}
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] font-semibold text-foreground uppercase">Emergency Contact</label>
            {isEditing ? (
              <input type="tel" value={editedProfile.emergency_contact || ''} onChange={(e) => setEditedProfile({...editedProfile, emergency_contact: e.target.value})} className="w-full bg-card border border-white/10 focus:border-blue-100 rounded-lg px-3 py-2 text-sm text-foreground outline-none" placeholder="+91 9876543210" />
            ) : <p className="text-sm text-foreground">{profile?.emergency_contact || 'Not set'}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}