'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, ArrowLeft, TrendingUp, Ticket, Users, DollarSign } from 'lucide-react';
import { TicketTierCard } from '@/components/organizer/ticket-tiers/TicketTierCard';
import { TicketTierFormModal } from '@/components/organizer/ticket-tiers/TicketTierFormModal';
import { ticketTiersService } from '@/services/organizer/ticketTiers.service';
import { TicketTier, TicketTierFormData } from '@/types/organizer/ticketTiers';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

// Mock data for development
const getMockTicketTiers = (): TicketTier[] => {
  return [
    {
      id: 'tier-1',
      name: 'VIP Pass',
      description: 'Full access including backstage passes, VIP lounge, and premium seating',
      basePrice: 150000,
      quantity: 100,
      sold: 45,
      maxPerPerson: 4,
      roleBasedPrices: [
        { role: 'MERCHANT', price: 135000, enabled: true },
        { role: 'ORGANIZER', price: 120000, enabled: true },
        { role: 'EMPLOYEE', price: 140000, enabled: false },
        { role: 'APPROVER', price: 130000, enabled: false },
        { role: 'FINANCE_OFFICER', price: 125000, enabled: false },
        { role: 'ADMIN', price: 0, enabled: false },
        { role: 'PUBLIC', price: 150000, enabled: false },
      ],
      earlyBirdPeriods: [
        {
          id: 'eb-1',
          name: 'Early Bird Special',
          startDate: new Date(Date.now() - 7 * 86400000).toISOString(),
          endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
          discountType: 'percentage',
          discountValue: 15,
          enabled: true,
        },
      ],
      benefits: ['Backstage Access', 'VIP Lounge', 'Premium Seating', 'Free Drinks', 'Meet & Greet'],
      isActive: true,
      sortOrder: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tier-2',
      name: 'General Admission',
      description: 'Standard entry to the event',
      basePrice: 45000,
      quantity: 500,
      sold: 320,
      maxPerPerson: 10,
      roleBasedPrices: [
        { role: 'MERCHANT', price: 40000, enabled: true },
        { role: 'ORGANIZER', price: 35000, enabled: true },
        { role: 'EMPLOYEE', price: 42000, enabled: false },
        { role: 'APPROVER', price: 38000, enabled: false },
        { role: 'FINANCE_OFFICER', price: 36000, enabled: false },
        { role: 'ADMIN', price: 0, enabled: false },
        { role: 'PUBLIC', price: 45000, enabled: false },
      ],
      earlyBirdPeriods: [],
      benefits: ['Standard Entry', 'Access to All Stages'],
      isActive: true,
      sortOrder: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'tier-3',
      name: 'Early Bird',
      description: 'Limited time offer - get early access',
      basePrice: 25000,
      quantity: 200,
      sold: 187,
      maxPerPerson: 6,
      roleBasedPrices: [],
      earlyBirdPeriods: [],
      benefits: ['Early Entry', 'Limited Edition Badge', 'Priority Queue'],
      isActive: true,
      sortOrder: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

export default function TicketTiersPage() {
  const { theme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<TicketTier | null>(null);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadTiers();
  }, [eventId]);

  const loadTiers = async () => {
    try {
      // Using mock data for now
      const mockData = getMockTicketTiers();
      setTiers(mockData);
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load ticket tiers:', error);
      toast.error('Failed to load ticket tiers');
      const mockData = getMockTicketTiers();
      setTiers(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = tiers.findIndex(t => t.id === active.id);
      const newIndex = tiers.findIndex(t => t.id === over?.id);
      const newTiers = [...tiers];
      const [movedItem] = newTiers.splice(oldIndex, 1);
      newTiers.splice(newIndex, 0, movedItem);
      setTiers(newTiers);
      
      try {
        await ticketTiersService.reorderTicketTiers(eventId, newTiers.map(t => t.id));
      } catch (error) {
        toast.error('Failed to save order');
        loadTiers();
      }
    }
  };

  const handleCreateTier = async (data: TicketTierFormData) => {
    if (useMockData) {
      const newTier: TicketTier = {
        ...data,
        id: Date.now().toString(),
        sold: 0,
        sortOrder: tiers.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTiers(prev => [...prev, newTier]);
      toast.success('Ticket tier created (demo)');
      setIsModalOpen(false);
      return;
    }
    
    try {
      const newTier = await ticketTiersService.createTicketTier(eventId, data);
      setTiers(prev => [...prev, newTier]);
      toast.success('Ticket tier created');
    } catch (error) {
      toast.error('Failed to create ticket tier');
    }
  };

  const handleUpdateTier = async (data: TicketTierFormData) => {
    if (!editingTier) return;
    
    if (useMockData) {
      setTiers(prev => prev.map(t => t.id === editingTier.id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t));
      toast.success('Ticket tier updated (demo)');
      setIsModalOpen(false);
      setEditingTier(null);
      return;
    }
    
    try {
      const updatedTier = await ticketTiersService.updateTicketTier(eventId, editingTier.id, data);
      setTiers(prev => prev.map(t => t.id === updatedTier.id ? updatedTier : t));
      toast.success('Ticket tier updated');
    } catch (error) {
      toast.error('Failed to update ticket tier');
    }
  };

  const handleDeleteTier = async (tierId: string) => {
    if (confirm('Are you sure you want to delete this ticket tier?')) {
      if (useMockData) {
        setTiers(prev => prev.filter(t => t.id !== tierId));
        toast.success('Ticket tier deleted (demo)');
        return;
      }
      
      try {
        await ticketTiersService.deleteTicketTier(eventId, tierId);
        setTiers(prev => prev.filter(t => t.id !== tierId));
        toast.success('Ticket tier deleted');
      } catch (error) {
        toast.error('Failed to delete ticket tier');
      }
    }
  };

  const handleToggleActive = async (tierId: string, isActive: boolean) => {
    if (useMockData) {
      setTiers(prev => prev.map(t => t.id === tierId ? { ...t, isActive } : t));
      toast.success(isActive ? 'Tier activated (demo)' : 'Tier deactivated (demo)');
      return;
    }
    
    try {
      await ticketTiersService.updateTierStatus(eventId, tierId, isActive);
      setTiers(prev => prev.map(t => t.id === tierId ? { ...t, isActive } : t));
      toast.success(isActive ? 'Tier activated' : 'Tier deactivated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const totalCapacity = tiers.reduce((sum, t) => sum + t.quantity, 0);
  const totalSold = tiers.reduce((sum, t) => sum + t.sold, 0);
  const totalRevenue = tiers.reduce((sum, t) => sum + (t.sold * t.basePrice), 0);
  const soldPercentage = totalCapacity > 0 ? (totalSold / totalCapacity) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Loading ticket tiers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Ticket Tiers
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Manage ticket types, pricing, and availability
              </p>
            </div>
          </div>
          
          <button
            onClick={() => {
              setEditingTier(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-colors"
          >
            <Plus size={16} />
            Add Ticket Tier
          </button>
        </div>

        {/* Demo Mode Notice */}
        {useMockData && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              ℹ️ Demo Mode - Using sample ticket data. Connect to backend for live data.
            </p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Ticket size={18} className="text-[#84cc16]" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Ticket Tiers</span>
            </div>
            <p className="text-2xl font-bold text-[#84cc16]">{tiers.length}</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} className="text-[#84cc16]" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Capacity</span>
            </div>
            <p className="text-2xl font-bold text-[#84cc16]">{totalCapacity.toLocaleString()}</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{totalSold.toLocaleString()} sold ({Math.round(soldPercentage)}%)</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={18} className="text-[#84cc16]" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Revenue</span>
            </div>
            <p className="text-2xl font-bold text-[#84cc16]">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} className="text-[#84cc16]" />
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Avg. Price</span>
            </div>
            <p className="text-2xl font-bold text-[#84cc16]">
              {tiers.length > 0 ? formatCurrency(tiers.reduce((sum, t) => sum + t.basePrice, 0) / tiers.length) : formatCurrency(0)}
            </p>
          </div>
        </div>

        {/* Ticket Tiers List */}
        {tiers.length === 0 ? (
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
              Create your first ticket tier to start selling tickets
            </p>
            <button
              onClick={() => {
                setEditingTier(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#84cc16] text-white hover:brightness-110 transition-colors"
            >
              <Plus size={16} />
              Create Ticket Tier
            </button>
          </div>
        ) : (
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={tiers.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {tiers.map((tier, index) => (
                  <TicketTierCard
                    key={tier.id}
                    tier={tier}
                    index={index}
                    onEdit={(t) => {
                      setEditingTier(t);
                      setIsModalOpen(true);
                    }}
                    onDelete={handleDeleteTier}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Form Modal */}
      <TicketTierFormModal
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