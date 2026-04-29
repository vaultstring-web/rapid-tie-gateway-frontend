'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Building2,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Mail,
  Phone,
  Briefcase,
  AlertCircle,
  Ticket,
  CalendarDays,
  Users,
} from 'lucide-react';
import { DsaCalculationTable } from '@/components/approver/DsaCalculationTable';
import { DecisionModal } from '@/components/approver/DecisionModal';
import { ApprovalRequest, DecisionData, URGENCY_CONFIG } from '@/types/rejected.ts/request';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data
const getMockRequest = (id: string): ApprovalRequest => {
  const now = new Date();
  return {
    id,
    requestNumber: `DSA-2024-${id.padStart(3, '0')}`,
    employeeName: 'John Doe',
    employeeId: 'EMP-001',
    employeeEmail: 'john.doe@example.com',
    employeePhone: '+265 999 123 456',
    department: 'Finance',
    position: 'Senior Accountant',
    supervisorName: 'Jane Mbalame',
    destination: 'Lilongwe',
    purpose: 'Audit meeting with external auditors',
    startDate: new Date(now.setDate(now.getDate() + 2)).toISOString(),
    endDate: new Date(now.setDate(now.getDate() + 4)).toISOString(),
    duration: 3,
    amount: 135000,
    perDiemRate: 45000,
    accommodationRate: 60000,
    otherExpenses: 15000,
    totalAmount: 210000,
    status: 'pending',
    submittedAt: new Date(now.setDate(now.getDate() - 3)).toISOString(),
    urgency: 'high',
    deadline: new Date(now.setDate(now.getDate() + 1)).toISOString(),
    travelAuthorizationRef: 'TA-2024-1234',
    hasEventAttendance: true,
    eventDetails: {
      id: 'evt-1',
      name: 'Fintech Conference 2026',
      description: 'Annual fintech conference featuring industry leaders and innovators',
      date: new Date(now.setDate(now.getDate() + 3)).toISOString(),
      location: 'BICC, Lilongwe',
      registrationFee: 50000,
      isRequired: true,
    },
    attachments: [
      { id: 'att-1', name: 'Travel Authorization.pdf', url: '#', type: 'pdf' },
      { id: 'att-2', name: 'Event Registration.pdf', url: '#', type: 'pdf' },
    ],
    comments: 'Requesting advance payment for accommodation and registration fee',
    approvalHistory: [
      {
        id: 'hist-1',
        action: 'submitted',
        by: 'John Doe',
        role: 'Employee',
        timestamp: new Date(now.setDate(now.getDate() - 3)).toISOString(),
      },
      {
        id: 'hist-2',
        action: 'approved',
        by: 'Jane Mbalame',
        role: 'Supervisor',
        timestamp: new Date(now.setDate(now.getDate() - 2)).toISOString(),
        comments: 'Approved - valid business trip',
      },
    ],
  };
};

