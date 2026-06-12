'use client'

import { Card, CardContent }        from '@/components/ui/card'
import { Badge }                    from '@/components/ui/badge'

interface KPICardProps {
  title    : string
  value    : string | number
  unit     : string
  sub?     : string
  trend?   : 'up' | 'down' | 'neutral'
  highlight?: boolean
}

const trendSymbol: Record<string, string> = { up: '↑', down: '↓', neutral: '—' }
const trendColor : Record<string, string> = {
  up     : 'text-emerald-400',
  down   : 'text-red-400',
  neutral: 'text-slate-500',
}

export function KPICard({ title, value, unit, sub, trend, highlight }: KPICardProps) {
  return (
    <Card
      className={`bg-slate-900 border-slate-800 transition-colors ${
        highlight ? 'border-sky-500/50 shadow-sky-500/10 shadow-lg' : ''
      }`}
    >
      <CardContent className="p-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">
          {title}
        </p>
        <div className="flex items-end gap-1.5">
          <span className="text-2xl font-bold tabular-nums text-slate-100 leading-none">
            {value}
          </span>
          <span className="text-xs text-slate-400 mb-0.5">{unit}</span>
          {trend && (
            <span className={`text-xs mb-0.5 ${trendColor[trend]}`}>
              {trendSymbol[trend]}
            </span>
          )}
        </div>
        {sub && (
          <p className="text-[10px] text-slate-600 mt-1 font-mono">{sub}</p>
        )}
      </CardContent>
    </Card>
  )
}

// ── Status badge (reused in header) ──────────────────────────────────────────

export function SimStatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    idle   : { label: '● Idle',    cls: 'bg-slate-700 text-slate-300 border-slate-600' },
    running: { label: '● Running', cls: 'bg-emerald-950 text-emerald-400 border-emerald-700 animate-pulse' },
    stopped: { label: '● Stopped', cls: 'bg-red-950 text-red-400 border-red-800' },
  }
  const { label, cls } = cfg[status] ?? cfg.idle
  return (
    <Badge variant="outline" className={`font-mono text-[10px] px-2 py-0.5 ${cls}`}>
      {label}
    </Badge>
  )
}
