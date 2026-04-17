'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Briefcase, Calendar, MapPin, ImageIcon, ShieldCheck, 
  CheckCircle, ChevronRight, ChevronLeft, Upload, Clock, Globe, Users, 
  Scissors
} from 'lucide-react';

export default function CreateEventPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    visibility: 'public',
  });

  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Navigation Logic
  const handleNext = () => setStep(s => Math.min(5, s + 1));
  const handleBack = () => setStep(s => Math.max(1, s - 1));

  const StepHeader = ({ icon: Icon, title, desc }: any) => (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2 bg-[var(--accent)]/10 rounded-lg text-[var(--accent)]">
          <Icon size={18} />
        </div>
        <h2 className="text-base font-bold text-[var(--text-primary)] tracking-tight">{title}</h2>
      </div>
      <p className="text-[11px] text-[var(--text-secondary)] ml-10 font-medium">{desc}</p>
      <div className="h-px bg-gradient-to-r from-[var(--border-color)] to-transparent mt-3 ml-10" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* 5-Step Progress Indicator with Glow */}
      <div className="flex justify-between items-center mb-10 px-6 relative">
        <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-[var(--border-color)] -translate-y-1/2" />
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="relative z-10">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black transition-all duration-500 border-2 text-xs
              ${step > s 
                ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-[0_0_15px_rgba(132,204,22,0.6)]' 
                : step === s 
                ? 'bg-[var(--bg-secondary)] border-[var(--accent)] text-[var(--accent)]' 
                : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-secondary)]'}`}>
              {step > s ? <CheckCircle size={18} strokeWidth={3} className="drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]" /> : s}
            </div>
            {/* Step Label (Optional) */}
            <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-tighter whitespace-nowrap transition-colors
              ${step >= s ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>
              Step 0{s}
            </span>
          </div>
        ))}
      </div>

      <Card className="border-[var(--border-color)] bg-[var(--bg-secondary)]/40 backdrop-blur-md rounded-[20px] shadow-lg overflow-hidden">
        <CardContent className="p-6">
          
          {/* STEP 1: IDENTIFICATION */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5">
              <StepHeader icon={Briefcase} title="Identification" desc="Set your event's core identity." />
              <div className="ml-10 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)]">Event Name</label>
                  <input 
                    className="w-full p-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:border-[var(--accent)] focus:outline-none font-bold text-sm" 
                    placeholder="e.g. Malawi Fintech"
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5">
              <StepHeader icon={Calendar} title="Schedule" desc="When is the event starting?" />
              <div className="ml-10 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
                  <input type="date" className="w-full pl-9 p-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-bold text-xs" />
                </div>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={14} />
                  <input type="time" className="w-full pl-9 p-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-bold text-xs" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: VENUE */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5">
              <StepHeader icon={MapPin} title="Venue" desc="Location details or link." />
              <div className="ml-10 space-y-3">
                <input className="w-full p-2.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-bold text-xs" placeholder="Search Lilongwe..." />
                <div className="aspect-video bg-[var(--bg-primary)] border border-[var(--border-color)] border-dashed rounded-xl flex items-center justify-center">
                  <MapPin size={24} className="text-[var(--text-secondary)] opacity-20" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: MEDIA */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5">
              <StepHeader icon={ImageIcon} title="Media" desc="Upload banner (16:9 crop)." />
              <div className="ml-10 space-y-3">
                <div 
                  onClick={() => bannerInputRef.current?.click()}
                  className="aspect-video border-2 border-dashed border-[var(--border-color)] rounded-xl flex flex-col items-center justify-center hover:border-[var(--accent)] transition-all cursor-pointer bg-[var(--bg-primary)]"
                >
                  <input type="file" ref={bannerInputRef} hidden accept="image/*" />
                  <Upload className="text-[var(--text-secondary)] mb-1.5" size={20} />
                  <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Select Banner</p>
                </div>
                <div className="flex items-center gap-2 text-[var(--accent)] text-[9px] font-bold uppercase">
                  <Scissors size={12} /> <span>Locked to 16:9 Aspect Ratio</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: VISIBILITY */}
          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5">
              <StepHeader icon={ShieldCheck} title="Visibility" desc="Control access levels." />
              <div className="ml-10 grid grid-cols-2 gap-3">
                <div 
                  onClick={() => setFormData({...formData, visibility: 'public'})}
                  className={`p-3 border rounded-xl cursor-pointer transition-all ${formData.visibility === 'public' ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--border-color)]'}`}
                >
                  <Globe className="mb-1 text-[var(--accent)]" size={16} />
                  <h4 className="font-black text-[9px] uppercase tracking-widest">Public</h4>
                </div>
                <div 
                  onClick={() => setFormData({...formData, visibility: 'private'})}
                  className={`p-3 border rounded-xl cursor-pointer transition-all ${formData.visibility === 'private' ? 'border-[var(--accent)] bg-[var(--accent)]/5' : 'border-[var(--border-color)]'}`}
                >
                  <Users className="mb-1 text-[var(--accent)]" size={16} />
                  <h4 className="font-black text-[9px] uppercase tracking-widest">Private</h4>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-8 pt-4 border-t border-[var(--border-color)] flex justify-between items-center">
            {/* Back Button */}
            <button 
              onClick={handleBack}
              className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors ${step === 1 ? 'invisible' : ''}`}
            >
              <ChevronLeft size={14} />
              Back
            </button>

            <button 
              onClick={handleNext} 
              className="bg-[var(--accent)] text-white px-8 py-2.5 rounded-lg font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-md shadow-lime-500/10 hover:brightness-110 active:scale-95 transition-all"
            >
              {step === 5 ? 'Publish' : 'Continue'}
              {step < 5 && <ChevronRight size={14} />}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}