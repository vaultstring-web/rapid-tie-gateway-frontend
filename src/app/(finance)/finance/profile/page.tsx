'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { 
  User, Mail, Briefcase, MapPin, Camera, Save, ArrowLeft, CheckCircle2, 
  Shield, Bell, Edit2, X, Phone, Building, Calendar, Lock, CreditCard
} from 'lucide-react';

const locations = [
  'Lilongwe, Malawi',
  'Blantyre, Malawi',
  'Mzuzu, Malawi',
  'Zomba, Malawi',
  'Nairobi, Kenya',
  'Lusaka, Zambia',
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, updateProfileImage } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    position: user.position,
    department: user.department,
    location: user.location,
    phone: user.phone,
    employeeId: user.employeeId,
    bio: user.bio,
  });

  // Sync form data when user changes
  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      position: user.position,
      department: user.department,
      location: user.location,
      phone: user.phone,
      employeeId: user.employeeId,
      bio: user.bio,
    });
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Update global user context
    updateUser({
      name: formData.name,
      email: formData.email,
      position: formData.position,
      department: formData.department,
      location: formData.location,
      phone: formData.phone,
      bio: formData.bio,
    });
    
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    updateProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = () => {
    return formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full text-slate-500 transition-colors shadow-sm border border-slate-100">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Profile Settings</h1>
          <p className="text-slate-500 text-sm">Update your personal details and account preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Identity & Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-lime-500/10" />
            <div className="relative pt-8 pb-4">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-slate-200 rounded-full border-4 border-white shadow-lg overflow-hidden mx-auto">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-lime-100 text-lime-600 flex items-center justify-center text-3xl font-bold">
                      {getInitials()}
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" id="profile-upload" />
                <label htmlFor="profile-upload" className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow-md border border-slate-100 text-slate-600 hover:text-lime-600 transition-colors cursor-pointer">
                  <Camera size={16} />
                </label>
                {user.profileImage && (
                  <button
                    onClick={removeImage}
                    className="absolute top-0 right-0 p-1.5 bg-red-500 rounded-full shadow-md text-white hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-800 mt-4">{formData.name}</h2>
              <p className="text-sm font-medium text-lime-600">{formData.position}</p>
            </div>

            <div className="border-t border-slate-50 p-4 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail size={16} className="text-slate-400" />
                <span className="truncate">{formData.email}</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-slate-600 group">
                <MapPin size={16} className="text-slate-400" />
                {isEditingLocation ? (
                  <select 
                    className="flex-1 text-sm border-b border-lime-500 focus:outline-none"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    onBlur={() => setIsEditingLocation(false)}
                    autoFocus
                  >
                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                ) : (
                  <>
                    <span className="flex-1">{formData.location}</span>
                    <button onClick={() => setIsEditingLocation(true)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-50 rounded">
                      <Edit2 size={12} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 uppercase tracking-wider text-xs text-slate-400">
              <CreditCard size={14} /> Disbursement Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Processed</p>
                <p className="text-lg font-bold">156</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500">Rate</p>
                <p className="text-lg font-bold text-lime-600">98%</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
              {showSuccess && (
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
                  <CheckCircle2 size={16} /> Changes Saved!
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 outline-none transition-all"
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 outline-none transition-all"
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Position</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 outline-none transition-all"
                    value={formData.position} 
                    onChange={(e) => setFormData({...formData, position: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Employee ID</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed"
                    value={formData.employeeId} 
                    disabled 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Bio</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 outline-none transition-all min-h-[120px]"
                value={formData.bio} 
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
              />
            </div>

            <div className="pt-4 flex gap-4">
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-lime-500 hover:bg-lime-600 text-white flex-1 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-lime-500/20 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <Save size={18} />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>

          {/* Preferences */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-4">Security & Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white text-blue-600 rounded-xl shadow-sm"><Bell size={18} /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Email Notifications</p>
                    <p className="text-xs text-slate-500">Alerts for disbursement approvals.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lime-500" />
                </label>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}