'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TopologyData } from '@/types/dashboard';
import { Network, Radio } from 'lucide-react';

interface NetworkTopologyProps {
  topology: TopologyData;
  simulationTime: number;
}

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({
  topology,
  simulationTime,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw links
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    topology.links.forEach((link) => {
      const srcNode = topology.nodes.find((n) => n.id === link.src);
      const dstNode = topology.nodes.find((n) => n.id === link.dst);

      if (srcNode && dstNode) {
        const x1 = (srcNode.x / 1000) * canvas.width;
        const y1 = (srcNode.y / 1000) * canvas.height;
        const x2 = (dstNode.x / 1000) * canvas.width;
        const y2 = (dstNode.y / 1000) * canvas.height;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Draw delay text
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        ctx.fillStyle = '#64748b';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${link.delay.toFixed(1)}ms`, midX, midY - 5);
      }
    });

    // Draw nodes
    topology.nodes.forEach((node) => {
      const x = (node.x / 1000) * canvas.width;
      const y = (node.y / 1000) * canvas.height;

      // Node circle
      ctx.fillStyle = '#0ea5e9';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Node border
      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node label
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`N${node.id}`, x, y);
    });
  }, [topology]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Network Topology
          </CardTitle>
          <div className="text-sm text-gray-600">
            Simulation Time: {simulationTime.toFixed(2)}s
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Canvas for topology visualization */}
          <div className="border rounded-lg overflow-hidden bg-white">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full border border-gray-200"
            />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-sm text-gray-600">Nodes</div>
              <div className="text-2xl font-bold text-blue-600">
                {topology.nodeCount}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Links</div>
              <div className="text-2xl font-bold text-green-600">
                {topology.linkCount}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Avg Delay</div>
              <div className="text-2xl font-bold text-purple-600">
                {topology.links.length > 0
                  ? (
                      topology.links.reduce((sum, l) => sum + l.delay, 0) /
                      topology.links.length
                    ).toFixed(2)
                  : '0.00'}{' '}
                ms
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Network Size</div>
              <div className="text-2xl font-bold text-orange-600">
                {(
                  (Math.max(...topology.nodes.map((n) => n.x), 0) +
                    Math.max(...topology.nodes.map((n) => n.y), 0)) /
                  2
                ).toFixed(0)}{' '}
                m
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
