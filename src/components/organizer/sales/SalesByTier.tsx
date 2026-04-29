'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SalesByTier, TIER_COLORS } from '@/types/organizer/salesDashboard';
import { formatCurrency } from '@/lib/utils/format';
import { useTheme } from '@/context/ThemeContext';

interface SalesByTierProps {
  data: SalesByTier[];
  loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="rounded-lg p-3 shadow-lg border"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)',
        }}
      >
        <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {label}
        </p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Sold: <span className="font-medium">{data.sold.toLocaleString()} / {data.quantity.toLocaleString()}</span>
        </p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Revenue: <span className="text-green-500 font-medium">{formatCurrency(data.revenue)}</span>
        </p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Price: <span className="font-medium">{formatCurrency(data.price)}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const SalesByTier = ({ data, loading }: SalesByTierProps) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
        <XAxis type="number" tick={{ fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }} />
        <YAxis
          type="category"
          dataKey="tierName"
          tick={{ fontSize: 12, fill: theme === 'dark' ? '#9ca3af' : '#6b7280' }}
          width={100}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="sold" name="Tickets Sold" fill="#84cc16" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={TIER_COLORS[index % TIER_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};