'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { TimeSeriesDataPoint } from '@/types/dashboard';

interface ChartProps {
  title: string;
  unit: string;
  data: TimeSeriesDataPoint[];
  color?: string;
  yAxisDomain?: [number, number];
}

const Chart: React.FC<ChartProps> = ({
  title,
  unit,
  data,
  color = '#3b82f6',
  yAxisDomain,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded text-gray-500">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }}
                tickFormatter={(value) => value.toFixed(1)}
              />
              <YAxis
                label={{ value: unit, angle: -90, position: 'insideLeft' }}
                domain={yAxisDomain}
              />
              <Tooltip
                formatter={(value: any) => [value.toFixed(2), unit]}
                labelFormatter={(value) => `Time: ${value.toFixed(2)}s`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                name={title}
                isAnimationActive={false}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

interface LiveChartsProps {
  throughput: TimeSeriesDataPoint[];
  sinr: TimeSeriesDataPoint[];
  rsrp: TimeSeriesDataPoint[];
  loss_pct: TimeSeriesDataPoint[];
}

export const LiveCharts: React.FC<LiveChartsProps> = ({
  throughput,
  sinr,
  rsrp,
  loss_pct,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Live Charts</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart title="Throughput vs Time" unit="Mbps" data={throughput} color="#3b82f6" />
        <Chart title="SINR vs Time" unit="dB" data={sinr} color="#10b981" />
        <Chart
          title="RSRP vs Time"
          unit="dBm"
          data={rsrp}
          color="#8b5cf6"
          yAxisDomain={[-150, -50]}
        />
        <Chart
          title="Packet Loss vs Time"
          unit="%"
          data={loss_pct}
          color="#f97316"
          yAxisDomain={[0, 100]}
        />
      </div>
    </div>
  );
};
