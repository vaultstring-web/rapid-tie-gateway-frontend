// src/contexts/UserContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserData {
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  location: string;
  employeeId: string;
  joinDate: string;
  bio: string;
  profileImage: string | null;
}

interface UserContextType {
  user: UserData;
  updateUser: (data: Partial<UserData>) => void;
  updateProfileImage: (imageUrl: string | null) => void;
}

const defaultUser: UserData = {
  name: 'Leticia Kanthiti',
  email: 'leticia.kanthiti@vaultstring.com',
  phone: '+265 888 123 456',
  position: 'Finance Manager',
  department: 'Finance',
  location: 'Lilongwe, Malawi',
  employeeId: 'VST-FIN-001',
  joinDate: '2022-01-15',
  bio: 'Senior Finance Manager with over 8 years of experience in financial management, budget tracking, and disbursement operations.',
  profileImage: null,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>(defaultUser);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('userProfile');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const updateUser = (data: Partial<UserData>) => {
    setUser(prev => {
      const updated = { ...prev, ...data };
      localStorage.setItem('userProfile', JSON.stringify(updated));
      return updated;
    });
  };

  const updateProfileImage = (imageUrl: string | null) => {
    setUser(prev => {
      const updated = { ...prev, profileImage: imageUrl };
      localStorage.setItem('userProfile', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser, updateProfileImage }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}