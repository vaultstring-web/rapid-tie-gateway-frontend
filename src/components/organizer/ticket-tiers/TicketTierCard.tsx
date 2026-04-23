'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2, Users, Tag, Clock, DollarSign, ChevronDown, ChevronUp, Power } from 'lucide-react';
import { TicketTier, ROLES } from '@/types/organizer/ticketTiers';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface TicketTierCardProps {
  tier: TicketTier;
  index: number;
  onEdit: (tier: TicketTier) => void;
  onDelete: (tierId: string) => void;
  onToggleActive: (tierId: string, isActive: boolean) => void;
}

export const TicketTierCard = ({ tier, index, onEdit, onDelete, onToggleActive }: TicketTierCardProps) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tier.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const soldPercentage = (tier.sold / tier.quantity) * 100;
  const isSoldOut = tier.sold >= tier.quantity;
  const rolePrices = tier.roleBasedPrices.filter(rp => rp.enabled && rp.price !== tier.basePrice);

  const getStatusColor = () => {
    if (!tier.isActive) return 'bg-gray-500';
    if (isSoldOut) return 'bg-red-500';
    if (soldPercentage > 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (!tier.isActive) return 'Inactive';
    if (isSoldOut) return 'Sold Out';
    if (soldPercentage > 80) return 'Almost Sold Out';
    return 'Active';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-xl border transition-all hover:shadow-md"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-1">
            <GripVertical size={20} style={{ color: 'var(--text-secondary)' }} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {tier.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor()}`}>
                    {getStatusText()}
                  </span>
                  {rolePrices.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                      Role Pricing Active
                    </span>
                  )}
                  {tier.earlyBirdPeriods.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                      Early Bird Available
                    </span>
                  )}
                </div>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {tier.description || 'No description provided'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-green-500">
                  {formatCurrency(tier.basePrice)}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Base price
                </p>
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {tier.sold.toLocaleString()} / {tier.quantity.toLocaleString()} sold
                </span>
                <span>{Math.round(soldPercentage)}% filled</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
                <div
                  className={`h-full rounded-full transition-all ${isSoldOut ? 'bg-red-500' : soldPercentage > 80 ? 'bg-yellow-500' : 'bg-primary-green-500'}`}
                  style={{ width: `${soldPercentage}%` }}
                />
              </div>
            </div>

            {/* Role-Based Pricing Preview */}
            {rolePrices.length > 0 && !expanded && (
              <div className="mt-3 flex flex-wrap gap-2">
                {rolePrices.slice(0, 3).map((rp) => {
                  const roleConfig = ROLES.find(r => r.value === rp.role);
                  return (
                    <span
                      key={rp.role}
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{ backgroundColor: `${roleConfig?.color}20`, color: roleConfig?.color }}
                    >
                      {roleConfig?.label}: {formatCurrency(rp.price)}
                    </span>
                  );
                })}
                {rolePrices.length > 3 && (
                  <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-secondary)' }}>
                    +{rolePrices.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Expand/Collapse Button */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 mt-3 text-xs text-primary-green-500 hover:underline"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {expanded ? 'Show less' : 'Show details'}
            </button>

            {/* Expanded Details */}
            {expanded && (
              <div className="mt-4 pt-4 border-t space-y-4" style={{ borderColor: 'var(--border-color)' }}>
                {/* Role-Based Pricing Table */}
                {tier.roleBasedPrices.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                      <DollarSign size={14} />
                      Role-Based Pricing
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {tier.roleBasedPrices.map((rp) => {
                        const roleConfig = ROLES.find(r => r.value === rp.role);
                        const isDiscounted = rp.price < tier.basePrice;
                        return (
                          <div
                            key={rp.role}
                            className="p-2 rounded-lg text-center"
                            style={{ backgroundColor: 'var(--hover-bg)' }}
                          >
                            <p className="text-xs" style={{ color: roleConfig?.color }}>{roleConfig?.label}</p>
                            <p className={`text-sm font-semibold ${isDiscounted ? 'text-primary-green-500' : ''}`}>
                              {formatCurrency(rp.price)}
                            </p>
                            {isDiscounted && (
                              <p className="text-xs line-through" style={{ color: 'var(--text-secondary)' }}>
                                {formatCurrency(tier.basePrice)}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Early Bird Periods */}
                {tier.earlyBirdPeriods.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                      <Clock size={14} />
                      Early Bird Periods
                    </h4>
                    <div className="space-y-2">
                      {tier.earlyBirdPeriods.map((period) => (
                        <div
                          key={period.id}
                          className="p-2 rounded-lg flex justify-between items-center"
                          style={{ backgroundColor: 'var(--hover-bg)' }}
                        >
                          <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                              {period.name}
                            </p>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-primary-green-500">
                            {period.discountType === 'percentage' ? `${period.discountValue}% off` : formatCurrency(period.discountValue)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {tier.benefits.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                      <Tag size={14} />
                      Benefits
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {tier.benefits.map((benefit, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-secondary)' }}
                        >
                          ✓ {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Max Per Person */}
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Users size={14} />
                  Max {tier.maxPerPerson} tickets per person
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onToggleActive(tier.id, !tier.isActive)}
              className={`p-2 rounded-lg transition-colors ${tier.isActive ? 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              title={tier.isActive ? 'Deactivate' : 'Activate'}
            >
              <Power size={16} />
            </button>
            <button
              onClick={() => onEdit(tier)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(tier.id)}
              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-red-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};