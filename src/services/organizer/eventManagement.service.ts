import apiClient from '@/lib/api/client';
import { 
  Event, 
  Attendee, 
  CheckinStats, 
  CheckinRecord,
  SalesMetrics,
  RevenueData,
  SalesByTier,
  RecentOrder,
  SendMessageRequest,
  DashboardStats,
  VisibilityMetrics
} from '@/types/organizer/eventManagement';

// Mock data generators
const generateMockEvents = (): Event[] => {
  return [
    {
      id: '1',
      name: 'Malawi Fintech Expo 2026',
      description: 'The largest fintech conference in Malawi',
      shortDescription: 'Annual fintech conference',
      category: 'conference',
      type: 'public',
      status: 'published',
      startDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 8 * 86400000).toISOString(),
      venue: 'BICC',
      city: 'Lilongwe',
      address: 'Convention Drive',
      imageUrl: 'https://picsum.photos/seed/event1/400/200',
      capacity: 1000,
      ticketTiers: [
        { id: 't1', name: 'VIP', description: 'Full access', price: 150000, quantity: 100, sold: 45, maxPerPerson: 4, benefits: ['Backstage', 'VIP Lounge'], isActive: true },
        { id: 't2', name: 'Standard', description: 'Standard access', price: 45000, quantity: 500, sold: 320, maxPerPerson: 10, benefits: ['Standard Entry'], isActive: true },
      ],
      visibilityMetrics: { total: 2450, MERCHANT: 850, ORGANIZER: 120, EMPLOYEE: 450, APPROVER: 80, FINANCE_OFFICER: 50, ADMIN: 10, PUBLIC: 890 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Tech Innovation Summit',
      description: 'Bringing together tech entrepreneurs',
      shortDescription: 'Tech summit',
      category: 'conference',
      type: 'public',
      status: 'published',
      startDate: new Date(Date.now() + 14 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 15 * 86400000).toISOString(),
      venue: 'Sunbird Mount Soche',
      city: 'Blantyre',
      address: 'Glyn Jones Road',
      imageUrl: 'https://picsum.photos/seed/event2/400/200',
      capacity: 600,
      ticketTiers: [
        { id: 't1', name: 'VIP', description: 'VIP access', price: 85000, quantity: 100, sold: 78, maxPerPerson: 4, benefits: ['VIP Lounge', 'Networking'], isActive: true },
        { id: 't2', name: 'Regular', description: 'Regular access', price: 35000, quantity: 400, sold: 210, maxPerPerson: 10, benefits: ['Conference Access'], isActive: true },
      ],
      visibilityMetrics: { total: 1820, MERCHANT: 620, ORGANIZER: 95, EMPLOYEE: 380, APPROVER: 60, FINANCE_OFFICER: 35, ADMIN: 8, PUBLIC: 622 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Developer Workshop',
      description: 'Hands-on workshops for developers',
      shortDescription: 'Developer workshop',
      category: 'workshop',
      type: 'public',
      status: 'draft',
      startDate: new Date(Date.now() + 21 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 22 * 86400000).toISOString(),
      venue: 'Virtual',
      city: 'Online',
      address: 'Online',
      imageUrl: 'https://picsum.photos/seed/event3/400/200',
      capacity: 300,
      ticketTiers: [
        { id: 't1', name: 'Early Bird', description: 'Early bird discount', price: 15000, quantity: 100, sold: 45, maxPerPerson: 3, benefits: ['Certificate', 'Materials'], isActive: true },
      ],
      visibilityMetrics: { total: 340, MERCHANT: 120, ORGANIZER: 45, EMPLOYEE: 95, APPROVER: 20, FINANCE_OFFICER: 10, ADMIN: 5, PUBLIC: 45 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

class EventManagementService {
  private useMockData = true;

  async getEvents(): Promise<Event[]> {
    if (this.useMockData) {
      return generateMockEvents();
    }
    const response = await apiClient.get('/organizer/events');
    return response.data.data;
  }

  async getEvent(eventId: string): Promise<Event> {
    if (this.useMockData) {
      const events = generateMockEvents();
      const event = events.find(e => e.id === eventId);
      if (!event) throw new Error('Event not found');
      return event;
    }
    const response = await apiClient.get(`/organizer/events/${eventId}`);
    return response.data.data;
  }

  async updateEvent(eventId: string, data: Partial<Event>): Promise<Event> {
    if (this.useMockData) {
      const events = generateMockEvents();
      const event = events.find(e => e.id === eventId);
      if (!event) throw new Error('Event not found');
      return { ...event, ...data, updatedAt: new Date().toISOString() };
    }
    const response = await apiClient.put(`/organizer/events/${eventId}`, data);
    return response.data.data;
  }

  async deleteEvent(eventId: string): Promise<void> {
    if (this.useMockData) {
      return;
    }
    await apiClient.delete(`/organizer/events/${eventId}`);
  }

  async updateEventStatus(eventId: string, status: Event['status']): Promise<void> {
    if (this.useMockData) {
      return;
    }
    await apiClient.patch(`/organizer/events/${eventId}/status`, { status });
  }

  async getAttendees(eventId: string): Promise<Attendee[]> {
    const roles = ['MERCHANT', 'ORGANIZER', 'EMPLOYEE', 'APPROVER', 'FINANCE_OFFICER', 'ADMIN', 'PUBLIC'];
    const tiers = ['VIP', 'General Admission', 'Early Bird', 'Group Ticket'];
    const statuses = ['checked_in', 'not_checked_in', 'refunded', 'cancelled'];
    
    return Array.from({ length: 25 }, (_, i) => ({
      id: `attendee-${i + 1}`,
      ticketNumber: `TKT-${String(i + 1).padStart(4, '0')}`,
      firstName: ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa'][i % 6],
      lastName: ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown', 'Jones'][i % 6],
      email: `attendee${i + 1}@example.com`,
      phone: `+265 999 ${String(i + 100).padStart(3, '0')}`,
      role: roles[i % roles.length],
      tierName: tiers[i % tiers.length],
      ticketPrice: [150000, 45000, 25000, 10000][i % 4],
      status: statuses[i % statuses.length] as any,
      checkedInAt: i % 3 === 0 ? new Date().toISOString() : undefined,
      purchaseDate: new Date(Date.now() - i * 86400000).toISOString(),
    }));
  }

  async getCheckinStats(eventId: string): Promise<CheckinStats> {
    return {
      total: 1250,
      checkedIn: 678,
      percentage: 54,
      byRole: [
        { role: 'MERCHANT', total: 450, checkedIn: 245, percentage: 54, color: '#10b981' },
        { role: 'ORGANIZER', total: 120, checkedIn: 89, percentage: 74, color: '#3b82f6' },
        { role: 'EMPLOYEE', total: 300, checkedIn: 156, percentage: 52, color: '#8b5cf6' },
        { role: 'APPROVER', total: 80, checkedIn: 45, percentage: 56, color: '#f59e0b' },
        { role: 'FINANCE_OFFICER', total: 50, checkedIn: 32, percentage: 64, color: '#06b6d4' },
        { role: 'ADMIN', total: 10, checkedIn: 8, percentage: 80, color: '#ef4444' },
        { role: 'PUBLIC', total: 240, checkedIn: 103, percentage: 43, color: '#6b7280' },
      ],
    };
  }

  async checkinAttendee(eventId: string, ticketNumber: string): Promise<CheckinRecord> {
    return {
      id: Date.now().toString(),
      attendeeName: 'Demo Attendee',
      ticketNumber,
      tierName: 'General Admission',
      checkedInAt: new Date().toLocaleTimeString(),
      method: 'manual',
    };
  }

  async getSalesMetrics(eventId: string): Promise<SalesMetrics> {
    return {
      totalRevenue: 12500000,
      totalTicketsSold: 1250,
      totalAttendees: 1180,
      averageTicketPrice: 10000,
      revenueChange: 12.5,
      ticketsSoldChange: 8.3,
      capacityPercentage: 78,
    };
  }

  async getRevenueData(eventId: string): Promise<RevenueData[]> {
    return [
      { date: 'Mon', revenue: 1250000, tickets: 28 },
      { date: 'Tue', revenue: 1580000, tickets: 35 },
      { date: 'Wed', revenue: 2100000, tickets: 42 },
      { date: 'Thu', revenue: 1850000, tickets: 39 },
      { date: 'Fri', revenue: 2450000, tickets: 51 },
      { date: 'Sat', revenue: 2980000, tickets: 62 },
    ];
  }

  async getSalesByTier(eventId: string): Promise<SalesByTier[]> {
    return [
      { tierName: 'VIP', sold: 150, revenue: 7500000, percentage: 45, color: '#84cc16' },
      { tierName: 'General Admission', sold: 800, revenue: 3600000, percentage: 64, color: '#3b82f6' },
      { tierName: 'Early Bird', sold: 200, revenue: 1000000, percentage: 100, color: '#f59e0b' },
    ];
  }

  async getRecentOrders(eventId: string): Promise<RecentOrder[]> {
    return [
      { id: '1', orderNumber: 'ORD-001', customerName: 'John Doe', tierName: 'VIP', amount: 150000, status: 'completed', purchasedAt: new Date().toISOString() },
      { id: '2', orderNumber: 'ORD-002', customerName: 'Jane Smith', tierName: 'General Admission', amount: 45000, status: 'completed', purchasedAt: new Date().toISOString() },
      { id: '3', orderNumber: 'ORD-003', customerName: 'Mike Johnson', tierName: 'Early Bird', amount: 25000, status: 'pending', purchasedAt: new Date().toISOString() },
    ];
  }

  async sendBulkMessage(eventId: string, request: SendMessageRequest): Promise<void> {
    if (this.useMockData) {
      console.log('Message sent:', request);
      return;
    }
    await apiClient.post(`/organizer/events/${eventId}/communications`, request);
  }

  async getTicketTiers(eventId: string): Promise<TicketTier[]> {
    return [
      { id: 't1', name: 'VIP', description: 'Full access', price: 150000, quantity: 100, sold: 45, maxPerPerson: 4, benefits: ['Backstage', 'VIP Lounge'], isActive: true },
      { id: 't2', name: 'General Admission', description: 'Standard access', price: 45000, quantity: 500, sold: 320, maxPerPerson: 10, benefits: ['Standard Entry'], isActive: true },
      { id: 't3', name: 'Early Bird', description: 'Limited time offer', price: 25000, quantity: 200, sold: 187, maxPerPerson: 6, benefits: ['Early Entry'], isActive: true },
    ];
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return {
      totalEvents: 12,
      publishedEvents: 8,
      totalTicketsSold: 3450,
      totalRevenue: 42500000,
      totalViews: 15680,
      conversionRate: 22.5,
      upcomingEventsCount: 5,
    };
  }
}

export const eventManagementService = new EventManagementService();