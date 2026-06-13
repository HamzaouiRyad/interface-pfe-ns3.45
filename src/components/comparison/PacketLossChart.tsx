'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const PacketLossChart: React.FC = () => {
  const data = [
    { scenario: 'Scénario 1', '4G LTE': 3.5, '5G NR': 1.2 },
    { scenario: 'Scénario 2', '4G LTE': 5.8, '5G NR': 1.9 },
    { scenario: 'Scénario 3', '4G LTE': 11.2, '5G NR': 3.6 },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-semibold">
              {entry.name}: {Number(entry.value).toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="scenario"
            stroke="#9CA3AF"
          />
          <YAxis
            label={{ value: 'Taux de perte (%)', angle: -90, position: 'insideLeft' }}
            domain={[0, 12]}
            ticks={[0, 2, 4, 6, 8, 10, 12]}
            stroke="#9CA3AF"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }} />
          <Legend
            wrapperStyle={{ paddingTop: '20px', color: '#E5E7EB' }}
          />
          <Bar dataKey="4G LTE" fill="#EF4444" name="4G LTE" radius={[8, 8, 0, 0]} />
          <Bar dataKey="5G NR" fill="#0EA5E9" name="5G NR" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PacketLossChart;
