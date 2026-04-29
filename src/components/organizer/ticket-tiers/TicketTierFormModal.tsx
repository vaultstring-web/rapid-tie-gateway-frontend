'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Clock, DollarSign, Users, Tag, Power } from 'lucide-react';
import { TicketTier, TicketTierFormData, ROLES, EarlyBirdPeriod, RoleBasedPrice } from '@/types/organizer/ticketTiers';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface TicketTierFormModalProps {
  isOpen: boolean;
  tier: TicketTier | null;
  onSave: (data: TicketTierFormData) => void;
  onClose: () => void;
}

const defaultFormData: TicketTierFormData = {
  name: '',
  description: '',
  basePrice: 0,
  quantity: 0,
  maxPerPerson: 10,
  roleBasedPrices: ROLES.map(role => ({
    role: role.value as any,
    price: 0,
    enabled: false,
  })),
  earlyBirdPeriods: [],
  benefits: [],
  isActive: true,
};

export const TicketTierFormModal = ({ isOpen, tier, onSave, onClose }: TicketTierFormModalProps) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<TicketTierFormData>(defaultFormData);
  const [benefitInput, setBenefitInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'rolePricing' | 'earlyBird' | 'benefits'>('basic');

  useEffect(() => {
    if (tier) {
      setFormData({
        name: tier.name,
        description: tier.description,
        basePrice: tier.basePrice,
        quantity: tier.quantity,
        maxPerPerson: tier.maxPerPerson,
        roleBasedPrices: tier.roleBasedPrices,
        earlyBirdPeriods: tier.earlyBirdPeriods,
        benefits: tier.benefits,
        isActive: tier.isActive,
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [tier]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Ticket tier name is required';
    if (formData.basePrice < 0) newErrors.basePrice = 'Price cannot be negative';
    if (formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    if (formData.maxPerPerson < 1) newErrors.maxPerPerson = 'Max per person must be at least 1';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(formData);
    onClose();
  };

  const updateRolePrice = (role: string, field: keyof RoleBasedPrice, value: any) => {
    setFormData(prev => ({
      ...prev,
      roleBasedPrices: prev.roleBasedPrices.map(rp =>
        rp.role === role ? { ...rp, [field]: value } : rp
      ),
    }));
  };

  const addEarlyBirdPeriod = () => {
    const newPeriod: EarlyBirdPeriod = {
      id: Date.now().toString(),
      name: `Early Bird ${formData.earlyBirdPeriods.length + 1}`,
      startDate: '',
      endDate: '',
      discountType: 'percentage',
      discountValue: 10,
      enabled: true,
    };
    setFormData(prev => ({
      ...prev,
      earlyBirdPeriods: [...prev.earlyBirdPeriods, newPeriod],
    }));
  };

  const updateEarlyBirdPeriod = (index: number, field: keyof EarlyBirdPeriod, value: any) => {
    setFormData(prev => ({
      ...prev,
      earlyBirdPeriods: prev.earlyBirdPeriods.map((period, i) =>
        i === index ? { ...period, [field]: value } : period
      ),
    }));
  };

  const removeEarlyBirdPeriod = (index: number) => {
    setFormData(prev => ({
      ...prev,
      earlyBirdPeriods: prev.earlyBirdPeriods.filter((_, i) => i !== index),
    }));
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

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Tag },
    { id: 'rolePricing', label: 'Role Pricing', icon: Users },
    { id: 'earlyBird', label: 'Early Bird', icon: Clock },
    { id: 'benefits', label: 'Benefits', icon: Plus },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
          borderWidth: 1,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {tier ? 'Edit Ticket Tier' : 'Add Ticket Tier'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-4" style={{ borderColor: 'var(--border-color)' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'border-b-2 border-[#84cc16] text-[#84cc16]'
                    : 'hover:text-[#84cc16]'
                }`}
                style={{ color: activeTab === tab.id ? undefined : 'var(--text-secondary)' }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <>
              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: 'var(--text-primary)' }}>
                  Tier Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] ${
                    errors.name ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                  }}
                  placeholder="e.g., VIP, General Admission, Early Bird"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: 'var(--text-primary)' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border resize-y focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  rows={3}
                  placeholder="Describe what's included in this ticket tier"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block" style={{ color: 'var(--text-primary)' }}>
                    Base Price (MWK) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.basePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, basePrice: parseFloat(e.target.value) || 0 }))}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] ${
                      errors.basePrice ? 'border-red-500' : 'border-[var(--border-color)]'
                    }`}
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                    }}
                    min={0}
                    step={1000}
                  />
                  {errors.basePrice && <p className="text-xs text-red-500 mt-1">{errors.basePrice}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block" style={{ color: 'var(--text-primary)' }}>
                    Quantity Available <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] ${
                      errors.quantity ? 'border-red-500' : 'border-[var(--border-color)]'
                    }`}
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                    }}
                    min={1}
                  />
                  {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block" style={{ color: 'var(--text-primary)' }}>
                  Maximum Per Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.maxPerPerson}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxPerPerson: parseInt(e.target.value) || 1 }))}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] ${
                    errors.maxPerPerson ? 'border-red-500' : 'border-[var(--border-color)]'
                  }`}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                  }}
                  min={1}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Maximum number of tickets one person can purchase
                </p>
                {errors.maxPerPerson && <p className="text-xs text-red-500 mt-1">{errors.maxPerPerson}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
                  />
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Active (available for purchase)</span>
                </label>
              </div>
            </>
          )}

          {/* Role Pricing Tab */}
          {activeTab === 'rolePricing' && (
            <div className="space-y-3">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Set custom prices for different user roles. Leave disabled to use base price.
              </p>
              {formData.roleBasedPrices.map((rp) => {
                const roleConfig = ROLES.find(r => r.value === rp.role);
                return (
                  <div
                    key={rp.role}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: 'var(--hover-bg)' }}
                  >
                    <input
                      type="checkbox"
                      checked={rp.enabled}
                      onChange={(e) => updateRolePrice(rp.role, 'enabled', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
                    />
                    <span className="text-sm flex-1" style={{ color: roleConfig?.color }}>
                      {roleConfig?.label}
                    </span>
                    {rp.enabled && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>MWK</span>
                        <input
                          type="number"
                          value={rp.price}
                          onChange={(e) => updateRolePrice(rp.role, 'price', parseFloat(e.target.value) || 0)}
                          className="w-32 px-2 py-1 rounded-lg border text-right focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                          style={{
                            backgroundColor: 'var(--bg-primary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)',
                          }}
                          min={0}
                          step={1000}
                        />
                        {rp.price < formData.basePrice && (
                          <span className="text-xs text-green-500">({Math.round((1 - rp.price / formData.basePrice) * 100)}% off)</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Early Bird Tab */}
          {activeTab === 'earlyBird' && (
            <div className="space-y-4">
              <button
                onClick={addEarlyBirdPeriod}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-[#84cc16] text-white hover:brightness-110 transition-colors"
              >
                <Plus size={14} />
                Add Early Bird Period
              </button>

              {formData.earlyBirdPeriods.length === 0 && (
                <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                  <Clock size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No early bird periods added</p>
                </div>
              )}

              {formData.earlyBirdPeriods.map((period, idx) => (
                <div
                  key={period.id}
                  className="p-4 rounded-lg border relative"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <button
                    onClick={() => removeEarlyBirdPeriod(idx)}
                    className="absolute top-2 right-2 p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block">Period Name</label>
                      <input
                        type="text"
                        value={period.name}
                        onChange={(e) => updateEarlyBirdPeriod(idx, 'name', e.target.value)}
                        className="w-full px-2 py-1 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">Discount Type</label>
                      <select
                        value={period.discountType}
                        onChange={(e) => updateEarlyBirdPeriod(idx, 'discountType', e.target.value)}
                        className="w-full px-2 py-1 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (MWK)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block">Start Date</label>
                      <input
                        type="datetime-local"
                        value={period.startDate}
                        onChange={(e) => updateEarlyBirdPeriod(idx, 'startDate', e.target.value)}
                        className="w-full px-2 py-1 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block">End Date</label>
                      <input
                        type="datetime-local"
                        value={period.endDate}
                        onChange={(e) => updateEarlyBirdPeriod(idx, 'endDate', e.target.value)}
                        className="w-full px-2 py-1 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1 block">
                      {period.discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount (MWK)'}
                    </label>
                    <input
                      type="number"
                      value={period.discountValue}
                      onChange={(e) => updateEarlyBirdPeriod(idx, 'discountValue', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                      min={0}
                      step={period.discountType === 'percentage' ? 1 : 1000}
                    />
                  </div>

                  <label className="flex items-center gap-2 mt-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={period.enabled}
                      onChange={(e) => updateEarlyBirdPeriod(idx, 'enabled', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#84cc16] focus:ring-[#84cc16]"
                    />
                    <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Active</span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Benefits Tab */}
          {activeTab === 'benefits' && (
            <div>
              <div className="flex gap-2 mb-4">
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
                  placeholder="e.g., Early Entry, Free Drink, VIP Lounge"
                  onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
                />
                <button
                  onClick={addBenefit}
                  className="px-4 py-2 rounded-lg bg-[#84cc16] text-white hover:brightness-110 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg"
                    style={{ backgroundColor: 'var(--hover-bg)' }}
                  >
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{benefit}</span>
                    <button
                      onClick={() => removeBenefit(idx)}
                      className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 border-t flex gap-3" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border transition-colors"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 rounded-lg bg-[#84cc16] text-white hover:brightness-110 transition-colors"
          >
            {tier ? 'Update Tier' : 'Create Tier'}
          </button>
        </div>
      </div>
    </div>
  );
};