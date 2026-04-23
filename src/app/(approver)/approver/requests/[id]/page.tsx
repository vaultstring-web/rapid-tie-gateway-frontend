'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Calendar, MapPin, User, 
  FileText, Calculator, CheckCircle, XCircle, 
  MessageSquare, Info, AlertCircle, Clock, Briefcase, Building, Phone
} from 'lucide-react';
import { MOCK_REQUESTS } from '@/mock/mockData';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';

// Format currency to Malawian Kwacha (MWK)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-MW', {
    style: 'currency',
    currency: 'MWK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function ApprovalDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'Approve' | 'Reject' | null>(null);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const request = MOCK_REQUESTS.find(r => r.id === id);

  if (!request) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Request not found</h2>
        <Link href="/approver/pending" className="text-[#84cc16] hover:underline mt-4 inline-block">Return to Queue</Link>
      </div>
    );
  }

  const handleDecision = () => {
    console.log(`Decision: ${decisionType}, Reason: ${reason}, Notes: ${notes}`);
    setIsDecisionModalOpen(false);
    router.push('/approver/pending');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between">
        <Link href="/approver/pending" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Queue</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-bold border",
            request.urgency === 'High' ? "text-red-600 bg-red-50 border-red-200" : 
            request.urgency === 'Medium' ? "text-orange-600 bg-orange-50 border-orange-200" : 
            "text-blue-600 bg-blue-50 border-blue-200"
          )}>
            {request.urgency} Urgency
          </span>
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{request.id}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Request Overview Section */}
          <section className="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{request.type} Request</h2>
                <p className="text-gray-500 mt-1">Submitted on {new Date(request.date).toLocaleDateString('en-MW')}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount</p>
                <p className="text-3xl font-bold text-[#84cc16]">{formatCurrency(request.amount)}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 py-6 border-y border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Requester</p>
                  <p className="text-sm font-medium text-gray-900">{request.requester}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Region</p>
                  <p className="text-sm font-medium text-gray-900">{request.region}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Team</p>
                  <p className="text-sm font-medium text-gray-900">{request.team}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Deadline</p>
                  <p className="text-sm font-medium text-gray-900">{new Date(request.deadline).toLocaleDateString('en-MW')}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                {request.description}
              </p>
            </div>
          </section>

          {/* Event Attendance Section (conditional) */}
          {request.hasEventAttendance && request.eventDetails && (
            <section className="rounded-xl bg-white shadow-sm border border-gray-100 p-6 border-l-4 border-l-[#84cc16]">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-[#84cc16]" />
                <h3 className="text-lg font-bold text-gray-900">Event Attendance</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Event Name</label>
                    <p className="text-sm font-medium text-gray-900">{request.eventDetails.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Location</label>
                    <p className="text-sm font-medium text-gray-900">{request.eventDetails.location}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Dates</label>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(request.eventDetails.startDate).toLocaleDateString('en-MW')} - {new Date(request.eventDetails.endDate).toLocaleDateString('en-MW')}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Expected Attendees</label>
                    <p className="text-sm font-medium text-gray-900">{request.eventDetails.attendees.toLocaleString()} people</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* DSA Calculation Table (conditional) */}
          {request.dsaCalculation && (
            <section className="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-[#3b5a65]" />
                <h3 className="text-lg font-bold text-gray-900">DSA Calculation Breakdown</h3>
              </div>
              <div className="overflow-hidden rounded-lg border border-gray-100">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 font-bold text-gray-700">Component</th>
                      <th className="px-4 py-3 font-bold text-gray-700 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="px-4 py-3 text-gray-600">Base Daily Rate</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(request.dsaCalculation.baseRate)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-600">Number of Days</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">{request.dsaCalculation.days}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-gray-600">Regional Multiplier</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">x{request.dsaCalculation.multiplier}</td>
                    </tr>
                    <tr className="bg-[#f0f5f6]">
                      <td className="px-4 py-3 font-bold text-[#3b5a65]">Total DSA Amount</td>
                      <td className="px-4 py-3 text-right font-bold text-[#3b5a65]">{formatCurrency(request.dsaCalculation.total)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Actions - Right Column */}
        <div className="space-y-6">
          {/* Decision Card */}
          <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Review Decision</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Decision Notes</label>
                <textarea 
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#84cc16] focus:border-transparent min-h-[120px]" 
                  placeholder="Add internal notes about this decision..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  onClick={() => { setDecisionType('Approve'); setIsDecisionModalOpen(true); }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#84cc16] text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-[#75b314] transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve Request
                </button>
                <button 
                  onClick={() => { setDecisionType('Reject'); setIsDecisionModalOpen(true); }}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Request
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Policy Check</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                This request complies with the standard travel policy for {request.region}. No exceptions flagged.
              </p>
            </div>
          </div>

          {/* Requester Info Card */}
          <div className="rounded-xl bg-gray-900 text-white border-none p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-[#84cc16]" />
              <h3 className="text-sm font-bold">Requester History</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Total Requests (YTD)</span>
                <span className="font-bold">14</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Approval Rate</span>
                <span className="font-bold text-[#84cc16]">92%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Avg. Request Size</span>
                <span className="font-bold">{formatCurrency(1450000)}</span>
              </div>
            </div>
          </div>

          {/* Your Info Card */}
          <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-[#84cc16]" />
              <h3 className="text-sm font-bold text-gray-900">Reviewer</h3>
            </div>
            <div className="flex items-center gap-3">
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-lime-100 text-lime-600 flex items-center justify-center text-sm font-bold">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.position}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Modal */}
      <AnimatePresence>
        {isDecisionModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDecisionModalOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  decisionType === 'Approve' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                )}>
                  {decisionType === 'Approve' ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Confirm {decisionType}</h3>
                  <p className="text-sm text-gray-500">Request {request.id}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Reason for {decisionType === 'Approve' ? 'Approval' : 'Rejection'} <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#84cc16] focus:border-transparent min-h-[100px]" 
                    placeholder={`Provide a brief explanation for ${decisionType === 'Approve' ? 'approval' : 'rejection'}...`}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setIsDecisionModalOpen(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDecision}
                    className={cn(
                      "flex-1 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                      decisionType === 'Approve' ? "bg-[#84cc16] hover:bg-[#75b314]" : "bg-red-600 hover:bg-red-700"
                    )}
                    disabled={!reason.trim()}
                  >
                    Confirm {decisionType}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}