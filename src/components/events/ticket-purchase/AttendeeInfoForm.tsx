'use client';

import { User, Mail, Phone, MessageSquare, Copy, UserPlus } from 'lucide-react';
import { AttendeeInfo } from '@/types/events/ticketPurchase';
import { useTheme } from '@/context/ThemeContext';

interface AttendeeInfoFormProps {
  attendees: AttendeeInfo[];
  quantity: number;
  onUpdateAttendee: (index: number, data: Partial<AttendeeInfo>) => void;
}

export const AttendeeInfoForm = ({ attendees, quantity, onUpdateAttendee }: AttendeeInfoFormProps) => {
  const { theme } = useTheme();

  const copyFromPrevious = (index: number) => {
    if (index > 0) {
      const previous = attendees[index - 1];
      onUpdateAttendee(index, {
        firstName: previous.firstName,
        lastName: previous.lastName,
        email: previous.email,
        phone: previous.phone,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
        Attendee Information
      </h2>
      <p className="text-sm -mt-2" style={{ color: 'var(--text-secondary)' }}>
        Please provide details for each attendee
      </p>

      {Array.from({ length: quantity }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl p-5 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <User size={16} className="text-primary-green-500" />
              <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Attendee {index + 1}
              </h3>
            </div>
            {index > 0 && (
              <button
                onClick={() => copyFromPrevious(index)}
                className="flex items-center gap-1 text-xs text-primary-green-500 hover:underline"
              >
                <Copy size={12} />
                Copy from previous
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label label-required">First Name</label>
              <input
                type="text"
                value={attendees[index]?.firstName || ''}
                onChange={(e) => onUpdateAttendee(index, { firstName: e.target.value })}
                className="input"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="label label-required">Last Name</label>
              <input
                type="text"
                value={attendees[index]?.lastName || ''}
                onChange={(e) => onUpdateAttendee(index, { lastName: e.target.value })}
                className="input"
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="label label-required">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  value={attendees[index]?.email || ''}
                  onChange={(e) => onUpdateAttendee(index, { email: e.target.value })}
                  className="input pl-10"
                  placeholder="attendee@example.com"
                />
              </div>
            </div>
            <div>
              <label className="label">Phone Number (optional)</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="tel"
                  value={attendees[index]?.phone || ''}
                  onChange={(e) => onUpdateAttendee(index, { phone: e.target.value })}
                  className="input pl-10"
                  placeholder="+265 999 123 456"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="label">Special Requests (optional)</label>
            <div className="relative">
              <MessageSquare size={16} className="absolute left-3 top-3 text-neutral-400" />
              <textarea
                value={attendees[index]?.specialRequests || ''}
                onChange={(e) => onUpdateAttendee(index, { specialRequests: e.target.value })}
                className="input pl-10 resize-y"
                rows={2}
                placeholder="Dietary restrictions, accessibility needs, etc."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};