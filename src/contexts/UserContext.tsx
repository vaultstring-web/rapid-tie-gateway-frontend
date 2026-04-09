'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserData {
  name: string;
  email: string;
  position: string;
  department: string;
  location: string;
  phone: string;
  employeeId: string;
  profileImage: string | null;
}

interface UserContextType {
  user: UserData;
  updateUser: (data: Partial<UserData>) => void;
}

const defaultUser: UserData = {
  name: 'Leticia Kanthiti',
  email: 'leticia.kanthiti@vaultstring.org',
  position: 'Senior Approver',
  department: 'Finance & Compliance',
  location: 'Lilongwe, Malawi',
  phone: '+265 888 123 456',
  employeeId: 'EMP-2024-001',
  profileImage: null,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData>(defaultUser);

  useEffect(() => {
    // Load saved user data from localStorage
    const savedName = localStorage.getItem('approver_name');
    const savedEmail = localStorage.getItem('approver_email');
    const savedPosition = localStorage.getItem('approver_position');
    const savedDepartment = localStorage.getItem('approver_department');
    const savedLocation = localStorage.getItem('approver_location');
    const savedPhone = localStorage.getItem('approver_phone');
    const savedImage = localStorage.getItem('approver_profile_image');

    setUser({
      name: savedName || defaultUser.name,
      email: savedEmail || defaultUser.email,
      position: savedPosition || defaultUser.position,
      department: savedDepartment || defaultUser.department,
      location: savedLocation || defaultUser.location,
      phone: savedPhone || defaultUser.phone,
      employeeId: defaultUser.employeeId,
      profileImage: savedImage || null,
    });
  }, []);

  const updateUser = (data: Partial<UserData>) => {
    setUser(prev => {
      const updated = { ...prev, ...data };
      
      // Save to localStorage
      if (data.name) localStorage.setItem('approver_name', data.name);
      if (data.email) localStorage.setItem('approver_email', data.email);
      if (data.position) localStorage.setItem('approver_position', data.position);
      if (data.department) localStorage.setItem('approver_department', data.department);
      if (data.location) localStorage.setItem('approver_location', data.location);
      if (data.phone) localStorage.setItem('approver_phone', data.phone);
      if (data.profileImage !== undefined) {
        if (data.profileImage) {
          localStorage.setItem('approver_profile_image', data.profileImage);
        } else {
          localStorage.removeItem('approver_profile_image');
        }
      }
      
      return updated;
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
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
