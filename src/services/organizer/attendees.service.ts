import apiClient from '@/lib/api/client';
import { Attendee, AttendeeFilters, AttendeeStats } from '@/types/organizer/attendees';

// Mock data generator
const generateMockAttendees = (): Attendee[] => {
  const roles = ['MERCHANT', 'ORGANIZER', 'EMPLOYEE', 'APPROVER', 'FINANCE_OFFICER', 'ADMIN', 'PUBLIC'];
  const tiers = ['VIP', 'General Admission', 'Early Bird', 'Group Ticket'];
  const statuses = ['checked_in', 'not_checked_in', 'refunded', 'cancelled'];
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'James', 'Mary', 'Robert', 'Patricia'];
  const lastNames = ['Smith', 'Doe', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `attendee-${i + 1}`,
    ticketNumber: `TKT-${String(i + 1).padStart(5, '0')}`,
    firstName: firstNames[i % firstNames.length],
    lastName: lastNames[i % lastNames.length],
    email: `attendee${i + 1}@example.com`,
    phone: `+265 999 ${String(100 + i).padStart(3, '0')}`,
    role: roles[i % roles.length] as any,
    tierName: tiers[i % tiers.length],
    ticketPrice: [150000, 45000, 25000, 10000][i % 4],
    status: statuses[i % statuses.length] as any,
    checkedInAt: i % 3 === 0 ? new Date(Date.now() - (i * 3600000)).toISOString() : undefined,
    checkedInBy: i % 3 === 0 ? 'Event Staff' : undefined,
    purchaseDate: new Date(Date.now() - (i * 86400000)).toISOString(),
    specialRequests: i % 7 === 0 ? 'Vegetarian meal requested' : undefined,
    dietaryRestrictions: i % 10 === 0 ? ['Vegetarian', 'Gluten Free'] : undefined,
    emergencyContact: i % 5 === 0 ? {
      name: `Emergency Contact ${i + 1}`,
      phone: `+265 999 ${String(200 + i).padStart(3, '0')}`,
      relationship: 'Family',
    } : undefined,
  }));
};

class AttendeesService {
  private useMockData = true;
  private mockAttendees = generateMockAttendees();

  async getAttendees(eventId: string, filters?: AttendeeFilters): Promise<Attendee[]> {
    if (this.useMockData) {
      let filtered = [...this.mockAttendees];
      
      if (filters?.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(a => 
          `${a.firstName} ${a.lastName}`.toLowerCase().includes(search) ||
          a.email.toLowerCase().includes(search) ||
          a.ticketNumber.toLowerCase().includes(search)
        );
      }
      
      if (filters?.role && filters.role !== 'all') {
        filtered = filtered.filter(a => a.role === filters.role);
      }
      
      if (filters?.status && filters.status !== 'all') {
        filtered = filtered.filter(a => a.status === filters.status);
      }
      
      if (filters?.tierId && filters.tierId !== 'all') {
        const tierMap: Record<string, string> = {
          'vip': 'VIP',
          'general': 'General Admission',
          'early_bird': 'Early Bird',
          'group': 'Group Ticket',
        };
        filtered = filtered.filter(a => a.tierName === tierMap[filters.tierId!]);
      }
      
      return filtered;
    }
    
    const response = await apiClient.get(`/organizer/events/${eventId}/attendees`, { params: filters });
    return response.data.data;
  }

