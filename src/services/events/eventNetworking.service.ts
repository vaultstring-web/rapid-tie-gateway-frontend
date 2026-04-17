import apiClient from '@/lib/api/client';
import { 
  SuggestedConnection, 
  ConnectionRequest, 
  Conversation, 
  Message,
  EventAttendeeList 
} from '@/types/events/eventNetworking';

class EventNetworkingService {
  // Get suggested connections
  async getSuggestions(eventId?: string): Promise<SuggestedConnection[]> {
    const response = await apiClient.get('/networking/suggestions', {
      params: { eventId }
    });
    return response.data.data;
  }

  // Send connection request
  async sendConnectionRequest(userId: string, message?: string): Promise<void> {
    await apiClient.post('/networking/connect', { userId, message });
  }

  // Accept connection request
  async acceptConnectionRequest(requestId: string): Promise<void> {
    await apiClient.post(`/networking/requests/${requestId}/accept`);
  }

  // Reject connection request
  async rejectConnectionRequest(requestId: string): Promise<void> {
    await apiClient.post(`/networking/requests/${requestId}/reject`);
  }

  // Get pending requests
  async getPendingRequests(): Promise<ConnectionRequest[]> {
    const response = await apiClient.get('/networking/requests/pending');
    return response.data.data;
  }

  // Get connections list
  async getConnections(): Promise<Attendee[]> {
    const response = await apiClient.get('/networking/connections');
    return response.data.data;
  }

  // Get conversations
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get('/networking/conversations');
    return response.data.data;
  }

  // Get messages for conversation
  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await apiClient.get(`/networking/conversations/${conversationId}/messages`);
    return response.data.data;
  }

  // Send message
  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const response = await apiClient.post(`/networking/conversations/${conversationId}/messages`, { content });
    return response.data.data;
  }

  // Get attendee list by event
  async getEventAttendees(eventId: string): Promise<EventAttendeeList> {
    const response = await apiClient.get(`/events/${eventId}/attendees`);
    return response.data.data;
  }

  // Get upcoming events for networking
  async getUpcomingEvents(): Promise<EventAttendeeList[]> {
    const response = await apiClient.get('/networking/upcoming-events');
    return response.data.data;
  }

  // Mark message as read
  async markAsRead(conversationId: string): Promise<void> {
    await apiClient.post(`/networking/conversations/${conversationId}/read`);
  }
}

export const eventNetworkingService = new EventNetworkingService();