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

const PowerConversionSection: React.FC = () => {
  // Data for the conversion table
  const conversionTableData = [
    { powerMW: 0.001, powerDBm: -30.0 },
    { powerMW: 0.01, powerDBm: -20.0 },
    { powerMW: 0.1, powerDBm: -10.0 },
    { powerMW: 1.0, powerDBm: 0.0 },
    { powerMW: 100.0, powerDBm: 20.0 },
  ];

  // Data for the conversion curve
  const curveData = [
    { powerMW: 1, power4G: -10, power5G: -8 },
    { powerMW: 10, power4G: 0, power5G: 2 },
    { powerMW: 100, power4G: 10, power5G: 12 },
    { powerMW: 500, power4G: 17, power5G: 19 },
    { powerMW: 1000, power4G: 20, power5G: 22 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Formula & Table */}
      <div className="space-y-6">
        {/* Formula Box */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/30 rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Formule de Conversion</h3>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            <p className="text-center text-xl text-cyan-300 font-mono">
              P(dBm) = 10 × log<sub>10</sub>(P_mW)
            </p>
          </div>
        </div>

        {/* Conversion Table */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-900/60 to-cyan-900/60 border-b border-slate-700">
                <th className="px-6 py-3 text-left text-sm font-semibold text-blue-300">
                  P (mW)
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-300">
                  P (dBm)
                </th>
              </tr>
            </thead>
            <tbody>
              {conversionTableData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-slate-700/50 ${
                    idx % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/40'
                  } hover:bg-slate-700/30 transition-colors`}
                >
                  <td className="px-6 py-3 text-sm text-gray-300">
                    {Number.isInteger(row.powerMW) ? row.powerMW : row.powerMW.toFixed(3)}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-300 font-mono">
                    {row.powerDBm.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Column: Conversion Curve */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Courbe de Conversion Logarithmique</h3>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={curveData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="powerMW"
                scale="log"
                label={{ value: 'Puissance (mW)', position: 'insideBottomRight', offset: -10 }}
                stroke="#9CA3AF"
              />
              <YAxis
                label={{ value: 'P(dBm)', angle: -90, position: 'insideLeft' }}
                domain={[-30, 30]}
                ticks={[-30, -20, -10, 0, 10, 20, 30]}
                stroke="#9CA3AF"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                  color: '#E5E7EB',
                }}
                formatter={(value) => `${Number(value).toFixed(1)} dBm`}
                cursor={{ stroke: '#6366F1', strokeWidth: 2 }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px', color: '#E5E7EB' }}
              />
              <Line
                type="monotone"
                dataKey="power4G"
                stroke="#EF4444"
                strokeWidth={3}
                dot={{ fill: '#FCA5A5', r: 5 }}
                activeDot={{ r: 7 }}
                name="Tendance conversion 4G"
              />
              <Line
                type="monotone"
                dataKey="power5G"
                stroke="#0EA5E9"
                strokeWidth={3}
                dot={{ fill: '#38BDF8', r: 5 }}
                activeDot={{ r: 7 }}
                name="Tendance conversion 5G"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PowerConversionSection;
