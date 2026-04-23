'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Check, AlertCircle, Tag, Users, Clock } from 'lucide-react';
import { TicketTier, RoleBasedPrice } from '@/types/events/ticketPurchase';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface TicketTierSelectorProps {
  tiers: TicketTier[];
  rolePrices?: RoleBasedPrice[];
  selectedTierId: string | null;
  quantities: Record<string, number>;
  onSelectTier: (tierId: string) => void;
  onQuantityChange: (tierId: string, quantity: number) => void;
}

export const TicketTierSelector = ({
  tiers,
  rolePrices,
  selectedTierId,
  quantities,
  onSelectTier,
  onQuantityChange,
}: TicketTierSelectorProps) => {
  const { theme } = useTheme();
  const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set());

  const toggleExpand = (tierId: string) => {
    setExpandedTiers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tierId)) {
        newSet.delete(tierId);
      } else {
        newSet.add(tierId);
      }
      return newSet;
    });
  };

  const getRolePrice = (tier: TicketTier): number => {
    if (!rolePrices) return tier.price;
    const rolePrice = rolePrices.find(rp => rp.role === 'MERCHANT'); // Replace with actual user role
    if (rolePrice && rolePrice.price < tier.price) {
      return rolePrice.price;
    }
    return tier.price;
  };

  const getDiscount = (tier: TicketTier): number => {
    const currentPrice = getRolePrice(tier);
    if (currentPrice < tier.price) {
      return Math.round(((tier.price - currentPrice) / tier.price) * 100);
    }
    return 0;
  };

  const isSelected = (tierId: string) => selectedTierId === tierId;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Select Tickets
      </h2>
      
      {tiers.map((tier) => {
        const available = tier.quantity - tier.sold;
        const isSoldOut = available <= 0;
        const discount = getDiscount(tier);
        const currentPrice = getRolePrice(tier);
        const quantity = quantities[tier.id] || 0;
        const isExpanded = expandedTiers.has(tier.id);
        const showLowStock = available <= 10 && available > 0;

        return (
          <div
            key={tier.id}
            className={`rounded-xl border transition-all ${
              isSelected(tier.id)
                ? 'ring-2 ring-primary-green-500'
                : 'hover:shadow-md'
            } ${isSoldOut ? 'opacity-60' : ''}`}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
            }}
          >
            <div className="p-4">
              <div className="flex flex-wrap gap-4 items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {tier.name}
                    </h3>
                    {discount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        {discount}% OFF
                      </span>
                    )}
                    {showLowStock && !isSoldOut && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 flex items-center gap-1">
                        <AlertCircle size={10} />
                        Only {available} left!
                      </span>
                    )}
                  </div>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {tier.description}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {discount > 0 && (
                      <span className="text-sm line-through" style={{ color: 'var(--text-secondary)' }}>
                        {formatCurrency(tier.price)}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-primary-green-500">
                      {formatCurrency(currentPrice)}
                    </span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {available} available
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              {!isSoldOut && (
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => toggleExpand(tier.id)}
                    className="flex items-center gap-1 text-sm text-primary-green-500 hover:underline"
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {isExpanded ? 'Hide details' : 'View benefits'}
                  </button>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onQuantityChange(tier.id, Math.max(0, quantity - 1))}
                      disabled={quantity === 0}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium" style={{ color: 'var(--text-primary)' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => onQuantityChange(tier.id, Math.min(available, quantity + 1))}
                      disabled={quantity >= available || quantity >= tier.maxPerPerson}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {isExpanded && tier.benefits.length > 0 && (
                <div className="mt-4 pt-4 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    What's included:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tier.benefits.map((benefit, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                        style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-secondary)' }}
                      >
                        <Check size={10} className="text-primary-green-500" />
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Max per person notice */}
              {!isSoldOut && tier.maxPerPerson > 1 && quantity >= tier.maxPerPerson && (
                <p className="text-xs mt-2 text-yellow-500">
                  Maximum {tier.maxPerPerson} tickets per person
                </p>
              )}
            </div>

            {/* Select Button */}
            {!isSelected(tier.id) && quantity > 0 && (
              <div className="p-4 pt-0">
                <button
                  onClick={() => onSelectTier(tier.id)}
                  className="w-full py-2 rounded-lg bg-primary-green-500 text-white font-medium hover:bg-primary-green-600 transition-colors"
                >
                  Select This Tier
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};