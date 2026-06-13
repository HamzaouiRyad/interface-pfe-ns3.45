'use client'

import { useEffect, useReducer, useCallback, useRef, useState } from 'react'
import dynamic                        from 'next/dynamic'
import { Button }                     from '@/components/ui/button'
import { Badge }                      from '@/components/ui/badge'
import { Separator }                  from '@/components/ui/separator'
import type { NS3Event, SimTech }     from '@/types/ns3'
import { dashboardReducer, initialState } from '@/lib/dashboard-reducer'
import { KPICard, SimStatusBadge }    from '@/components/dashboard/kpi-card'
import { TechToggle }                 from '@/components/dashboard/tech-toggle'
import { ThroughputChart }            from '@/components/dashboard/throughput-chart'
import { SINRChart }                  from '@/components/dashboard/sinr-chart'
import { RSRPChart }                  from '@/components/dashboard/rsrp-chart'
import { LossChart }                  from '@/components/dashboard/loss-chart'
import { TopologyCanvas }             from '@/components/dashboard/topology-canvas'
import { LogPanel }                   from '@/components/dashboard/log-panel'

// TerminalPanel uses xterm.js (DOM-only) — must be loaded client-side
const TerminalPanel = dynamic(
  () => import('@/components/dashboard/terminal-panel').then(m => m.TerminalPanel),
  { ssr: false, loading: () => null },
)

// Helpers

function fmt(n: number | undefined, decimals = 2, fallback = '—'): string {
  return n !== undefined ? n.toFixed(decimals) : fallback
}

// Page

