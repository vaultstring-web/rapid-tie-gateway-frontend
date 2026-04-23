'use client';

import { useState } from 'react';
import { Check, CreditCard, Smartphone, Landmark } from 'lucide-react';
import { PaymentMethod, PaymentField } from '@/types/events/checkout';
import { useTheme } from '@/context/ThemeContext';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: () => void;
  onDataChange: (data: Record<string, string>) => void;
}

const getMethodIcon = (icon: string) => {
  switch (icon) {
    case '📱': return <Smartphone size={24} />;
    case '💳': return <CreditCard size={24} />;
    case '🏦': return <Landmark size={24} />;
    default: return <CreditCard size={24} />;
  }
};

export const PaymentMethodCard = ({ method, isSelected, onSelect, onDataChange }: PaymentMethodCardProps) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleFieldChange = (name: string, value: string) => {
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  return (
    <div
      className={`rounded-xl border transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-primary-green-500' : 'hover:shadow-md'
      }`}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
      onClick={onSelect}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div style={{ color: method.color }}>{getMethodIcon(method.icon)}</div>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {method.name}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {method.description}
            </p>
          </div>
        </div>
        {isSelected && <Check size={20} className="text-primary-green-500" />}
      </div>

      {isSelected && method.fields && method.fields.length > 0 && (
        <div className="p-4 pt-0 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="space-y-3 mt-3">
            {method.fields.map((field) => (
              <div key={field.name}>
                <label className="text-sm font-medium mb-1 block" style={{ color: 'var(--text-primary)' }}>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="input w-full"
                  required={field.required}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};