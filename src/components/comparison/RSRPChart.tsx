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

interface CSVData {
  time_s?: number;
  rsrp_dbm?: number;
}

interface Props {
  csvData4G: CSVData[];
  csvData5G: CSVData[];
}

const RSRPChart: React.FC<Props> = ({
  csvData4G,
  csvData5G,
}) => {

  const length = Math.max(
    csvData4G.length,
    csvData5G.length
  );

  const data = Array.from({ length }, (_, i) => ({
    time: csvData4G[i]?.time_s ?? csvData5G[i]?.time_s,

    '4G LTE':
      csvData4G[i]?.rsrp_dbm,

    '5G NR':
      csvData5G[i]?.rsrp_dbm,
  }));

  return (
    <div className="w-full h-96">

      <ResponsiveContainer width="100%" height="100%">

        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 10,
            bottom: 5,
          }}
        >

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#374151"
          />

          <XAxis
            dataKey="time"
            stroke="#9CA3AF"
            label={{
              value: 'Temps (s)',
              position: 'insideBottomRight',
              offset: -10,
            }}
          />

          <YAxis
            stroke="#9CA3AF"
            domain={[-120, -60]}
            label={{
              value: 'RSRP (dBm)',
              angle: -90,
              position: 'insideLeft',
            }}
          />

          <Tooltip
            formatter={(value: any) =>
              [`${value} dBm`, 'RSRP']
            }
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #4B5563',
              borderRadius: '8px',
              color: '#E5E7EB',
            }}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="4G LTE"
            stroke="#ef4444"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 7 }}
          />

          <Line
            type="monotone"
            dataKey="5G NR"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 7 }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
};

export default RSRPChart;