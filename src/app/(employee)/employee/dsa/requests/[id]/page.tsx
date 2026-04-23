"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, Calendar, ArrowLeft, CheckCircle2, Clock, 
  MessageSquare, XCircle, FileText, Send, DollarSign
} from 'lucide-react';

interface DSARequest {
  id: string;
  purpose: string;
  destination: string;
  startDate: string;
  endDate: string;
  amount: number;
  dailyRate?: number;
  days?: number;
  status: string;
  createdAt: string;
  notes?: string;
}

const DAILY_RATE = 45000;
const formatMWK = (amt: number) => `MWK ${amt.toLocaleString()}`;

export default function RequestDetail() {
  const params = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<DSARequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const savedRequests = localStorage.getItem('dsa_requests');
    if (savedRequests) {
      const requests = JSON.parse(savedRequests);
      const found = requests.find((r: DSARequest) => r.id === params.id);
      setRequest(found || null);
    }
    setLoading(false);
  }, [params.id]);

  const handleCancel = () => {
    if (!request) return;
    setIsCancelling(true);
    
    const savedRequests = localStorage.getItem('dsa_requests');
    if (savedRequests) {
      const requests = JSON.parse(savedRequests);
      const updatedRequests = requests.map((r: DSARequest) => 
        r.id === request.id ? { ...r, status: 'Cancelled' } : r
      );
      localStorage.setItem('dsa_requests', JSON.stringify(updatedRequests));
    }
    
    setTimeout(() => {
      setIsCancelling(false);
      router.push('/employee');
    }, 1000);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!request) return <div className="text-center py-12">Request not found</div>;

  // Calculate days if not stored
  const days = request.days || Math.ceil((new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const dailyRate = request.dailyRate || DAILY_RATE;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/employee/dsa/requests" className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={20} /></Link>
          <div><div className="flex items-center gap-3"><h1 className="text-2xl font-bold text-slate-900">Request #{request.id.slice(-6)}</h1><span className={`text-xs px-2 py-1 rounded-full ${request.status === 'Pending' ? 'bg-amber-50 text-amber-600' : request.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{request.status}</span></div><p className="text-slate-500 text-sm">Submitted on {new Date(request.createdAt).toLocaleDateString()}</p></div>
        </div>
        {request.status === 'Pending' && (<button onClick={handleCancel} disabled={isCancelling} className="border-2 border-red-200 text-red-500 px-4 py-2 rounded-xl font-bold hover:bg-red-50 transition-colors disabled:opacity-50"><XCircle size={18} className="inline mr-2" />{isCancelling ? 'Cancelling...' : 'Cancel Request'}</button>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Request Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Purpose</label><p className="text-slate-800 font-medium mt-1">{request.purpose}</p></div>
              <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Destination</label><p className="text-slate-800 font-medium mt-1 flex items-center gap-1"><MapPin size={16} className="text-lime-500" /> {request.destination}</p></div>
              <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Travel Dates</label><p className="text-slate-800 font-medium mt-1 flex items-center gap-1"><Calendar size={16} className="text-lime-500" /> {request.startDate} to {request.endDate}</p></div>
              <div><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Amount</label><p className="text-2xl font-bold text-lime-600 mt-1">{formatMWK(request.amount)}</p></div>
            </div>
            {request.notes && (<div className="bg-slate-50 rounded-xl p-4"><label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Additional Notes</label><p className="text-slate-600 text-sm mt-1">{request.notes}</p></div>)}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">DSA Calculation</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-600">Daily Rate</span><span className="font-medium">{formatMWK(dailyRate)}</span></div>
              <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-600">Number of Days</span><span className="font-medium">{days} days</span></div>
              <div className="flex justify-between py-2"><span className="font-semibold text-slate-800">Total DSA</span><span className="text-xl font-bold text-lime-600">{formatMWK(request.amount)}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 pb-4 flex items-center gap-2"><MessageSquare size={20} className="text-slate-400" />Comments</h3>
            <div className="relative"><textarea className="w-full pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-lime-500 min-h-[80px] px-4" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)}></textarea><button className="absolute bottom-3 right-3 p-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors"><Send size={18} /></button></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={20} className="text-slate-400" />Approval Timeline</h3>
            <div className="space-y-6">
              <div className="flex gap-3"><div className="w-8 h-8 rounded-full bg-lime-500 text-white flex items-center justify-center"><CheckCircle2 size={14} /></div><div><p className="font-medium text-slate-800">Request Submitted</p><p className="text-xs text-slate-400">{new Date(request.createdAt).toLocaleDateString()}</p></div></div>
              <div className="flex gap-3"><div className={`w-8 h-8 rounded-full flex items-center justify-center ${request.status === 'Pending' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-400'}`}>{request.status === 'Pending' ? <Clock size={14} /> : <CheckCircle2 size={14} />}</div><div><p className={`font-medium ${request.status === 'Pending' ? 'text-slate-800' : 'text-slate-400'}`}>Budget Holder Review</p><p className="text-xs text-slate-400">{request.status === 'Pending' ? 'Awaiting approval' : 'Completed'}</p></div></div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6"><h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-lime-400"><FileText size={16} />Attached Documents</h3><div className="space-y-2"><div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800 cursor-pointer"><div className="w-6 h-6 bg-red-500/20 text-red-400 rounded flex items-center justify-center"><FileText size={12} /></div><span className="text-xs">Travel_Itinerary.pdf</span></div></div></div>
        </div>
      </div>
    </div>
  );
}
