'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KPIMetric } from '@/types/dashboard';
import { ArrowDownIcon, ArrowUpIcon, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  unit: string;
  metric: KPIMetric;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  unit,
  metric,
  icon,
  color = 'blue',
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      header: 'text-blue-600',
      current: 'text-blue-700',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      header: 'text-green-600',
      current: 'text-green-700',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-900',
      header: 'text-purple-600',
      current: 'text-purple-700',
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-900',
      header: 'text-orange-600',
      current: 'text-orange-700',
    },
  };

  const colors = colorClasses[color];

  return (
    <Card className={`${colors.bg} border-l-4 ${colors.border}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-sm font-semibold ${colors.header}`}>
            {title}
          </CardTitle>
          {icon && <div className={`${colors.text} opacity-50`}>{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Current Value */}
          <div>
            <div className="text-xs text-gray-600 uppercase">Current</div>
            <div className={`text-2xl font-bold ${colors.current}`}>
              {metric.current.toFixed(2)} <span className="text-sm">{unit}</span>
            </div>
          </div>

          {/* Min/Avg/Max Grid */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200">
            <div className="text-center">
              <div className="text-xs text-gray-500">Min</div>
              <div className="text-sm font-semibold text-gray-700">
                {metric.minimum.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Avg</div>
              <div className="text-sm font-semibold text-gray-700">
                {metric.average.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Max</div>
              <div className="text-sm font-semibold text-gray-700">
                {metric.maximum.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface KPIMetricsProps {
  throughput: KPIMetric;
  sinr: KPIMetric;
  rsrp: KPIMetric;
  loss_pct: KPIMetric;
}

export const KPIMetrics: React.FC<KPIMetricsProps> = ({
  throughput,
  sinr,
  rsrp,
  loss_pct,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KPICard
        title="Throughput"
        unit="Mbps"
        metric={throughput}
        color="blue"
        icon={<ArrowUpIcon className="w-4 h-4" />}
      />
      <KPICard
        title="SINR"
        unit="dB"
        metric={sinr}
        color="green"
        icon={<Minus className="w-4 h-4" />}
      />
      <KPICard
        title="RSRP"
        unit="dBm"
        metric={rsrp}
        color="purple"
        icon={<ArrowDownIcon className="w-4 h-4" />}
      />
      <KPICard
        title="Packet Loss"
        unit="%"
        metric={loss_pct}
        color="orange"
        icon={<ArrowUpIcon className="w-4 h-4" />}
      />
    </div>
  );
};
