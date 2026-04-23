'use client';

import { User, Mail, Phone, MapPin, MessageSquare, CheckCircle } from 'lucide-react';
import { BuyerDetails } from '@/types/events/checkout';
import { useTheme } from '@/context/ThemeContext';

interface BuyerDetailsFormProps {
  details: BuyerDetails;
  onChange: (details: Partial<BuyerDetails>) => void;
  errors: Record<string, string>;
}

export const BuyerDetailsForm = ({ details, onChange, errors }: BuyerDetailsFormProps) => {
  const { theme } = useTheme();

  const emailsMatch = details.email && details.confirmEmail && details.email === details.confirmEmail;

  return (
    <div
      className="rounded-xl p-5 border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Your Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label label-required">First Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={details.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              className={`input pl-10 ${errors.firstName ? 'input-error' : ''}`}
              placeholder="John"
            />
          </div>
          {errors.firstName && <p className="error-text">{errors.firstName}</p>}
        </div>

        <div>
          <label className="label label-required">Last Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={details.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              className={`input pl-10 ${errors.lastName ? 'input-error' : ''}`}
              placeholder="Doe"
            />
          </div>
          {errors.lastName && <p className="error-text">{errors.lastName}</p>}
        </div>

        <div>
          <label className="label label-required">Email Address</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="email"
              value={details.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
              placeholder="john@example.com"
            />
          </div>
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>

        <div>
          <label className="label label-required">Confirm Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="email"
              value={details.confirmEmail}
              onChange={(e) => onChange({ confirmEmail: e.target.value })}
              className={`input pl-10 ${errors.confirmEmail ? 'input-error' : ''} ${!errors.confirmEmail && details.confirmEmail && emailsMatch ? 'border-green-500' : ''}`}
              placeholder="john@example.com"
            />
          </div>
          {errors.confirmEmail && <p className="error-text">{errors.confirmEmail}</p>}
          {!errors.confirmEmail && details.confirmEmail && emailsMatch && (
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
              <CheckCircle size={10} /> Emails match
            </p>
          )}
        </div>

        <div>
          <label className="label label-required">Phone Number</label>
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="tel"
              value={details.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className={`input pl-10 ${errors.phone ? 'input-error' : ''}`}
              placeholder="+265 999 123 456"
            />
          </div>
          {errors.phone && <p className="error-text">{errors.phone}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="label">Address (optional)</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={details.address || ''}
              onChange={(e) => onChange({ address: e.target.value })}
              className="input pl-10"
              placeholder="Street address"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="label">Special Notes (optional)</label>
          <div className="relative">
            <MessageSquare size={16} className="absolute left-3 top-3 text-neutral-400" />
            <textarea
              value={details.notes || ''}
              onChange={(e) => onChange({ notes: e.target.value })}
              className="input pl-10 resize-y"
              rows={2}
              placeholder="Any special requests or notes for the organizer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};