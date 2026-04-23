'use client';

import { motion } from 'framer-motion';
import { Layers, CheckCircle, XCircle, Loader2, RefreshCw, Filter, Search, Eye, X } from 'lucide-react';
import { MOCK_BATCHES } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Batch } from '@/types/index';
import { useState } from 'react';

// Mock detailed transactions for each batch
const getBatchTransactions = (batchId: string) => {
  return [
    { id: 'TXN-001', recipient: 'Alex Johnson', amount: 1250, status: 'success', date: '2024-04-15', type: 'Travel' },
    { id: 'TXN-002', recipient: 'Sarah Miller', amount: 3400, status: 'success', date: '2024-04-15', type: 'Equipment' },
    { id: 'TXN-003', recipient: 'Michael Chen', amount: 800, status: 'failed', date: '2024-04-15', type: 'Event', error: 'Insufficient funds' },
    { id: 'TXN-004', recipient: 'Emma Wilson', amount: 2500, status: 'pending', date: '2024-04-15', type: 'Travel' },
  ];
};

export default function BatchProcessing() {
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const formatCurrency = (amount: number) => {
    return `MK ${amount.toLocaleString()}`;
  };

  const handleViewDetails = (batch: Batch) => {
    setSelectedBatch(batch);
    setShowDetailsModal(true);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedBatch(null);
  };

  // Filter batches based on search query and status filter
  const filteredBatches = MOCK_BATCHES.filter((batch: Batch) => {
    // Search filter (by name or ID)
    const matchesSearch = searchQuery === '' || 
      batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
  };

  // Get filter counts for badges
  const getFilterCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (statusFilter !== 'all') count++;
    return count;
  };

  return (
    <>
      <div className="space-y-8 animate-slide-up">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white-900">Batch Processing</h1>
            <p className="text-gray-500 mt-1">Monitor disbursement batches and track processing progress.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search Input - Now Working */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                className="input pl-10 btn-small w-64"
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            {/* Filter Dropdown - Now Working */}
            <div className="relative">
              <button 
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={cn(
                  "btn-secondary btn-small gap-2",
                  getFilterCount() > 0 && "border-[#84cc16] text-[#84cc16]"
                )}
              >
                <Filter className="w-4 h-4" />
                Filter
                {getFilterCount() > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-[#84cc16] text-white text-[10px] rounded-full">
                    {getFilterCount()}
                  </span>
                )}
              </button>
              
              {showFilterDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowFilterDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          setStatusFilter('all');
                          setShowFilterDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                          statusFilter === 'all' ? "bg-[#84cc16]/10 text-[#84cc16]" : "hover:bg-gray-50"
                        )}
                      >
                        All Statuses
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter('Completed');
                          setShowFilterDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                          statusFilter === 'Completed' ? "bg-[#84cc16]/10 text-[#84cc16]" : "hover:bg-gray-50"
                        )}
                      >
                        ✅ Completed
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter('Processing');
                          setShowFilterDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                          statusFilter === 'Processing' ? "bg-[#84cc16]/10 text-[#84cc16]" : "hover:bg-gray-50"
                        )}
                      >
                        🔄 Processing
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter('Failed');
                          setShowFilterDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                          statusFilter === 'Failed' ? "bg-[#84cc16]/10 text-[#84cc16]" : "hover:bg-gray-50"
                        )}
                      >
                        ❌ Failed
                      </button>
                    </div>
                    {getFilterCount() > 0 && (
                      <div className="border-t border-gray-100 p-2">
                        <button
                          onClick={clearFilters}
                          className="w-full text-center px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Clear all filters
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Filter Summary Bar */}
        {getFilterCount() > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-red-500">
                  <X size={12} />
                </button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('all')} className="hover:text-red-500">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-500">
          Showing {filteredBatches.length} of {MOCK_BATCHES.length} batches
        </div>

        <div className="space-y-6">
          {filteredBatches.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <Search className="w-12 h-12 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900">No batches found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                <button onClick={clearFilters} className="btn-primary mt-2">
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            filteredBatches.map((batch: Batch) => (
              <div key={batch.id} className="card p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-3 rounded-xl shrink-0",
                      batch.status === 'Completed' ? "bg-green-50 text-green-600" :
                      batch.status === 'Processing' ? "bg-blue-50 text-blue-600" :
                      "bg-red-50 text-red-600"
                    )}>
                      {batch.status === 'Processing' ? <Loader2 className="w-6 h-6 animate-spin" /> : <Layers className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-900">{batch.name}</h3>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          batch.status === 'Completed' ? "bg-green-100 text-green-700" :
                          batch.status === 'Processing' ? "bg-blue-100 text-blue-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {batch.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{batch.id} • Created on {new Date(batch.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-8">
                    <div className="text-center md:text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Total Amount</p>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(batch.totalAmount)}</p>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Items</p>
                      <p className="text-lg font-bold text-gray-900">{batch.itemCount}</p>
                    </div>
                    <div className="flex gap-2">
                      {batch.status === 'Failed' && (
                        <button className="btn-secondary btn-small gap-2 border-red-200 text-red-600 hover:bg-red-50">
                          <RefreshCw className="w-4 h-4" />
                          Retry Failed
                        </button>
                      )}
                      <button 
                        onClick={() => handleViewDetails(batch)}
                        className="btn-secondary btn-small gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-8 space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-bold text-gray-700">{batch.successCount} Success</span>
                      </div>
                      {batch.failureCount > 0 && (
                        <div className="flex items-center gap-1.5">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-xs font-bold text-gray-700">{batch.failureCount} Failed</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-gray-900">{batch.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className={cn(
                        "h-full",
                        batch.status === 'Failed' ? "bg-red-500" : "bg-[#84cc16]"
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${batch.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Details Modal - Same as before */}
      {showDetailsModal && selectedBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedBatch.name}</h2>
                <p className="text-sm text-gray-500 mt-1">Batch ID: {selectedBatch.id}</p>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                  <span className={cn(
                    "inline-block px-3 py-1 rounded-full text-xs font-bold mt-2",
                    selectedBatch.status === 'Completed' ? "bg-green-100 text-green-700" :
                    selectedBatch.status === 'Processing' ? "bg-blue-100 text-blue-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {selectedBatch.status}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold">Total Amount</p>
                  <p className="text-xl font-bold text-gray-900 mt-2">{formatCurrency(selectedBatch.totalAmount)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold">Success Rate</p>
                  <p className="text-xl font-bold text-green-600 mt-2">{selectedBatch.progress}%</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold">Created</p>
                  <p className="text-sm font-bold text-gray-900 mt-2">{new Date(selectedBatch.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-4">Transaction Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 rounded-lg">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Transaction ID</th>
                      <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Recipient</th>
                      <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-right">Amount</th>
                      <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {getBatchTransactions(selectedBatch.id).map((tx, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-gray-600">{tx.id}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{tx.recipient}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{tx.type}</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">{formatCurrency(tx.amount)}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                            tx.status === 'success' ? "bg-green-50 text-green-600" :
                            tx.status === 'failed' ? "bg-red-50 text-red-600" :
                            "bg-amber-50 text-amber-600"
                          )}>
                            {tx.status === 'success' && <CheckCircle className="w-3 h-3" />}
                            {tx.status === 'failed' && <XCircle className="w-3 h-3" />}
                            {tx.status === 'pending' && <Loader2 className="w-3 h-3 animate-spin" />}
                            {tx.status}
                          </span>
                          {tx.error && (
                            <p className="text-[10px] text-red-500 mt-1">{tx.error}</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                {selectedBatch.status === 'Failed' && (
                  <button className="btn-primary gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Retry Failed Transactions
                  </button>
                )}
                <button onClick={closeModal} className="btn-secondary">Close</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}