'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  Ticket,
  Users,
  DollarSign,
  Power,
  X,
  CheckCircle,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Types
interface TicketTier {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold: number;
  maxPerPerson: number;
  benefits: string[];
  isActive: boolean;
}

// Mock data
const getMockTicketTiers = (): TicketTier[] => [
  {
    id: '1',
    name: 'VIP Pass',
    description: 'Full access including backstage passes, VIP lounge, and premium seating',
    price: 150000,
    quantity: 100,
    sold: 45,
    maxPerPerson: 4,
    benefits: ['Backstage Access', 'VIP Lounge', 'Premium Seating', 'Free Drinks', 'Meet & Greet'],
    isActive: true,
  },
  {
    id: '2',
    name: 'General Admission',
    description: 'Standard entry to the event',
    price: 45000,
    quantity: 500,
    sold: 320,
    maxPerPerson: 10,
    benefits: ['Standard Entry', 'Access to All Stages'],
    isActive: true,
  },
  {
    id: '3',
    name: 'Early Bird',
    description: 'Limited time offer - get early access',
    price: 25000,
    quantity: 200,
    sold: 187,
    maxPerPerson: 6,
    benefits: ['Early Entry', 'Limited Edition Badge', 'Priority Queue'],
    isActive: true,
  },
];

// Modal Component
const TicketTierModal = ({ 
  isOpen, 
  tier, 
  onSave, 
  onClose 
}: { 
  isOpen: boolean; 
  tier: TicketTier | null; 
  onSave: (tier: TicketTier) => void; 
  onClose: () => void;
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    maxPerPerson: 10,
    benefits: [] as string[],
    isActive: true,
  });
  const [benefitInput, setBenefitInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (tier) {
      setFormData({
        name: tier.name,
        description: tier.description,
        price: tier.price,
        quantity: tier.quantity,
        maxPerPerson: tier.maxPerPerson,
        benefits: tier.benefits,
        isActive: tier.isActive,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        maxPerPerson: 10,
        benefits: [],
        isActive: true,
      });
    }
  }, [tier]);

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
      onSave({ 
        ...formData, 
        id: tier?.id || Date.now().toString(), 
        sold: tier?.sold || 0 
      });
      onClose();
    }
  };

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, benefitInput.trim()],
      }));
      setBenefitInput('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
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

// Main Page Component
export default function TicketTiersPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<TicketTier | null>(null);

  useEffect(() => {
    loadTiers();
  }, [eventId]);

  const loadTiers = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTiers(getMockTicketTiers());
    } catch (error) {
      toast.error('Failed to load ticket tiers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTier = async (tier: TicketTier) => {
    setTiers(prev => [...prev, tier]);
    toast.success('Ticket tier created');
    setIsModalOpen(false);
  };

  const handleUpdateTier = async (tier: TicketTier) => {
    setTiers(prev => prev.map(t => t.id === tier.id ? tier : t));
    toast.success('Ticket tier updated');
    setIsModalOpen(false);
    setEditingTier(null);
  };

  const handleDeleteTier = async (tierId: string) => {
    if (confirm('Are you sure you want to delete this ticket tier?')) {
      setTiers(prev => prev.filter(t => t.id !== tierId));
      toast.success('Ticket tier deleted');
    }
  };

  const handleToggleActive = async (tierId: string, isActive: boolean) => {
    setTiers(prev => prev.map(t => t.id === tierId ? { ...t, isActive } : t));
    toast.success(isActive ? 'Tier activated' : 'Tier deactivated');
  };

  const totalCapacity = tiers.reduce((sum, t) => sum + t.quantity, 0);
  const totalSold = tiers.reduce((sum, t) => sum + t.sold, 0);
  const totalRevenue = tiers.reduce((sum, t) => sum + (t.sold * t.price), 0);
  const soldPercentage = totalCapacity > 0 ? (totalSold / totalCapacity) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#84cc16] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Ticket Tiers</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage ticket types, pricing, and availability
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Ticket size={18} className="text-[#84cc16]" />
            <span className="text-sm text-[var(--text-secondary)]">Ticket Tiers</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{tiers.length}</p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-[#84cc16]" />
            <span className="text-sm text-[var(--text-secondary)]">Capacity</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{totalCapacity.toLocaleString()}</p>
          <p className="text-xs text-[var(--text-secondary)]">{totalSold.toLocaleString()} sold ({Math.round(soldPercentage)}%)</p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={18} className="text-[#84cc16]" />
            <span className="text-sm text-[var(--text-secondary)]">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-[#84cc16]">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-[#84cc16]" />
            <span className="text-sm text-[var(--text-secondary)]">Avg. Price</span>
          </div>
          <p className="text-2xl font-bold text-[#84cc16]">
            {tiers.length > 0 ? formatCurrency(tiers.reduce((sum, t) => sum + t.price, 0) / tiers.length) : formatCurrency(0)}
          </p>
        </div>
      </div>

      {/* Add Button */}
      <button
        onClick={() => {
          setEditingTier(null);
          setIsModalOpen(true);
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white hover:brightness-110 transition-colors"
      >
        <Plus size={16} />
        Add Ticket Tier
      </button>

      {/* Ticket Tiers List */}
      {tiers.length === 0 ? (
        <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)]">
          <Ticket size={48} className="mx-auto mb-4 opacity-50 text-[var(--text-secondary)]" />
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Ticket Tiers</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Create your first ticket tier to start selling tickets
          </p>
          <button
            onClick={() => {
              setEditingTier(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white hover:brightness-110"
          >
            <Plus size={16} />
            Create Ticket Tier
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">{tier.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      tier.isActive 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {tier.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">{tier.description}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <span className="text-[#84cc16] font-medium">{formatCurrency(tier.price)}</span>
                    <span className="text-[var(--text-secondary)]">{tier.sold} / {tier.quantity} sold</span>
                    <span className="text-[var(--text-secondary)]">Max {tier.maxPerPerson} per person</span>
                  </div>

                  {/* Benefits */}
                  {tier.benefits.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tier.benefits.map((benefit, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-full text-xs bg-[var(--hover-bg)] text-[var(--text-secondary)]">
                          ✓ {benefit}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="h-1.5 bg-[var(--border-color)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#84cc16] rounded-full transition-all"
                        style={{ width: `${(tier.sold / tier.quantity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleToggleActive(tier.id, !tier.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      tier.isActive 
                        ? 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800' 
                        : 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900/20'
                    }`}
                    title={tier.isActive ? 'Deactivate' : 'Activate'}
                  >
                    <Power size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingTier(tier);
                      setIsModalOpen(true);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Edit2 size={16} className="text-[var(--text-primary)]" />
                  </button>
                  <button
                    onClick={() => handleDeleteTier(tier.id)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <TicketTierModal
        isOpen={isModalOpen}
        tier={editingTier}
        onSave={editingTier ? handleUpdateTier : handleCreateTier}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTier(null);
        }}
      />
    </div>
  );
}

// Helper component for TrendingUp
const TrendingUp = ({ size, className }: { size: number; className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);