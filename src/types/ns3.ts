// ── Simulation status & technology ───────────────────────────────────────────
export type SimStatus = 'idle' | 'running' | 'stopped'
export type SimTech   = '4g' | '5g'

// ── Server-Sent Events ───────────────────────────────────────────────────────
export interface StatsEvent {
  type: 'stats'
  time: number
  node: number
  tx_bytes: number
  rx_bytes: number
  throughput: number
  loss_pct: number
  sinr?: number
  rsrp?: number
}

export interface LinkEvent {
  type: 'link'
  src: number
  dst: number
  delay: string
}

export interface NodePosEvent {
  type: 'node_pos'
  id: number
  x: number
  y: number
}

export interface LogEvent {
  type: 'log'
  text: string
}

export interface StatusEvent {
  type  : 'status'
  state : SimStatus
  isMock?: boolean
  tech  ?: SimTech
}

export type NS3Event = StatsEvent | LinkEvent | NodePosEvent | LogEvent | StatusEvent

// ── Chart data ───────────────────────────────────────────────────────────────
// Each point: { time: 0.1, 'n1': 15.2, 'n2': 22.1, ... }
export type ChartPoint = { time: number } & Record<string, number | undefined>

// ── Topology ─────────────────────────────────────────────────────────────────
export interface NodeState {
  id: number
  x: number
  y: number
  sinr?: number
  rsrp?: number
  throughput?: number
  loss_pct?: number
}

export interface LinkState {
  src: number
  dst: number
  delay: string
}

// ── KPI snapshot ─────────────────────────────────────────────────────────────
export interface KPIData {
  avgThroughput: number
  peakThroughput: number
  avgSINR: number | undefined
  avgRSRP: number | undefined
  avgLoss: number
}

// ── Client-side dashboard state ───────────────────────────────────────────────
export interface DashboardState {
  status: SimStatus
  tech  : SimTech
  isMock: boolean
  nodes: Record<number, NodeState>
  links: LinkState[]
  throughputData: ChartPoint[]
  sinrData: ChartPoint[]
  rsrpData: ChartPoint[]
  lossData: ChartPoint[]
  logs: string[]
  kpi: KPIData
  activeNodes: number[]
  simTime: number
}
