// app/organizer/profile/page.tsx
'use client';

import React, { useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Camera, 
  Settings, 
  CreditCard, 
  Bell, 
  LogOut,
  ChevronRight,
  ShieldAlert,
  Upload,
  X
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { user, updateUser, updateAvatar } = useUser();
  
  // Local form state for editing
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  });

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
    setIsEditing(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatar(reader.result as string);
        setShowUploadModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmAvatarUpload = () => {
    if (tempAvatar) {
      updateAvatar(tempAvatar);
      setShowUploadModal(false);
      setTempAvatar(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24">
      {/* Avatar Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Preview Avatar</h3>
              <button onClick={() => setShowUploadModal(false)} className="p-1">
                <X size={20} />
              </button>
            </div>
            <div className="flex justify-center mb-6">
              <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-[#84cc16]">
                <img src={tempAvatar!} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAvatarUpload}
                className="flex-1 btn-primary"
              >
                Save Avatar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase mb-2">My Profile</h1>
          <p className="text-[var(--text-secondary)] text-sm font-medium uppercase tracking-widest">Manage your identity and security</p>
        </div>
        <div className="flex gap-3">
          {isEditing && (
            <button 
              onClick={handleCancel}
              className="bg-red-500/10 text-red-500 px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500/20 transition-all"
            >
              Cancel
            </button>
          )}
          <button 
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className="bg-[#84cc16] text-white px-6 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-lime-500/20 hover:scale-105 transition-all"
          >
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Role Card */}
        <div className="space-y-6">
          <div className="bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] p-8 rounded-[20px] text-center relative overflow-hidden group">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-[var(--bg-primary)] shadow-2xl group-hover:border-[#84cc16] transition-all duration-500">
                <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 bg-[#84cc16] text-white p-2.5 rounded-xl shadow-lg hover:scale-110 transition-transform"
              >
                <Camera size={16} />
              </button>
            </div>
            
            <h2 className="text-xl font-black uppercase tracking-tight mb-1">{user.name}</h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#84cc16]/10 text-[#84cc16] rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <ShieldCheck size={12} /> {user.role}
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest">{user.joinDate}</p>

            {/* Background Glow */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#84cc16]/5 rounded-full blur-3xl" />
          </div>

          {/* Quick Menu */}
          <div className="bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] rounded-[20px] overflow-hidden">
            {[
              { label: 'Payment Methods', icon: CreditCard },
              { label: 'Notifications', icon: Bell },
              { label: 'Account Security', icon: ShieldAlert },
              { label: 'Preferences', icon: Settings },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg-primary)] transition-colors border-b border-[var(--border-color)] last:border-0 group">
                <div className="flex items-center gap-3">
                  <item.icon size={18} className="text-[var(--text-secondary)] group-hover:text-[#84cc16]" />
                  <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                </div>
                <ChevronRight size={14} className="text-[var(--text-secondary)]" />
              </button>
            ))}
            <button className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-500/5 transition-colors">
              <LogOut size={18} />
              <span className="text-[11px] font-black uppercase tracking-widest">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right Column: Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] p-8 rounded-[20px]">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 border-b border-[var(--border-color)] pb-4">Personal Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!isEditing}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-12 pr-4 text-xs font-bold outline-none focus:border-[#84cc16] disabled:opacity-50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!isEditing}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-12 pr-4 text-xs font-bold outline-none focus:border-[#84cc16] disabled:opacity-50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-12 pr-4 text-xs font-bold outline-none focus:border-[#84cc16] disabled:opacity-50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Platform Role</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-[#84cc16]" size={16} />
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    disabled={!isEditing}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-3.5 pl-12 pr-4 text-xs font-bold outline-none focus:border-[#84cc16] appearance-none disabled:opacity-50 transition-all"
                  >
                    <option value="Developer">Developer</option>
                    <option value="SME">SME</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Student">Student</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-10 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-start gap-4">
              <ShieldAlert className="text-amber-500 shrink-0" size={20} />
              <div>
                <p className="text-[10px] font-black uppercase tracking-tight text-amber-500 mb-1">Role Verification Required</p>
                <p className="text-[9px] font-bold text-[var(--text-secondary)] leading-relaxed">
                  Changing your role to <span className="text-[var(--text-primary)]">Corporate</span> or <span className="text-[var(--text-primary)]">SME</span> requires manual verification of your business documents to unlock specialized ticket pricing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}