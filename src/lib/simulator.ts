import 'server-only'
import { spawn }               from 'child_process'
import { parseLine }           from './ns3-parser'
import { simState, broadcast } from './state'
import type { SimTech }        from '@/types/ns3'

const NS3_PATH       = process.env.NS3_PATH        ?? ''
const NS3_SCRIPT_4G  = process.env.NS3_SCRIPT_4G   ?? process.env.NS3_SCRIPT ?? 'scratch/fixed-4g'
const NS3_SCRIPT_5G  = process.env.NS3_SCRIPT_5G   ?? 'scratch/fixed-5g'

/** True when NS3_PATH is not configured → use mock data */
export const IS_MOCK = !NS3_PATH

// ── Mock topology ─────────────────────────────────────────────────────────────

const MOCK_NODES_4G = [
  { id: 0, x: 300, y:  60 }, // eNodeB
  { id: 1, x:  80, y: 260 },
  { id: 2, x: 520, y: 260 },
  { id: 3, x: 160, y: 420 },
  { id: 4, x: 440, y: 420 },
]

const MOCK_LINKS_4G = [
  { src: 0, dst: 1, delay: '5ms' },
  { src: 0, dst: 2, delay: '3ms' },
  { src: 0, dst: 3, delay: '8ms' },
  { src: 0, dst: 4, delay: '6ms' },
]

// 5G NR: 5 UEs, lower latency links
const MOCK_NODES_5G = [
  { id: 0, x: 300, y:  60 }, // gNB
  { id: 1, x:  60, y: 220 },
  { id: 2, x: 540, y: 220 },
  { id: 3, x: 120, y: 400 },
  { id: 4, x: 480, y: 400 },
  { id: 5, x: 300, y: 460 },
]

const MOCK_LINKS_5G = [
  { src: 0, dst: 1, delay: '1ms' },
  { src: 0, dst: 2, delay: '1ms' },
  { src: 0, dst: 3, delay: '2ms' },
  { src: 0, dst: 4, delay: '2ms' },
  { src: 0, dst: 5, delay: '2ms' },
]

// ── UE profiles ───────────────────────────────────────────────────────────────

// 4G LTE: 8–22 Mbps, SINR 6–18 dB, RSRP -95–-75 dBm
const UE_PROFILES_4G = [
  { node: 1, baseTp: 15, baseSINR: 12, baseRSRP:  -80, baseLoss: 2.0 },
  { node: 2, baseTp: 22, baseSINR: 18, baseRSRP:  -75, baseLoss: 1.0 },
  { node: 3, baseTp:  8, baseSINR:  6, baseRSRP:  -95, baseLoss: 5.0 },
  { node: 4, baseTp: 18, baseSINR: 15, baseRSRP:  -82, baseLoss: 3.0 },
]

// 5G NR sub-6GHz: 45–140 Mbps, SINR 13–28 dB, RSRP -83–-62 dBm
const UE_PROFILES_5G = [
  { node: 1, baseTp:  85, baseSINR: 22, baseRSRP:  -68, baseLoss: 0.5 },
  { node: 2, baseTp: 140, baseSINR: 28, baseRSRP:  -62, baseLoss: 0.2 },
  { node: 3, baseTp:  45, baseSINR: 13, baseRSRP:  -83, baseLoss: 1.5 },
  { node: 4, baseTp: 110, baseSINR: 25, baseRSRP:  -70, baseLoss: 0.4 },
  { node: 5, baseTp:  70, baseSINR: 19, baseRSRP:  -76, baseLoss: 0.8 },
]

// ── Mock runner ───────────────────────────────────────────────────────────────

let mockTime = 0

function emitTopology(tech: SimTech) {
  const nodes = tech === '5g' ? MOCK_NODES_5G : MOCK_NODES_4G
  const links = tech === '5g' ? MOCK_LINKS_5G : MOCK_LINKS_4G
  nodes.forEach(n => broadcast({ type: 'node_pos', ...n }))
  links.forEach(l => broadcast({ type: 'link',     ...l }))

  const bsLabel = tech === '5g' ? 'gNB' : 'eNodeB'
  const ueCount = tech === '5g' ? 5 : 4
  broadcast({ type: 'log', text: `[Mock] ${tech.toUpperCase()} simulation — 1 ${bsLabel} + ${ueCount} UEs` })
  broadcast({ type: 'log', text: `[Mock] Set NS3_PATH in .env.local to run real NS3 data` })
  broadcast({ type: 'log', text: `[Mock] t = 0.0 s — starting` })
}

