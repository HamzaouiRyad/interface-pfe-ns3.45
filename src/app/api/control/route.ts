import { NextRequest, NextResponse }               from 'next/server'
import { startSimulation, stopSimulation, resetSimulation } from '@/lib/simulator'
import type { SimTech }                            from '@/types/ns3'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { action, tech } = (await req.json()) as { action: string; tech?: SimTech }

    switch (action) {
      case 'start': startSimulation(tech ?? '4g'); break
      case 'stop':  stopSimulation();              break
      case 'reset': resetSimulation();             break
      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}
