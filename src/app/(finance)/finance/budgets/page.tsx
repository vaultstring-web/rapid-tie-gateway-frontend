'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { BudgetCard } from '@/components/finance/BudgetCard';
import { SpendingTrendChart } from '@/components/finance/SpendingTrendChart';
import { DepartmentBudget, BudgetSummary, DEPARTMENT_BUDGETS } from '@/types/finance/budgets';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

const getMockSummary = (budgets: DepartmentBudget[]): BudgetSummary => {
  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalCommitted = budgets.reduce((sum, b) => sum + b.committed, 0);
  const totalRemaining = budgets.reduce((sum, b) => sum + b.remaining, 0);
  
  return {
    totalAllocated,
    totalSpent,
    totalCommitted,
    totalRemaining,
    overallUtilization: (totalSpent / totalAllocated) * 100,
    departmentsAtRisk: budgets.filter(b => b.percentageUsed >= 75).length,
    eventsAtRisk: budgets.reduce((sum, b) => sum + b.eventBudgets.filter(e => e.percentageUsed >= 75).length, 0),
  };
};

export default function BudgetTrackingPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [budgets, setBudgets] = useState<DepartmentBudget[]>([]);
  const [filteredBudgets, setFilteredBudgets] = useState<DepartmentBudget[]>([]);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'warning' | 'critical'>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentBudget | null>(null);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterBudgets();
  }, [budgets, searchQuery, statusFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const mockData = DEPARTMENT_BUDGETS;
      setBudgets(mockData);
      setFilteredBudgets(mockData);
      setSummary(getMockSummary(mockData));
      setUseMockData(true);
    } catch (error) {
      console.error('Failed to load budget data:', error);
      toast.error('Failed to load budget data');
    } finally {
      setLoading(false);
    }
  };

  const filterBudgets = () => {
    let filtered = [...budgets];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (budget) => budget.department.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter((budget) => budget.status === statusFilter);
    }
    
    setFilteredBudgets(filtered);
  };

  const handleRefresh = () => {
    loadData();
    toast.success('Data refreshed');
  };

  const handleExport = () => {
    toast.info('Exporting budget report... (demo)');
  };

  const summaryCards = [
    {
      title: 'Total Budget',
      value: formatCurrency(summary?.totalAllocated || 0),
      icon: DollarSign,
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Total Spent',
      value: formatCurrency(summary?.totalSpent || 0),
      icon: TrendingUp,
      color: 'text-[#84cc16]',
      bg: 'bg-[#84cc16]/10',
    },
    {
      title: 'Overall Utilization',
      value: `${summary?.overallUtilization.toFixed(1)}%`,
      icon: TrendingUp,
      color: summary?.overallUtilization >= 75 ? 'text-yellow-500' : 'text-green-500',
      bg: 'bg-gray-100 dark:bg-gray-800',
    },
    {
      title: 'Departments at Risk',
      value: summary?.departmentsAtRisk || 0,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#84cc16] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)]">Loading budget data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Budget Tracking</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Monitor departmental and event budgets
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Demo Mode Notice */}
      {useMockData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            ℹ️ Demo Mode - Using sample data. Connect to backend for live data.
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-xl p-4 border transition-all hover:shadow-md"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <Icon size={16} className={card.color} />
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{card.title}</p>
              <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Search department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16]"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
        
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="pl-9 pr-8 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#84cc16] appearance-none"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
            }}
          >
            <option value="all">All Departments</option>
            <option value="healthy">Healthy</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Department Budget Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBudgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            onViewDetails={(id) => {
              const dept = budgets.find(b => b.id === id);
              setSelectedDepartment(dept || null);
            }}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredBudgets.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <DollarSign size={32} className="text-[var(--text-secondary)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No Budgets Found</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'No department budgets available'}
          </p>
        </div>
      )}

      {/* Spending Trend Modal */}
      {selectedDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedDepartment(null)}>
          <div
            className="rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-color)',
              borderWidth: 1,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {selectedDepartment.department} - Spending Trends
              </h2>
              <button
                onClick={() => setSelectedDepartment(null)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                ✕
              </button>
            </div>
            <SpendingTrendChart
              data={selectedDepartment.monthlySpending}
              departmentName={selectedDepartment.department}
              loading={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}