import type {
  DashboardState,
  NS3Event,
  ChartPoint,
  KPIData,
  NodeState,
} from '@/types/ns3'

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_HISTORY = 80   // rolling chart window
const MAX_LOGS    = 200  // max log entries kept

// ── Initial state ─────────────────────────────────────────────────────────────

export const initialState: DashboardState = {
  status        : 'idle',
  tech          : '4g',
  isMock        : false,
  nodes         : {},
  links         : [],
  throughputData: [],
  sinrData      : [],
  rsrpData      : [],
  lossData      : [],
  logs          : [],
  kpi           : { avgThroughput: 0, peakThroughput: 0, avgSINR: undefined, avgRSRP: undefined, avgLoss: 0 },
  activeNodes   : [],
  simTime       : 0,
}

// ── Action type ───────────────────────────────────────────────────────────────

export type DashboardAction =
  | { type: 'NS3_EVENT'; payload: NS3Event }
  | { type: 'RESET' }

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Insert/merge a value into a rolling ChartPoint array keyed by simulation time */
function mergeChartPoint(
  history: ChartPoint[],
  time   : number,
  nodeKey: string,
  value  : number | undefined,
): ChartPoint[] {
  if (value === undefined) return history

  const BUCKET = 0.05 // merge points within 50 ms of each other
  const idx = history.findIndex(p => Math.abs(p.time - time) < BUCKET)

  if (idx >= 0) {
    const updated = [...history]
    updated[idx]  = { ...updated[idx], [nodeKey]: value }
    return updated
  }

  const next = [...history, { time, [nodeKey]: value }]
  return next.length > MAX_HISTORY ? next.slice(next.length - MAX_HISTORY) : next
}

/** Average of defined numeric values */
function avg(vals: (number | undefined)[]): number | undefined {
  const defined = vals.filter((v): v is number => v !== undefined)
  return defined.length ? defined.reduce((a, b) => a + b, 0) / defined.length : undefined
}

/** Recompute KPIs from current node snapshot (UEs only, id > 0) */
function computeKPI(nodes: Record<number, NodeState>, prev: KPIData): KPIData {
  const ues = Object.values(nodes).filter(n => n.id !== 0)
  const avgTP = avg(ues.map(n => n.throughput)) ?? 0
  return {
    avgThroughput : avgTP,
    peakThroughput: Math.max(prev.peakThroughput, ...ues.map(n => n.throughput ?? 0)),
    avgSINR       : avg(ues.map(n => n.sinr)),
    avgRSRP       : avg(ues.map(n => n.rsrp)),
    avgLoss       : avg(ues.map(n => n.loss_pct)) ?? 0,
  }
}

// ── Reducer ───────────────────────────────────────────────────────────────────

export function dashboardReducer(
  state : DashboardState,
  action: DashboardAction,
): DashboardState {
  if (action.type === 'RESET') return initialState

  const ev = action.payload

  switch (ev.type) {
    // ── Status update ────────────────────────────────────────────────────────
    case 'status':
      return {
        ...state,
        status: ev.state,
        isMock: ev.isMock ?? state.isMock,
        tech  : ev.tech   ?? state.tech,
      }

    // ── Node position ────────────────────────────────────────────────────────
    case 'node_pos':
      return {
        ...state,
        nodes: {
          ...state.nodes,
          [ev.id]: { ...(state.nodes[ev.id] ?? {}), id: ev.id, x: ev.x, y: ev.y },
        },
      }

    // ── Link topology ────────────────────────────────────────────────────────
    case 'link': {
      // deduplicate
      const exists = state.links.some(l => l.src === ev.src && l.dst === ev.dst)
      if (exists) return state
      return { ...state, links: [...state.links, { src: ev.src, dst: ev.dst, delay: ev.delay }] }
    }

    // ── Stats ────────────────────────────────────────────────────────────────
    case 'stats': {
      const key = `n${ev.node}`

      // Update node live snapshot
      const updatedNode: NodeState = {
        ...(state.nodes[ev.node] ?? { id: ev.node, x: 0, y: 0 }),
        id        : ev.node,
        sinr      : ev.sinr,
        rsrp      : ev.rsrp,
        throughput: ev.throughput,
        loss_pct  : ev.loss_pct,
      }
      const nodes = { ...state.nodes, [ev.node]: updatedNode }

      // Update rolling chart histories
      const throughputData = mergeChartPoint(state.throughputData, ev.time, key, ev.throughput)
      const sinrData       = mergeChartPoint(state.sinrData,       ev.time, key, ev.sinr)
      const rsrpData       = mergeChartPoint(state.rsrpData,       ev.time, key, ev.rsrp)
      const lossData       = mergeChartPoint(state.lossData,       ev.time, key, ev.loss_pct)

      // Track active nodes
      const activeNodes = state.activeNodes.includes(ev.node)
        ? state.activeNodes
        : [...state.activeNodes, ev.node].sort((a, b) => a - b)

      const kpi = computeKPI(nodes, state.kpi)

      return {
        ...state,
        nodes,
        throughputData,
        sinrData,
        rsrpData,
        lossData,
        activeNodes,
        kpi,
        simTime: ev.time,
      }
    }

    // ── Log ──────────────────────────────────────────────────────────────────
    case 'log': {
      const logs = [...state.logs, ev.text]
      return {
        ...state,
        logs: logs.length > MAX_LOGS ? logs.slice(logs.length - MAX_LOGS) : logs,
      }
    }

    default:
      return state
  }
}
