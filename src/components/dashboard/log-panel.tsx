"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Props {
  logs: string[];
}

function classifyLog(text: string): { color: string; prefix: string } {
  if (text.includes("[Mock]")) return { color: "text-violet-400", prefix: "◆" };
  if (text.includes("error") || text.includes("Error"))
    return { color: "text-red-400", prefix: "✕" };
  if (text.includes("warn") || text.includes("Warn"))
    return { color: "text-amber-400", prefix: "⚠" };
  if (text.match(/t\s*=\s*[\d.]+/))
    return { color: "text-sky-400", prefix: "►" };
  return { color: "text-foreground", prefix: "·" };
}

export function LogPanel({ logs }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  return (
    <Card className="bg-slate-900 border-slate-800 flex flex-col">
      <CardHeader className="pb-1 pt-3 px-4 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-[11px] font-mono uppercase tracking-widest text-foreground">
          Simulation Log
        </CardTitle>
        <Badge
          variant="outline"
          className="text-[9px] font-mono px-1.5 py-0 border-slate-700 text-slate-500"
        >
          {logs.length} lines
        </Badge>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-44 px-3 pb-2">
          {logs.length === 0 ? (
            <p className="text-slate-600 text-[10px] font-mono pt-3">
              No output yet — press Start to begin.
            </p>
          ) : (
            <div className="space-y-0.5 pt-1">
              {logs.map((line, i) => {
                const { color, prefix } = classifyLog(line);
                return (
                  <div
                    key={i}
                    className={`flex gap-1.5 text-[10px] font-mono leading-relaxed ${color}`}
                  >
                    <span className="select-none opacity-40 shrink-0">
                      {prefix}
                    </span>
                    <span className="break-all">{line}</span>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
