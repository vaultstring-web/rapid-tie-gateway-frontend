"use client";

import React, { useState } from 'react';
import { 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Eye, 
  EyeOff, 
  BarChart3,
  ShieldAlert,
  Key,
  Search
} from 'lucide-react';

// Sample data for the keys
const MOCK_API_KEYS = [
  {
    id: '1',
    name: 'Production Gateway',
    key: 'mk_live_8291f09282334b1a9c8d7e6f5a4b3c2d',
    createdAt: 'Mar 12, 2026',
    lastUsed: '2 mins ago',
    usage: 124500,
  },
  {
    id: '2',
    name: 'Development Sandbox',
    key: 'mk_test_4412e11022334b1a9c8d7e6f5a4b3c2d',
    createdAt: 'Feb 28, 2026',
    lastUsed: '14 hours ago',
    usage: 8420,
  }
];

export default function ApiKeys() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const toggleVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8 animate-slide-up p-6 bg-[#fcfcfc] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">API Management</h1>
          <p className="text-gray-500 font-medium">Credentials for Malawian Kwacha (MWK) payment integration.</p>
        </div>
        <button className="flex items-center gap-3 px-6 py-3 bg-[#84cc16] text-white rounded-2xl text-sm font-black shadow-lg shadow-lime-100 hover:scale-[1.02] transition-transform">
          <Plus size={20} /> GENERATE NEW KEY
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Key size={18} />
            </div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Active Keys</p>
          </div>
          <h3 className="text-2xl font-black text-gray-900">02</h3>
        </div>
        
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#84cc16]/10 text-[#84cc16] rounded-lg">
              <BarChart3 size={18} />
            </div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">API Requests (MTD)</p>
          </div>
          <h3 className="text-2xl font-black text-gray-900">132,920</h3>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Search size={18} />
            </div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Avg. Latency</p>
          </div>
          <h3 className="text-2xl font-black text-gray-900">124ms</h3>
        </div>
      </div>

      {/* Keys Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] border-b border-gray-50">
                <th className="pb-6 font-semibold">Key Label</th>
                <th className="pb-6 font-semibold">Credential</th>
                <th className="pb-6 font-semibold">Created</th>
                <th className="pb-6 font-semibold">Last Used</th>
                <th className="pb-6 font-semibold">Usage (MWK)</th>
                <th className="pb-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_API_KEYS.map((key) => (
                <tr key={key.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-8">
                    <p className="text-sm font-black text-gray-800">{key.name}</p>
                  </td>
                  <td className="py-8">
                    <div className="flex items-center gap-3 font-mono text-[11px] bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl text-gray-500 w-fit">
                      {showKeys[key.id] ? key.key : '••••••••••••••••••••••••••••'}
                      <button 
                        onClick={() => toggleVisibility(key.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showKeys[key.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </td>
                  <td className="py-8 text-sm font-bold text-gray-500">{key.createdAt}</td>
                  <td className="py-8 text-sm font-bold text-gray-500">{key.lastUsed}</td>
                  <td className="py-8">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-gray-900">K{key.usage.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleCopy(key.id, key.key)}
                        className="p-3 text-gray-400 hover:text-[#84cc16] bg-gray-50 rounded-xl transition-all"
                      >
                        {copied === key.id ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                      <button className="p-3 text-gray-400 hover:text-red-600 bg-gray-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Warning Block */}
      <div className="bg-amber-50 border border-amber-100 rounded-[2.5rem] p-8 flex gap-6 items-start">
        <div className="p-4 bg-amber-100 text-amber-600 rounded-2xl shrink-0">
          <ShieldAlert size={28} />
        </div>
        <div>
          <h4 className="text-sm font-black text-amber-900 uppercase tracking-[0.1em] mb-2">Security Protocol</h4>
          <p className="text-xs text-amber-700 font-medium leading-relaxed max-w-2xl">
            API keys grant full programmatic access to your MWK transaction data and payment links. 
            Never share your secret keys or commit them to public version control. 
            If you suspect a key has been compromised, revoke it immediately and rotate your credentials.
          </p>
        </div>
      </div>
    </div>
  );
}