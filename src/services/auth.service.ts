import apiClient from '@/lib/api/client';
import { signOut } from 'next-auth/react';
import { LoginCredentials, LoginResponse, SessionData, User } from '@/types/auth';
import { RegistrationData, RegistrationResponse } from '@/types/registration';
import { ValidateTokenResponse } from '@/types/passwordReset';

const SESSION_KEY = 'rapid_tie_session';
const REFRESH_TOKEN_KEY = 'rapid_tie_refresh_token';
const REMEMBER_ME_KEY = 'rapid_tie_remember_me';

class AuthService {
  async login(
    credentials: LoginCredentials
  ): Promise<{ user: User; token: string; refreshToken: string }> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email: credentials.email,
        phone: credentials.phone,
        password: credentials.password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }

      const { user, token, refreshToken } = response.data.data;
      this.setSession(user, token, refreshToken, credentials.rememberMe ?? false);

      return { user, token, refreshToken };
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Invalid email/phone or password';
      throw new Error(message);
    }
  }

  setSession(user: User, token: string, refreshToken: string, rememberMe = false): void {
    const expiresAt = Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000;
    const sessionData: SessionData = { user, token, refreshToken, expiresAt };

    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(REMEMBER_ME_KEY, String(rememberMe));

    document.cookie = `token=${token}; path=/; max-age=${rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60}; SameSite=Lax`;
  }

  getSession(): SessionData | null {
    try {
      const sessionStr = localStorage.getItem(SESSION_KEY);
      if (!sessionStr) return null;

      const session = JSON.parse(sessionStr) as SessionData;

      if (session.expiresAt < Date.now()) {
        this.clearSession();
        return null;
      }

      return session;
    } catch {
      return null;
    }
  }

  getCurrentUser(): User | null {
    return this.getSession()?.user ?? null;
  }

  getToken(): string | null {
    return this.getSession()?.token ?? null;
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  getRememberMe(): boolean {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
  }

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  async clearSession(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore
    }

    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

    await signOut({ redirect: false }).catch(() => {});
  }

  async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await apiClient.post('/auth/refresh-token', { refreshToken });
      if (response.data.success) {
        const newToken = response.data.data.token;
        const newRefreshToken = response.data.data.refreshToken;
        const session = this.getSession();

        if (session) {
          this.setSession(session.user, newToken, newRefreshToken, this.getRememberMe());
        }

        return newToken;
      }
      return null;
    } catch {
      await this.clearSession();
      return null;
    }
  }

  async register(registrationData: RegistrationData): Promise<RegistrationResponse> {
    try {
      const response = await apiClient.post<RegistrationResponse>(
        '/auth/register',
        registrationData
      );
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed');
      }
      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Registration failed';
      throw new Error(message);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, password });
  }

  async validateResetToken(token: string): Promise<ValidateTokenResponse> {
    const response = await apiClient.get<ValidateTokenResponse>(
      `/auth/validate-reset-token?token=${encodeURIComponent(token)}`
    );
    return response.data;
  }

  getDashboardUrl(user: User): string {
    switch (user.role) {
      case 'MERCHANT':
        return '/merchant';
      case 'ORGANIZER':
        return '/organizer';
      case 'EMPLOYEE':
        return '/employee';
      case 'APPROVER':
        return '/approver';
      case 'FINANCE_OFFICER':
        return '/finance';
      case 'ADMIN':
        return '/dashboard/admin';
      case 'COMPLIANCE':
        return '/dashboard/compliance';
      default:
        return '/dashboard';
    }
  }

  redirectToDashboard(user: User): void {
    const url = this.getDashboardUrl(user);
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  }
}

export const authService = new AuthService();