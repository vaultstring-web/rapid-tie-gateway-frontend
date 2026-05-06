'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, Tag, DollarSign, Users, Clock, Check, X } from 'lucide-react';
import { TicketTierInput } from '@/types/organizer/createEvent';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface TicketsStepProps {
  ticketTiers: TicketTierInput[];
  onChange: (ticketTiers: TicketTierInput[]) => void;
  errors: Record<string, string>;
}

const defaultTicketTier: TicketTierInput = {
  name: '',
  description: '',
  price: 0,
  quantity: 0,
  maxPerPerson: 10,
  benefits: [],
  isActive: true,
};

interface TicketTierModalProps {
  isOpen: boolean;
  tier: TicketTierInput | null;
  onSave: (tier: TicketTierInput) => void;
  onClose: () => void;
}

const TicketTierModal = ({ isOpen, tier, onSave, onClose }: TicketTierModalProps) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<TicketTierInput>(tier || defaultTicketTier);
  const [benefitInput, setBenefitInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Tier name is required';
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';
    if (formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()]
      }));
      setBenefitInput('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          borderWidth: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            {tier ? 'Edit Ticket Tier' : 'Add Ticket Tier'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Tier Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              placeholder="e.g., VIP, General Admission"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              placeholder="What's included in this ticket?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Price (MWK) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                min={0}
                step={1000}
              />
              {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Quantity *</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                min={1}
              />
              {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Max Per Person</label>
            <input
              type="number"
              value={formData.maxPerPerson}
              onChange={(e) => setFormData(prev => ({ ...prev, maxPerPerson: parseInt(e.target.value) || 1 }))}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              min={1}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Benefits</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                placeholder="e.g., Early Entry, VIP Lounge"
                onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
              />
              <button
                onClick={addBenefit}
                className="px-4 py-2 rounded-lg bg-[#84cc16] text-white hover:brightness-110"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {formData.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[var(--hover-bg)]">
                  <span className="text-sm text-[var(--text-primary)]">{benefit}</span>
                  <button onClick={() => removeBenefit(idx)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded">
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
            />
            <span className="text-sm text-[var(--text-primary)]">Active (available for purchase)</span>
          </label>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-[var(--border-color)]">
          <button onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-primary)]">
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 px-4 py-2 rounded-lg bg-[#84cc16] text-white hover:brightness-110">
            Save Tier
          </button>
        </div>
      </div>
    </div>
  );
};

export const TicketsStep = ({ ticketTiers, onChange, errors }: TicketsStepProps) => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<TicketTierInput | null>(null);

  const handleAddTier = (tier: TicketTierInput) => {
    onChange([...ticketTiers, { ...tier, id: Date.now().toString() }]);
  };

  const handleUpdateTier = (tier: TicketTierInput) => {
    onChange(ticketTiers.map(t => t.id === tier.id ? tier : t));
  };

  const handleDeleteTier = (index: number) => {
    if (confirm('Delete this ticket tier?')) {
      const newTiers = [...ticketTiers];
      newTiers.splice(index, 1);
      onChange(newTiers);
    }
  };

  const totalCapacity = ticketTiers.reduce((sum, t) => sum + t.quantity, 0);
  const totalRevenue = ticketTiers.reduce((sum, t) => sum + (t.price * t.quantity), 0);

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)]">
          <p className="text-sm text-[var(--text-secondary)]">Ticket Tiers</p>
          <p className="text-2xl font-bold text-[#84cc16]">{ticketTiers.length}</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)]">
          <p className="text-sm text-[var(--text-secondary)]">Total Capacity</p>
          <p className="text-2xl font-bold text-[#84cc16]">{totalCapacity.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)]">
          <p className="text-sm text-[var(--text-secondary)]">Potential Revenue</p>
          <p className="text-2xl font-bold text-[#84cc16]">{formatCurrency(totalRevenue)}</p>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={() => {
          setEditingTier(null);
          setIsModalOpen(true);
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white hover:brightness-110"
      >
        <Plus size={16} />
        Add Ticket Tier
      </button>

      {/* Ticket Tiers List */}
      {ticketTiers.length === 0 ? (
        <div className="text-center py-8 border border-dashed border-[var(--border-color)] rounded-lg">
          <p className="text-sm text-[var(--text-secondary)]">No ticket tiers added yet</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">Click the button above to add your first ticket tier</p>
        </div>
      ) : (
        <div className="space-y-3">
          {ticketTiers.map((tier, index) => (
            <div
              key={tier.id || index}
              className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[var(--text-primary)]">{tier.name}</h3>
                    {!tier.isActive && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">Inactive</span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{tier.description}</p>
                  <div className="flex gap-3 mt-2 text-sm">
                    <span className="text-[#84cc16] font-medium">{formatCurrency(tier.price)}</span>
                    <span className="text-[var(--text-secondary)]">• {tier.quantity} available</span>
                    <span className="text-[var(--text-secondary)]">• Max {tier.maxPerPerson} per person</span>
                  </div>
                  {tier.benefits.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tier.benefits.map((benefit, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-full text-xs bg-[var(--hover-bg)] text-[var(--text-secondary)]">
                          ✓ {benefit}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingTier(tier);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Edit2 size={16} className="text-[var(--text-secondary)]" />
                  </button>
                  <button
                    onClick={() => handleDeleteTier(index)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TicketTierModal
        isOpen={isModalOpen}
        tier={editingTier}
        onSave={editingTier ? handleUpdateTier : handleAddTier}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTier(null);
        }}
      />
    </div>
  );
};