export default function ApprovalDetailPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const [request, setRequest] = useState<ApprovalRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [decisionModal, setDecisionModal] = useState<{
    isOpen: boolean;
    action: 'approved' | 'rejected' | 'revision';
  }>({ isOpen: false, action: 'approved' });
  const [processing, setProcessing] = useState(false);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadRequest();
  }, [requestId]);

  const loadRequest = async () => {
    setLoading(true);
    try {
      const mockData = getMockRequest(requestId);
      setRequest(mockData);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load request:', error);
      toast.error('Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (data: DecisionData) => {
    setProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(
        `Request ${data.action === 'approved' ? 'approved' : data.action === 'rejected' ? 'rejected' : 'sent for revision'} successfully`
      );
      router.push('/approver/pending');
    } catch (error) {
      toast.error('Failed to process decision');
    } finally {
      setProcessing(false);
      setDecisionModal({ isOpen: false, action: 'approved' });
    }
  };

  const urgencyConfig = request ? URGENCY_CONFIG[request.urgency] : null;
  const isOverdue = request ? new Date(request.deadline) < new Date() : false;

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--bg-primary)' }}
      >
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Request Not Found</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            The request you're looking for doesn't exist.
          </p>
          <Link href="/approver/pending" className="text-[#84cc16] hover:underline">
            ← Back to Pending Approvals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/approver/pending"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">Approval Request</h1>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyConfig?.bg} ${urgencyConfig?.color}`}
              >
                {urgencyConfig?.label} Urgency
              </span>
              {isOverdue && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  OVERDUE
                </span>
              )}
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Request #{request.requestNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setDecisionModal({ isOpen: true, action: 'approved' })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
          >
            <CheckCircle size={16} />
            Approve
          </button>
          <button
            onClick={() => setDecisionModal({ isOpen: true, action: 'rejected' })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
          >
            <XCircle size={16} />
            Reject
          </button>
          <button
            onClick={() => setDecisionModal({ isOpen: true, action: 'revision' })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <RefreshCw size={16} />
            Request Revision
          </button>
        </div>
      </div>

      {/* Demo Mode Notice */}
      {useMockData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ Demo Mode - Using sample data. Connect to backend for live data.
          </p>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Employee Information */}
          <div
            className="rounded-xl p-5 border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <User size={18} className="text-[#84cc16]" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Employee Information
              </h2>
            </div>
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full bg-[#84cc16]/20 flex items-center justify-center">
                <User size={32} className="text-[#84cc16]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  {request.employeeName}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {request.position} • {request.department}
                </p>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                    <Mail size={14} />
                    <span>{request.employeeEmail}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                    <Phone size={14} />
                    <span>{request.employeePhone}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                    <Building2 size={14} />
                    <span>Employee ID: {request.employeeId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div
            className="rounded-xl p-5 border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-[#84cc16]" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Trip Details</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Destination:</span>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {request.destination}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Travel Dates:</span>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {formatDate(request.startDate)} - {formatDate(request.endDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Duration:</span>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {request.duration} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Purpose:</span>
                <span className="text-sm text-[var(--text-primary)]">{request.purpose}</span>
              </div>
              {request.travelAuthorizationRef && (
                <div className="flex justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">
                    Travel Authorization:
                  </span>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {request.travelAuthorizationRef}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Event Attendance Section */}
          {request.hasEventAttendance && request.eventDetails && (
            <div
              className="rounded-xl p-5 border border-purple-200 dark:border-purple-800"
              style={{
                backgroundColor: 'var(--bg-secondary)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Ticket size={18} className="text-purple-500" />
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Event Attendance
                </h2>
                {request.eventDetails.isRequired && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                    Required
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-purple-600 dark:text-purple-400">
                    {request.eventDetails.name}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {request.eventDetails.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <CalendarDays size={14} />
                    <span>{formatDate(request.eventDetails.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <MapPin size={14} />
                    <span>{request.eventDetails.location}</span>
                  </div>
                </div>
                {request.eventDetails.registrationFee && (
                  <div
                    className="flex justify-between pt-2 border-t"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <span className="text-sm text-[var(--text-secondary)]">Registration Fee:</span>
                    <span className="text-sm font-semibold text-[#84cc16]">
                      {formatCurrency(request.eventDetails.registrationFee)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DSA Calculation */}
          <DsaCalculationTable
            perDiemRate={request.perDiemRate}
            accommodationRate={request.accommodationRate}
            otherExpenses={request.otherExpenses}
            duration={request.duration}
            totalAmount={request.totalAmount}
          />

          {/* Attachments */}
          {request.attachments && request.attachments.length > 0 && (
            <div
              className="rounded-xl p-5 border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <FileText size={18} className="text-[#84cc16]" />
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Attachments</h2>
              </div>
              <div className="space-y-2">
                {request.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-[#84cc16]" />
                      <span className="text-sm text-[var(--text-primary)]">{attachment.name}</span>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <Download size={14} className="text-[var(--text-secondary)]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes Field - For Approver to Add Notes */}
          <div
            className="rounded-xl p-5 border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText size={18} className="text-[#84cc16]" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Approver Notes</h2>
            </div>
            <textarea
              placeholder="Add internal notes about this request..."
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] resize-y"
              rows={3}
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Status Card */}
          <div
            className="rounded-xl p-5 border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <h3 className="font-semibold text-[var(--text-primary)] mb-3">Request Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Submitted:</span>
                <span className="text-sm text-[var(--text-primary)]">
                  {formatDateTime(request.submittedAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Deadline:</span>
                <span
                  className={`text-sm font-medium ${isOverdue ? 'text-red-500' : 'text-[var(--text-primary)]'}`}
                >
                  {formatDate(request.deadline)}
                  {isOverdue && <span className="ml-1">(Overdue)</span>}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--text-secondary)]">Total Amount:</span>
                <span className="text-sm font-bold text-[#84cc16]">
                  {formatCurrency(request.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Approval History */}
          {request.approvalHistory && request.approvalHistory.length > 0 && (
            <div
              className="rounded-xl p-5 border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-[#84cc16]" />
                <h3 className="font-semibold text-[var(--text-primary)]">Approval History</h3>
              </div>
              <div className="space-y-3">
                {request.approvalHistory.map((history) => (
                  <div
                    key={history.id}
                    className="relative pl-4 pb-3 border-l-2"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#84cc16]" />
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {history.action === 'submitted'
                        ? '📝 Submitted'
                        : history.action === 'approved'
                          ? '✅ Approved'
                          : history.action === 'rejected'
                            ? '❌ Rejected'
                            : '🔄 Revision Requested'}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {history.by} • {history.role} • {formatDateTime(history.timestamp)}
                    </p>
                    {history.comments && (
                      <p className="text-xs text-[var(--text-secondary)] mt-1 italic">
                        "{history.comments}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Employee Comments */}
          {request.comments && (
            <div
              className="rounded-xl p-5 border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Briefcase size={18} className="text-[#84cc16]" />
                <h3 className="font-semibold text-[var(--text-primary)]">Employee Comments</h3>
              </div>
              <p className="text-sm text-[var(--text-secondary)] italic">"{request.comments}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Decision Modal */}
      <DecisionModal
        isOpen={decisionModal.isOpen}
        action={decisionModal.action}
        requestNumber={request.requestNumber}
        employeeName={request.employeeName}
        onClose={() => setDecisionModal({ isOpen: false, action: 'approved' })}
        onConfirm={handleDecision}
        loading={processing}
      />
    </div>
  );
}
