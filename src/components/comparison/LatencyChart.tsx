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

interface CSVData {
  time_s?: number;
  latence_ms?: number;
}

interface Props {
  csvData4G: CSVData[];
  csvData5G: CSVData[];
}

const LatencyChart: React.FC<Props> = ({ csvData4G, csvData5G }) => {
  // Fusion des données 4G + 5G par index temporel
  const data = csvData4G.map((row4g, index) => {
    const row5g = csvData5G[index] || {};

    return {
      time: row4g.time_s ?? index,

      "4G Latency": row4g.latence_ms ?? 0,
      "5G Latency": row5g.latence_ms ?? 0,
    };
  });

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

          <XAxis dataKey="time" stroke="#9CA3AF" />
          <YAxis
            stroke="#9CA3AF"
            label={{
              value: "Latency (ms)",
              angle: -90,
              position: "insideLeft",
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #4B5563",
              borderRadius: "8px",
              color: "#E5E7EB",
            }}
          />

          <Legend wrapperStyle={{ color: "#E5E7EB" }} />

          <Line
            type="monotone"
            dataKey="4G Latency"
            stroke="#EF4444"
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="5G Latency"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LatencyChart;
