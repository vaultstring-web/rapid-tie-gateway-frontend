'use client';

import { useState } from 'react';
import { User, Mail, Phone, Building2, Briefcase, Calendar, Camera, Save, Key } from 'lucide-react';
import { ApproverProfile } from '@/types/approver/settings';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface ApproverProfileTabProps {
  profile: ApproverProfile;
  onUpdate: (data: Partial<ApproverProfile>) => Promise<void>;
}

export const ApproverProfileTab = ({ profile, onUpdate }: ApproverProfileTabProps) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdate(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
        toast.success('Avatar updated');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-[#84cc16]/20 flex items-center justify-center overflow-hidden border-2 border-[#84cc16]/40">
            {formData.avatar ? (
              <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-[#84cc16]" />
            )}
          </div>
          <label className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-[#84cc16] text-white cursor-pointer hover:brightness-110 transition-colors">
            <Camera size={14} />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
          </label>
        </div>
        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">Profile Picture</h3>
          <p className="text-sm text-[var(--text-secondary)]">JPG, PNG or GIF. Max 2MB.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">First Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Last Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Phone Number</label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Role</label>
          <div className="relative">
            <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 rounded-lg border bg-gray-100 dark:bg-gray-800 text-[var(--text-secondary)] cursor-not-allowed"
              style={{ borderColor: 'var(--border-color)' }}
              disabled
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Department</label>
          <div className="relative">
            <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <select
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              {['Finance', 'Operations', 'HR', 'IT', 'Sales', 'Marketing', 'Field Operations', 'Administration'].map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Employee ID</label>
          <div className="relative">
            <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={formData.employeeId}
              className="w-full pl-10 pr-3 py-2 rounded-lg border bg-gray-100 dark:bg-gray-800 text-[var(--text-secondary)] cursor-not-allowed"
              style={{ borderColor: 'var(--border-color)' }}
              disabled
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Join Date</label>
          <div className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="date"
              value={formData.joinDate.split('T')[0]}
              onChange={(e) => setFormData(prev => ({ ...prev, joinDate: e.target.value }))}
              className="w-full pl-10 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Bio / About</label>
        <textarea
          value={formData.bio || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] resize-y"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Changes
        </button>
      </div>
    </form>
  );
};