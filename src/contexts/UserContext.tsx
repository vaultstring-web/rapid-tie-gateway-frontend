// contexts/UserContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  phone: string;
  role: string;
  joinDate: string;
  avatar: string;
}

interface UserContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  updateAvatar: (avatarUrl: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({
    name: "Tiwonge Kumwenda",
    email: "tiwonge.k@vaultstring.mw",
    phone: "+265 888 123 456",
    role: "Developer",
    joinDate: "Member since Oct 2024",
    avatar: "https://picsum.photos/seed/user123/200/200"
  });

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('userProfile');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save to localStorage whenever user changes
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(user));
  }, [user]);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const updateAvatar = (avatarUrl: string) => {
    setUser(prev => ({ ...prev, avatar: avatarUrl }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, updateAvatar }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}