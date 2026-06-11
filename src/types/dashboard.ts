// Dashboard data types

export type SimulationState = 'ready' | 'running' | 'stopped';
export type MessageType = 'status' | 'stats' | 'link' | 'node_pos' | 'log';

export interface DashboardMessage {
  type: MessageType;
  time: number;
  state?: SimulationState;
  throughput?: number;
  sinr?: number;
  rsrp?: number;
  loss_pct?: number;
  src?: number;
  dst?: number;
  delay?: number;
  id?: number;
  x?: number;
  y?: number;
  text?: string;
}

export interface KPIMetric {
  current: number;
  minimum: number;
  average: number;
  maximum: number;
}

export interface DashboardStats {
  throughput: KPIMetric;
  sinr: KPIMetric;
  rsrp: KPIMetric;
  loss_pct: KPIMetric;
}

export interface TimeSeriesDataPoint {
  time: number;
  value: number;
}

export interface Node {
  id: number;
  x: number;
  y: number;
}

export interface Link {
  src: number;
  dst: number;
  delay: number;
}

export interface TopologyData {
  nodes: Node[];
  links: Link[];
  nodeCount: number;
  linkCount: number;
}

export interface LogEntry {
  timestamp: number;
  message: string;
  type: 'status' | 'stats' | 'link' | 'node' | 'warning';
}

export interface DashboardState {
  simulationState: SimulationState;
  simulationTime: number;
  wsConnected: boolean;
  stats: DashboardStats;
  timeSeriesData: {
    throughput: TimeSeriesDataPoint[];
    sinr: TimeSeriesDataPoint[];
    rsrp: TimeSeriesDataPoint[];
    loss_pct: TimeSeriesDataPoint[];
  };
  topology: TopologyData;
  logs: LogEntry[];
}
