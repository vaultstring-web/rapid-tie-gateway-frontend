import apiClient from '@/lib/api/client';
import { 
  MessageRecipient, 
  RecipientFilter, 
  MessageTemplate,
  ScheduledMessage,
  SendHistory,
  SendMessageRequest,
  SendMessageResponse,
  RecipientCountResponse
} from '@/types/events/bulkMessaging';

class BulkMessagingService {
  async getRecipients(eventId: string, filter?: RecipientFilter): Promise<MessageRecipient[]> {
    const response = await apiClient.post(`/organizer/events/${eventId}/recipients`, filter || {});
    return response.data.data;
  }

  async getRecipientCount(eventId: string, filter: RecipientFilter): Promise<RecipientCountResponse> {
    const response = await apiClient.post(`/organizer/events/${eventId}/recipients/count`, filter);
    return response.data.data;
  }

  async sendMessage(eventId: string, request: SendMessageRequest): Promise<SendMessageResponse> {
    const response = await apiClient.post(`/organizer/events/${eventId}/communications/send`, request);
    return response.data.data;
  }

  async getTemplates(eventId: string): Promise<MessageTemplate[]> {
    const response = await apiClient.get(`/organizer/events/${eventId}/communications/templates`);
    return response.data.data;
  }

  async saveTemplate(eventId: string, template: Partial<MessageTemplate>): Promise<MessageTemplate> {
    const response = await apiClient.post(`/organizer/events/${eventId}/communications/templates`, template);
    return response.data.data;
  }

  async deleteTemplate(eventId: string, templateId: string): Promise<void> {
    await apiClient.delete(`/organizer/events/${eventId}/communications/templates/${templateId}`);
  }

  async getScheduledMessages(eventId: string): Promise<ScheduledMessage[]> {
    const response = await apiClient.get(`/organizer/events/${eventId}/communications/scheduled`);
    return response.data.data;
  }

  async cancelScheduledMessage(eventId: string, messageId: string): Promise<void> {
    await apiClient.delete(`/organizer/events/${eventId}/communications/scheduled/${messageId}`);
  }

  async getSendHistory(eventId: string, limit?: number): Promise<SendHistory[]> {
    const response = await apiClient.get(`/organizer/events/${eventId}/communications/history`, {
      params: { limit },
    });
    return response.data.data;
  }

  async sendTestMessage(eventId: string, request: SendMessageRequest): Promise<void> {
    await apiClient.post(`/organizer/events/${eventId}/communications/test`, request);
  }

  async getMessageStats(eventId: string, messageId: string): Promise<any> {
    const response = await apiClient.get(`/organizer/events/${eventId}/communications/${messageId}/stats`);
    return response.data.data;
  }
}

export const bulkMessagingService = new BulkMessagingService();