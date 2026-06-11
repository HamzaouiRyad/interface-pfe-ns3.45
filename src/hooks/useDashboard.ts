// Custom hook for managing dashboard state

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { DashboardState, DashboardMessage } from '@/types/dashboard';
import { getInitialMockState, updateStateWithMessage } from '@/lib/mockData';
import { WebSocketHandler } from '@/lib/websocket';

export const useDashboard = (useMockData: boolean = false, wsUrl?: string) => {
  const [state, setState] = useState<DashboardState>(getInitialMockState());
  const wsRef = useRef<WebSocketHandler | null>(null);
  const mockTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mockCounterRef = useRef(0);

  // Handle incoming messages
  const handleMessage = useCallback((message: DashboardMessage) => {
    setState((prevState) => updateStateWithMessage(prevState, message));
  }, []);

  // Start mock data generation
  const startMockData = useCallback(() => {
    let counter = 0;
    mockTimerRef.current = setInterval(() => {
      const { generateMockMessage } = require('@/lib/mockData');
      const message = generateMockMessage(counter);
      handleMessage(message);
      counter++;
      mockCounterRef.current = counter;
    }, 100);
  }, [handleMessage]);

  // Stop mock data generation
  const stopMockData = useCallback(() => {
    if (mockTimerRef.current) {
      clearInterval(mockTimerRef.current);
      mockTimerRef.current = null;
    }
  }, []);

  // Connect to WebSocket
  const connectWebSocket = useCallback(async () => {
    if (!wsUrl) return;

    wsRef.current = new WebSocketHandler({
      url: wsUrl,
      onMessage: handleMessage,
      onConnect: () => {
        setState((prev) => ({ ...prev, wsConnected: true }));
      },
      onDisconnect: () => {
        setState((prev) => ({ ...prev, wsConnected: false }));
      },
      onError: (error) => {
        console.error('WebSocket error:', error);
        setState((prev) => ({ ...prev, wsConnected: false }));
      },
    });

    try {
      await wsRef.current.connect();
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
    }
  }, [wsUrl, handleMessage]);

  // Disconnect from WebSocket
  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
      wsRef.current = null;
    }
  }, []);

  // Initialize
  useEffect(() => {
    if (useMockData) {
      startMockData();
    } else if (wsUrl) {
      connectWebSocket();
    }

    return () => {
      if (useMockData) {
        stopMockData();
      } else {
        disconnectWebSocket();
      }
    };
  }, [useMockData, wsUrl, startMockData, stopMockData, connectWebSocket, disconnectWebSocket]);

  return {
    state,
    connectWebSocket,
    disconnectWebSocket,
    startMockData,
    stopMockData,
  };
};
