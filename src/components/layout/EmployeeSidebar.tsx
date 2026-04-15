"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/employee' },
  { icon: FileText, label: 'My Requests', path: '/employee/dsa/requests' },
  { icon: PlusCircle, label: 'New Request', path: '/employee/dsa/request' },
];

export default function EmployeeSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/employee' && pathname === '/employee') return true;
    if (path !== '/employee' && pathname?.startsWith(path)) return true;
    return false;
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={cn(
      "bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo Section */}
      <div className={cn(
        "p-6 border-b border-gray-200 flex items-center",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        <div className={cn(
          "flex items-center gap-3",
          isCollapsed && "justify-center"
        )}>
          <img 
            src="/vault.png" 
            alt="VaultString Logo" 
            className="w-8 h-8 object-contain"
          />
          {!isCollapsed && (
            <span className="text-xl font-bold text-gray-900">VaultString</span>
          )}
        </div>
        <button 
          onClick={toggleSidebar}
          className={cn(
            "p-1 rounded-lg hover:bg-gray-100 transition-colors",
            isCollapsed && "absolute -right-3 bg-white border border-gray-200 shadow-sm"
          )}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className={cn(
          "text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2",
          isCollapsed && "text-center text-[10px]"
        )}>
          {!isCollapsed ? "Main Menu" : "•••"}
        </div>
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive(item.path) 
                ? "bg-[#84cc16]/10 text-[#84cc16]" 
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              isCollapsed && "justify-center"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon size={18} className="shrink-0" />
            {!isCollapsed && item.label}
          </Link>
        ))}
      </nav>

      {/* Profile Section at bottom */}
      <div className={cn(
        "p-4 border-t border-gray-200",
        isCollapsed && "flex justify-center"
      )}>
        <Link 
          href="/employee/profile"
          className={cn(
            "flex items-center gap-3 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors w-full",
            isCollapsed && "justify-center"
          )}
        >
          <img 
            src="https://i.pravatar.cc/150?u=leticia" 
            alt="Profile" 
            className="w-8 h-8 rounded-full shrink-0"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Leticia K.</p>
              <p className="text-xs text-gray-500 truncate">leticia@vaultstring.org</p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
