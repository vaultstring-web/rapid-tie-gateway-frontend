'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CreditCard, ShieldCheck, Smartphone, Landmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PAYMENT_METHODS } from '@/lib/constants/index';

// Create the type from the PAYMENT_METHODS object
type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];

export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // Fix: Explicitly type the state
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PAYMENT_METHODS.CARD);
  const [loading, setLoading] = useState(false);

  const handlePayment = () => {
    setLoading(true);
    // Simulate payment logic
    setTimeout(() => {
      router.push(`/order/confirmation/${id}`);
    }, 2000);
  };

  return (
    <div className="container-custom py-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-[var(--text-primary)]">Secure Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Airtel Money */}
              <PaymentOption 
                active={selectedMethod === PAYMENT_METHODS.AIRTEL_MONEY}
                onClick={() => setSelectedMethod(PAYMENT_METHODS.AIRTEL_MONEY)}
                icon={<Smartphone size={24} />}
                label="Airtel Money"
              />
              {/* TNM Mpamba */}
              <PaymentOption 
                active={selectedMethod === PAYMENT_METHODS.TNM_MPAMBA}
                onClick={() => setSelectedMethod(PAYMENT_METHODS.TNM_MPAMBA)}
                icon={<Smartphone size={24} />}
                label="TNM Mpamba"
              />
              {/* Card */}
              <PaymentOption 
                active={selectedMethod === PAYMENT_METHODS.CARD}
                onClick={() => setSelectedMethod(PAYMENT_METHODS.CARD)}
                icon={<CreditCard size={24} />}
                label="Debit/Credit Card"
              />
              {/* Bank Transfer */}
              <PaymentOption 
                active={selectedMethod === PAYMENT_METHODS.BANK_TRANSFER}
                onClick={() => setSelectedMethod(PAYMENT_METHODS.BANK_TRANSFER)}
                icon={<Landmark size={24} />}
                label="Bank Transfer"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Attendee Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input className="input" placeholder="First Name" />
                <input className="input" placeholder="Last Name" />
              </div>
              <input className="input" placeholder="Email Address" />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <Card className="bg-[var(--bg-secondary)] sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Standard Admission x 1</span>
                <span className="text-[var(--text-primary)] font-bold">MK 25,000</span>
              </div>
              <div className="pt-4 border-t border-[var(--border-color)] flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-bold text-[var(--accent)]">MK 25,000</span>
              </div>
              <button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full btn-primary h-12 mt-4"
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
              <div className="flex items-center justify-center gap-2 text-[var(--text-secondary)] text-xs mt-4">
                <ShieldCheck size={14} />
                Secure Encrypted Transaction
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PaymentOption({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
        active 
          ? 'border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--text-primary)]' 
          : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'
      }`}
    >
      <div className={active ? 'text-[var(--accent)]' : ''}>{icon}</div>
      <span className="font-bold text-sm">{label}</span>
    </button>
  );
}