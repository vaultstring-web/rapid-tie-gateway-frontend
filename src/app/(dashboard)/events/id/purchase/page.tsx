'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { TicketTierSelector } from '@/components/events/ticket-purchase/TicketTierSelector';
import { AttendeeInfoForm } from '@/components/events/ticket-purchase/AttendeeInfoForm';
import { OrderSummary } from '@/components/events/ticket-purchase/OrderSummary';
import { ticketPurchaseService } from '@/services/events/ticketPurchase.service';
import { TicketTier, AttendeeInfo, OrderSummary as OrderSummaryType } from '@/types/events/ticketPurchase';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/utils/format';

// Mock data for development
const getMockTicketTiers = (): TicketTier[] => {
  return [
    {
      id: 'tier-1',
      name: 'VIP Pass',
      description: 'Full access including backstage passes, VIP lounge, and premium seating',
      price: 150000,
      originalPrice: 200000,
      quantity: 100,
      sold: 45,
      maxPerPerson: 4,
      benefits: ['Backstage Access', 'VIP Lounge', 'Premium Seating', 'Free Drinks', 'Meet & Greet'],
      isAvailable: true,
    },
    {
      id: 'tier-2',
      name: 'General Admission',
      description: 'Standard entry to the event',
      price: 45000,
      quantity: 500,
      sold: 320,
      maxPerPerson: 10,
      benefits: ['Standard Entry', 'Access to All Stages'],
      isAvailable: true,
    },
    {
      id: 'tier-3',
      name: 'Early Bird',
      description: 'Limited time offer - get early access',
      price: 25000,
      originalPrice: 45000,
      quantity: 200,
      sold: 187,
      maxPerPerson: 6,
      benefits: ['Early Entry', 'Limited Edition Badge', 'Priority Queue'],
      isAvailable: true,
    },
    {
      id: 'tier-4',
      name: 'Group Ticket (5+)',
      description: 'Special rate for groups of 5 or more',
      price: 35000,
      originalPrice: 45000,
      quantity: 150,
      sold: 62,
      maxPerPerson: 20,
      benefits: ['Group Seating', 'Group Photo Opportunity'],
      isAvailable: true,
    },
  ];
};

const getMockOrderSummary = (tier: TicketTier, quantity: number): OrderSummaryType => {
  const subtotal = tier.price * quantity;
  const discount = tier.originalPrice ? (tier.originalPrice - tier.price) * quantity : 0;
  const fees = Math.round(subtotal * 0.05);
  return {
    subtotal,
    discount,
    fees,
    total: subtotal - discount + fees,
    savings: discount > 0 ? discount : undefined,
  };
};

