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

const RSRPChart: React.FC = () => {
  const data = [
    { distance: 100, 'UE 1 - 4G': -85, 'UE 2 - 5G': -90, 'UE 3 - 5G': -95 },
    { distance: 200, 'UE 1 - 4G': -95, 'UE 2 - 5G': -100, 'UE 3 - 5G': -110 },
    { distance: 300, 'UE 1 - 4G': -105, 'UE 2 - 5G': -108, 'UE 3 - 5G': -120 },
    { distance: 400, 'UE 1 - 4G': -115, 'UE 2 - 5G': -118, 'UE 3 - 5G': -128 },
    { distance: 500, 'UE 1 - 4G': -125, 'UE 2 - 5G': -125, 'UE 3 - 5G': -130 },
  ];

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="distance"
            label={{ value: 'Distance (m)', position: 'insideBottomRight', offset: -10 }}
            domain={[100, 500]}
            ticks={[100, 200, 300, 400, 500]}
            stroke="#9CA3AF"
          />
          <YAxis
            label={{ value: 'RSRP (dBm)', angle: -90, position: 'insideLeft' }}
            domain={[-130, -60]}
            ticks={[-60, -80, -100, -120, -130]}
            stroke="#9CA3AF"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #4B5563',
              borderRadius: '8px',
              color: '#E5E7EB',
            }}
            formatter={(value) => `${value} dBm`}
            cursor={{ stroke: '#6366F1', strokeWidth: 2 }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px', color: '#E5E7EB' }}
          />
          <Line
            type="monotone"
            dataKey="UE 1 - 4G"
            stroke="#F87171"
            strokeWidth={3}
            dot={{ fill: '#FCA5A5', r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="UE 2 - 5G"
            stroke="#38BDF8"
            strokeWidth={3}
            dot={{ fill: '#7DD3FC', r: 5 }}
            activeDot={{ r: 7 }}
          />
          <Line
            type="monotone"
            dataKey="UE 3 - 5G"
            stroke="#0EA5E9"
            strokeWidth={3}
            dot={{ fill: '#06B6D4', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RSRPChart;
