'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';

const LatencyChart: React.FC = () => {
  const data = [
    { distance: 100, '4G LTE': 1.8, '5G NR': 0.15 },
    { distance: 200, '4G LTE': 1.9, '5G NR': 0.14 },
    { distance: 300, '4G LTE': 2.1, '5G NR': 0.16 },
    { distance: 400, '4G LTE': 2.3, '5G NR': 0.18 },
    { distance: 500, '4G LTE': 2.4, '5G NR': 0.17 },
    { distance: 600, '4G LTE': 2.5, '5G NR': 0.19 },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="distance"
              label={{ value: 'Distance (m)', position: 'insideBottomRight', offset: -10 }}
              domain={[100, 600]}
              ticks={[100, 200, 300, 400, 500, 600]}
              stroke="#9CA3AF"
            />
            <YAxis
              label={{ value: 'Temps de réponse (ms)', angle: -90, position: 'insideLeft' }}
              domain={[0.5, 2.5]}
              ticks={[0.5, 1, 1.5, 2, 2.5]}
              stroke="#9CA3AF"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #4B5563',
                borderRadius: '8px',
                color: '#E5E7EB',
              }}
              formatter={(value) => `${Number(value).toFixed(2)} ms`}
              cursor={{ stroke: '#6366F1', strokeWidth: 2 }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px', color: '#E5E7EB' }}
            />
            <Line
              type="monotone"
              dataKey="4G LTE"
              stroke="#EF4444"
              strokeWidth={3}
              dot={{ fill: '#FCA5A5', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="5G NR"
              stroke="#0EA5E9"
              strokeWidth={3}
              dot={{ fill: '#38BDF8', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 flex items-center gap-3">
        <div className="text-blue-300 text-sm">ℹ️</div>
        <div>
          <p className="text-blue-200 text-sm font-medium">
            Configuration TTI fixe : <span className="text-red-400">TTI 4G = 1 ms</span> | <span className="text-blue-400">TTI 5G = 0.125 ms</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LatencyChart;
