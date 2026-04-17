'use client';

import { Funnel, FunnelChart, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { ConversionFunnelData } from '@/types/analytics/eventAnalytics';

interface ConversionFunnelProps {
  data: ConversionFunnelData[];
  loading?: boolean;
}

const STAGE_NAMES: Record<string, string> = {
  VIEW: 'Event Views',
  CLICK: 'Interested',
  ADD_TO_CART: 'Added to Cart',
  CHECKOUT: 'Checkout',
  PURCHASE: 'Purchased',
};

const COLORS = ['#84cc16', '#a3e635', '#65a30d', '#4d7c0f', '#3f6212'];

export const ConversionFunnel = ({ data, loading }: ConversionFunnelProps) => {
  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: STAGE_NAMES[item.stage] || item.stage,
    value: item.count,
    conversionRate: item.conversionRate,
  }));

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={400}>
        <FunnelChart>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
            }}
            formatter={(value: any, name: any, props: any) => {
              const item = data[props.payload.index];
              return [
                `Count: ${value.toLocaleString()}`,
                `Rate: ${item.conversionRate}%`,
              ];
            }}
          />
          <Funnel
            dataKey="value"
            data={chartData}
            isAnimationActive
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
      
      {/* Conversion Rates Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="text-left py-2 font-medium text-neutral-600">Stage</th>
              <th className="text-right py-2 font-medium text-neutral-600">Count</th>
              <th className="text-right py-2 font-medium text-neutral-600">Conversion Rate</th>
              <th className="text-right py-2 font-medium text-neutral-600">Drop-off</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.stage} className="border-b border-neutral-100">
                <td className="py-2 font-medium">{STAGE_NAMES[item.stage] || item.stage}</td>
                <td className="text-right">{item.count.toLocaleString()}</td>
                <td className="text-right text-primary-green-600 font-medium">
                  {item.conversionRate}%
                </td>
                <td className="text-right text-orange-500">
                  {index < data.length - 1 ? `${item.dropOffRate}%` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};