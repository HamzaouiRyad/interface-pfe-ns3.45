'use client';

import React, { useMemo } from 'react';
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
  throughput_dl_mbps?: number;
}

interface Props {
  csvData4G: CSVData[];
  csvData5G: CSVData[];
}

const ThroughputChart: React.FC<Props> = ({
  csvData4G,
  csvData5G,
}) => {

  const data = useMemo(() => {

    const len = Math.max(csvData4G.length, csvData5G.length);

    return Array.from({ length: len }, (_, i) => ({
      time: csvData4G[i]?.time_s ?? csvData5G[i]?.time_s,

      '4G LTE':
        csvData4G[i]?.throughput_dl_mbps,

      '5G NR':
        csvData5G[i]?.throughput_dl_mbps,
    }));

  }, [csvData4G, csvData5G]);

  if (!data.length) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-400">
        Aucun fichier chargé
      </div>
    );
  }

  return (

    <div className="w-full h-96">

      <ResponsiveContainer width="100%" height="100%">

        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 10,
            bottom: 10,
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
              position: 'insideBottom',
              offset: -5,
            }}
          />

          <YAxis
            stroke="#9CA3AF"
            label={{
              value: 'Débit DL (Mbps)',
              angle: -90,
              position: 'insideLeft',
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#1E293B',
              border: '1px solid #475569',
              borderRadius: '10px',
            }}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="4G LTE"
            stroke="#EF4444"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />

          <Line
            type="monotone"
            dataKey="5G NR"
            stroke="#0EA5E9"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );
};

export default ThroughputChart;