'use client';

import { useRef } from 'react';
import QRCode from 'react-qr-code';
import { Ticket as TicketIcon, Calendar, MapPin, User, Mail, Phone } from 'lucide-react';
import { Ticket } from '@/types/orders/orderConfirmation';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface QRTicketProps {
  ticket: Ticket;
  eventName: string;
  eventDate: string;
  eventVenue: string;
}

export const QRTicket = ({ ticket, eventName, eventDate, eventVenue }: QRTicketProps) => {
  const { theme } = useTheme();
  const ticketRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ticketRef}
      className="rounded-xl overflow-hidden border transition-all hover:shadow-lg"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* QR Code */}
          <div className="flex-shrink-0 flex justify-center">
            <div className="p-3 bg-white rounded-xl">
              <QRCode value={ticket.qrCode} size={120} />
            </div>
          </div>

          {/* Ticket Details */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  {eventName}
                </h3>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {ticket.tierName} Ticket
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                #{ticket.ticketNumber}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <User size={14} />
                <span>{ticket.attendeeName}</span>
              </div>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <Mail size={14} />
                <span>{ticket.attendeeEmail}</span>
              </div>
              {ticket.attendeePhone && (
                <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <Phone size={14} />
                  <span>{ticket.attendeePhone}</span>
                </div>
              )}
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <TicketIcon size={14} />
                <span>{formatCurrency(ticket.price)}</span>
              </div>
            </div>

            {ticket.seatNumber && (
              <div className="mt-2 p-2 rounded-lg inline-block bg-primary-green-100 dark:bg-primary-green-900/30">
                <span className="text-xs font-medium text-primary-green-700 dark:text-primary-green-300">
                  Seat: {ticket.seatNumber} | Gate: {ticket.gate || 'Main'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Event Info Footer */}
        <div className="mt-4 pt-3 border-t flex flex-wrap gap-3 text-xs" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{new Date(eventDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span>{eventVenue}</span>
          </div>
        </div>
      </div>
    </div>
  );
};