  async getAttendeeStats(eventId: string): Promise<AttendeeStats> {
    if (this.useMockData) {
      const attendees = this.mockAttendees;
      const roles = ['MERCHANT', 'ORGANIZER', 'EMPLOYEE', 'APPROVER', 'FINANCE_OFFICER', 'ADMIN', 'PUBLIC'];
      const tiers = ['VIP', 'General Admission', 'Early Bird', 'Group Ticket'];
      
      return {
        total: attendees.length,
        checkedIn: attendees.filter(a => a.status === 'checked_in').length,
        notCheckedIn: attendees.filter(a => a.status === 'not_checked_in').length,
        refunded: attendees.filter(a => a.status === 'refunded').length,
        cancelled: attendees.filter(a => a.status === 'cancelled').length,
        byRole: roles.map(role => ({
          role,
          count: attendees.filter(a => a.role === role).length,
          percentage: Math.round((attendees.filter(a => a.role === role).length / attendees.length) * 100),
          color: this.getRoleColor(role),
        })),
        byTier: tiers.map(tier => ({
          tierName: tier,
          count: attendees.filter(a => a.tierName === tier).length,
          percentage: Math.round((attendees.filter(a => a.tierName === tier).length / attendees.length) * 100),
        })),
      };
    }
    
    const response = await apiClient.get(`/organizer/events/${eventId}/attendees/stats`);
    return response.data.data;
  }

  async checkInAttendee(eventId: string, attendeeId: string): Promise<Attendee> {
    if (this.useMockData) {
      const index = this.mockAttendees.findIndex(a => a.id === attendeeId);
      if (index !== -1 && this.mockAttendees[index].status === 'not_checked_in') {
        this.mockAttendees[index] = {
          ...this.mockAttendees[index],
          status: 'checked_in',
          checkedInAt: new Date().toISOString(),
          checkedInBy: 'Staff Member',
        };
        return this.mockAttendees[index];
      }
      throw new Error('Attendee not found or already checked in');
    }
    
    const response = await apiClient.post(`/organizer/events/${eventId}/attendees/${attendeeId}/checkin`);
    return response.data.data;
  }

  async bulkCheckIn(eventId: string, attendeeIds: string[]): Promise<number> {
    if (this.useMockData) {
      let count = 0;
      for (const id of attendeeIds) {
        const index = this.mockAttendees.findIndex(a => a.id === id);
        if (index !== -1 && this.mockAttendees[index].status === 'not_checked_in') {
          this.mockAttendees[index] = {
            ...this.mockAttendees[index],
            status: 'checked_in',
            checkedInAt: new Date().toISOString(),
            checkedInBy: 'Staff Member',
          };
          count++;
        }
      }
      return count;
    }
    
    const response = await apiClient.post(`/organizer/events/${eventId}/attendees/bulk-checkin`, { attendeeIds });
    return response.data.data.count;
  }

  async exportAttendees(eventId: string, format: 'csv' | 'excel'): Promise<Blob> {
    if (this.useMockData) {
      const headers = ['Ticket Number', 'Name', 'Email', 'Phone', 'Role', 'Ticket Tier', 'Price', 'Status', 'Purchase Date'];
      const rows = this.mockAttendees.map(a => [
        a.ticketNumber,
        `${a.firstName} ${a.lastName}`,
        a.email,
        a.phone,
        a.role,
        a.tierName,
        a.ticketPrice.toString(),
        a.status,
        new Date(a.purchaseDate).toLocaleDateString(),
      ]);
      
      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
      return new Blob([csvContent], { type: 'text/csv' });
    }
    
    const response = await apiClient.post(`/organizer/events/${eventId}/attendees/export`, { format }, { responseType: 'blob' });
    return response.data;
  }

  async sendReminder(eventId: string, attendeeIds: string[]): Promise<void> {
    if (this.useMockData) {
      console.log(`Sending reminder to ${attendeeIds.length} attendees`);
      return;
    }
    
    await apiClient.post(`/organizer/events/${eventId}/attendees/send-reminder`, { attendeeIds });
  }

  private getRoleColor(role: string): string {
    const colors: Record<string, string> = {
      MERCHANT: '#10b981',
      ORGANIZER: '#3b82f6',
      EMPLOYEE: '#8b5cf6',
      APPROVER: '#f59e0b',
      FINANCE_OFFICER: '#06b6d4',
      ADMIN: '#ef4444',
      PUBLIC: '#6b7280',
    };
    return colors[role] || '#6b7280';
  }
}

export const attendeesService = new AttendeesService();