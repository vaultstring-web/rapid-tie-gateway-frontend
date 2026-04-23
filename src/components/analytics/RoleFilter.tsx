'use client';

import { Users, Building2, Briefcase, UserCheck, Wallet, ShieldCheck, Globe } from 'lucide-react';

interface RoleFilterProps {
  selectedRole: string | undefined;
  onRoleChange: (role: string | undefined) => void;
}

const ROLES = [
  { value: undefined, label: 'All Users', icon: Globe },
  { value: 'MERCHANT', label: 'Merchants', icon: Building2 },
  { value: 'ORGANIZER', label: 'Organizers', icon: Users },
  { value: 'EMPLOYEE', label: 'Employees', icon: Briefcase },
  { value: 'APPROVER', label: 'Approvers', icon: UserCheck },
  { value: 'FINANCE_OFFICER', label: 'Finance', icon: Wallet },
  { value: 'ADMIN', label: 'Admins', icon: ShieldCheck },
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
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${
                isSelected
                  ? 'bg-primary-green-500 text-green shadow-md'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-primary-green-500/10 hover:border-primary-green-500/50'
              }
            `}
          >
            <Icon
              className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-primary-green-600 white:text-primary-green-400'}`}
            />
            {role.label}
          </button>
        );
      })}
    </div>
  );
};
