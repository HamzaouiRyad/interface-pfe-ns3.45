'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface CSVData {
  perte_dl_pct?: number;
}

interface Props {
  csvData4G: CSVData[];
  csvData5G: CSVData[];
}

const average = (arr: number[]) => {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
};

const PacketLossChart: React.FC<Props> = ({ csvData4G, csvData5G }) => {
  const data = useMemo(() => {
    const dl4G = csvData4G.map(d => d.perte_dl_pct ?? 0);
    const dl5G = csvData5G.map(d => d.perte_dl_pct ?? 0);

    return [
      {
        name: 'LTE-4G',
        'Packet Loss DL (%)': average(dl4G),
      },
      {
        name: '5G NR',
        'Packet Loss DL (%)': average(dl5G),
      },
    ];
  }, [csvData4G, csvData5G]);

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

          <XAxis dataKey="name" stroke="#9CA3AF" />

          <YAxis
            stroke="#9CA3AF"
            label={{ value: 'Perte (%)', angle: -90, position: 'insideLeft' }}
          />

          <Tooltip
            formatter={(v: number) => `${v.toFixed(2)} %`}
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #4B5563',
              borderRadius: '8px',
              color: '#E5E7EB',
            }}
          />

          <Legend />

          <Bar dataKey="Packet Loss DL (%)" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PacketLossChart;