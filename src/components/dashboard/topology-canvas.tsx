'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { NodeState, LinkState } from '@/types/ns3'
import { NODE_COLORS } from './chart-shared'

interface Props {
  nodes : Record<number, NodeState>
  links : LinkState[]
  status: string
  tech  : string   // '4g' | '5g'
}

const W = 560
const H = 320
const PAD = 44

// Draw helpers

function toCanvas(
  x: number, y: number,
  minX: number, maxX: number,
  minY: number, maxY: number,
) {
  const rx = maxX === minX ? 0.5 : (x - minX) / (maxX - minX)
  const ry = maxY === minY ? 0.5 : (y - minY) / (maxY - minY)
  return {
    cx: PAD + rx * (W - PAD * 2),
    cy: PAD + ry * (H - PAD * 2),
  }
}

function sinrColor(sinr: number | undefined): string {
  if (sinr === undefined) return '#38bdf8'
  if (sinr >= 15) return '#34d399'   // good
  if (sinr >= 8)  return '#fbbf24'   // fair
  return '#f87171'                   // poor
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = '#0f172a'
  ctx.lineWidth   = 1
  const step = 40
  for (let x = 0; x < W; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = 0; y < H; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }
}

// Component

export function TopologyCanvas({ nodes, links, status, tech }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isNR      = tech === '5g'

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear
    ctx.fillStyle = '#020817'
    ctx.fillRect(0, 0, W, H)
    drawGrid(ctx)

    const ids  = Object.keys(nodes).map(Number)
    const hasNodes = ids.length > 0

    if (!hasNodes) {
      // Placeholder
      ctx.fillStyle  = '#1e293b'
      ctx.font       = '12px monospace'
      ctx.textAlign  = 'center'
      ctx.fillText('Waiting for topology…', W / 2, H / 2)
      return
    }

    // Bounding box for normalisation
    const xs   = ids.map(id => nodes[id].x)
    const ys   = ids.map(id => nodes[id].y)
    const minX = Math.min(...xs), maxX = Math.max(...xs)
    const minY = Math.min(...ys), maxY = Math.max(...ys)

    const pos = (id: number) =>
      toCanvas(nodes[id].x, nodes[id].y, minX, maxX, minY, maxY)

    // Base-station color: blue for 4G eNB, violet for 5G gNB
    const bsColor = isNR ? '#8b5cf6' : '#3b82f6'

    // Links
    for (const link of links) {
      const a = nodes[link.src], b = nodes[link.dst]
      if (!a || !b) continue
      const { cx: x1, cy: y1 } = pos(link.src)
      const { cx: x2, cy: y2 } = pos(link.dst)

      const grad = ctx.createLinearGradient(x1, y1, x2, y2)
      const colA = link.src === 0 ? bsColor + '50' : (NODE_COLORS[link.src] ?? '#38bdf8') + '60'
      const colB = link.dst === 0 ? bsColor + '50' : (NODE_COLORS[link.dst] ?? '#38bdf8') + '60'
      grad.addColorStop(0, colA)
      grad.addColorStop(1, colB)
      ctx.strokeStyle = grad
      ctx.lineWidth   = 1.5
      ctx.setLineDash([4, 4])
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = '#475569'
      ctx.font      = '8px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(link.delay, (x1 + x2) / 2, (y1 + y2) / 2 - 4)
    }

    // Nodes
    for (const id of ids) {
      const node     = nodes[id]
      const { cx, cy } = pos(id)
      const isBS     = id === 0
      const r        = isBS ? 22 : 14
      const color    = isBS ? bsColor : sinrColor(node.sinr)

      // Glow ring while running
      if (status === 'running' && !isBS) {
        ctx.beginPath()
        ctx.arc(cx, cy, r + 6, 0, Math.PI * 2)
        ctx.fillStyle = color + '18'
        ctx.fill()
      }

      // Node body
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      const bodyGrad = ctx.createRadialGradient(cx - r / 3, cy - r / 3, 1, cx, cy, r)
      bodyGrad.addColorStop(0, color + 'cc')
      bodyGrad.addColorStop(1, color + '66')
      ctx.fillStyle = bodyGrad
      ctx.fill()

      ctx.strokeStyle = color
      ctx.lineWidth   = 1.5
      ctx.stroke()

      // Label
      ctx.fillStyle    = '#f1f5f9'
      ctx.font         = `bold ${isBS ? 9 : 8}px monospace`
      ctx.textAlign    = 'center'
      ctx.textBaseline = 'middle'
      // 4G → eNB, 5G → gNB
      ctx.fillText(isBS ? (isNR ? 'gNB' : 'eNB') : `UE${id}`, cx, cy)

      // Stats below UE
      if (!isBS) {
        ctx.textBaseline = 'top'
        const lines: string[] = []
        if (node.throughput !== undefined) lines.push(`${node.throughput.toFixed(1)}M`)
        if (node.sinr       !== undefined) lines.push(`${node.sinr.toFixed(1)}dB`)
        ctx.fillStyle = '#94a3b8'
        ctx.font      = '7px monospace'
        lines.forEach((ln, i) => ctx.fillText(ln, cx, cy + r + 4 + i * 9))
      }
    }
  }, [nodes, links, status, isNR])

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-1 pt-3 px-4">
        <CardTitle className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
          {isNR ? '5G NR' : '4G LTE'} Topology
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="w-full rounded"
          style={{ imageRendering: 'pixelated' }}
        />
      </CardContent>
    </Card>
  )
}
