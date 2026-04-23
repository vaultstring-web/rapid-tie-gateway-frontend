"use client";

import React, { useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Camera, 
  Shield, 
  Bell, 
  Globe, 
  Save,
  CheckCircle2,
  MapPin,
  Briefcase,
  Languages,
  Clock,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils'; // Ensure your path matches your project structure

export default function ProfilePage() {
  // --- STATE ---
  const [name, setName] = useState('Leticia Kanthiti');
  const [email, setEmail] = useState('leticiakanthiti05@gmail.com');
  const [bio, setBio] = useState('Merchant administrator and event coordinator based in Lilongwe.');
  const [location, setLocation] = useState('Lilongwe, Malawi');
  const [timezone, setTimezone] = useState('CAT (UTC+2)');
  const [language, setLanguage] = useState('English (US)');
  const [isSaved, setIsSaved] = useState(false);
  const [profilePic, setProfilePic] = useState('https://i.pravatar.cc/150?u=merchant');

  // --- HANDLERS ---
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-10">
      
      {/* 1. PROFILE HEADER / PREVIEW SECTION */}
      <section className="relative overflow-hidden bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#84cc16]/20 to-lime-50" />
        
        <div className="relative flex flex-col md:flex-row items-end gap-6 mt-12">
          <div className="relative group">
            <img 
              src={profilePic} 
              alt="Profile" 
              className="w-32 h-32 rounded-[2rem] object-cover border-4 border-white shadow-xl"
            />
            <label className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-lg border border-gray-100 cursor-pointer hover:scale-110 transition-transform">
              <Camera size={18} className="text-[#84cc16]" />
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
          
          <div className="flex-1 pb-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">{name}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1.5"><Briefcase size={14} /> Administrator</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} /> {location}</span>
              <span className="flex items-center gap-1.5"><Languages size={14} /> {language}</span>
            </div>
          </div>

          <AnimatePresence>
            {isSaved && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-0 right-0 bg-lime-50 text-[#84cc16] px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2"
              >
                <CheckCircle2 size={14} /> Synchronized
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 2. ACCOUNT SETTINGS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-4">Settings Menu</h2>
          {[
            { icon: User, label: 'Personal Info', active: true },
            { icon: Shield, label: 'Security', active: false },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: Globe, label: 'Preferences', active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all",
                item.active 
                  ? "bg-[#3b5a65] text-white shadow-lg" 
                  : "text-gray-500 hover:bg-white hover:text-[#84cc16]"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </aside>

        {/* Form Main Area */}
        <div className="lg:col-span-9 space-y-8">
          <form onSubmit={handleSave} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Display Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#84cc16] outline-none transition-all" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="email" 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#84cc16] outline-none transition-all" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#84cc16] outline-none transition-all" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Bio / Professional Summary</label>
                <textarea 
                  className="w-full p-5 bg-gray-50 border border-transparent rounded-[2rem] text-sm font-bold focus:bg-white focus:ring-2 focus:ring-[#84cc16] outline-none transition-all min-h-[120px]" 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              {/* EXPANDED TIMEZONE OPTIONS */}
              
            </div>

            <div className="pt-8 border-t border-gray-50 flex justify-end gap-4">
              <button type="button" className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Discard</button>
              <button type="submit" className="px-10 py-4 bg-[#84cc16] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-lg flex items-center gap-2">
                <Save size={16} /> Update Settings
              </button>
            </div>
          </form>

          {/* DANGER ZONE */}
          <div className="bg-red-50/50 p-8 rounded-[2.5rem] border border-red-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-black text-red-900 text-lg">Deactivate Account</h3>
              <p className="text-sm text-red-700/70 font-medium">Permanently remove your account and all associated data.</p>
            </div>
            <button className="px-8 py-4 border-2 border-red-200 text-red-600 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all flex items-center gap-2">
              <Trash2 size={16} /> Delete Forever
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}