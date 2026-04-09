"use client";

import React from 'react';
import { 
  Users, 
  Plus, 
  Mail, 
  Shield, 
  MoreHorizontal, 
  Lock,
  CheckCircle2,
  UserPlus,
  ChevronDown,
  Send,
  Calendar
} from 'lucide-react';

// Mock data for the invitation dropdowns
const MOCK_EVENTS = [
  { id: '1', name: 'Lilongwe Music Fest' },
  { id: '2', name: 'Blantyre Tech Expo' },
  { id: '3', name: 'Zomba Arts Festival' }
];

const MOCK_TEAM = [
  {
    id: '1',
    name: 'Leticia Banda',
    email: 'leticia@merchant.mw',
    role: 'Administrator',
    status: 'Active',
    avatar: 'LB'
  },
  {
    id: '2',
    name: 'Chifundo Phiri',
    email: 'c.phiri@merchant.mw',
    role: 'Manager',
    status: 'Active',
    avatar: 'CP'
  }
];

export default function TeamMembers() {
  return (
    <div className="space-y-8 animate-slide-up p-6 bg-[#fcfcfc] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Staff Management</h1>
          <p className="text-gray-500 font-medium">Control dashboard access and reporting permissions for your team.</p>
        </div>
        <button className="flex items-center gap-3 px-6 py-3 bg-[#84cc16] text-white rounded-2xl text-sm font-black shadow-lg shadow-lime-100 hover:scale-[1.02] transition-transform">
          <UserPlus size={20} /> INVITE STAFF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Team Table */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-10">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] border-b border-gray-50">
                    <th className="pb-6">Member</th>
                    <th className="pb-6">Role</th>
                    <th className="pb-6">Status</th>
                    <th className="pb-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {MOCK_TEAM.map((member) => (
                    <tr key={member.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-lime-100 text-[#84cc16] flex items-center justify-center font-black text-lg shadow-inner">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-800">{member.name}</p>
                            <p className="text-xs font-bold text-gray-400">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-8">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl w-fit ${
                          member.role === 'Administrator' ? 'bg-lime-50 text-[#84cc16]' : 'bg-blue-50 text-blue-600'
                        }`}>
                          <Shield size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{member.role}</span>
                        </div>
                      </td>
                      <td className="py-8">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-[#84cc16]' : 'bg-gray-300'}`} />
                          <span className="text-xs font-bold text-gray-500">{member.status}</span>
                        </div>
                      </td>
                      <td className="py-8 text-right">
                        <button className="p-3 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-xl transition-all">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invitation Form - Converted to match sample dashboard style */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest mb-8">Invite New Member</h3>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#84cc16] transition-all placeholder:text-gray-300 outline-none" 
                    placeholder="colleague@merchant.mw" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Role</label>
                <div className="relative">
                  <select className="w-full appearance-none pl-4 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#84cc16] outline-none cursor-pointer">
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Event Access</label>
                <div className="relative">
                  <select className="w-full appearance-none pl-4 pr-10 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#84cc16] outline-none cursor-pointer">
                    <option value="all">All Events</option>
                    {MOCK_EVENTS.map(e => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="md:col-span-2 pt-2">
                <button 
                  type="button" 
                  className="w-full py-4 bg-[#3b5a65] text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#2c444d] transition-all shadow-lg shadow-gray-200 active:scale-[0.98]"
                >
                  <Send size={16} />
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          {/* Permissions Overview */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 uppercase text-[10px] tracking-[0.2em] mb-8 flex items-center gap-2">
              <Lock size={16} className="text-[#84cc16]" /> Role Hierarchy
            </h3>
            <div className="space-y-6">
              {[
                { role: 'Administrator', desc: 'Unrestricted access to MWK logs, API keys, and team settings.', color: 'text-[#84cc16]' },
                { role: 'Manager', desc: 'Can view analytics, manage links, and generate reports.', color: 'text-blue-500' },
                { role: 'Viewer', desc: 'Read-only access to sales performance data.', color: 'text-gray-400' },
              ].map((r) => (
                <div key={r.role} className="space-y-2 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${r.color}`}>{r.role}</span>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Invitations */}
          <div className="bg-[#3b5a65] p-10 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Mail size={16} className="text-[#84cc16]" /> Pending Invites
              </h3>
              <div className="space-y-3">
                <div className="bg-white/10 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-white/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#84cc16] flex items-center justify-center">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black tracking-tight">mike@merchant.mw</p>
                      <p className="text-[9px] text-gray-300 font-bold uppercase tracking-tighter">Sent 2 days ago</p>
                    </div>
                  </div>
                  <button className="text-[9px] font-black text-[#84cc16] uppercase hover:underline">Revoke</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}