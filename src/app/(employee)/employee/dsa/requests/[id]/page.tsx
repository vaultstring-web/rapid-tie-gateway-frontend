'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Briefcase, DollarSign, FileText, XCircle } from 'lucide-react';
import { ApprovalTimeline } from '@/components/employee/dsa/ApprovalTimeline';
import { CommentsThread } from '@/components/employee/dsa/CommentsThread';
import { LocalEvents } from '@/components/employee/dsa/LocalEvents';
import { dsaDetailsService } from '@/services/employee/dsaDetails.service';
import { DsaRequestDetail, ApprovalStep, Comment, LocalEvent } from '@/types/employee/dsaDetails';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockRequestDetail = (): DsaRequestDetail => {
  return {
    id: 'req-1',
    requestNumber: 'DSA-2024-001',
    destination: 'Lilongwe',
    purpose: 'Conference Attendance',
    startDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    duration: 4,
    perDiemRate: 45000,
    accommodationRate: 60000,
    totalAmount: 420000,
    currency: 'MWK',
    status: 'pending',
    travelAuthRef: 'TA-2024-123',
    notes: 'Requesting DSA for the Malawi Fintech Expo conference.',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    submittedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    employee: {
      id: 'emp-1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      grade: 'Senior Officer',
      department: 'Finance',
    },
  };
};

const getMockApprovals = (): ApprovalStep[] => {
  return [
    {
      id: 'app-1',
      level: 1,
      approverName: 'Jane Smith',
      approverRole: 'Department Manager',
      status: 'approved',
      comments: 'Approved. Valid conference attendance.',
      approvedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      id: 'app-2',
      level: 2,
      approverName: 'Michael Banda',
      approverRole: 'Finance Director',
      status: 'pending',
    },
  ];
};

const getMockComments = (): Comment[] => {
  return [
    {
      id: 'comment-1',
      authorName: 'Jane Smith',
      authorRole: 'Department Manager',
      content: 'Please ensure you submit a report after the conference.',
      createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
      isApprover: true,
    },
    {
      id: 'comment-2',
      authorName: 'John Doe',
      authorRole: 'Employee',
      content: 'Yes, will do. Thank you for the approval.',
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      isApprover: false,
    },
  ];
};

const getMockLocalEvents = (): LocalEvent[] => {
  return [
    {
      id: 'event-1',
      name: 'Malawi Fintech Expo 2026',
      description: 'The largest fintech conference in Malawi featuring industry leaders.',
      startDate: new Date(Date.now() + 8 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 10 * 86400000).toISOString(),
      venue: 'BICC',
      city: 'Lilongwe',
      category: 'conference',
      distance: 2.5,
      relevanceScore: 95,
    },
    {
      id: 'event-2',
      name: 'Tech Innovation Workshop',
      description: 'Hands-on workshop on emerging technologies.',
      startDate: new Date(Date.now() + 9 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 9 * 86400000).toISOString(),
      venue: 'Innovation Hub',
      city: 'Lilongwe',
      category: 'workshop',
      distance: 3.2,
      relevanceScore: 82,
    },
  ];
};

