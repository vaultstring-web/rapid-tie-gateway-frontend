'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Download, Mail, Smartphone, Calendar, Ticket, Home, Printer } from 'lucide-react';
import { QRTicket } from '@/components/orders/QRTicket';
import { ConfettiEffect } from '@/components/orders/ConfettiEffect';
import { AddToCalendar } from '@/components/orders/AddToCalendar';
import { orderConfirmationService } from '@/services/orders/orderConfirmation.service';
import { OrderDetails, CalendarEvent } from '@/types/orders/orderConfirmation';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

export default function OrderConfirmationPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState({ email: false, sms: false });
  const [downloading, setDownloading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await orderConfirmationService.getOrderDetails(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleResendTickets = async (method: 'email' | 'sms') => {
    setResending(prev => ({ ...prev, [method]: true }));
    try {
      await orderConfirmationService.resendTickets(orderId, method);
      toast.success(`Tickets resent via ${method.toUpperCase()}`);
    } catch (error) {
      toast.error(`Failed to resend tickets via ${method.toUpperCase()}`);
    } finally {
      setResending(prev => ({ ...prev, [method]: false }));
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const blob = await orderConfirmationService.downloadTicketsPDF(orderId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tickets-${order?.orderNumber || orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Tickets downloaded');
    } catch (error) {
      toast.error('Failed to download tickets');
    } finally {
      setDownloading(false);
    }
  };

  const handleAddToCalendar = async () => {
    // Already handled in component
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading order details...</p>
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

  const calendarEvent: CalendarEvent = {
    title: order.eventName,
    startDate: order.eventDate,
    endDate: order.eventDate,
    location: `${order.eventVenue}, ${order.eventAddress}, ${order.eventCity}`,
    description: `Tickets purchased for ${order.eventName}. Order #${order.orderNumber}`,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <ConfettiEffect active={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Order Confirmed! 🎉
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Thank you for your purchase. Your tickets have been sent to {order.buyerEmail}
          </p>
          <p className="text-xs mt-2 font-mono" style={{ color: 'var(--text-secondary)' }}>
            Order #{order.orderNumber}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => handleResendTickets('email')}
            disabled={resending.email}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            {resending.email ? (
              <div className="w-4 h-4 border-2 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Mail size={16} />
            )}
            Resend Email
          </button>
          
          <button
            onClick={() => handleResendTickets('sms')}
            disabled={resending.sms}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            {resending.sms ? (
              <div className="w-4 h-4 border-2 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Smartphone size={16} />
            )}
            Resend SMS
          </button>

          <AddToCalendar event={calendarEvent} onAdd={handleAddToCalendar} />

          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            {downloading ? (
              <div className="w-4 h-4 border-2 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download size={16} />
            )}
            Download PDF
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Printer size={16} />
            Print
          </button>
        </div>

        {/* Order Summary Card */}
        <div
          className="rounded-xl p-5 border mb-6"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Order Summary
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Event:</span>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{order.eventName}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Date:</span>
              <span style={{ color: 'var(--text-primary)' }}>{formatDate(order.eventDate)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Venue:</span>
              <span style={{ color: 'var(--text-primary)' }}>{order.eventVenue}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Buyer:</span>
              <span style={{ color: 'var(--text-primary)' }}>{order.buyerName}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Payment Method:</span>
              <span style={{ color: 'var(--text-primary)' }}>{order.paymentMethod}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-bold">
              <span style={{ color: 'var(--text-primary)' }}>Total Paid:</span>
              <span className="text-primary-green-500">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Tickets Section */}
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Ticket size={20} />
          Your Tickets ({order.tickets.length})
        </h2>

        <div className="space-y-4 mb-8">
          {order.tickets.map((ticket) => (
            <QRTicket
              key={ticket.id}
              ticket={ticket}
              eventName={order.eventName}
              eventDate={order.eventDate}
              eventVenue={order.eventVenue}
            />
          ))}
        </div>

        {/* Important Information */}
        <div
          className="rounded-xl p-5 border mb-6"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            📌 Important Information
          </h3>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li>• Please arrive at least 30 minutes before the event start time.</li>
            <li>• Have your QR code ready for scanning at the entrance.</li>
            <li>• Each ticket is valid for one-time entry only.</li>
            <li>• For any assistance, contact the organizer at {order.organizerEmail}</li>
          </ul>
        </div>

        {/* Help Section */}
        <div className="text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-primary-green-500 hover:underline"
          >
            <Home size={16} />
            Browse More Events
          </Link>
        </div>
      </div>
    </div>
  );
}