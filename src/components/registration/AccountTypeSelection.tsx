'use client';

import { motion } from 'framer-motion';
import {
  ShoppingBagIcon,
  TicketIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { AccountType, AccountTypeInfo } from '@/types/registration';

interface AccountTypeSelectionProps {
  selectedType: AccountType | null;
  onSelect: (type: AccountType) => void;
  error?: string;
}

const accountTypes: AccountTypeInfo[] = [
  {
    id: 'MERCHANT',
    title: 'Merchant',
    description: 'Accept payments for your online store or business',
    icon: 'shopping-bag',
    features: [
      'Payment links & checkout widget',
      'Transaction dashboard',
      'API access',
      'Refund management',
    ],
    color: 'green',
    gradient: 'from-primary-green-500 to-primary-green-600',
  },
  {
    id: 'ORGANIZER',
    title: 'Event Organizer',
    description: 'Sell tickets and manage events',
    icon: 'ticket',
    features: [
      'Custom event pages',
      'QR code tickets',
      'Mobile check-in app',
      'Attendee management',
    ],
    color: 'blue',
    gradient: 'from-primary-blue-500 to-primary-blue-600',
  },
  {
    id: 'EMPLOYEE',
    title: 'Organization',
    description: 'For government, NGOs, and companies to manage DSA',
    icon: 'building',
    features: [
      'Bulk DSA disbursements',
      'Approval workflows',
      'Compliance reporting',
      'Budget tracking',
    ],
    color: 'green',
    gradient: 'from-primary-green-600 to-primary-green-700',
  },
];

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'shopping-bag':
      return <ShoppingBagIcon className="w-8 h-8" />;
    case 'ticket':
      return <TicketIcon className="w-8 h-8" />;
    case 'building':
      return <BuildingOfficeIcon className="w-8 h-8" />;
    default:
      return <ShoppingBagIcon className="w-8 h-8" />;
  }
};

export const AccountTypeSelection = ({
  selectedType,
  onSelect,
  error,
}: AccountTypeSelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-h3 font-bold text-neutral-900 mb-2">Choose Your Account Type</h2>
        <p className="text-body text-neutral-600">
          Select the account type that best describes your needs
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {accountTypes.map((type, index) => (
          <motion.button
            key={type.id}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => onSelect(type.id)}
            className={`
              relative rounded-xl border p-6 text-left transition-all duration-300
              ${selectedType === type.id ? 'ring-2 ring-primary-green-500 shadow-lg scale-[1.02]' : 'hover:shadow-md hover:scale-[1.01]'}
            `}
          >
            <div
              className={`absolute inset-0 rounded-xl bg-gradient-to-br ${type.gradient} opacity-0 ${selectedType === type.id ? 'opacity-5' : ''}`}
            />

            <div className="relative bg-neutral-0 rounded-xl h-full min-h-[240px]">
              {selectedType === type.id && (
                <div className="absolute top-4 right-4">
                  <CheckCircleIcon className="w-6 h-6 text-primary-green-500" />
                </div>
              )}

              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                  type.id === 'MERCHANT'
                    ? 'bg-primary-green-100 text-primary-green-500'
                    : type.id === 'ORGANIZER'
                      ? 'bg-primary-blue-100 text-primary-blue-500'
                      : 'bg-primary-green-100 text-primary-green-500'
                }`}
              >
                {getIcon(type.icon)}
              </div>

              <h3 className="text-h5 font-bold text-neutral-900 mb-2">{type.title}</h3>
              <p className="text-body-sm text-neutral-600 mb-4">{type.description}</p>

              <ul className="space-y-2">
                {type.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-caption text-neutral-500"
                  >
                    <span className="w-1.5 h-1.5 bg-primary-green-500 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </motion.button>
        ))}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="error-text text-center mt-4"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};
