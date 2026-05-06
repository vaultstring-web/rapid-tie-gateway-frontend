'use client';

import { Calendar, MapPin, Ticket, DollarSign, CheckCircle } from 'lucide-react';
import { CreateEventFormData, EVENT_CATEGORIES } from '@/types/organizer/createEvent';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface ReviewStepProps {
  formData: CreateEventFormData;
}

export const ReviewStep = ({ formData }: ReviewStepProps) => {
  const { theme } = useTheme();
  const category = EVENT_CATEGORIES.find(c => c.value === formData.category);
  const totalCapacity = formData.ticketTiers.reduce((sum, t) => sum + t.quantity, 0);
  const totalRevenue = formData.ticketTiers.reduce((sum, t) => sum + (t.price * t.quantity), 0);

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[#84cc16]/20 flex items-center justify-center mx-auto mb-3">
          <CheckCircle size={32} className="text-[#84cc16]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Ready to Create!</h2>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Review your event details before publishing</p>
      </div>

      {/* Event Summary Card */}
      <div className="rounded-xl border border-[var(--border-color)] overflow-hidden">
        {/* Cover Image Preview */}
        {formData.coverImage && (
          <div className="h-40 overflow-hidden">
            <img
              src={formData.coverImage instanceof File ? URL.createObjectURL(formData.coverImage) : formData.coverImage}
              alt="Event cover"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Event Info */}
        <div className="p-5 space-y-4">
          <div>
            <span className={`px-2 py-0.5 rounded-full text-xs ${category ? 'bg-[#84cc16]/10 text-[#84cc16]' : 'bg-gray-100 text-gray-500'}`}>
              {category?.label || formData.category}
            </span>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mt-2">{formData.name}</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{formData.shortDescription}</p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <Calendar size={14} />
              <span>{formatDate(formData.startDate)} - {formatDate(formData.endDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <MapPin size={14} />
              <span>{formData.isVirtual ? 'Virtual Event' : `${formData.venue}, ${formData.city}`}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border-color)]">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[var(--text-secondary)]">Ticket Tiers</span>
              <span className="font-medium text-[var(--text-primary)]">{formData.ticketTiers.length}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[var(--text-secondary)]">Total Capacity</span>
              <span className="font-medium text-[var(--text-primary)]">{totalCapacity.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Potential Revenue</span>
              <span className="font-bold text-[#84cc16]">{formatCurrency(totalRevenue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Tiers Preview */}
      {formData.ticketTiers.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-[var(--text-primary)]">Ticket Tiers</h3>
          <div className="space-y-2">
            {formData.ticketTiers.map((tier, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{tier.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{tier.description}</p>
                    <div className="flex gap-3 mt-1 text-xs text-[var(--text-secondary)]">
                      <span>{tier.quantity} available</span>
                      <span>Max {tier.maxPerPerson} per person</span>
                    </div>
                  </div>
                  <p className="font-bold text-[#84cc16]">{formatCurrency(tier.price)}</p>
                </div>
                {tier.benefits.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tier.benefits.map((benefit, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-[var(--hover-bg)] text-[var(--text-secondary)]">
                        ✓ {benefit}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};