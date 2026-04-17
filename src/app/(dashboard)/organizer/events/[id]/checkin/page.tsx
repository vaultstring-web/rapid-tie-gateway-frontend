'use client';

import React, { useState, useRef } from 'react'; // Added useRef
import { useParams } from 'next/navigation';
import { 
  ChevronLeft, Camera, Search, CheckCircle2, Wifi, WifiOff, 
  UserPlus, RefreshCw, History, ShieldCheck, Users, SearchIcon,
  Upload, X // Added Upload and X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckInManagement() {
  const { id } = useParams();
  const [isScanning, setIsScanning] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null); // State for upload
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for device file picker

  // Requirement: Recent check-ins feed
  const [recentCheckins] = useState([
    { id: '1', name: 'Chisomo Phiri', role: 'Developer', time: 'Just now' },
    { id: '2', name: 'Lumbani Banda', role: 'SME', time: '2 mins ago' },
    { id: '3', name: 'Kondwani Mwale', role: 'Corporate', time: '5 mins ago' },
  ]);

  const stats = {
    total: 1240,
    checkedIn: 842,
    byRole: [
      { label: 'Developers', count: 400, color: '#84cc16' },
      { label: 'SME', count: 200, color: '#3b82f6' },
      { label: 'Corporate', count: 150, color: '#a855f7' },
      { label: 'Students', count: 92, color: '#f59e0b' },
    ]
  };

  // Logic to handle picture upload from device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setIsScanning(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 min-h-screen">
      
      {/* 1. Header & Offline Mode Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl hover:border-[#84cc16] transition-all">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">Check-in Terminal</h1>
            <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em]">
              Event Instance <span className="text-[#84cc16]">#{id}</span>
            </p>
          </div>
        </div>

        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
            isOnline 
              ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
          }`}
        >
          {isOnline ? <Wifi size={14} strokeWidth={3} /> : <WifiOff size={14} strokeWidth={3} />}
          {isOnline ? 'Online' : 'Offline Mode'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* 2. Updated Scanner View: Support for Theme & Uploads */}
          <div className="relative aspect-video bg-[var(--bg-primary)] rounded-[32px] overflow-hidden border-4 border-[var(--bg-secondary)] shadow-2xl transition-colors">
            {isScanning ? (
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center">
                  {/* Show uploaded image if present, otherwise simulated feed */}
                  {uploadedImage ? (
                    <img src={uploadedImage} alt="Uploaded QR" className="w-full h-full object-contain opacity-60" />
                  ) : (
                    <div className="w-full h-full bg-neutral-900" />
                  )}
                  
                  {/* Scanner Visual Overlay */}
                  <div className="w-64 h-64 border-2 border-[#84cc16] rounded-[40px] relative z-10">
                    <motion.div 
                      animate={{ top: ['10%', '90%', '10%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-4 right-4 h-1 bg-[#84cc16] shadow-[0_0_15px_#84cc16] rounded-full"
                    />
                  </div>
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                  <button 
                    onClick={() => { setIsScanning(false); setUploadedImage(null); }} 
                    className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/20 transition-all"
                  >
                    <X size={14} className="inline mr-2 mb-0.5" /> Stop / Reset
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-[var(--bg-secondary)]/30 backdrop-blur-md">
                <div className="w-20 h-20 bg-[var(--bg-primary)] rounded-3xl flex items-center justify-center mb-6 border border-[var(--border-color)]">
                  <Camera className="text-[#84cc16]" size={32} />
                </div>
                <h2 className="text-xl font-black uppercase mb-2">Check-in Ready</h2>
                <p className="text-[10px] text-[var(--text-secondary)] font-bold uppercase tracking-widest max-w-xs mb-8">
                  Position ticket QR in view or upload a photo from the attendee's device.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                  <button 
                    onClick={() => setIsScanning(true)}
                    className="flex-1 px-6 py-4 bg-[#84cc16] text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl shadow-lime-500/20"
                  >
                    Live Scanner
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 px-6 py-4 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-2xl font-black uppercase text-xs tracking-widest hover:border-[#84cc16] transition-all flex items-center justify-center gap-2"
                  >
                    <Upload size={18} /> Upload
                  </button>
                </div>
                {/* Hidden File Input */}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              </div>
            )}
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-8 rounded-[28px]">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <SearchIcon size={16} className="text-[#84cc16]" /> Manual Check-in
            </h3>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                <input 
                  type="text" 
                  placeholder="SEARCH NAME, EMAIL, OR TICKET ID..." 
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-4 pl-12 pr-4 text-xs font-bold outline-none focus:border-[#84cc16] transition-all"
                />
              </div>
              <button className="px-8 py-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[#84cc16] transition-all">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Stats & History Sections Remain Consistent */}
        <div className="space-y-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 rounded-[28px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xs font-black uppercase tracking-[0.2em]">Entry Analytics</h3>
              <Users size={16} className="text-[var(--text-secondary)]" />
            </div>
            <div className="space-y-5">
              {stats.byRole.map((role) => (
                <div key={role.label} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase text-[var(--text-secondary)]">{role.label}</span>
                    <span className="text-xs font-black">{role.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg-primary)] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(role.count / stats.total) * 100}%` }}
                      style={{ backgroundColor: role.color }}
                      className="h-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4 mt-2 border-t border-[var(--border-color)] flex justify-between items-center">
                <p className="text-[10px] font-black uppercase text-[var(--text-secondary)]">Checked In</p>
                <p className="text-lg font-black tracking-tight">{stats.checkedIn} <span className="text-[var(--text-secondary)] text-sm">/ {stats.total}</span></p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 rounded-[28px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <History size={16} className="text-[var(--text-secondary)]" /> Recent Entry
              </h3>
              <button className="p-2 hover:bg-[var(--bg-primary)] rounded-lg text-[var(--text-secondary)] transition-colors">
                <RefreshCw size={14} />
              </button>
            </div>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {recentCheckins.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl flex items-center justify-between group hover:border-[#84cc16] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                        <CheckCircle2 size={16} strokeWidth={3} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-tight">{item.name}</p>
                        <p className="text-[8px] font-black text-[#84cc16] uppercase">{item.role}</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold text-[var(--text-secondary)] uppercase">{item.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <button className="w-full mt-6 py-3 border border-[var(--border-color)] rounded-xl text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[#84cc16] hover:border-[#84cc16] transition-all">
              View All Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}