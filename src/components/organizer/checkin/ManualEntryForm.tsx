'use client';

import { useState } from 'react';
import { Ticket, UserCheck, AlertCircle } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ManualEntryFormProps {
  onSubmit: (ticketNumber: string) => Promise<void>;
  loading?: boolean;
}

export const ManualEntryForm = ({ onSubmit, loading }: ManualEntryFormProps) => {
  const { theme } = useTheme();
  const [ticketNumber, setTicketNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNumber.trim()) {
      setError('Please enter a ticket number');
      return;
    }
    setError(null);
    try {
      await onSubmit(ticketNumber.trim());
      setTicketNumber('');
    } catch (err: any) {
      setError(err.message || 'Ticket not found or already checked in');
    }
  };

  return (
    <div
      className="rounded-xl p-5 border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
        <Ticket size={18} />
        Manual Check-in
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Ticket Number</label>
          <input
            type="text"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            placeholder="Enter ticket number (e.g., TKT-1234)"
            className="input w-full"
            disabled={loading}
            autoFocus
          />
          {error && (
            <p className="error-text mt-1 flex items-center gap-1">
              <AlertCircle size={12} />
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-primary-green-500 text-white font-medium hover:bg-primary-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <UserCheck size={16} />
              Check In
            </>
          )}
        </button>
      </form>
    </div>
  );
};