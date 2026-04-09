'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';
import { 
  User, Mail, Briefcase, MapPin, Camera, Save, ArrowLeft, CheckCircle2, 
  Shield, Bell, Globe, Edit2, X, Phone, Building, Calendar, Lock 
} from 'lucide-react';

const locations = [
  'Lilongwe, Malawi',
  'Blantyre, Malawi',
  'Mzuzu, Malawi',
  'Zomba, Malawi',
  'Nairobi, Kenya',
  'Dar es Salaam, Tanzania',
  'Lusaka, Zambia',
  'Harare, Zimbabwe',
  'Johannesburg, South Africa',
  'Lagos, Nigeria'
];

export default function ApproverProfile() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(user.profileImage);
  const [isMounted, setIsMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    position: user.position,
    department: user.department,
    location: user.location,
    phone: user.phone,
    employeeId: user.employeeId,
    bio: 'Senior approver with over 8 years of experience in financial compliance and risk management. Specialized in cross-border transactions and DSA approvals for East African region.'
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Sync form data with user context when it changes
    setFormData(prev => ({
      ...prev,
      name: user.name,
      email: user.email,
      position: user.position,
      department: user.department,
      location: user.location,
      phone: user.phone,
    }));
    setProfileImage(user.profileImage);
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
      profileImage: profileImage,
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
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isMounted) {
    return null;
  }

  const getInitials = () => {
    return formData.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/approver" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-slate-500 text-sm">Manage your personal information and approval preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
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
                    <div className="w-full h-full bg-lime-100 text-lime-600 flex items-center justify-center text-3xl font-bold">
                      {getInitials()}
                    </div>
                  )}
                </div>
                
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
              <p className="text-xs text-slate-400 mt-1">{formData.employeeId}</p>
            </div>
            
            <div className="border-t border-slate-100 pt-4 mt-2 space-y-3 text-left p-4">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail size={16} className="text-slate-400 shrink-0" />
                <span className="truncate">{formData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600 group">
                <MapPin size={16} className="text-slate-400 shrink-0" />
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
              <div className="flex items-center gap-3 text-sm text-slate-600 group">
                <Phone size={16} className="text-slate-400 shrink-0" />
                {isEditingPhone ? (
                  <input 
                    type="tel"
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-lime-500"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    onBlur={() => setIsEditingPhone(false)}
                    autoFocus
                  />
                ) : (
                  <>
                    <span className="flex-1">{formData.phone}</span>
                    <button 
                      onClick={() => setIsEditingPhone(true)}
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
              <CheckCircle2 size={16} className="text-lime-500" />
              Approval Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Total Approved</span>
                <span className="text-lg font-bold text-slate-800">247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Pending Reviews</span>
                <span className="text-lg font-bold text-amber-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Avg. Response Time</span>
                <span className="text-lg font-bold text-slate-800">2.4 hrs</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-2">
                <div className="bg-lime-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
              <p className="text-xs text-slate-400 text-center mt-2">95% approval rate</p>
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
              <span>Two-Factor Authentication</span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase tracking-wider">Setup</span>
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between group">
              <span>Session Management</span>
              <span className="text-xs text-slate-400">2 active sessions</span>
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
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Position</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500" 
                    value={formData.position} 
                    onChange={(e) => setFormData({...formData, position: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Department</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500" 
                    value={formData.department} 
                    onChange={(e) => setFormData({...formData, department: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="tel" 
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Employee ID</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed" 
                    value={formData.employeeId} 
                    disabled 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio</label>
              <textarea 
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500 min-h-[100px]" 
                value={formData.bio} 
                onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                placeholder="Tell us about your role and expertise..."
              />
            </div>

            <div className="pt-4 flex gap-4">
              <button 
                type="submit" 
                className="bg-lime-500 hover:bg-lime-600 text-white flex-1 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={isSaving}
              >
                <Save size={18} />
                {isSaving ? "Saving Changes..." : "Save Changes"}
              </button>
              <button 
                type="button" 
                className="border-2 border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors" 
                onClick={() => router.push('/approver')}
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Bell size={18} /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Email Notifications</p>
                    <p className="text-xs text-slate-500">Receive updates about pending approvals.</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-lime-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Calendar size={18} /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Date Format</p>
                    <p className="text-xs text-slate-500">Choose your preferred date format.</p>
                  </div>
                </div>
                <select className="bg-transparent text-sm font-bold text-slate-600 focus:outline-none">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Approval Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Shield size={18} /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Auto-approve threshold</p>
                    <p className="text-xs text-slate-500">Requests below this amount are auto-approved.</p>
                  </div>
                </div>
                <select className="bg-transparent text-sm font-bold text-slate-600 focus:outline-none">
                  <option>MWK 500,000</option>
                  <option>MWK 1,000,000</option>
                  <option>MWK 2,500,000</option>
                  <option>MWK 5,000,000</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Bell size={18} /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Urgency notifications</p>
                    <p className="text-xs text-slate-500">Get notified for high urgency requests.</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-lime-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
