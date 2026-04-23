'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, GripVertical, Clock, Tag, Users, AlertCircle, Ticket } from 'lucide-react';
import { TicketTierForm } from '@/types/organizer/eventEdit';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface TicketTiersTabProps {
  ticketTiers: TicketTierForm[];
  onChange: (tiers: TicketTierForm[]) => void;
}

interface TicketTierModalProps {
  isOpen: boolean;
  tier: TicketTierForm | null;
  onSave: (tier: TicketTierForm) => void;
  onClose: () => void;
}

const defaultTier: TicketTierForm = {
  name: '',
  description: '',
  price: 0,
  quantity: 0,
  maxPerPerson: 10,
  benefits: [],
  isAvailable: true,
};

const TicketTierModal = ({ isOpen, tier, onSave, onClose }: TicketTierModalProps) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<TicketTierForm>(tier || defaultTier);
  const [benefitInput, setBenefitInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Ticket tier name is required';
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';
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
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {tier ? 'Edit Ticket Tier' : 'Add Ticket Tier'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="label label-required">Tier Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`input ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g., VIP, General Admission, Early Bird"
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="input resize-y"
              rows={2}
              placeholder="What's included in this ticket tier?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="label label-required">Price (MWK)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                className={`input ${errors.price ? 'input-error' : ''}`}
                min={0}
                step={1000}
              />
              {errors.price && <p className="error-text">{errors.price}</p>}
            </div>

            {/* Quantity */}
            <div>
              <label className="label label-required">Quantity Available</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                className={`input ${errors.quantity ? 'input-error' : ''}`}
                min={1}
              />
              {errors.quantity && <p className="error-text">{errors.quantity}</p>}
            </div>
          </div>

          {/* Max Per Person */}
          <div>
            <label className="label label-required">Maximum Per Person</label>
            <input
              type="number"
              value={formData.maxPerPerson}
              onChange={(e) => setFormData(prev => ({ ...prev, maxPerPerson: parseInt(e.target.value) || 1 }))}
              className={`input ${errors.maxPerPerson ? 'input-error' : ''}`}
              min={1}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Maximum number of tickets one person can purchase
            </p>
            {errors.maxPerPerson && <p className="error-text">{errors.maxPerPerson}</p>}
          </div>

          {/* Sale Period */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Sale Start Date</label>
              <input
                type="datetime-local"
                value={formData.saleStartDate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, saleStartDate: e.target.value }))}
                className="input"
              />
            </div>
            <div>
              <label className="label">Sale End Date</label>
              <input
                type="datetime-local"
                value={formData.saleEndDate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, saleEndDate: e.target.value }))}
                className="input"
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                className="w-4 h-4 rounded border-gray-300 text-primary-green-500 focus:ring-primary-green-500"
              />
              <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Available for purchase</span>
            </label>
          </div>

          {/* Benefits */}
          <div>
            <label className="label">Benefits</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                className="input flex-1"
                placeholder="e.g., Early Entry, Free Drink, VIP Lounge"
                onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
              />
              <button
                onClick={addBenefit}
                className="px-3 py-2 rounded-lg bg-primary-green-500 text-white hover:bg-primary-green-600 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {formData.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--hover-bg)' }}>
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
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border transition-colors"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 rounded-lg bg-primary-green-500 text-white hover:bg-primary-green-600 transition-colors"
          >
            Save Tier
          </button>
        </div>
      </div>
    </div>
  );
};

export const TicketTiersTab = ({ ticketTiers, onChange }: TicketTiersTabProps) => {
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<TicketTierForm | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const totalCapacity = ticketTiers.reduce((sum, tier) => sum + tier.quantity, 0);
  const totalRevenue = ticketTiers.reduce((sum, tier) => sum + (tier.price * tier.quantity), 0);

  const handleAddTier = (tier: TicketTierForm) => {
    onChange([...ticketTiers, { ...tier, id: Date.now().toString() }]);
    toast.success('Ticket tier added');
  };

  const handleEditTier = (tier: TicketTierForm) => {
    onChange(ticketTiers.map(t => t.id === tier.id ? tier : t));
    toast.success('Ticket tier updated');
  };

  const handleDeleteTier = (index: number) => {
    if (confirm('Are you sure you want to delete this ticket tier?')) {
      const newTiers = [...ticketTiers];
      newTiers.splice(index, 1);
      onChange(newTiers);
      toast.success('Ticket tier deleted');
    }
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    
    const newTiers = [...ticketTiers];
    const draggedItem = newTiers[dragIndex];
    newTiers.splice(dragIndex, 1);
    newTiers.splice(index, 0, draggedItem);
    
    onChange(newTiers);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Tag size={18} className="text-primary-green-500" />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Ticket Tiers
            </span>
          </div>
          <p className="text-3xl font-bold text-primary-green-500">
            {ticketTiers.length}
          </p>
        </div>
        <div
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-primary-green-500" />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Total Capacity
            </span>
          </div>
          <p className="text-3xl font-bold text-primary-green-500">
            {totalCapacity.toLocaleString()}
          </p>
        </div>
        <div
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Tag size={18} className="text-primary-green-500" />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Potential Revenue
            </span>
          </div>
          <p className="text-3xl font-bold text-primary-green-500">
            {formatCurrency(totalRevenue)}
          </p>
        </div>
      </div>

      {/* Add Tier Button */}
      <button
        onClick={() => {
          setEditingTier(null);
          setIsModalOpen(true);
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-green-500 text-white font-medium hover:bg-primary-green-600 transition-colors"
      >
        <Plus size={16} />
        Add Ticket Tier
      </button>

      {/* Ticket Tiers List */}
      {ticketTiers.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
          }}
        >
          <Ticket size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-secondary)' }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            No Ticket Tiers
          </h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            Add your first ticket tier to start selling tickets
          </p>
          <button
            onClick={() => {
              setEditingTier(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-green-500 text-white hover:bg-primary-green-600 transition-colors"
          >
            <Plus size={16} />
            Add Ticket Tier
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {ticketTiers.map((tier, index) => (
            <div
              key={tier.id || index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className="rounded-xl p-4 border cursor-move transition-all hover:shadow-md"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-start gap-3">
                <div className="cursor-grab">
                  <GripVertical size={20} style={{ color: 'var(--text-secondary)' }} />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {tier.name}
                        </h3>
                        {!tier.isAvailable && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                            Unavailable
                          </span>
                        )}
                        {tier.saleStartDate && new Date(tier.saleStartDate) > new Date() && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      {tier.description && (
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                          {tier.description}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary-green-500">
                        {formatCurrency(tier.price)}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {tier.quantity} available
                      </p>
                    </div>
                  </div>

                  {/* Benefits */}
                  {tier.benefits.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {tier.benefits.map((benefit, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{ backgroundColor: 'var(--hover-bg)', color: 'var(--text-secondary)' }}
                        >
                          ✓ {benefit}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Sale Period */}
                  {(tier.saleStartDate || tier.saleEndDate) && (
                    <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Clock size={12} />
                      <span>
                        {tier.saleStartDate && `From ${new Date(tier.saleStartDate).toLocaleDateString()}`}
                        {tier.saleStartDate && tier.saleEndDate && ' - '}
                        {tier.saleEndDate && `Until ${new Date(tier.saleEndDate).toLocaleDateString()}`}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <button
                      onClick={() => {
                        setEditingTier(tier);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTier(index)}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pricing Recommendation */}
      {ticketTiers.length > 0 && (
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: 'var(--hover-bg)' }}
        >
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-primary-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Pricing Recommendation
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Based on similar events in {ticketTiers[0]?.price ? 'your area' : 'Malawi'}, 
                consider offering an early bird discount or group packages to boost sales.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <TicketTierModal
        isOpen={isModalOpen}
        tier={editingTier}
        onSave={editingTier ? handleEditTier : handleAddTier}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTier(null);
        }}
      />
    </div>
  );
};