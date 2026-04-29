'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Ticket, Calendar, MapPin, Tag, TrendingDown, Shield, Lock } from 'lucide-react';
import { PaymentMethodCard } from '@/components/checkout/PaymentMethodCard';
import { BuyerDetailsForm } from '@/components/checkout/BuyerDetailsForm';
import { PaymentStatus } from '@/components/checkout/PaymentStatus';
import { checkoutService } from '@/services/events/checkout.service';
import { OrderDetails, BuyerDetails, PaymentMethod, PAYMENT_METHODS, PaymentStatus as PaymentStatusType } from '@/types/events/checkout';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [buyerDetails, setBuyerDetails] = useState<BuyerDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    confirmEmail: '',
    address: '',
    city: '',
    notes: '',
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<Record<string, string>>({});
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusType>({ state: 'idle', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await checkoutService.getOrderDetails(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const validateBuyerDetails = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!buyerDetails.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!buyerDetails.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!buyerDetails.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerDetails.email)) newErrors.email = 'Invalid email format';
    if (!buyerDetails.confirmEmail.trim()) newErrors.confirmEmail = 'Please confirm your email';
    else if (buyerDetails.email !== buyerDetails.confirmEmail) newErrors.confirmEmail = 'Emails do not match';
    if (!buyerDetails.phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentData = (method: PaymentMethod): boolean => {
    if (!method.fields) return true;
    
    const newErrors: Record<string, string> = {};
    for (const field of method.fields) {
      if (field.required && !paymentData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (!validateBuyerDetails()) {
      toast.error('Please fix the errors in your information');
      return;
    }

    const method = PAYMENT_METHODS.find(m => m.id === selectedPaymentMethod);
    if (!method) return;

    if (!validatePaymentData(method)) {
      toast.error('Please complete payment information');
      return;
    }

    setProcessing(true);
    setPaymentStatus({ state: 'processing', message: 'Processing your payment...' });

    try {
      // Update buyer details
      await checkoutService.updateBuyerDetails(orderId, buyerDetails);
      
      // Process payment
      const result = await checkoutService.processPayment(orderId, selectedPaymentMethod, paymentData);
      
      if (result.success) {
        setPaymentStatus({
          state: 'success',
          message: 'Your payment was successful! Redirecting to confirmation...',
          transactionId: result.transactionId,
        });
        
        setTimeout(() => {
          router.push(`/order/confirmation/${orderId}`);
        }, 2000);
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      console.error('Payment failed:', error);
      setPaymentStatus({
        state: 'error',
        message: error.message || 'Payment failed. Please try again or use a different payment method.',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Order Not Found</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>The order you're looking for doesn't exist.</p>
          <Link href="/events" className="text-primary-green-500 hover:underline">
            Browse Events →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href={`/events/${order.eventId}/purchase`}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Checkout
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Complete your purchase to secure your tickets
            </p>
          </div>
        </div>

        {/* Payment Status */}
        <PaymentStatus status={paymentStatus} />

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8 mt-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Buyer Details */}
            <BuyerDetailsForm
              details={buyerDetails}
              onChange={setBuyerDetails}
              errors={errors}
            />

            {/* Payment Methods */}
            <div
              className="rounded-xl p-5 border"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Payment Method
              </h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.filter(m => m.enabled).map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    isSelected={selectedPaymentMethod === method.id}
                    onSelect={() => {
                      setSelectedPaymentMethod(method.id);
                      setPaymentData({});
                      setErrors({});
                    }}
                    onDataChange={(data) => setPaymentData(prev => ({ ...prev, ...data }))}
                  />
                ))}
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Lock size={14} />
              <span>Your payment information is secure and encrypted</span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={processing || !selectedPaymentMethod}
              className="w-full py-3 rounded-lg bg-primary-green-500 text-white font-semibold hover:bg-primary-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                `Pay ${formatCurrency(order.total)}`
              )}
            </button>
          </div>

          {/* Right Column - Order Summary */}
          <div>
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

              {/* Event Info */}
              <div className="flex gap-3 pb-4 mb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={order.eventImage || '/images/event-placeholder.jpg'}
                    alt={order.eventName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {order.eventName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <Calendar size={10} />
                    <span>{formatDate(order.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <MapPin size={10} />
                    <span>{order.eventVenue}</span>
                  </div>
                </div>
              </div>

              {/* Ticket Details */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {order.tierName} x {order.quantity}
                  </span>
                  <span style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(order.unitPrice * order.quantity)}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span className="flex items-center gap-1">
                      <TrendingDown size={14} />
                      Discount
                    </span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span>Service Fee</span>
                  <span>{formatCurrency(order.fees)}</span>
                </div>

                {order.savings && order.savings > 0 && (
                  <div className="flex justify-between text-sm text-green-500">
                    <span>You saved</span>
                    <span>{formatCurrency(order.savings)}</span>
                  </div>
                )}

                {order.promoCode && (
                  <div className="flex justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span>Promo Code</span>
                    <span>{order.promoCode}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex justify-between text-lg font-bold">
                  <span style={{ color: 'var(--text-primary)' }}>Total</span>
                  <span className="text-primary-green-500">{formatCurrency(order.total)}</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-4 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'var(--hover-bg)' }}>
                <Shield size={16} className="text-primary-green-500" />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Secure checkout powered by Rapid Tie
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}