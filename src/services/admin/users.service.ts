import apiClient from '@/lib/api/client';
import { User, UserFilter, UserResponse, UserStats } from '@/types/admin/users';

class UsersService {
  async getUsers(page: number = 1, limit: number = 20, filters?: UserFilter): Promise<UserResponse> {
    const response = await apiClient.get('/admin/users', {
      params: { page, limit, ...filters },
    });
    return response.data.data;
  }

  async getUser(userId: string): Promise<User> {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data.data;
  }

  async getUserStats(): Promise<UserStats> {
    const response = await apiClient.get('/admin/users/stats');
    return response.data.data;
  }

  async updateUserRole(userId: string, role: string): Promise<void> {
    await apiClient.patch(`/admin/users/${userId}/role`, { role });
  }

  async updateUserStatus(userId: string, status: 'active' | 'inactive' | 'suspended'): Promise<void> {
    await apiClient.patch(`/admin/users/${userId}/status`, { status });
  }

  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`/admin/users/${userId}`);
  }

  async resendVerificationEmail(userId: string): Promise<void> {
    await apiClient.post(`/admin/users/${userId}/resend-verification`);
  }
}

export const usersService = new UsersService();