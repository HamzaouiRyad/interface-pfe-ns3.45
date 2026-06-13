/**
 * Custom Next.js server
 * Adds a WebSocket endpoint at /ws/terminal that spawns a real PTY shell.
 *
 */

import { createServer } from "node:http";
import { parse } from "node:url";
import next from "next";
import { WebSocketServer, WebSocket } from "ws";
import * as pty from "node-pty";

// Config

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT ?? "3000", 10);
const ns3Path = process.env.NS3_PATH || undefined;
const shell =
  process.env.SHELL ||
  (process.platform === "win32" ? "powershell.exe" : "bash");

// Next.js app

const app = next({ dev });
const handle = app.getRequestHandler();

// Active PTY sessions

interface Session {
  pty: pty.IPty;
  ws: WebSocket;
}
const sessions = new Map<string, Session>();

// Message protocol
// Client → server:
//   { type: 'input',  data: string }
//   { type: 'resize', cols: number, rows: number }
// Server → client:
//   raw terminal output (string)
//   JSON: { type: 'info', cwd: string }

function handleSession(ws: WebSocket, id: string) {
  const cwd = ns3Path ?? process.env.HOME ?? "/tmp";

  // Spawn PTY
  const proc = pty.spawn(shell, [], {
    name: "xterm-256color",
    cols: 80,
    rows: 24,
    cwd,
    env: {
      ...(process.env as Record<string, string>),
      TERM: "xterm-256color",
      COLORTERM: "truecolor",
      // If NS3 is available, add it to PATH hint
      ...(ns3Path ? { NS3_PATH: ns3Path } : {}),
    },
  });

  sessions.set(id, { pty: proc, ws });

  // Send initial info frame
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "info", cwd }));
  }

  // If NS3_PATH set, cd there and print a hint automatically
  if (ns3Path) {
    // The shell already started in ns3Path (cwd above), just print a banner
    proc.write(
      `echo -e "\\033[1;34m[NS3 Terminal]\\033[0m Working in ${ns3Path}\\r"\r`,
    );
  }

  // PTY → WebSocket
  proc.onData((data: string) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });

  proc.onExit(({ exitCode }) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(`\r\n\x1b[90m[process exited with code ${exitCode}]\x1b[0m\r\n`);
      ws.close();
    }
    sessions.delete(id);
  });

  // WebSocket → PTY
  ws.on("message", (raw: Buffer | string) => {
    const msg = raw.toString();
    try {
      const parsed = JSON.parse(msg) as
        | { type: "input"; data: string }
        | { type: "resize"; cols: number; rows: number };

      if (parsed.type === "input") proc.write(parsed.data);
      if (parsed.type === "resize") proc.resize(parsed.cols, parsed.rows);
    } catch {
      // Plain string input (fallback)
      proc.write(msg);
    }
  });

  ws.on("close", () => {
    try {
      proc.kill();
    } catch {
      /* already dead */
    }
    sessions.delete(id);
  });

  ws.on("error", () => {
    try {
      proc.kill();
    } catch {
      /* ignore */
    }
    sessions.delete(id);
  });
}

// Boot

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url ?? "/", true);
    handle(req, res, parsedUrl);
  });

  // WebSocket server — noServer: we handle the upgrade ourselves
  const wss = new WebSocketServer({ noServer: true });

  wss.on("connection", (ws, req) => {
    const id = crypto.randomUUID();
    if (dev) console.log(`[terminal] session open  ${id}`);

    handleSession(ws, id);

    ws.on("close", () => {
      if (dev) console.log(`[terminal] session close ${id}`);
    });
  });

  // Intercept upgrade requests for /ws/terminal
  httpServer.on("upgrade", (req, socket, head) => {
    const { pathname } = parse(req.url ?? "/");

    if (pathname === "/ws/terminal") {
      wss.handleUpgrade(req, socket as import("net").Socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    } else {
      // Let other upgrade requests (e.g. HMR websocket) pass through
      socket.destroy();
    }
  });

  httpServer.listen(port, () => {
    console.log();
    console.log(`  ▲ NS3 Dashboard`);
    console.log(`  → http://localhost:${port}`);
    console.log(`  → WebSocket terminal: ws://localhost:${port}/ws/terminal`);
    if (ns3Path) {
      console.log(`  → NS3_PATH: ${ns3Path}`);
    } else {
      console.log(`  → Mock mode (NS3_PATH not set)`);
    }
    console.log();
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    sessions.forEach(({ pty: proc }) => {
      try {
        proc.kill();
      } catch {}
    });
    process.exit(0);
  });
});
