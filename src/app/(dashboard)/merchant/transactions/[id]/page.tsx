"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Printer, RotateCcw, CheckCircle2, Clock, 
  User, Mail, CreditCard, Calendar, ExternalLink, ShieldCheck 
} from 'lucide-react';
import { MOCK_TRANSACTIONS, MOCK_EVENTS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function TransactionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const tx = MOCK_TRANSACTIONS.find(t => t.id === id) || MOCK_TRANSACTIONS[0];
  const event = MOCK_EVENTS.find(e => e.id === tx.event?.id);

  // Format MWK currency
  const formatMWK = (amount: number) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const timeline = [
    { label: 'Payment Initiated', date: 'Mar 30, 2026, 10:28 AM', status: 'completed' },
    { label: 'Fraud Check Passed', date: 'Mar 30, 2026, 10:29 AM', status: 'completed' },
    { label: 'Payment Successful', date: 'Mar 30, 2026, 10:30 AM', status: 'completed' },
    { label: 'Receipt Sent', date: 'Mar 30, 2026, 10:30 AM', status: 'completed' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/merchant/transactions" className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">Transaction {tx.id}</h1>
              <span className="badge-success">Success</span>
            </div>
            <p className="text-gray-500">Processed on {new Date(tx.date).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary btn-small" onClick={handlePrint}>
            <Printer size={16} />
            Print Receipt
          </button>
          <button className="btn-secondary btn-small text-red-600 border-red-200 hover:bg-red-50">
            <RotateCcw size={16} />
            Issue Refund
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card">
            <h3 className="font-bold text-gray-900 mb-6">Transaction Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Amount</p>
                <p className="text-xl font-bold text-gray-900">{formatMWK(tx.amount)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Currency</p>
                <p className="text-xl font-bold text-gray-900">{tx.currency}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Method</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-2 mt-1">
                  <CreditCard size={16} className="text-gray-400" />
                  {tx.method}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Fee</p>
                <p className="text-sm font-medium text-gray-900 mt-1">{formatMWK(3450)}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-900 mb-8">Transaction Timeline</h3>
            <div className="relative space-y-8">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
              {timeline.map((item, i) => (
                <div key={i} className="relative flex gap-6">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center z-10",
                    item.status === 'completed' ? "bg-[#84cc16] text-white" : "bg-gray-100 text-gray-400"
                  )}>
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-900 mb-6">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{tx.customer.name}</p>
                  <p className="text-xs text-gray-500">Customer since Jan 2026</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  {tx.customer.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <ShieldCheck size={16} className="text-gray-400" />
                  Verified Customer
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {event ? (
            <div className="card border-l-4 border-l-[#84cc16]">
              <h3 className="font-bold text-gray-900 mb-4">Related Event</h3>
              <img 
                src={event.image} 
                alt={event.name} 
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <h4 className="font-bold text-gray-900">{event.name}</h4>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <Calendar size={12} />
                {event.date}
              </p>
              <Link 
                href="/merchant/analytics" 
                className="btn-secondary w-full mt-6 btn-small flex items-center justify-center gap-2"
              >
                View Event Stats
                <ExternalLink size={14} />
              </Link>
            </div>
          ) : (
            <div className="card bg-gray-50 border-dashed">
              <p className="text-sm text-gray-500 text-center py-8">
                No associated event for this transaction.
              </p>
            </div>
          )}

          <div className="card">
            <h3 className="font-bold text-gray-900 mb-4">Security</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Risk Level</span>
                <span className="text-green-600 font-bold">Low</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">IP Address</span>
                <span className="text-gray-900 font-mono">192.168.1.1</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Origin</span>
                <span className="text-gray-900">Lilongwe, Malawi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
