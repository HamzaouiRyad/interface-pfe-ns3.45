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

type CSVData = {
  time_s?: number;
  throughput_dl_mbps?: number;
  sinr_db?: number;
};

interface Props {
  data4G: CSVData[];
  data5G: CSVData[];
}

const PowerConversionSection: React.FC<Props> = ({ data4G, data5G }) => {
  // Convert SINR → pseudo power (log-like mapping for visualization)
  const chartData = useMemo(() => {
    const maxLen = Math.max(data4G.length, data5G.length);

    return Array.from({ length: maxLen }).map((_, i) => {
      const d4 = data4G[i];
      const d5 = data5G[i];

      const sinrToPower = (sinr?: number) =>
        sinr !== undefined ? 10 * Math.log10(Math.max(sinr, 0.1)) : null;

      return {
        time: d5?.time_s ?? d4?.time_s ?? i * 0.1,

        power4G: sinrToPower(d4?.sinr_db),
        power5G: sinrToPower(d5?.sinr_db),
      };
    });
  }, [data4G, data5G]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* LEFT: FORMULA */}
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Conversion SINR → dB (visualisation)
          </h3>

          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            <p className="text-center text-xl text-cyan-300 font-mono">
              P(dB) = 10 × log<sub>10</sub>(SINR)
            </p>
          </div>

          <p className="text-gray-400 text-sm mt-4">
            Cette transformation est utilisée uniquement pour comparer visuellement 4G vs 5G.
          </p>
        </div>
      </div>

      {/* RIGHT: CHART */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">
          Comparaison puissance (dérivée SINR)
        </h3>

        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

              <XAxis
                dataKey="time"
                stroke="#9CA3AF"
                label={{ value: 'Temps (s)', position: 'insideBottomRight', offset: -5 }}
              />

              <YAxis stroke="#9CA3AF" />

              <Tooltip
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
                dataKey="power4G"
                stroke="#EF4444"
                strokeWidth={2}
                dot={false}
                name="4G (SINR→dB)"
              />

              <Line
                type="monotone"
                dataKey="power5G"
                stroke="#0EA5E9"
                strokeWidth={2}
                dot={false}
                name="5G (SINR→dB)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PowerConversionSection;