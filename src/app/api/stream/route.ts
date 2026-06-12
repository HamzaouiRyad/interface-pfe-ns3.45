import type { NextRequest }            from 'next/server'
import { addClient, removeClient, simState } from '@/lib/state'
import { IS_MOCK }                      from '@/lib/simulator'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(_req: NextRequest) {
  const id  = crypto.randomUUID()
  const enc = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      addClient(id, controller)

      // Immediately send current status + mode so the client knows its state
      const hello = enc.encode(
        `data: ${JSON.stringify({
          type  : 'status',
          state : simState.status,
          isMock: IS_MOCK,
        })}\n\n`,
      )
      controller.enqueue(hello)
    },
    cancel() {
      removeClient(id)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type'     : 'text/event-stream',
      'Cache-Control'    : 'no-cache, no-transform',
      'Connection'       : 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
