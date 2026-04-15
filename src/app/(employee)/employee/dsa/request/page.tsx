"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Calendar, ArrowLeft, CheckCircle2, AlertCircle, DollarSign, Info } from 'lucide-react';

const destinations = ["Lilongwe", "Blantyre", "Mzuzu", "Zomba", "Mangochi", "Salima"];
const purposes = ["Official Meeting", "Training", "Field Work", "Conference", "Monitoring"];
const DAILY_RATE = 45000; // Consistent daily rate

export default function NewDSARequest() {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 0;
  };

  const days = calculateDays();
  const totalAmount = days * DAILY_RATE;
  const formatMWK = (amt: number) => `MWK ${amt.toLocaleString()}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create new request object with consistent calculation
    const newRequest = {
      id: Date.now().toString(),
      purpose: purpose,
      destination: destination,
      startDate: startDate,
      endDate: endDate,
      amount: totalAmount,
      dailyRate: DAILY_RATE,
      days: days,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      notes: notes
    };

    // Get existing requests from localStorage
    const existingRequests = localStorage.getItem('dsa_requests');
    let requests = existingRequests ? JSON.parse(existingRequests) : [];
    
    // Add new request
    requests.unshift(newRequest);
    
    // Save back to localStorage
    localStorage.setItem('dsa_requests', JSON.stringify(requests));

    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/employee');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/employee" className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={20} /></Link>
        <div><h1 className="text-2xl font-bold text-slate-900">New DSA Request</h1><p className="text-slate-500 text-sm">Submit a new travel allowance request</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Destination <span className="text-red-500">*</span></label>
              <select className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500" value={destination} onChange={(e) => setDestination(e.target.value)} required>
                <option value="">Select destination</option>{destinations.map(d => (<option key={d} value={d}>{d}</option>))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Start Date <span className="text-red-500">*</span></label><input type="date" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500" value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></div>
              <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">End Date <span className="text-red-500">*</span></label><input type="date" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500" value={endDate} onChange={(e) => setEndDate(e.target.value)} required /></div>
            </div>
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Purpose <span className="text-red-500">*</span></label>
              <select className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500" value={purpose} onChange={(e) => setPurpose(e.target.value)} required>
                <option value="">Select purpose</option>{purposes.map(p => (<option key={p} value={p}>{p}</option>))}
              </select>
            </div>
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Additional Notes</label>
              <textarea className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 min-h-[100px]" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional information..."></textarea>
            </div>
            <div className="flex gap-4 pt-4">
              <button type="submit" className="bg-lime-500 hover:bg-lime-600 text-white flex-1 py-3 rounded-xl font-bold transition-colors disabled:opacity-50" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
              <button type="button" className="border-2 border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors" onClick={() => router.push('/employee')}>Cancel</button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sticky top-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><DollarSign className="text-lime-400" /> Calculation Preview</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-slate-400">Daily Rate</span><span>{formatMWK(DAILY_RATE)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Duration</span><span>{days} days</span></div>
              <div className="h-px bg-slate-700 my-2"></div>
              <div className="flex justify-between"><span className="text-slate-400">Total</span><span className="text-xl font-bold text-lime-400">{formatMWK(totalAmount)}</span></div>
            </div>
          </div>
          <div className="bg-lime-50 rounded-2xl p-4"><h4 className="font-bold text-lime-800 mb-2">Policy Reminder</h4><ul className="text-xs text-lime-700 space-y-1 list-disc pl-4"><li>Daily rate is MWK 45,000</li><li>Submit at least 7 days before travel</li><li>Keep all receipts</li></ul></div>
        </div>
      </div>
    </div>
  );
}
