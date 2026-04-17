// src/hooks/useAuth.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
  login: (credentials: LoginCredentials) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to get user from auth service
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      // Use type assertion to handle avatar property
      setUser({
        id: (currentUser as any).id,
        firstName: (currentUser as any).firstName,
        lastName: (currentUser as any).lastName,
        email: currentUser.email,
        role: (currentUser as any).role,
        avatar: (currentUser as any).avatar || '', // Provide fallback
      });
    } else {
      // Mock user for development
      setUser({
        firstName: 'Leticia',
        lastName: 'Kanthiti',
        email: 'leticia@vaultstring.com',
        role: 'Senior Approver',
        avatar: '',
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);
      // Use type assertion for the result user
      setUser({
        id: (result.user as any).id,
        firstName: (result.user as any).firstName,
        lastName: (result.user as any).lastName,
        email: result.user.email,
        role: (result.user as any).role,
        avatar: (result.user as any).avatar || '',
      });
      // Redirect after successful login
      authService.redirectToDashboard(result.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.clearSession();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        logout, 
        login, 
        isLoading, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}