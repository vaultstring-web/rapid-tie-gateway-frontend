'use client';

import { useState } from 'react';
import { Bell, Search, ChevronDown, Menu } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

export default function TopBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();

  const getInitials = () => {
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900">{user.name}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user.position}</p>
          </div>
          {user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.name} 
              className="h-10 w-10 rounded-xl object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-xl bg-lime-100 text-lime-600 flex items-center justify-center text-sm font-bold">
              {getInitials()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
