'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogEntry } from '@/types/dashboard';
import { FileText, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LogPanelProps {
  logs: LogEntry[];
}

const getLogIcon = (type: LogEntry['type']) => {
  switch (type) {
    case 'status':
      return <CheckCircle className="w-4 h-4 text-blue-500" />;
    case 'warning':
      return <AlertCircle className="w-4 h-4 text-orange-500" />;
    case 'stats':
      return <FileText className="w-4 h-4 text-green-500" />;
    case 'link':
      return <Info className="w-4 h-4 text-purple-500" />;
    case 'node':
      return <Info className="w-4 h-4 text-gray-500" />;
    default:
      return <FileText className="w-4 h-4 text-gray-500" />;
  }
};

const getLogBgColor = (type: LogEntry['type']) => {
  switch (type) {
    case 'status':
      return 'bg-blue-50';
    case 'warning':
      return 'bg-orange-50';
    case 'stats':
      return 'bg-green-50';
    case 'link':
      return 'bg-purple-50';
    case 'node':
      return 'bg-gray-50';
    default:
      return 'bg-gray-50';
  }
};

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Event Log
          </CardTitle>
          <span className="text-sm text-gray-600">
            {logs.length} Events
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 w-full rounded-md border border-gray-200 bg-white">
          <div className="p-4 space-y-2">
            {logs.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No events yet
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`flex gap-3 p-3 rounded-md text-sm ${getLogBgColor(log.type)} border border-gray-200`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-xs text-gray-600 uppercase">
                        {log.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {log.timestamp.toFixed(2)}s
                      </span>
                    </div>
                    <p className="text-gray-700 break-words mt-1">
                      {log.message}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
