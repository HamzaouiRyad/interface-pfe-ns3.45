import type { NS3Event } from '@/types/ns3'

/**
 * Parse a single line of NS3 stdout/stderr into a typed event.
 * Supports:
 *   t=0.5 node=1 tx_bytes=1000 rx_bytes=950 [sinr=12.3] [rsrp=-80.5]
 *   LINK node0 -- node1 delay=5ms
 *   NODE id=0 x=300.0 y=100.0
 *   (anything else → log event)
 */
export function parseLine(line: string): NS3Event | null {
  line = line.trim()
  if (!line) return null

  // Stats line
  let m = line.match(/t=([\d.]+).*node=(\d+).*tx_bytes=(\d+).*rx_bytes=(\d+)/)
  if (m) {
    const txB   = parseInt(m[3])
    const rxB   = parseInt(m[4])
    const sinrM = line.match(/sinr=([-\d.]+)/)
    const rsrpM = line.match(/rsrp=([-\d.]+)/)
    return {
      type      : 'stats',
      time      : parseFloat(m[1]),
      node      : parseInt(m[2]),
      tx_bytes  : txB,
      rx_bytes  : rxB,
      throughput: +((rxB * 8 / 1e6).toFixed(3)),
      loss_pct  : txB > 0 ? +(((txB - rxB) / txB * 100).toFixed(2)) : 0,
      sinr      : sinrM ? parseFloat(sinrM[1]) : undefined,
      rsrp      : rsrpM ? parseFloat(rsrpM[1]) : undefined,
    }
  }

  // Link topology
  m = line.match(/LINK node(\d+) -- node(\d+) delay=(\S+)/)
  if (m) return { type: 'link', src: +m[1], dst: +m[2], delay: m[3] }

  // Node position
  m = line.match(/NODE id=(\d+) x=([\d.]+) y=([\d.]+)/)
  if (m) return { type: 'node_pos', id: +m[1], x: +m[2], y: +m[3] }

  return { type: 'log', text: line }
}
