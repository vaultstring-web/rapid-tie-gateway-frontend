'use client';

import { useState } from 'react';
import { Ticket, Tag, CreditCard, Shield, Clock, TrendingDown } from 'lucide-react';
import { OrderSummary as OrderSummaryType, PAYMENT_METHODS } from '@/types/events/ticketPurchase';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface OrderSummaryProps {
  summary: OrderSummaryType;
  tierName: string;
  quantity: number;
  onPaymentMethodChange: (method: string) => void;
  onPromoCodeApply: (code: string) => Promise<void>;
  onSubmit: () => void;
  loading?: boolean;
}

export const OrderSummary = ({
  summary,
  tierName,
  quantity,
  onPaymentMethodChange,
  onPromoCodeApply,
  onSubmit,
  loading,
}: OrderSummaryProps) => {
  const { theme } = useTheme();
  const [promoCode, setPromoCode] = useState('');
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].value);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setApplyingPromo(true);
    setPromoError(null);
    try {
      await onPromoCodeApply(promoCode);
    } catch (error: any) {
      setPromoError(error.message || 'Invalid promo code');
    } finally {
      setApplyingPromo(false);
    }
  };

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    onPaymentMethodChange(method);
  };

  return (
    <div
      className="rounded-xl p-5 border sticky top-24"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
        Order Summary
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span style={{ color: 'var(--text-secondary)' }}>
            {tierName} x {quantity}
          </span>
          <span style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(summary.subtotal)}
          </span>
        </div>

        {summary.discount > 0 && (
          <div className="flex justify-between text-sm text-green-500">
            <span className="flex items-center gap-1">
              <TrendingDown size={14} />
              Discount
            </span>
            <span>-{formatCurrency(summary.discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span>Service Fee</span>
          <span>{formatCurrency(summary.fees)}</span>
        </div>

        {summary.savings && summary.savings > 0 && (
          <div className="flex justify-between text-sm text-green-500">
            <span>You saved</span>
            <span>{formatCurrency(summary.savings)}</span>
          </div>
        )}

        <div className="border-t pt-3 mt-3" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex justify-between text-lg font-bold">
            <span style={{ color: 'var(--text-primary)' }}>Total</span>
            <span className="text-primary-green-500">{formatCurrency(summary.total)}</span>
          </div>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mt-4">
        <label className="text-sm font-medium mb-1 block" style={{ color: 'var(--text-primary)' }}>
          Promo Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="input flex-1"
          />
          <button
            onClick={handleApplyPromo}
            disabled={applyingPromo || !promoCode}
            className="px-4 py-2 rounded-lg bg-primary-green-500 text-white hover:bg-primary-green-600 transition-colors disabled:opacity-50"
          >
            {applyingPromo ? 'Applying...' : 'Apply'}
          </button>
        </div>
        {promoError && <p className="error-text mt-1">{promoError}</p>}
      </div>

      {/* Payment Methods */}
      <div className="mt-4">
        <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--text-primary)' }}>
          Payment Method
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.value}
              onClick={() => handleMethodSelect(method.value)}
              className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                selectedMethod === method.value
                  ? 'border-primary-green-500 bg-primary-green-500/10'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{ borderColor: selectedMethod === method.value ? undefined : 'var(--border-color)' }}
            >
              <span className="text-lg">{method.icon}</span>
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                {method.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-4 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'var(--hover-bg)' }}>
        <Shield size={16} className="text-primary-green-500" />
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Your payment information is secure and encrypted
        </p>
      </div>

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        disabled={loading}
        className="w-full mt-4 py-3 rounded-lg bg-primary-green-500 text-white font-semibold hover:bg-primary-green-600 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          `Pay ${formatCurrency(summary.total)}`
        )}
      </button>

      <p className="text-xs text-center mt-3" style={{ color: 'var(--text-secondary)' }}>
        By completing this purchase, you agree to our Terms of Service
      </p>
    </div>
  );
};