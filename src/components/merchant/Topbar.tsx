"use client";

import { useState } from 'react';
import { Bell, Search, ChevronDown, Menu } from 'lucide-react';

export default function Topbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu size={20} />
        </button>
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search transactions, links, or events..." 
              className="w-full pl-10 h-10 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-[#84cc16] focus:ring-1 focus:ring-[#84cc16]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-2"></div>
        
        <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
          <span className="hidden sm:inline">English</span>
          <ChevronDown size={16} />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 p-4 lg:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 h-10 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-[#84cc16] focus:ring-1 focus:ring-[#84cc16]"
            />
          </div>
        </div>
      )}
    </header>
  );
}
