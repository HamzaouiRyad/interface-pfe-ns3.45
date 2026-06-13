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

const SINRChart: React.FC = () => {
  const data = [
    { distance: 10, '4G LTE': 8, '5G NR': 28 },
    { distance: 20, '4G LTE': 6, '5G NR': 29 },
    { distance: 30, '4G LTE': 5, '5G NR': 30 },
    { distance: 40, '4G LTE': 4, '5G NR': 29 },
    { distance: 50, '4G LTE': 3, '5G NR': 28 },
    { distance: 60, '4G LTE': 2, '5G NR': 27 },
  ];

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="distance"
            label={{ value: 'Temps/Distance', position: 'insideBottomRight', offset: -10 }}
            domain={[10, 60]}
            ticks={[10, 20, 30, 40, 50, 60]}
            stroke="#9CA3AF"
          />
          <YAxis
            label={{ value: 'Niveau de signal (dB)', angle: -90, position: 'insideLeft' }}
            domain={[-10, 30]}
            ticks={[-10, 0, 10, 20, 30]}
            stroke="#9CA3AF"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #4B5563',
              borderRadius: '8px',
              color: '#E5E7EB',
            }}
            formatter={(value) => `${value} dB`}
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
  );
};

export default SINRChart;
