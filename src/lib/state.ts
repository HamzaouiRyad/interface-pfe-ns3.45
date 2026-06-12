import 'server-only'
import type { SimStatus, SimTech } from '@/types/ns3'
import type { ChildProcess } from 'child_process'

// ── Types ────────────────────────────────────────────────────────────────────

export interface SSEClient {
  id: string
  controller: ReadableStreamDefaultController<Uint8Array>
}

interface GlobalSimState {
  status      : SimStatus
  tech        : SimTech
  process     : ChildProcess | null
  mockInterval: ReturnType<typeof setInterval> | null
  clients     : Map<string, SSEClient>
}

// ── Singleton (survives Next.js hot-reload in dev) ───────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __simState: GlobalSimState | undefined
}

if (!globalThis.__simState) {
  globalThis.__simState = {
    status      : 'idle',
    tech        : '4g',
    process     : null,
    mockInterval: null,
    clients     : new Map(),
  }
}

export const simState: GlobalSimState = globalThis.__simState!

// ── SSE client registry ───────────────────────────────────────────────────────

export function addClient(
  id: string,
  controller: ReadableStreamDefaultController<Uint8Array>,
) {
  simState.clients.set(id, { id, controller })
}

export function removeClient(id: string) {
  simState.clients.delete(id)
}

// ── Broadcast helper ──────────────────────────────────────────────────────────

const enc = new TextEncoder()

export function broadcast(data: object) {
  const msg  = enc.encode(`data: ${JSON.stringify(data)}\n\n`)
  const dead: string[] = []

  for (const [id, client] of simState.clients) {
    try {
      client.controller.enqueue(msg)
    } catch {
      dead.push(id)
    }
  }

  dead.forEach(id => simState.clients.delete(id))
}