export default function DashboardPage() {
  const [state, dispatch]   = useReducer(dashboardReducer, initialState)
  const [selectedTech, setSelectedTech] = useState<SimTech>('4g')
  const [showTerminal, setShowTerminal] = useState(false)
  const sseRef              = useRef<EventSource | null>(null)

  // SSE connection
  useEffect(() => {
    function connect() {
      const sse = new EventSource('/api/stream')
      sseRef.current = sse

      sse.onmessage = (e: MessageEvent<string>) => {
        try {
          const event = JSON.parse(e.data) as NS3Event
          dispatch({ type: 'NS3_EVENT', payload: event })
        } catch { /* ignore malformed frames */ }
      }

      sse.onerror = () => {
        sse.close()
        setTimeout(connect, 2000)
      }
    }

    connect()
    return () => sseRef.current?.close()
  }, [])

  // Control actions
  const control = useCallback(async (action: 'start' | 'stop' | 'reset', tech?: SimTech) => {
    if (action === 'reset') dispatch({ type: 'RESET' })
    await fetch('/api/control', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ action, tech }),
    })
  }, [])

  const {
    status, isMock,
    nodes, links,
    throughputData, sinrData, rsrpData, lossData,
    logs, kpi, activeNodes, simTime,
    tech: runningTech,
  } = state

  const isRunning  = status === 'running'
  const hasData    = activeNodes.length > 0
  // While running, show the actual tech; when idle show the user's selection
  const displayTech: SimTech = isRunning ? runningTech : selectedTech
  const isNR       = displayTech === '5g'

  // Tech-specific reference labels
  const techLabel = isNR ? '5G NR' : '4G LTE'
  const bsLabel   = isNR ? 'gNB'   : 'eNB'

  // Render
  return (
    <div className="min-h-screen bg-[#020817] text-slate-100 p-4 space-y-4">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded border flex items-center justify-center transition-colors ${
              isNR
                ? 'bg-violet-500/20 border-violet-500/40'
                : 'bg-sky-500/20    border-sky-500/40'
            }`}>
              <span className={`text-xs font-bold ${isNR ? 'text-violet-400' : 'text-sky-400'}`}>
                N3
              </span>
            </div>
            <h1 className="text-sm font-bold tracking-tight text-slate-100">NS3 Dashboard</h1>
          </div>

          <Separator orientation="vertical" className="h-4 bg-slate-700" />

          {/* Mode badge */}
          <Badge
            variant="outline"
            className={`text-[10px] font-mono px-2 py-0.5 ${
              isMock
                ? 'border-violet-700 text-violet-400 bg-violet-950/40'
                : 'border-sky-700 text-sky-400 bg-sky-950/40'
            }`}
          >
            {isMock ? '⚡ Mock' : '🔬 NS3 Live'}
          </Badge>

          <SimStatusBadge status={status} />

          {hasData && (
            <span className="text-[10px] font-mono text-slate-500">
              {techLabel} · t = {simTime.toFixed(1)} s
            </span>
          )}
        </div>

        {/* Right side: tech toggle + controls */}
        <div className="flex items-center gap-3">
          {/* 4G / 5G toggle — disabled while simulation is running */}
          <TechToggle
            value={selectedTech}
            onChange={(t) => {
              setSelectedTech(t)
              // If stopped/idle reset chart data so 4G data doesn't bleed into 5G
              if (!isRunning) dispatch({ type: 'RESET' })
            }}
            disabled={isRunning}
          />

          <Separator orientation="vertical" className="h-5 bg-slate-700" />

          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => control('start', selectedTech)}
              disabled={isRunning}
              className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs h-7 px-3 font-mono disabled:opacity-40"
            >
              ▶ Start
            </Button>
            <Button
              size="sm"
              onClick={() => control('stop')}
              disabled={!isRunning}
              className="bg-red-800 hover:bg-red-700 text-white text-xs h-7 px-3 font-mono disabled:opacity-40"
            >
              ■ Stop
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => control('reset')}
              className="border-slate-700 text-slate-400 hover:text-slate-100 hover:border-slate-500 text-xs h-7 px-3 font-mono"
            >
              ↺ Reset
            </Button>

            <Separator orientation="vertical" className="h-5 bg-slate-700 self-center" />

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowTerminal(v => !v)}
              className={`text-xs h-7 px-3 font-mono transition-colors ${
                showTerminal
                  ? 'border-sky-600 text-sky-400 bg-sky-950/30 hover:bg-sky-950/50'
                  : 'border-slate-700 text-slate-400 hover:text-slate-100 hover:border-slate-500'
              }`}
            >
              ⌨ Terminal
            </Button>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-800" />

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard
          title="Avg Throughput"
          value={fmt(hasData ? kpi.avgThroughput : undefined)}
          unit="Mbps"
          highlight={isRunning}
        />
        <KPICard
          title="Peak Throughput"
          value={fmt(hasData ? kpi.peakThroughput : undefined)}
          unit="Mbps"
        />
        <KPICard
          title="Avg SINR"
          value={fmt(kpi.avgSINR, 1)}
          unit="dB"
        />
        <KPICard
          title="Avg RSRP"
          value={fmt(kpi.avgRSRP, 1)}
          unit="dBm"
        />
        <KPICard
          title="Avg Loss"
          value={fmt(hasData ? kpi.avgLoss : undefined)}
          unit="%"
        />
        <KPICard
          title={`Active UEs / ${bsLabel}`}
          value={activeNodes.length > 0 ? `${activeNodes.length} / 1` : '—'}
          unit="nodes"
        />
      </div>

      {/* Main content: Topology + Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Left: topology + log */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <TopologyCanvas
            nodes={nodes}
            links={links}
            status={status}
            tech={displayTech}
          />
          <LogPanel logs={logs} />
        </div>

        {/* Right: 2×2 chart grid */}
        <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ThroughputChart data={throughputData} activeNodes={activeNodes} />
          <SINRChart       data={sinrData}       activeNodes={activeNodes} />
          <RSRPChart       data={rsrpData}       activeNodes={activeNodes} />
          <LossChart       data={lossData}       activeNodes={activeNodes} />
        </div>
      </div>

      {/* Integrated Terminal */}
      {showTerminal && (
        <div className="sticky bottom-0 left-0 right-0 z-20 mx-[-1rem] px-4">
          <TerminalPanel onClose={() => setShowTerminal(false)} />
        </div>
      )}

      {/* Footer */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
        <p className="text-[9px] font-mono text-slate-700">
          NS3 Dashboard — Next.js + shadcn/ui + recharts
        </p>
        {isMock && (
          <p className="text-[9px] font-mono text-slate-700">
            Set{' '}
            <span className={isNR ? 'text-violet-500' : 'text-sky-500'}>
              {isNR ? 'NS3_SCRIPT_5G' : 'NS3_SCRIPT_4G'}
            </span>{' '}
            + <span className="text-slate-500">NS3_PATH</span> in{' '}
            <span className="text-slate-500">.env.local</span> to enable live data
          </p>
        )}
      </div>
    </div>
  )
}
