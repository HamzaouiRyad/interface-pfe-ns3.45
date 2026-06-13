'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Per-node color palette

export const NODE_COLORS: Record<number, string> = {
  1: '#38bdf8', // sky-400    — UE1
  2: '#34d399', // emerald-400 — UE2
  3: '#fb923c', // orange-400  — UE3
  4: '#f472b6', // pink-400    — UE4
  5: '#a78bfa', // violet-400  — UE5
}

export const CHART_THEME = {
  grid  : '#1e293b', // slate-800
  axis  : '#475569', // slate-600
  text  : '#64748b', // slate-500
  bg    : 'transparent',
}

// Generic chart card wrapper

export function ChartCard({
  title,
  children,
}: {
  title   : string
  children: React.ReactNode
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <Card className="bg-card border-border cursor-pointer" onClick={() => setExpanded(true)}>
        <CardHeader className="pb-2 pt-3 px-4">
          <CardTitle className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-3">
          {children}
        </CardContent>
      </Card>

      {expanded && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6" onClick={() => setExpanded(false)}>
          <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Card className="bg-card border-border">
              <CardHeader className="flex items-center justify-between pb-2 pt-3 px-4">
                <CardTitle className="text-sm font-mono">{title} — Expanded</CardTitle>
                <button className="text-sm font-mono text-foreground" onClick={() => setExpanded(false)}>Close</button>
              </CardHeader>
              <CardContent className="p-4">
                {children}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}