function startMock(tech: SimTech) {
  mockTime = 0
  emitTopology(tech)

  const profiles = tech === '5g' ? UE_PROFILES_5G : UE_PROFILES_4G
  // 5G jitter is tighter (more stable beamformed link)
  const tpJitter   = tech === '5g' ? 15 : 4
  const sinrJitter = tech === '5g' ? 2  : 3
  const rsrpJitter = tech === '5g' ? 3  : 5
  const lossJitter = tech === '5g' ? 0.3 : 1

  simState.mockInterval = setInterval(() => {
    mockTime = parseFloat((mockTime + 0.1).toFixed(2))
    const j = (amp: number) => (Math.random() - 0.5) * amp

    for (const ue of profiles) {
      const tp      = Math.max(0.5, ue.baseTp   + j(tpJitter))
      const sinr    =              ue.baseSINR + j(sinrJitter)
      const rsrp    =              ue.baseRSRP + j(rsrpJitter)
      const loss    = Math.max(0, Math.min(20, ue.baseLoss + j(lossJitter)))
      const rxBytes = Math.floor(tp * 1e6 / 8)
      const txBytes = Math.floor(rxBytes / Math.max(0.01, 1 - loss / 100))

      broadcast({
        type      : 'stats',
        time      : mockTime,
        node      : ue.node,
        tx_bytes  : txBytes,
        rx_bytes  : rxBytes,
        throughput: +tp.toFixed(3),
        loss_pct  : +loss.toFixed(2),
        sinr      : +sinr.toFixed(1),
        rsrp      : +rsrp.toFixed(1),
      })
    }

    if (Math.round(mockTime * 10) % 20 === 0) {
      broadcast({ type: 'log', text: `[Mock] t = ${mockTime.toFixed(1)} s` })
    }

    if (mockTime >= 60) stopSimulation()
  }, 100)
}

function stopMock() {
  if (simState.mockInterval) {
    clearInterval(simState.mockInterval)
    simState.mockInterval = null
  }
}

// ── Real NS3 process ──────────────────────────────────────────────────────────

function startNS3(tech: SimTech) {
  const script = tech === '5g' ? NS3_SCRIPT_5G : NS3_SCRIPT_4G
  const proc   = spawn('./ns3', ['run', script], { cwd: NS3_PATH, shell: false })
  simState.process = proc

  const pipeLines = (src: NodeJS.ReadableStream) => {
    let buf = ''
    src.on('data', (chunk: Buffer) => {
      buf += chunk.toString()
      const lines = buf.split('\n')
      buf = lines.pop() ?? ''
      for (const line of lines) {
        const ev = parseLine(line)
        if (ev) broadcast(ev)
      }
    })
  }

  if (proc.stdout) pipeLines(proc.stdout)
  if (proc.stderr) pipeLines(proc.stderr)

  proc.on('close', () => {
    simState.process = null
    simState.status  = 'stopped'
    broadcast({ type: 'status', state: 'stopped', tech })
  })
}

// ── Public API ────────────────────────────────────────────────────────────────

export function startSimulation(tech: SimTech = '4g') {
  if (simState.status === 'running') return
  simState.status = 'running'
  simState.tech   = tech
  broadcast({ type: 'status', state: 'running', isMock: IS_MOCK, tech })
  IS_MOCK ? startMock(tech) : startNS3(tech)
}

export function stopSimulation() {
  IS_MOCK
    ? stopMock()
    : (simState.process?.kill('SIGTERM'), (simState.process = null))
  simState.status = 'stopped'
  broadcast({ type: 'status', state: 'stopped', tech: simState.tech })
}

export function resetSimulation() {
  stopSimulation()
  simState.status = 'idle'
  broadcast({ type: 'status', state: 'idle', tech: simState.tech })
}
