"use client";

import React, { useState } from 'react';
import { 
  Webhook as WebhookIcon, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Play, 
  History, 
  Settings2,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

// Mock data to match the layout
const MOCK_WEBHOOKS = [
  {
    id: '1',
    url: 'https://api.merchant.mw/webhooks/payments',
    status: 'Active',
    events: ['payment.succeeded', 'refund.processed'],
    lastDelivery: {
      date: '2026-03-31T20:15:00',
      status: 200
    }
  }
];

export default function Webhooks() {
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['payment.succeeded']);

  const events = [
    'payment.succeeded',
    'payment.failed',
    'refund.created',
    'refund.processed',
    'payout.created',
    'customer.created'
  ];

  const toggleEvent = (event: string) => {
    setSelectedEvents(prev => 
      prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event]
    );
  };

  return (
    <div className="space-y-8 animate-slide-up p-6 bg-[#fcfcfc] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Webhooks</h1>
          <p className="text-gray-500 font-medium">Real-time MWK transaction notifications for your server.</p>
        </div>
        <button className="flex items-center gap-3 px-6 py-3 bg-[#84cc16] text-white rounded-2xl text-sm font-black shadow-lg shadow-lime-100 hover:scale-[1.02] transition-transform">
          <Plus size={20} /> ADD ENDPOINT
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Endpoints List */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest mb-8">Active Endpoints</h3>
            <div className="space-y-6">
              {MOCK_WEBHOOKS.map((webhook) => (
                <div key={webhook.id} className="p-6 border border-gray-50 rounded-[2rem] bg-gray-50/30 hover:border-[#84cc16] transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#84cc16]">
                        <WebhookIcon size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="text-sm font-black text-gray-800">{webhook.url}</h4>
                          <span className="bg-lime-100 text-[#84cc16] text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider">Active</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {webhook.events.map(e => (
                            <span key={e} className="text-[10px] bg-white border border-gray-100 text-gray-500 font-bold px-2 py-1 rounded-lg">
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-3 text-gray-400 hover:text-[#84cc16] bg-white rounded-xl shadow-sm transition-all">
                        <Play size={16} />
                      </button>
                      <button className="p-3 text-gray-400 hover:text-gray-900 bg-white rounded-xl shadow-sm transition-all">
                        <Settings2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {webhook.lastDelivery && (
                    <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                        <History size={14} />
                        Last attempt: {new Date(webhook.lastDelivery.date).toLocaleTimeString()}
                      </div>
                      <div className="flex items-center gap-1.5 text-[#84cc16] text-[11px] font-black uppercase tracking-wider">
                        <ShieldCheck size={14} />
                        {webhook.lastDelivery.status} OK
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Logs */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-10">
            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest mb-8">Recent Deliveries</h3>
            <div className="space-y-2">
              {[
                { event: 'payment.succeeded', status: 200, time: '2 mins ago', id: 'evt_mwk_123' },
                { event: 'payment.succeeded', status: 200, time: '15 mins ago', id: 'evt_mwk_124' },
                { event: 'payment.failed', status: 500, time: '1 hour ago', id: 'evt_mwk_125' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    {log.status === 200 ? (
                      <div className="w-8 h-8 rounded-full bg-lime-50 flex items-center justify-center text-[#84cc16]">
                        <CheckCircle2 size={18} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                        <XCircle size={18} />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-black text-gray-800">{log.event}</p>
                      <p className="text-[10px] text-gray-400 font-mono tracking-tighter">{log.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[11px] font-bold text-gray-400">{log.time}</span>
                    <ChevronRight size={16} className="text-gray-200 group-hover:text-[#84cc16] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Event Subscriptions Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 uppercase text-[10px] tracking-[0.2em] mb-8 flex items-center gap-2">
              <Zap size={16} className="text-[#84cc16]" /> Subscriptions
            </h3>
            <div className="space-y-4">
              {events.map((event) => (
                <label key={event} className="flex items-center gap-4 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      className="sr-only"
                      checked={selectedEvents.includes(event)}
                      onChange={() => toggleEvent(event)}
                    />
                    <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                      selectedEvents.includes(event) 
                        ? "bg-[#84cc16] border-[#84cc16] shadow-md shadow-lime-100" 
                        : "border-gray-100 bg-gray-50 group-hover:border-gray-200"
                    }`}>
                      {selectedEvents.includes(event) && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                  </div>
                  <span className={`text-xs font-bold transition-colors ${
                    selectedEvents.includes(event) ? "text-gray-900" : "text-gray-400"
                  }`}>
                    {event}
                  </span>
                </label>
              ))}
            </div>
            
            <div className="mt-10 p-6 bg-gray-50 rounded-[1.5rem] border border-gray-100">
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                Select events for real-time MWK updates. We deliver payloads via POST requests to your configured endpoint.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}