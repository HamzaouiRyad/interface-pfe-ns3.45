"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Types (kept local to avoid importing xterm at module level)
type ConnState = "connecting" | "open" | "closed" | "error";

interface Props {
  onClose: () => void;
  /** Height preset in px */
  height?: number;
}

// Xterm theme matching the dark dashboard
const XTERM_THEME = {
  background: "#020817",
  foreground: "#e2e8f0",
  cursor: "#38bdf8",
  cursorAccent: "#020817",
  selectionBackground: "#38bdf840",
  black: "#1e293b",
  red: "#f87171",
  green: "#34d399",
  yellow: "#fbbf24",
  blue: "#38bdf8",
  magenta: "#a78bfa",
  cyan: "#22d3ee",
  white: "#cbd5e1",
  brightBlack: "#475569",
  brightRed: "#fca5a5",
  brightGreen: "#6ee7b7",
  brightYellow: "#fde68a",
  brightBlue: "#7dd3fc",
  brightMagenta: "#c4b5fd",
  brightCyan: "#67e8f9",
  brightWhite: "#f1f5f9",
};

// Height presets
const HEIGHTS = { sm: 220, md: 360, lg: 520 } as const;
type HeightKey = keyof typeof HEIGHTS;

// Component

export function TerminalPanel({ onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Using `any` so we don't import xterm types at module level (SSR safety)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const termRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fitRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);

  const [connState, setConnState] = useState<ConnState>("connecting");
  const [cwd, setCwd] = useState<string>("");
  const [heightKey, setHeightKey] = useState<HeightKey>("md");
  const height = HEIGHTS[heightKey];

  //Reconnect logic
  const connect = useCallback(async () => {
    if (!containerRef.current) return;

    // Cleanup previous session
    termRef.current?.clear();
    wsRef.current?.close();

    setConnState("connecting");

    // Dynamic imports — safe because this runs only in the browser
    const { Terminal } = await import("@xterm/xterm");
    const { FitAddon } = await import("@xterm/addon-fit");
    const { WebLinksAddon } = await import("@xterm/addon-web-links");

    // Create or reuse terminal instance
    if (!termRef.current) {
      const term = new Terminal({
        theme: XTERM_THEME,
        fontFamily:
          '"Cascadia Code", "JetBrains Mono", "Fira Code", Menlo, monospace',
        fontSize: 13,
        lineHeight: 1.45,
        cursorBlink: true,
        cursorStyle: "bar",
        scrollback: 2000,
        allowProposedApi: true,
        convertEol: false,
      });

      const fit = new FitAddon();
      const webLinks = new WebLinksAddon();

      term.loadAddon(fit);
      term.loadAddon(webLinks);
      term.open(containerRef.current);

      termRef.current = term;
      fitRef.current = fit;

      // Cleanup previous observer
      roRef.current?.disconnect();

      // Auto-fit on container resize
      const ro = new ResizeObserver(() => {
        try {
          fitRef.current?.fit();
          const { cols, rows } = termRef.current;
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "resize", cols, rows }));
          }
        } catch {
          /* terminal may be disposed */
        }
      });
      ro.observe(containerRef.current);
      roRef.current = ro;
    } else {
      // Reuse existing terminal, just write a reconnect message
      termRef.current.write("\r\n\x1b[90mreconnecting\x1b[0m\r\n");
    }

    // Initial fit
    setTimeout(() => {
      try {
        fitRef.current?.fit();
      } catch {}
    }, 50);

    // WebSocket connection
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${proto}//${window.location.host}/ws/terminal`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnState("open");
      const { cols, rows } = termRef.current;
      ws.send(JSON.stringify({ type: "resize", cols, rows }));
    };

    ws.onmessage = (e: MessageEvent<string>) => {
      // Info frame (JSON) vs raw terminal output
      if (e.data.startsWith('{"type":"info"')) {
        try {
          const { cwd: dir } = JSON.parse(e.data) as {
            type: string;
            cwd: string;
          };
          setCwd(dir);
        } catch {}
        return;
      }
      termRef.current?.write(e.data);
    };

    ws.onclose = () => {
      setConnState("closed");
      termRef.current?.write(
        "\r\n\x1b[90m[connection closed — click Reconnect to start a new session]\x1b[0m\r\n",
      );
    };

    ws.onerror = () => {
      setConnState("error");
      termRef.current?.write(
        "\r\n\x1b[31m[WebSocket error — is the custom server running?]\x1b[0m\r\n",
      );
    };

    // Keyboard input → PTY
    termRef.current.onData((data: string) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "input", data }));
      }
    });
  }, []);

  useEffect(() => {
    connect();
    return () => {
      roRef.current?.disconnect();
      wsRef.current?.close();
      termRef.current?.dispose();
      termRef.current = null;
      fitRef.current = null;
    };
  }, [connect]);

  // Re-fit when height changes
  useEffect(() => {
    setTimeout(() => {
      try {
        fitRef.current?.fit();
        const { cols, rows } = termRef.current ?? {};
        if (cols && rows && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "resize", cols, rows }));
        }
      } catch {}
    }, 80);
  }, [heightKey]);

  // Status badge config
  const statusBadge: Record<ConnState, { label: string; cls: string }> = {
    connecting: {
      label: "○ connecting…",
      cls: "border-slate-600  text-foreground animate-pulse",
    },
    open: { label: "● connected", cls: "border-emerald-700 text-foreground" },
    closed: { label: "○ closed", cls: "border-slate-600  text-foreground" },
    error: { label: "✕ error", cls: "border-red-800    text-foreground" },
  };
  const { label: statusLabel, cls: statusCls } = statusBadge[connState];

  // Render
  return (
    <Card className="bg-[#020817] border-slate-800 flex flex-col rounded-t-lg rounded-b-none border-b-0">
      {/* Terminal header bar */}
      <CardHeader className="px-3 py-1.5 flex-row items-center justify-between space-y-0 shrink-0 border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          {/* Icon */}
          <span className="text-foreground text-foreground select-none shrink-0">⌨</span>

          <span className="text-[11px] font-mono text-foreground font-semibold shrink-0">
            Terminal
          </span>

          {/* CWD pill */}
          {cwd && (
            <span className="text-[9px] font-mono text-foreground bg-background border border-slate-800 px-1.5 py-0.5 rounded truncate max-w-[240px]">
              {cwd}
            </span>
          )}

          {/* Connection status */}
          <Badge
            variant="outline"
            className={`text-[9px] font-mono px-1.5 py-0 h-4 shrink-0 ${statusCls}`}
          >
            {statusLabel}
          </Badge>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Height presets */}
          {(["sm", "md", "lg"] as HeightKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setHeightKey(k)}
              className={`text-[9px] font-mono px-1.5 py-0.5 rounded transition-colors ${
                heightKey === k
                  ? "bg-background text-foreground"
                  : "text-foreground hover:text-foreground"
              }`}
            >
              {k.toUpperCase()}
            </button>
          ))}

          <div className="w-px h-3 bg-background mx-1" />

          {/* Reconnect */}
          {(connState === "closed" || connState === "error") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={connect}
              className="h-5 px-2 text-[9px] font-mono text-foreground hover:text-foreground hover:bg-background/40"
            >
              ↺ Reconnect
            </Button>
          )}

          {/* Clear */}
          <button
            onClick={() => termRef.current?.clear()}
            className="text-[9px] font-mono px-1.5 py-0.5 rounded text-foreground hover:text-foreground transition-colors"
            title="Clear terminal"
          >
            clear
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center rounded text-foreground hover:text-foreground hover:bg-background transition-colors ml-1"
            title="Close terminal"
          >
            ✕
          </button>
        </div>
      </CardHeader>

      {/*xterm container */}
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div
          ref={containerRef}
          style={{ height, width: "100%" }}
          className="[&_.xterm]:h-full [&_.xterm-viewport]:rounded-b-lg"
        />
      </CardContent>
    </Card>
  );
}
