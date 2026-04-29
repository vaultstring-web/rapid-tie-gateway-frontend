"use client";

import { useState, useRef, ChangeEvent } from 'react';
import { 
  Palette, Upload, Smartphone, Monitor, CreditCard, 
  ShieldCheck, Eye, Lock, CheckCircle2, 
  Landmark, AlertCircle, Image
} from 'lucide-react';

export default function CheckoutSettings() {
  // --- BRANDING STATE ---
  const [brandColor, setBrandColor] = useState('#84cc16');
  const [businessName, setBusinessName] = useState('VaultString');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // --- PAYMENT METHODS STATE ---
  const paymentMethods = [
    { id: 'airtel', label: 'Airtel Money', enabled: true, icon: Smartphone },
    { id: 'tnm', label: 'TNM Mpamba', enabled: true, icon: Smartphone },
    { id: 'cards', label: 'Visa / Mastercard', enabled: true, icon: CreditCard },
    { id: 'bank', label: 'Bank Transfer', enabled: false, icon: Landmark },
  ];

  const [methods, setMethods] = useState(paymentMethods);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Max file size: 5MB (increased from 2MB)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError(null);
    
    if (file) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`File too large. Max size is 5MB. Your file: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        return;
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/svg+xml', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Invalid file type. Please upload PNG, JPG, JPEG, SVG, or WEBP');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleMethod = (id: string) => {
    setMethods(prev => prev.map(m => 
      m.id === id ? { ...m, enabled: !m.enabled } : m
    ));
  };

  // Mock amount for preview
  const previewAmount = 25000;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8 bg-[#fcfcfc] min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Checkout Customization</h1>
          <p className="text-gray-500 text-sm mt-1">Configure your checkout page appearance and payment methods.</p>
        </div>
        <button className="px-8 py-4 bg-[#84cc16] text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-[#65a30d] transition-all shadow-xl active:scale-95">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: SETTINGS */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* BRANDING SECTION */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <Palette size={18} className="text-[#84cc16]" /> Brand Identity
            </h3>
            
            <div className="space-y-6">
              {/* Brand Color */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">
                  Brand Accent Color
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <input 
                    type="color" 
                    value={brandColor} 
                    onChange={(e) => setBrandColor(e.target.value)} 
                    className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent shadow-sm" 
                  />
                  <div className="flex-1">
                    <input 
                      type="text" 
                      value={brandColor} 
                      onChange={(e) => setBrandColor(e.target.value)} 
                      className="w-full bg-transparent border-none text-xs font-mono font-bold uppercase text-gray-600 focus:ring-0" 
                    />
                  </div>
                </div>
              </div>

              {/* Business Name */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2">
                  Business Name
                </label>
                <input 
                  type="text" 
                  value={businessName} 
                  onChange={(e) => setBusinessName(e.target.value)} 
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#84cc16] transition-all" 
                  placeholder="Your Business Name"
                />
              </div>

              {/* Logo Upload - BIGGER SECTION */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block ml-2 flex items-center gap-2">
                  <Image size={12} /> Brand Logo
                </label>
                
                <div className="border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/30 hover:bg-gray-50 transition-all">
                  <div 
                    onClick={() => fileInputRef.current?.click()} 
                    className="cursor-pointer p-8 flex flex-col items-center justify-center"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleLogoUpload} 
                      className="hidden" 
                      accept="image/jpeg,image/png,image/jpg,image/svg+xml,image/webp" 
                    />
                    
                    {logoPreview ? (
                      <div className="relative w-full">
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative">
                            <img 
                              src={logoPreview} 
                              alt="Logo preview" 
                              className="max-h-32 w-auto object-contain rounded-xl shadow-md" 
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeLogo();
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition shadow-md"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">Click to change logo</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 py-8">
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#84cc16]/10 transition-all">
                          <Upload size={32} className="text-gray-400 group-hover:text-[#84cc16]" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-700">Click to upload your logo</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG, WEBP up to 5MB</p>
                          <p className="text-xs text-gray-400">Recommended size: 200x200px or larger</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Message */}
                {uploadError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                    <AlertCircle size={14} className="text-red-500 shrink-0" />
                    <p className="text-xs text-red-600">{uploadError}</p>
                  </div>
                )}

                {/* Logo Tips */}
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-[10px] text-blue-600 font-medium">💡 Logo Tips:</p>
                  <ul className="text-[9px] text-blue-500 mt-1 space-y-0.5 list-disc list-inside">
                    <li>Transparent background PNG works best</li>
                    <li>Square images (1:1 ratio) look great</li>
                    <li>Maximum file size: 5MB</li>
                    <li>SVG files are recommended for crisp scaling</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* PAYMENT METHODS SECTION */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <Lock size={18} className="text-[#84cc16]" /> Payment Methods
            </h3>
            <div className="space-y-3">
              {methods.map((method) => {
                const Icon = method.icon;
                return (
                  <div key={method.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-50 hover:border-[#84cc16]/20 transition-all">
                    <div className="flex items-center gap-3">
                      <Icon size={20} className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-800">{method.label}</span>
                    </div>
                    <div 
                      onClick={() => toggleMethod(method.id)} 
                      className={`w-11 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${method.enabled ? 'bg-[#84cc16]' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${method.enabled ? 'left-6' : 'left-1'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-4">
              Toggle payment methods on/off for your checkout page
            </p>
          </section>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className="lg:col-span-7 sticky top-8">
          <div className="flex items-center justify-between mb-6 px-4">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Eye size={14} className="text-[#84cc16]" /> Live Preview
            </h3>
            <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
              <button onClick={() => setPreviewMode('mobile')} className={`p-2.5 rounded-xl transition-all ${previewMode === 'mobile' ? 'bg-white shadow-md text-gray-900' : 'text-gray-400'}`}>
                <Smartphone size={18} />
              </button>
              <button onClick={() => setPreviewMode('desktop')} className={`p-2.5 rounded-xl transition-all ${previewMode === 'desktop' ? 'bg-white shadow-md text-gray-900' : 'text-gray-400'}`}>
                <Monitor size={18} />
              </button>
            </div>
          </div>

          <div className={`mx-auto transition-all duration-500 ${previewMode === 'mobile' ? 'max-w-[340px]' : 'max-w-full'}`}>
            
            {/* MOBILE PREVIEW */}
            {previewMode === 'mobile' ? (
              <div className="bg-gray-900 p-4 rounded-[3.5rem] shadow-2xl border-[10px] border-gray-800 aspect-[9/16] relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20" />
                <div className="bg-white h-full w-full rounded-[2.8rem] overflow-hidden flex flex-col">
                  <div className="px-6 py-8 flex-1 overflow-y-auto">
                    <div className="flex flex-col items-center text-center mb-6">
                      {logoPreview ? (
                        <img src={logoPreview} className="h-20 w-auto object-contain mb-4" alt="Logo" />
                      ) : (
                        <ShieldCheck size={56} className="text-gray-200 mb-4" />
                      )}
                      <h2 className="text-xl font-black tracking-tight" style={{ color: brandColor }}>{businessName}</h2>
                      
                      <div className="mt-6 p-4 rounded-2xl bg-gray-50 w-full">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total to Pay</p>
                        <h3 className="text-2xl font-black text-gray-900">MWK {previewAmount.toLocaleString()}</h3>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <p className="text-[9px] font-black text-gray-400 uppercase">Payment Method</p>
                      {methods.filter(m => m.enabled).map((m, i) => {
                        const Icon = m.icon;
                        return (
                          <div key={m.id} className="p-3 rounded-xl border flex items-center gap-3" style={{ borderColor: i === 0 ? brandColor : '#e5e7eb', backgroundColor: i === 0 ? '#fefce8' : 'white' }}>
                            <Icon size={18} className={i === 0 ? `text-[${brandColor}]` : 'text-gray-500'} />
                            <span className="text-xs font-medium text-gray-700">{m.label}</span>
                            {i === 0 && <CheckCircle2 size={14} className="ml-auto" style={{ color: brandColor }} />}
                          </div>
                        );
                      })}
                    </div>

                    <button className="w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95" style={{ backgroundColor: brandColor }}>
                      Pay MWK {previewAmount.toLocaleString()}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* DESKTOP PREVIEW */
              <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                <div className="flex min-h-[400px]">
                  <div className="w-2/5 p-8 bg-gray-50 border-r border-gray-100 flex flex-col items-center text-center">
                    {logoPreview ? (
                      <img src={logoPreview} className="h-24 w-auto object-contain mb-4" alt="Logo" />
                    ) : (
                      <ShieldCheck size={56} className="text-gray-200 mb-4" />
                    )}
                    <h3 className="text-xl font-bold" style={{ color: brandColor }}>{businessName}</h3>
                    <div className="mt-6 pt-4 border-t border-gray-200 w-full">
                      <p className="text-[10px] font-black text-gray-400 uppercase">Total</p>
                      <p className="text-2xl font-bold text-gray-900">MWK {previewAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="w-3/5 p-8">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-4">Secure Checkout</p>
                    <div className="space-y-3 mb-6">
                      {methods.filter(m => m.enabled).map((m, i) => {
                        const Icon = m.icon;
                        return (
                          <div key={m.id} className="p-3 rounded-xl border flex items-center gap-3" style={{ borderColor: i === 0 ? brandColor : '#e5e7eb' }}>
                            <Icon size={18} className={i === 0 ? `text-[${brandColor}]` : 'text-gray-500'} />
                            <span className="text-sm font-medium text-gray-700">{m.label}</span>
                            {i === 0 && <CheckCircle2 size={14} className="ml-auto" style={{ color: brandColor }} />}
                          </div>
                        );
                      })}
                    </div>
                    <button className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all" style={{ backgroundColor: brandColor }}>
                      Pay MWK {previewAmount.toLocaleString()}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
