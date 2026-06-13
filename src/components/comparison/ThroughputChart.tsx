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

const ThroughputChart: React.FC = () => {
  const data = [
    { time: 0, '4G LTE': 5, '5G NR': 8 },
    { time: 10, '4G LTE': 15, '5G NR': 35 },
    { time: 20, '4G LTE': 28, '5G NR': 75 },
    { time: 30, '4G LTE': 38, '5G NR': 105 },
    { time: 40, '4G LTE': 48, '5G NR': 112 },
    { time: 50, '4G LTE': 50, '5G NR': 110 },
  ];

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="time"
            label={{ value: 'Temps (s)', position: 'insideBottomRight', offset: -10 }}
            domain={[0, 50]}
            ticks={[0, 10, 20, 30, 40, 50]}
            stroke="#9CA3AF"
          />
          <YAxis
            label={{ value: 'Débit (Mbps)', angle: -90, position: 'insideLeft' }}
            domain={[0, 120]}
            ticks={[0, 20, 40, 60, 80, 100, 120]}
            stroke="#9CA3AF"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #4B5563',
              borderRadius: '8px',
              color: '#E5E7EB',
            }}
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
            name="4G LTE"
          />
          <Line
            type="monotone"
            dataKey="5G NR"
            stroke="#0EA5E9"
            strokeWidth={3}
            dot={{ fill: '#38BDF8', r: 5 }}
            activeDot={{ r: 7 }}
            name="5G NR"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ThroughputChart;
