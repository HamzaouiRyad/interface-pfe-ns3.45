'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import type { ChartPoint } from '@/types/ns3'
import { ChartCard, NODE_COLORS, CHART_THEME } from './chart-shared'

interface Props {
  data       : ChartPoint[]
  activeNodes: number[]
}

export function SINRChart({ data, activeNodes }: Props) {
  return (
    <ChartCard title="SINR (dB)">
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
          <CartesianGrid stroke={CHART_THEME.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ fill: CHART_THEME.text, fontSize: 9, fontFamily: 'monospace' }}
            tickFormatter={v => `${Number(v).toFixed(0)}s`}
            interval="preserveStartEnd"
            stroke={CHART_THEME.axis}
          />
          <YAxis
            tick={{ fill: CHART_THEME.text, fontSize: 9, fontFamily: 'monospace' }}
            stroke={CHART_THEME.axis}
            width={30}
          />
          {/* Poor / Fair threshold lines */}
          <ReferenceLine y={0}  stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1}
            label={{ value: 'Poor', fill: '#ef4444', fontSize: 8, fontFamily: 'monospace', position: 'insideTopLeft' }} />
          <ReferenceLine y={10} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1}
            label={{ value: 'Fair', fill: '#f59e0b', fontSize: 8, fontFamily: 'monospace', position: 'insideTopLeft' }} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 6, fontSize: 11 }}
            labelStyle={{ color: '#94a3b8', fontFamily: 'monospace' }}
            labelFormatter={v => `t = ${Number(v).toFixed(2)} s`}
            formatter={(v: number) => [`${v.toFixed(1)} dB`]}
          />
          <Legend
            iconType="circle"
            iconSize={6}
            wrapperStyle={{ fontSize: 10, fontFamily: 'monospace', paddingTop: 4 }}
          />
          {activeNodes.map(id => (
            <Line
              key={id}
              type="monotone"
              dataKey={`n${id}`}
              name={`UE ${id}`}
              stroke={NODE_COLORS[id] ?? '#94a3b8'}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
