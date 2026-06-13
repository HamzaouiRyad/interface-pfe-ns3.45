'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ReactNode } from 'react'

// Per-node color palette (keep as-is, these are data colors not UI theme colors)
export const NODE_COLORS: Record<number, string> = {
  1: '#38bdf8', // sky-400
  2: '#34d399', // emerald-400
  3: '#fb923c', // orange-400
  4: '#f472b6', // pink-400
  5: '#a78bfa', // violet-400
}

// Use CSS variables / shadcn theme tokens for charts
export const CHART_THEME = {
  grid: 'hsl(var(--border))',
  axis: 'hsl(var(--muted-foreground))',
  text: 'hsl(var(--muted-foreground))',
  bg: 'transparent',
}

export function ChartCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="bg-background border border-border shadow-sm">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-2 pb-3">
        {children}
      </CardContent>
    </Card>
  )
}