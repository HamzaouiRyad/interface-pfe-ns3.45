'use client';

import { DashboardPage } from '@/components/dashboard/DashboardPage';

export default function Home() {
  // Set to 'real' when you have NS3 running with WebSocket server
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws';

  return (
    <DashboardPage 
      mode="mock"
      wsUrl={WS_URL}
    />
  );
}
