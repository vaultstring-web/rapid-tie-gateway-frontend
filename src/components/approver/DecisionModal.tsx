'use client';

import { useState } from 'react';
import { X, AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { DecisionData } from '@/types/rejected.ts/request';
import { useTheme } from '@/context/ThemeContext';

interface DecisionModalProps {
  isOpen: boolean;
  action: 'approved' | 'rejected' | 'revision';
  requestNumber: string;
  employeeName: string;
  onClose: () => void;
  onConfirm: (data: DecisionData) => void;
  loading?: boolean;
}

export const DecisionModal = ({
  isOpen,
  action,
  requestNumber,
  employeeName,
  onClose,
  onConfirm,
  loading,
}: DecisionModalProps) => {
  const { theme } = useTheme();
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const getConfig = () => {
    switch (action) {
      case 'approved':
        return {
          title: 'Approve Request',
          icon: <CheckCircle size={24} className="text-green-500" />,
          buttonText: 'Approve Request',
          buttonColor: 'bg-green-500 hover:bg-green-600',
          placeholder: 'Optional: Add approval notes...',
        };
      case 'rejected':
        return {
          title: 'Reject Request',
          icon: <XCircle size={24} className="text-red-500" />,
          buttonText: 'Reject Request',
          buttonColor: 'bg-red-500 hover:bg-red-600',
          placeholder: 'Required: Provide reason for rejection',
        };
      case 'revision':
        return {
          title: 'Request Revision',
          icon: <RefreshCw size={24} className="text-yellow-500" />,
          buttonText: 'Request Revision',
          buttonColor: 'bg-yellow-500 hover:bg-yellow-600',
          placeholder: 'Required: Specify what needs to be revised',
        };
      default:
        return {
          title: 'Confirm Decision',
          icon: <AlertCircle size={24} className="text-gray-500" />,
          buttonText: 'Confirm',
          buttonColor: 'bg-gray-500 hover:bg-gray-600',
          placeholder: 'Add comments...',
        };
    }
  };

  const config = getConfig();
  const isReasonRequired = action !== 'approved';

  const handleConfirm = () => {
    if (isReasonRequired && !reason.trim()) {
      return;
    }
    onConfirm({ action, reason, notes });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="rounded-xl max-w-md w-full p-6"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          borderWidth: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            {config.icon}
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{config.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={18} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="mb-4 p-3 rounded-lg bg-[var(--hover-bg)]">
          <p className="text-sm text-[var(--text-primary)]">
            <strong>Request:</strong> {requestNumber}
          </p>
          <p className="text-sm text-[var(--text-primary)] mt-1">
            <strong>Employee:</strong> {employeeName}
          </p>
        </div>

        <div className="space-y-4">
          {/* Reason (Required for reject/revision) */}
          <div>
            <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
              {isReasonRequired ? 'Reason *' : 'Reason (Optional)'}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] resize-y"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              placeholder={config.placeholder}
              required={isReasonRequired}
            />
            {isReasonRequired && !reason.trim() && (
              <p className="text-xs text-red-500 mt-1">Reason is required</p>
            )}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">
              Internal Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] resize-y"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              placeholder="Add internal notes for reference..."
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border transition-colors"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || (isReasonRequired && !reason.trim())}
            className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 ${config.buttonColor}`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              config.buttonText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
