import apiClient from '@/lib/api/client';
import { Ticket, EventInfo, RoleSpecificQRConfig, BulkResendRequest, DeliveryStatus } from '@/types/events/qrCodeManagement';

class QRCodeManagementService {
  async getEventInfo(eventId: string): Promise<EventInfo> {
    const response = await apiClient.get(`/organizer/events/${eventId}/info`);
    return response.data.data;
  }

  async getTickets(eventId: string, role?: string): Promise<Ticket[]> {
    const response = await apiClient.get(`/organizer/events/${eventId}/tickets`, {
      params: { role },
    });
    return response.data.data;
  }

  async generateRoleQR(eventId: string, role: string): Promise<{ qrCode: string; dataUrl: string }> {
    const response = await apiClient.post(`/organizer/events/${eventId}/qrcodes/role`, { role });
    return response.data.data;
  }

  async resendTickets(eventId: string, ticketIds: string[], deliveryMethod: 'email' | 'sms'): Promise<DeliveryStatus[]> {
    const response = await apiClient.post(`/organizer/events/${eventId}/tickets/resend`, {
      ticketIds,
      deliveryMethod,
    });
    return response.data.data;
  }

  async regenerateQRCode(eventId: string, ticketId: string): Promise<{ qrCode: string; dataUrl: string }> {
    const response = await apiClient.post(`/organizer/events/${eventId}/tickets/${ticketId}/regenerate-qr`);
    return response.data.data;
  }

  async downloadTicketsPDF(eventId: string, ticketIds: string[]): Promise<Blob> {
    const response = await apiClient.post(
      `/organizer/events/${eventId}/tickets/download-pdf`,
      { ticketIds },
      { responseType: 'blob' }
    );
    return response.data;
  }

  async getDeliveryStatus(eventId: string): Promise<DeliveryStatus[]> {
    const response = await apiClient.get(`/organizer/events/${eventId}/delivery-status`);
    return response.data.data;
  }

  async sendReminders(eventId: string, ticketIds: string[]): Promise<void> {
    await apiClient.post(`/organizer/events/${eventId}/reminders`, { ticketIds });
  }
}

export const qrCodeManagementService = new QRCodeManagementService();