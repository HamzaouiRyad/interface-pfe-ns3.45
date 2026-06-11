'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Signal, Zap, Wifi } from 'lucide-react';
import { SimulationState } from '@/types/dashboard';

interface HeaderProps {
  simulationState: SimulationState;
  simulationTime: number;
  wsConnected: boolean;
}

export const DashboardHeader: React.FC<HeaderProps> = ({
  simulationState,
  simulationTime,
  wsConnected,
}) => {
  const getStateBadgeVariant = (state: SimulationState) => {
    switch (state) {
      case 'ready':
        return 'secondary';
      case 'running':
        return 'default';
      case 'stopped':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-800">
            NS3 Network Simulation Dashboard
          </CardTitle>
          <div className="text-sm text-gray-600">
            4G/5G Network Simulation
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Simulation Status */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <Zap className="w-5 h-5 text-yellow-500" />
            <div>
              <div className="text-xs font-semibold text-gray-600 uppercase">
                Status
              </div>
              <Badge variant={getStateBadgeVariant(simulationState)} className="mt-1">
                {simulationState.charAt(0).toUpperCase() + simulationState.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Simulation Time */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <Signal className="w-5 h-5 text-blue-500" />
            <div>
              <div className="text-xs font-semibold text-gray-600 uppercase">
                Simulation Time
              </div>
              <div className="text-lg font-bold text-gray-900 mt-1">
                {simulationTime.toFixed(2)} s
              </div>
            </div>
          </div>

          {/* WebSocket Connection */}
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <Wifi
              className={`w-5 h-5 ${wsConnected ? 'text-green-500' : 'text-red-500'}`}
            />
            <div>
              <div className="text-xs font-semibold text-gray-600 uppercase">
                Connection
              </div>
              <Badge
                variant={wsConnected ? 'default' : 'destructive'}
                className="mt-1"
              >
                {wsConnected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
