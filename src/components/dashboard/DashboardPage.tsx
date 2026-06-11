'use client';

import React, { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { KPIMetrics } from '@/components/dashboard/KPIMetrics';
import { LiveCharts } from '@/components/dashboard/LiveCharts';
import { NetworkTopology } from '@/components/dashboard/NetworkTopology';
import { LogPanel } from '@/components/dashboard/LogPanel';
import { useDashboard } from '@/hooks/useDashboard';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface DashboardPageProps {
  mode?: 'mock' | 'real';
  wsUrl?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  mode = 'mock',
  wsUrl,
}) => {
  const [dataMode, setDataMode] = useState<'mock' | 'real'>(mode);
  const { state } = useDashboard(dataMode === 'mock', dataMode === 'real' ? wsUrl : undefined);

  return (
    <div className="w-full min-h-screen bg-gray-900 p-4 md:p-6">
      <div className="max-w-full mx-auto">
        {/* Mode Selector */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              NS3 Simulation Dashboard
            </h1>
            <p className="text-gray-400">Real-time 4G/5G Network Performance Monitoring</p>
          </div>
          <div className="flex gap-4 items-center bg-gray-800 p-3 rounded-lg border border-gray-700">
            <span className="text-sm font-medium text-gray-300">Data Mode:</span>
            <ToggleGroup
              type="single"
              value={dataMode}
              onValueChange={(value) => {
                if (value) setDataMode(value as 'mock' | 'real');
              }}
              className="gap-2"
            >
              <ToggleGroupItem
                value="mock"
                aria-label="Mock Data"
                className="text-xs px-3"
              >
                Mock
              </ToggleGroupItem>
              <ToggleGroupItem
                value="real"
                aria-label="Real Data"
                className="text-xs px-3"
                disabled={!wsUrl}
              >
                Real (NS3)
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Header */}
          <DashboardHeader
            simulationState={state.simulationState}
            simulationTime={state.simulationTime}
            wsConnected={state.wsConnected}
          />

          {/* KPI Metrics */}
          <KPIMetrics
            throughput={state.stats.throughput}
            sinr={state.stats.sinr}
            rsrp={state.stats.rsrp}
            loss_pct={state.stats.loss_pct}
          />

          {/* Charts */}
          <LiveCharts
            throughput={state.timeSeriesData.throughput}
            sinr={state.timeSeriesData.sinr}
            rsrp={state.timeSeriesData.rsrp}
            loss_pct={state.timeSeriesData.loss_pct}
          />

          {/* Topology */}
          <NetworkTopology
            topology={state.topology}
            simulationTime={state.simulationTime}
          />

          {/* Logs */}
          <LogPanel logs={state.logs} />
        </div>
      </div>
    </div>
  );
};
