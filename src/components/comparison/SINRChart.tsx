"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Type aligné avec ton parser CSV
interface CSVData {
  time_s?: number;
  sinr_db?: number;
}

interface Props {
  csvData4G: CSVData[];
  csvData5G: CSVData[];
}

const SINRChart: React.FC<Props> = ({ csvData4G, csvData5G }) => {
  // Fusion des datasets sur time_s
  const mergedData = csvData4G.map((row4g, index) => {
    const row5g = csvData5G[index];

    return {
      time: row4g.time_s ?? index,

      sinr4g: row4g.sinr_db ?? 0,
      sinr5g: row5g?.sinr_db ?? 0,
    };
  });

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mergedData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

          <XAxis
            dataKey="time"
            label={{
              value: "Temps (s)",
              position: "insideBottomRight",
              offset: -5,
            }}
            stroke="#9CA3AF"
          />

          <YAxis
            label={{
              value: "SINR (dB)",
              angle: -90,
              position: "insideLeft",
            }}
            stroke="#9CA3AF"
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #4B5563",
              borderRadius: "8px",
              color: "#E5E7EB",
            }}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="sinr4g"
            name="4G LTE"
            stroke="#EF4444"
            strokeWidth={3}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="sinr5g"
            name="5G NR"
            stroke="#0EA5E9"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SINRChart;