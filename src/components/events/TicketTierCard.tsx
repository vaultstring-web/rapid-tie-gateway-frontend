'use client';

import { useState } from 'react';
import { Ticket, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { TicketTier } from '@/types/events/eventDetails';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface TicketTierCardProps {
  tier: TicketTier;
  eventId: string;
  onPurchase: (tierId: string, quantity: number) => Promise<void>;
}

export const TicketTierCard = ({ tier, eventId, onPurchase }: TicketTierCardProps) => {
  const { theme } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [showBenefits, setShowBenefits] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const availableTickets = tier.quantity - tier.sold;
  const isSoldOut = availableTickets <= 0;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= Math.min(availableTickets, tier.maxPerPerson)) {
      setQuantity(newQuantity);
    }
  };

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      await onPurchase(tier.id, quantity);
      toast.success(`${quantity} ticket(s) added to cart!`);
    } catch (error) {
      toast.error('Failed to purchase tickets');
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div
      className="rounded-xl p-5 border transition-all hover:shadow-lg"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Ticket size={18} className="text-primary-green-500" />
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {tier.name}
            </h3>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {tier.description}
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary-green-500">
            {formatCurrency(tier.price)}
          </span>
        </div>
      </div>

      {/* Availability Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
          <span>{availableTickets} tickets left</span>
          <span>{Math.round((tier.sold / tier.quantity) * 100)}% sold</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
          <div
            className="h-full rounded-full bg-primary-green-500 transition-all"
            style={{ width: `${(tier.sold / tier.quantity) * 100}%` }}
          />
        </div>
      </div>

      {/* Benefits */}
      {tier.benefits.length > 0 && (
        <div className="mb-4">
          <button
            onClick={() => setShowBenefits(!showBenefits)}
            className="flex items-center gap-1 text-xs font-medium text-primary-green-500 hover:underline"
          >
            {showBenefits ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showBenefits ? 'Hide benefits' : 'Show benefits'}
          </button>
          {showBenefits && (
            <div className="mt-2 space-y-1">
              {tier.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Check size={12} className="text-green-500" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quantity Selector and Purchase Button */}
      {!isSoldOut ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Quantity</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-lg border flex items-center justify-center disabled:opacity-50"
                style={{
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                -
              </button>
              <span className="w-8 text-center font-medium" style={{ color: 'var(--text-primary)' }}>
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= Math.min(availableTickets, tier.maxPerPerson)}
                className="w-8 h-8 rounded-lg border flex items-center justify-center disabled:opacity-50"
                style={{
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={handlePurchase}
            disabled={purchasing}
            className="w-full py-2 rounded-lg bg-primary-green-500 text-white font-medium hover:bg-primary-green-600 transition-colors disabled:opacity-50"
          >
            {purchasing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              `Select - ${formatCurrency(tier.price * quantity)}`
            )}
          </button>
        </div>
      ) : (
        <button
          disabled
          className="w-full py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
        >
          Sold Out
        </button>
      )}

      {tier.maxPerPerson > 1 && !isSoldOut && (
        <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-secondary)' }}>
          Max {tier.maxPerPerson} per person
        </p>
      )}
    </div>
  );
};