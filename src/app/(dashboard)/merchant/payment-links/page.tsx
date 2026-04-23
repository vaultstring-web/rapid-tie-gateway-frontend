"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, Filter, Link as LinkIcon, Copy, ExternalLink, 
  MoreVertical, BarChart2, CheckCircle2, XCircle 
} from 'lucide-react';
import { MOCK_PAYMENT_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function PaymentLinks() {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const stats = [
    { label: 'Total Clicks', value: '1,690', change: '+12%', icon: BarChart2, trend: 'up' },
    { label: 'Total Conversions', value: '97', change: '+5%', icon: CheckCircle2, trend: 'up' },
    { label: 'Conversion Rate', value: '5.7%', change: '-1.2%', icon: LinkIcon, trend: 'down' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Links</h1>
          <p className="text-gray-500">Create and manage links to collect payments anywhere.</p>
        </div>
        <Link href="/merchant/payment-links/create" className="btn-primary">
          <Plus size={20} />
          Create New Link
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="card">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-[#84cc16]/10">
                <stat.icon size={20} className="text-[#84cc16]" />
              </div>
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                stat.trend === 'up' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Links List */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search links..." 
              className="input pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className="space-y-4">
          {MOCK_PAYMENT_LINKS.map((link) => (
            <div key={link.id} className="p-4 border border-gray-100 rounded-xl hover:border-[#84cc16] hover:shadow-sm transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#84cc16]/10 text-[#84cc16] flex items-center justify-center shrink-0">
                    <LinkIcon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">{link.title}</h4>
                      {link.event && (
                        <span className="badge-success text-[10px] bg-blue-50 text-blue-600 border border-blue-100">
                          {link.event}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      ${link.amount.toFixed(2)} {link.currency} • Created {new Date(link.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-600">
                        pay.merchant.com/{link.id}
                      </code>
                      <button 
                        onClick={() => handleCopy(link.id, `pay.merchant.com/${link.id}`)}
                        className="p-1 text-gray-400 hover:text-[#84cc16] transition-colors"
                      >
                        {copiedId === link.id ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Clicks</p>
                    <p className="text-sm font-bold text-gray-900">{link.clicks}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 font-semibold uppercase">Sales</p>
                    <p className="text-sm font-bold text-gray-900">{link.conversions}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <MoreVertical size={18} />
                    </button>
                    <button className="btn-primary btn-small">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
