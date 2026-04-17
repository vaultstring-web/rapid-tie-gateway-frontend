'use client';

import { Users, Building2, Briefcase, UserCheck, Wallet, ShieldCheck, Globe } from 'lucide-react';

interface RoleFilterProps {
  selectedRole: string | undefined;
  onRoleChange: (role: string | undefined) => void;
}

const ROLES = [
  { value: undefined, label: 'All Users', icon: Globe, color: 'text-gray-500' },
  { value: 'MERCHANT', label: 'Merchants', icon: Building2, color: 'text-blue-500' },
  { value: 'ORGANIZER', label: 'Organizers', icon: Users, color: 'text-green-500' },
  { value: 'EMPLOYEE', label: 'Employees', icon: Briefcase, color: 'text-purple-500' },
  { value: 'APPROVER', label: 'Approvers', icon: UserCheck, color: 'text-orange-500' },
  { value: 'FINANCE_OFFICER', label: 'Finance', icon: Wallet, color: 'text-teal-500' },
  { value: 'ADMIN', label: 'Admins', icon: ShieldCheck, color: 'text-red-500' },
];

export const RoleFilter = ({ selectedRole, onRoleChange }: RoleFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {ROLES.map((role) => {
        const Icon = role.icon;
        const isSelected = selectedRole === role.value;
        return (
          <button
            key={role.value || 'all'}
            onClick={() => onRoleChange(role.value)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${isSelected 
                ? 'bg-primary-green-500 text-white shadow-md' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }
            `}
          >
            <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : role.color}`} />
            {role.label}
          </button>
        );
      })}
    </div>
  );
};