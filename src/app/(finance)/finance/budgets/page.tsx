'use client';

import { motion } from 'framer-motion';
import { PieChart as PieChartIcon, AlertTriangle, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { MOCK_BUDGETS } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Budget, EventBudget } from '@/types/index';

export default function BudgetTracking() {
  const [expandedBudgets, setExpandedBudgets] = useState<string[]>([]);

  const toggleBudget = (id: string) => {
    setExpandedBudgets((prev: string[]) => 
      prev.includes(id) ? prev.filter((b: string) => b !== id) : [...prev, id]
    );
  };

  // Format currency function
  const formatCurrency = (amount: number) => {
    return `MK ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Budget Tracking</h1>
        <p className="text-gray-500 mt-1">Monitor departmental spending and event-specific budget allocations.</p>
      </header>

      {/* Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-4">
        <div className="p-2 bg-amber-100 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-900">Budget Alert: Marketing Department</h4>
          <p className="text-xs text-amber-700 mt-1">
            Marketing has utilized 92% of their Q2 budget. Consider reviewing upcoming commitments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {MOCK_BUDGETS.map((budget: Budget) => {
          const utilization = (budget.spent / budget.total) * 100;
          const committedPercentage = (budget.committed / budget.total) * 100;
          const isExpanded = expandedBudgets.includes(budget.id);

          return (
            <div key={budget.id} className="card p-0 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <PieChartIcon className="w-6 h-6 text-[#3b5a65]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{budget.department}</h3>
                      <p className="text-xs text-gray-400 mt-1">Budget ID: {budget.id}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Budget</p>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(budget.total)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Remaining</p>
                      <p className="text-lg font-bold text-[#84cc16]">{formatCurrency(budget.total - budget.spent)}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Committed</p>
                      <p className="text-lg font-bold text-amber-600">{formatCurrency(budget.committed)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-gray-500 uppercase">Utilization</span>
                    <span className={cn(
                      "text-sm font-bold",
                      utilization > 90 ? "text-red-600" : utilization > 70 ? "text-amber-600" : "text-gray-900"
                    )}>
                      {utilization.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden flex">
                    <motion.div 
                      className="bg-[#84cc16] h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${utilization}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                    <motion.div 
                      className="bg-amber-400 h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${committedPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    />
                  </div>
                  <div className="flex gap-4 pt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#84cc16]" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Spent</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Committed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Sub-sections */}
              <div className="bg-gray-50 border-t border-gray-100">
                <button 
                  onClick={() => toggleBudget(budget.id)}
                  className="w-full px-6 py-3 flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-[#3b5a65] transition-colors"
                >
                  <span>Event Budget Sub-sections ({budget.events.length})</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                <motion.div
                  initial={false}
                  animate={{ height: isExpanded ? 'auto' : 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 space-y-4">
                    {budget.events.map((event: EventBudget, idx: number) => {
                      const eventUtilization = (event.spent / event.budget) * 100;
                      return (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[#84cc16]" />
                              <h4 className="text-sm font-bold text-gray-900">{event.name}</h4>
                            </div>
                            <span className="text-xs font-bold text-[#84cc16] bg-[#84cc16]/10 px-2 py-1 rounded-lg">
                              {eventUtilization.toFixed(0)}% Spent
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">Allocated</p>
                              <p className="text-sm font-bold text-gray-900">{formatCurrency(event.budget)}</p>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase">Actual Spend</p>
                              <p className="text-sm font-bold text-gray-900">{formatCurrency(event.spent)}</p>
                            </div>
                          </div>
                          <div className="mt-4 w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-[#84cc16] h-full rounded-full" 
                              style={{ width: `${eventUtilization}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}