export default function TicketPurchasePage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [attendees, setAttendees] = useState<AttendeeInfo[]>([]);
  const [summary, setSummary] = useState<OrderSummaryType | null>(null);
  const [loading, setLoading] = useState({ tiers: true, calculation: false, purchase: false });
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadTiers();
  }, [eventId]);

  const loadTiers = async () => {
    setLoading(prev => ({ ...prev, tiers: true }));
    try {
      let data;
      try {
        data = await ticketPurchaseService.getTicketTiers(eventId);
        if (data && data.length > 0) {
          setUseMockData(false);
        } else {
          data = getMockTicketTiers();
        }
      } catch (error) {
        console.warn('Failed to fetch from API, using mock data:', error);
        data = getMockTicketTiers();
        setUseMockData(true);
      }
      setTiers(data);
      // Initialize quantities
      const initialQuantities: Record<string, number> = {};
      data.forEach(tier => { initialQuantities[tier.id] = 0; });
      setQuantities(initialQuantities);
    } catch (error) {
      console.error('Failed to load tiers:', error);
      toast.error('Failed to load ticket options');
      // Fallback to mock data
      const mockData = getMockTicketTiers();
      setTiers(mockData);
      const initialQuantities: Record<string, number> = {};
      mockData.forEach(tier => { initialQuantities[tier.id] = 0; });
      setQuantities(initialQuantities);
    } finally {
      setLoading(prev => ({ ...prev, tiers: false }));
    }
  };

  const updateQuantity = (tierId: string, quantity: number) => {
    setQuantities(prev => ({ ...prev, [tierId]: quantity }));
    
    // If quantity becomes 0 and this was the selected tier, clear selection
    if (selectedTierId === tierId && quantity === 0) {
      setSelectedTierId(null);
      setAttendees([]);
      setSummary(null);
    }
  };

  const selectTier = async (tierId: string) => {
    const quantity = quantities[tierId];
    if (quantity === 0) {
      toast.error('Please select a quantity first');
      return;
    }

    setSelectedTierId(tierId);
    setLoading(prev => ({ ...prev, calculation: true }));

    try {
      const tier = tiers.find(t => t.id === tierId);
      if (tier) {
        // Initialize attendee forms
        const newAttendees: AttendeeInfo[] = Array(quantity).fill(null).map(() => ({
          id: crypto.randomUUID(),
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          specialRequests: '',
        }));
        setAttendees(newAttendees);
        
        // Calculate order summary
        let orderSummary;
        if (useMockData) {
          orderSummary = getMockOrderSummary(tier, quantity);
        } else {
          orderSummary = await ticketPurchaseService.calculateOrder(eventId, tierId, quantity);
        }
        setSummary(orderSummary);
      }
    } catch (error) {
      console.error('Failed to calculate order:', error);
      toast.error('Failed to calculate order');
    } finally {
      setLoading(prev => ({ ...prev, calculation: false }));
    }
  };

  const updateAttendee = (index: number, data: Partial<AttendeeInfo>) => {
    setAttendees(prev => prev.map((a, i) => i === index ? { ...a, ...data } : a));
  };

  const handlePromoCodeApply = async (code: string) => {
    if (useMockData) {
      if (code === 'DEMO10') {
        const tier = tiers.find(t => t.id === selectedTierId);
        if (tier && selectedTierId) {
          const quantity = quantities[selectedTierId];
          const subtotal = tier.price * quantity;
          const discount = Math.round(subtotal * 0.1);
          const fees = Math.round((subtotal - discount) * 0.05);
          setSummary({
            subtotal,
            discount,
            fees,
            total: subtotal - discount + fees,
            savings: discount,
          });
          toast.success(`Promo code applied! You saved ${formatCurrency(discount)}`);
        }
      } else {
        throw new Error('Invalid promo code');
      }
      return;
    }
    
    const result = await ticketPurchaseService.validatePromoCode(eventId, code);
    if (result.valid && selectedTierId) {
      const updatedSummary = await ticketPurchaseService.calculateOrder(eventId, selectedTierId, quantities[selectedTierId], code);
      setSummary(updatedSummary);
      toast.success(`Promo code applied! You saved ${formatCurrency(result.discount)}`);
    } else {
      throw new Error(result.message || 'Invalid promo code');
    }
  };

  const handlePurchase = async () => {
    if (!selectedTierId || !summary) return;

    // Validate attendee information
    const hasEmptyFields = attendees.some(a => !a.firstName || !a.lastName || !a.email);
    if (hasEmptyFields) {
      toast.error('Please fill in all attendee information');
      return;
    }

    setLoading(prev => ({ ...prev, purchase: true }));

    try {
      let result;
      if (useMockData) {
        // Simulate purchase delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        result = { orderId: `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}` };
      } else {
        result = await ticketPurchaseService.purchaseTickets(eventId, {
          tierId: selectedTierId,
          quantity: quantities[selectedTierId],
          attendees,
          paymentMethod: 'airtel_money',
          agreeToTerms: true,
        });
      }
      
      setOrderId(result.orderId);
      setPurchaseComplete(true);
      toast.success('Tickets purchased successfully!');
      
      // Redirect to confirmation page after 2 seconds
      setTimeout(() => {
        router.push(`/order/confirmation/${result.orderId}`);
      }, 2000);
    } catch (error) {
      console.error('Purchase failed:', error);
      toast.error('Failed to complete purchase');
    } finally {
      setLoading(prev => ({ ...prev, purchase: false }));
    }
  };

  const selectedTier = tiers.find(t => t.id === selectedTierId);
  const selectedQuantity = selectedTierId ? quantities[selectedTierId] : 0;

  if (loading.tiers) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading ticket options...</p>
        </div>
      </div>
    );
  }

  if (purchaseComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Payment Successful!
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Your tickets have been purchased. A confirmation email has been sent.
          </p>
          <p className="text-xs mb-6" style={{ color: 'var(--text-secondary)' }}>
            Order ID: {orderId}
          </p>
          <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs mt-4" style={{ color: 'var(--text-secondary)' }}>
            Redirecting to confirmation page...
          </p>
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
            href={`/events/${eventId}`}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Complete Your Purchase
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Select tickets and provide attendee information
            </p>
          </div>
        </div>

        {/* Demo Mode Notice */}
        {useMockData && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              ℹ️ Demo Mode - Using sample ticket data. Connect to backend for live data.
            </p>
          </div>
        )}

        {/* Inventory Warning */}
        {tiers.some(t => (t.quantity - t.sold) <= 10 && (t.quantity - t.sold) > 0) && (
          <div className="mb-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 flex items-start gap-3">
            <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                Limited availability!
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                Some ticket tiers are selling fast. Complete your purchase soon to secure your spot.
              </p>
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Ticket Selection & Attendee Info */}
          <div className="lg:col-span-2 space-y-6">
            {!selectedTierId ? (
              <TicketTierSelector
                tiers={tiers}
                selectedTierId={selectedTierId}
                quantities={quantities}
                onSelectTier={selectTier}
                onQuantityChange={updateQuantity}
              />
            ) : (
              <>
                {/* Selected Tier Summary */}
                <div
                  className="rounded-xl p-4 border bg-primary-green-50 dark:bg-primary-green-900/20"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        Selected: {selectedTier?.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Quantity: {selectedQuantity}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTierId(null);
                        setAttendees([]);
                        setSummary(null);
                      }}
                      className="text-sm text-primary-green-500 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                </div>

                {/* Attendee Information Form */}
                <AttendeeInfoForm
                  attendees={attendees}
                  quantity={selectedQuantity}
                  onUpdateAttendee={updateAttendee}
                />
              </>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div>
            {selectedTierId && summary && (
              <OrderSummary
                summary={summary}
                tierName={selectedTier?.name || ''}
                quantity={selectedQuantity}
                onPaymentMethodChange={(method) => console.log('Payment method:', method)}
                onPromoCodeApply={handlePromoCodeApply}
                onSubmit={handlePurchase}
                loading={loading.purchase}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}