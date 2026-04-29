export interface Ticket {
  id: string;
  ticketNumber: string;
  qrCode: string;
  qrCodeDataUrl?: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone?: string;
  tierName: string;
  price: number;
  seatNumber?: string;
  gate?: string;
}

export interface OrderDetails {
  id: string;
  orderNumber: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventVenue: string;
  eventAddress: string;
  eventCity: string;
  eventImage: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  tickets: Ticket[];
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  subtotal: number;
  discount: number;
  fees: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'completed' | 'pending' | 'failed';
  purchasedAt: string;
}

export interface CalendarEvent {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}