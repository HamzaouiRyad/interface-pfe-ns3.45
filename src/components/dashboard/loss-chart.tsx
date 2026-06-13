"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { ChartPoint } from "@/types/ns3";
import { ChartCard, NODE_COLORS, CHART_THEME } from "./chart-shared";

interface Props {
  data: ChartPoint[];
  activeNodes: number[];
}

export function LossChart({ data, activeNodes }: Props) {
  return (
    <ChartCard title="Packet Loss (%)">
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart
          data={data}
          margin={{ top: 4, right: 12, left: -10, bottom: 0 }}
        >
          <defs>
            {activeNodes.map((id) => (
              <linearGradient
                key={id}
                id={`lg${id}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={NODE_COLORS[id] ?? "#94a3b8"}
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor={NODE_COLORS[id] ?? "#94a3b8"}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid
            stroke={CHART_THEME.grid}
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{
              fill: CHART_THEME.text,
              fontSize: 9,
              fontFamily: "monospace",
            }}
            tickFormatter={(v) => `${Number(v).toFixed(0)}s`}
            interval="preserveStartEnd"
            stroke={CHART_THEME.axis}
          />
          <YAxis
            tick={{
              fill: CHART_THEME.text,
              fontSize: 9,
              fontFamily: "monospace",
            }}
            stroke={CHART_THEME.axis}
            domain={[0, "auto"]}
            width={30}
          />
          <ReferenceLine
            y={5}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{
              value: "5%",
              fill: "#f59e0b",
              fontSize: 8,
              fontFamily: "monospace",
              position: "insideTopRight",
            }}
          />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 6,
              fontSize: 11,
            }}
            labelStyle={{ color: "#94a3b8", fontFamily: "monospace" }}
            labelFormatter={(v) => `t = ${Number(v).toFixed(2)} s`}
            formatter={(v: number) => [`${v.toFixed(2)} %`]}
          />
          <Legend
            iconType="circle"
            iconSize={6}
            wrapperStyle={{
              fontSize: 10,
              fontFamily: "monospace",
              paddingTop: 4,
            }}
          />
          {activeNodes.map((id) => (
            <Area
              key={id}
              type="monotone"
              dataKey={`n${id}`}
              name={`UE ${id}`}
              stroke={NODE_COLORS[id] ?? "#94a3b8"}
              fill={`url(#lg${id})`}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
