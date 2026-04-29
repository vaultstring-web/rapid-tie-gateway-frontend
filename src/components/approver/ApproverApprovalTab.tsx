'use client';

import { useState } from 'react';
import { DollarSign, Users, Calendar, MapPin, Plus, Trash2, Save } from 'lucide-react';
import { ApprovalLimits, DEPARTMENTS, DESTINATIONS } from '@/types/approver/settings';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

interface ApproverApprovalTabProps {
  limits: ApprovalLimits;
  onUpdate: (data: Partial<ApprovalLimits>) => Promise<void>;
}

export const ApproverApprovalTab = ({ limits, onUpdate }: ApproverApprovalTabProps) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState(limits);
  const [saving, setSaving] = useState(false);
  const [showDelegationForm, setShowDelegationForm] = useState(false);
  const [newDelegation, setNewDelegation] = useState({
    delegateId: '',
    name: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onUpdate(formData);
      toast.success('Approval limits updated');
    } catch (error) {
      toast.error('Failed to update limits');
    } finally {
      setSaving(false);
    }
  };

  const addDelegation = () => {
    if (!newDelegation.name || !newDelegation.startDate || !newDelegation.endDate) {
      toast.error('Please fill all required fields');
      return;
    }
    setFormData(prev => ({
      ...prev,
      delegatedTo: [...(prev.delegatedTo || []), { ...newDelegation, id: Date.now().toString() }]
    }));
    setNewDelegation({ delegateId: '', name: '', startDate: '', endDate: '', reason: '' });
    setShowDelegationForm(false);
    toast.success('Delegation added');
  };

  const removeDelegation = (id: string) => {
    setFormData(prev => ({
      ...prev,
      delegatedTo: prev.delegatedTo?.filter(d => d.id !== id)
    }));
  };

  const toggleDestination = (destination: string) => {
    setFormData(prev => ({
      ...prev,
      restrictedDestinations: prev.restrictedDestinations.includes(destination)
        ? prev.restrictedDestinations.filter(d => d !== destination)
        : [...prev.restrictedDestinations, destination]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Financial Limits */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign size={18} className="text-[#84cc16]" />
          <h3 className="font-semibold text-[var(--text-primary)]">Financial Limits</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Max Amount per Request</label>
            <input
              type="number"
              value={formData.maxAmount}
              onChange={(e) => setFormData(prev => ({ ...prev, maxAmount: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              step={10000}
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">Maximum amount you can approve per request</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Requires Second Approval Above</label>
            <input
              type="number"
              value={formData.requiresSecondApproval}
              onChange={(e) => setFormData(prev => ({ ...prev, requiresSecondApproval: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              step={10000}
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">Requests above this amount require a second approver</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block text-[var(--text-primary)]">Auto-Approve Under</label>
            <input
              type="number"
              value={formData.autoApproveUnder}
              onChange={(e) => setFormData(prev => ({ ...prev, autoApproveUnder: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
              step={5000}
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">Requests under this amount are auto-approved</p>
          </div>
        </div>
      </div>

      {/* Default Department */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users size={18} className="text-[#84cc16]" />
          <h3 className="font-semibold text-[var(--text-primary)]">Default Department</h3>
        </div>
        <select
          value={formData.defaultDepartment}
          onChange={(e) => setFormData(prev => ({ ...prev, defaultDepartment: e.target.value }))}
          className="w-full max-w-xs px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
          }}
        >
          {DEPARTMENTS.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Restricted Destinations */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={18} className="text-[#84cc16]" />
          <h3 className="font-semibold text-[var(--text-primary)]">Restricted Destinations</h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mb-3">Select destinations that require additional review</p>
        <div className="flex flex-wrap gap-2">
          {DESTINATIONS.map(dest => (
            <button
              key={dest}
              type="button"
              onClick={() => toggleDestination(dest)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                formData.restrictedDestinations.includes(dest)
                  ? 'bg-red-500 text-white'
                  : 'border hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              style={{ borderColor: 'var(--border-color)' }}
            >
              {dest}
            </button>
          ))}
        </div>
      </div>

      {/* Delegation */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-[#84cc16]" />
            <h3 className="font-semibold text-[var(--text-primary)]">Delegation</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowDelegationForm(!showDelegationForm)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-[#84cc16] text-white hover:brightness-110 transition-colors"
          >
            <Plus size={14} />
            Add Delegation
          </button>
        </div>

        {showDelegationForm && (
          <div className="mb-4 p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Delegate Name</label>
                <input
                  type="text"
                  value={newDelegation.name}
                  onChange={(e) => setNewDelegation(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  placeholder="Enter delegate name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Start Date</label>
                <input
                  type="date"
                  value={newDelegation.startDate}
                  onChange={(e) => setNewDelegation(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">End Date</label>
                <input
                  type="date"
                  value={newDelegation.endDate}
                  onChange={(e) => setNewDelegation(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Reason</label>
                <input
                  type="text"
                  value={newDelegation.reason}
                  onChange={(e) => setNewDelegation(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                  placeholder="e.g., Annual Leave, Training"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDelegationForm(false)}
                className="px-3 py-1.5 rounded-lg border text-sm"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addDelegation}
                className="px-3 py-1.5 rounded-lg bg-[#84cc16] text-white text-sm hover:brightness-110 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {formData.delegatedTo && formData.delegatedTo.length > 0 ? (
          <div className="space-y-2">
            {formData.delegatedTo.map((delegation) => (
              <div key={delegation.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{delegation.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {new Date(delegation.startDate).toLocaleDateString()} - {new Date(delegation.endDate).toLocaleDateString()}
                    {delegation.reason && ` • ${delegation.reason}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeDelegation(delegation.id)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-secondary)] text-center py-4">No active delegations</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#84cc16] text-white font-medium hover:brightness-110 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Limits
        </button>
      </div>
    </form>
  );
};