export default function DSARequestDetailsPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const [request, setRequest] = useState<DsaRequestDetail | null>(null);
  const [approvals, setApprovals] = useState<ApprovalStep[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [localEvents, setLocalEvents] = useState<LocalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadData();
  }, [requestId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const mockRequest = getMockRequestDetail();
      const mockApprovals = getMockApprovals();
      const mockComments = getMockComments();
      const mockEvents = getMockLocalEvents();
      
      setRequest(mockRequest);
      setApprovals(mockApprovals);
      setComments(mockComments);
      setLocalEvents(mockEvents);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load request details:', error);
      toast.error('Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (content: string) => {
    if (useMockData) {
      const newComment: Comment = {
        id: Date.now().toString(),
        authorName: 'You',
        authorRole: 'Employee',
        content,
        createdAt: new Date().toISOString(),
        isApprover: false,
      };
      setComments(prev => [...prev, newComment]);
      toast.success('Comment added (demo)');
      return;
    }
    await dsaDetailsService.addComment(requestId, content);
    await loadData();
  };

  const handleCancelRequest = async () => {
    setCancelling(true);
    try {
      if (useMockData) {
        setRequest(prev => prev ? { ...prev, status: 'cancelled' } : null);
        toast.success('Request cancelled (demo)');
        setShowCancelModal(false);
      } else {
        await dsaDetailsService.cancelRequest(requestId);
        toast.success('Request cancelled successfully');
        await loadData();
        setShowCancelModal(false);
      }
    } catch (error) {
      toast.error('Failed to cancel request');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusConfig = () => {
    switch (request?.status) {
      case 'pending':
        return { label: 'Pending Approval', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: '⏳' };
      case 'approved':
        return { label: 'Approved', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', icon: '✅' };
      case 'rejected':
        return { label: 'Rejected', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', icon: '❌' };
      case 'paid':
        return { label: 'Paid', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: '💰' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800', icon: '🚫' };
      default:
        return { label: 'Draft', color: 'text-gray-600', bg: 'bg-gray-100', icon: '📝' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <XCircle size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Request Not Found</h2>
          <p className="text-sm text-[var(--text-secondary)]">The DSA request you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/employee/dsa/requests')}
            className="mt-4 px-4 py-2 rounded-lg bg-[#84cc16] text-white hover:brightness-110"
          >
            Back to Requests
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig();
  const canCancel = request.status === 'pending';

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">DSA Request Details</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                  {statusConfig.icon} {statusConfig.label}
                </span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Request #{request.requestNumber}</p>
            </div>
          </div>
          
          {canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <XCircle size={16} />
              Cancel Request
            </button>
          )}
        </div>

        {/* Demo Mode Notice */}
        {useMockData && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              ℹ️ Demo Mode - Using sample data. Connect to backend for live data.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details Card */}
            <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Request Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-[#84cc16] mt-0.5" />
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Destination</p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{request.destination}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Briefcase size={16} className="text-[#84cc16] mt-0.5" />
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Purpose</p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{request.purpose}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar size={16} className="text-[#84cc16] mt-0.5" />
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Travel Dates</p>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {formatDate(request.startDate)} - {formatDate(request.endDate)}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">{request.duration} days</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign size={16} className="text-[#84cc16] mt-0.5" />
                  <div>
                    <p className="text-xs text-[var(--text-secondary)]">Total Amount</p>
                    <p className="text-lg font-bold text-[#84cc16]">{formatCurrency(request.totalAmount)}</p>
                  </div>
                </div>
              </div>
              
              {request.travelAuthRef && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-xs text-[var(--text-secondary)]">Travel Authorization Reference</p>
                  <p className="text-sm font-mono text-[var(--text-primary)]">{request.travelAuthRef}</p>
                </div>
              )}
              
              {request.notes && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-xs text-[var(--text-secondary)]">Additional Notes</p>
                  <p className="text-sm text-[var(--text-primary)]">{request.notes}</p>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-xs" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                  <span className="text-[var(--text-secondary)]">Submitted:</span>
                  <span className="ml-2 text-[var(--text-primary)]">{formatDateTime(request.submittedAt!)}</span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)]">Last Updated:</span>
                  <span className="ml-2 text-[var(--text-primary)]">{formatDateTime(request.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Approval Timeline */}
            <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Approval Timeline</h2>
              <ApprovalTimeline approvals={approvals} loading={loading} />
            </div>

            {/* Comments Thread */}
            <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Comments</h2>
              <CommentsThread
                comments={comments}
                requestId={requestId}
                onAddComment={handleAddComment}
                loading={loading}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Employee Info */}
            <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <h3 className="text-sm font-semibold mb-3 text-[var(--text-primary)]">Employee Information</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#84cc16]/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#84cc16]">
                    {request.employee.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{request.employee.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{request.employee.email}</p>
                  <p className="text-xs text-[#84cc16] mt-1">{request.employee.grade} • {request.employee.department}</p>
                </div>
              </div>
            </div>

            {/* Local Events */}
            <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-[var(--text-primary)]">
                <Calendar size={18} className="text-[#84cc16]" />
                Local Events
              </h3>
              <LocalEvents events={localEvents} destination={request.destination} loading={loading} />
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}>
          <div
            className="rounded-xl max-w-md w-full p-6"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              borderWidth: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle size={20} className="text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">Cancel DSA Request</h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              Are you sure you want to cancel this DSA request? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 rounded-lg border"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Keep Request
              </button>
              <button
                onClick={handleCancelRequest}
                disabled={cancelling}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}