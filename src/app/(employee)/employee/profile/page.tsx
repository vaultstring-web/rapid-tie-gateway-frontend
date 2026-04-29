"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Briefcase, MapPin, Camera, Save, ArrowLeft, CheckCircle2, Shield, Bell, Globe, Edit2, X } from 'lucide-react';

const locations = [
  'Lilongwe, Malawi',
  'Blantyre, Malawi',
  'Mzuzu, Malawi',
  'Zomba, Malawi',
  'Nairobi, Kenya',
  'Dar es Salaam, Tanzania',
  'Lusaka, Zambia',
  'Harare, Zimbabwe'
];

export default function Profile() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Leticia Kanthiti',
    email: 'leticia.kanthiti@vaultstring.org',
    position: 'Program Officer',
    department: 'Health & Nutrition',
    location: 'Lilongwe, Malawi',
    phone: '+265 888 123 456',
    bio: 'Dedicated program officer focused on regional health initiatives and NGO coordination across East Africa.'
  });

  // Load saved image on component mount (client-side only)
  useEffect(() => {
    setIsMounted(true);
    const savedImage = localStorage.getItem('user_profile_image');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImage(result);
        // Save to localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_profile_image', result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_profile_image');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Don't render until mounted (to avoid hydration issues)
  if (!isMounted) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/employee" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-slate-500 text-sm">Manage your personal information and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-lime-500/10"></div>
            <div className="relative pt-8 pb-4">
              <div className="relative inline-block group">
                <div className="w-32 h-32 bg-slate-200 rounded-full border-4 border-white shadow-lg overflow-hidden mx-auto">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`} 
                      alt="Profile" 
                      className="w-full h-full"
                    />
                  )}
                </div>
                
                {/* Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  id="profile-upload"
                />
                
                <label 
                  htmlFor="profile-upload"
                  className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow-md border border-slate-100 text-slate-600 hover:text-lime-600 transition-colors cursor-pointer"
                >
                  <Camera size={16} />
                </label>
                
                {/* Remove Image Button (only shows when image exists) */}
                {profileImage && (
                  <button
                    onClick={removeImage}
                    className="absolute top-0 right-0 p-1.5 bg-red-500 rounded-full shadow-md text-white hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-slate-800 mt-4">{formData.name}</h2>
              <p className="text-sm font-medium text-slate-500">{formData.position}</p>
            </div>
            
            <div className="border-t border-slate-100 pt-4 mt-2 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-slate-600 px-2">
                <Mail size={16} className="text-slate-400" />
                <span className="truncate">{formData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 px-2 group">
                <MapPin size={16} className="text-slate-400" />
                {isEditingLocation ? (
                  <select 
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-lime-500"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    onBlur={() => setIsEditingLocation(false)}
                    autoFocus
                  >
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                ) : (
                  <>
                    <span className="flex-1">{formData.location}</span>
                    <button 
                      onClick={() => setIsEditingLocation(true)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded"
                    >
                      <Edit2 size={12} className="text-slate-400" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Shield size={16} className="text-lime-500" />
              Account Security
            </h3>
            <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between group">
              <span>Change Password</span>
              <ArrowLeft size={14} className="rotate-180 text-slate-400 group-hover:text-lime-500 transition-transform" />
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between group">
              <span>Two-Factor Auth</span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase tracking-wider">Off</span>
            </button>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
              {showSuccess && (
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
                  <CheckCircle2 size={16} />
                  Changes Saved!
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="email" className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Position</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} required />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio</label>
              <textarea className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 min-h-[100px]" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="Tell us a bit about your role..."></textarea>
            </div>

            <div className="pt-4 flex gap-4">
              <button type="submit" className="bg-lime-500 hover:bg-lime-600 text-white flex-1 py-3 rounded-xl font-bold transition-colors" disabled={isSaving}>
                {isSaving ? "Saving Changes..." : "Save Changes"}
              </button>
              <button type="button" className="border-2 border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors" onClick={() => router.push('/employee')}>Cancel</button>
            </div>
          </form>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Bell size={18} /></div>
                  <div><p className="text-sm font-bold text-slate-800">Email Notifications</p><p className="text-xs text-slate-500">Receive updates about your DSA requests.</p></div>
                </div>
                <div className="w-12 h-6 bg-lime-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Globe size={18} /></div>
                  <div><p className="text-sm font-bold text-slate-800">Language</p><p className="text-xs text-slate-500">Select your preferred display language.</p></div>
                </div>
                <select className="bg-transparent text-sm font-bold text-slate-600 focus:outline-none"><option>English (US)</option><option>French</option><option>Swahili</option></select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}