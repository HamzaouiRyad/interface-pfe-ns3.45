// Mock data generator for testing without real NS3 data

import { DashboardMessage, DashboardState, LogEntry } from '@/types/dashboard';

export const generateMockMessage = (index: number): DashboardMessage => {
  const time = index * 0.1;
  const random = Math.random();

  // Vary the type based on index
  if (index % 5 === 0) {
    return {
      type: 'status',
      time,
      state: index < 20 ? 'ready' : index < 100 ? 'running' : 'stopped',
    };
  } else if (index % 5 === 1) {
    return {
      type: 'stats',
      time,
      throughput: 100 + random * 200,
      sinr: 10 + random * 30,
      rsrp: -120 + random * 40,
      loss_pct: random * 5,
    };
  } else if (index % 5 === 2) {
    return {
      type: 'link',
      time,
      src: Math.floor(random * 10),
      dst: Math.floor(random * 10) + 10,
      delay: 1 + random * 10,
    };
  } else if (index % 5 === 3) {
    return {
      type: 'node_pos',
      time,
      id: Math.floor(random * 20),
      x: random * 1000,
      y: random * 1000,
    };
  } else {
    return {
      type: 'log',
      time,
      text: `Mock log message ${index}: Simulation event at time ${time.toFixed(2)}s`,
    };
  }
};

export const getInitialMockState = (): DashboardState => {
  return {
    simulationState: 'ready',
    simulationTime: 0,
    wsConnected: true,
    stats: {
      throughput: { current: 0, minimum: 0, average: 0, maximum: 0 },
      sinr: { current: 0, minimum: 0, average: 0, maximum: 0 },
      rsrp: { current: 0, minimum: 0, average: 0, maximum: 0 },
      loss_pct: { current: 0, minimum: 0, average: 0, maximum: 0 },
    },
    timeSeriesData: {
      throughput: [],
      sinr: [],
      rsrp: [],
      loss_pct: [],
    },
    topology: {
      nodes: [],
      links: [],
      nodeCount: 0,
      linkCount: 0,
    },
    logs: [],
  };
};

export const updateStateWithMessage = (
  state: DashboardState,
  message: DashboardMessage
): DashboardState => {
  const newState = { ...state };

  if (message.type === 'status' && message.state) {
    newState.simulationState = message.state;
    newState.simulationTime = message.time;
  }

  if (message.type === 'stats') {
    const stats = newState.stats;

    // Update throughput
    if (message.throughput !== undefined) {
      stats.throughput.current = message.throughput;
      stats.throughput.minimum = Math.min(
        stats.throughput.minimum || message.throughput,
        message.throughput
      );
      stats.throughput.maximum = Math.max(
        stats.throughput.maximum || message.throughput,
        message.throughput
      );
      const avg =
        (stats.throughput.average * (state.timeSeriesData.throughput.length || 1) +
          message.throughput) /
        ((state.timeSeriesData.throughput.length || 1) + 1);
      stats.throughput.average = avg;
    }

    // Update SINR
    if (message.sinr !== undefined) {
      stats.sinr.current = message.sinr;
      stats.sinr.minimum = Math.min(
        stats.sinr.minimum || message.sinr,
        message.sinr
      );
      stats.sinr.maximum = Math.max(
        stats.sinr.maximum || message.sinr,
        message.sinr
      );
      const avg =
        (stats.sinr.average * (state.timeSeriesData.sinr.length || 1) +
          message.sinr) /
        ((state.timeSeriesData.sinr.length || 1) + 1);
      stats.sinr.average = avg;
    }

    // Update RSRP
    if (message.rsrp !== undefined) {
      stats.rsrp.current = message.rsrp;
      stats.rsrp.minimum = Math.min(
        stats.rsrp.minimum || message.rsrp,
        message.rsrp
      );
      stats.rsrp.maximum = Math.max(
        stats.rsrp.maximum || message.rsrp,
        message.rsrp
      );
      const avg =
        (stats.rsrp.average * (state.timeSeriesData.rsrp.length || 1) +
          message.rsrp) /
        ((state.timeSeriesData.rsrp.length || 1) + 1);
      stats.rsrp.average = avg;
    }

    // Update loss percentage
    if (message.loss_pct !== undefined) {
      stats.loss_pct.current = message.loss_pct;
      stats.loss_pct.minimum = Math.min(
        stats.loss_pct.minimum || message.loss_pct,
        message.loss_pct
      );
      stats.loss_pct.maximum = Math.max(
        stats.loss_pct.maximum || message.loss_pct,
        message.loss_pct
      );
      const avg =
        (stats.loss_pct.average * (state.timeSeriesData.loss_pct.length || 1) +
          message.loss_pct) /
        ((state.timeSeriesData.loss_pct.length || 1) + 1);
      stats.loss_pct.average = avg;
    }

    // Add to time series
    if (message.throughput !== undefined) {
      newState.timeSeriesData.throughput.push({
        time: message.time,
        value: message.throughput,
      });
    }
    if (message.sinr !== undefined) {
      newState.timeSeriesData.sinr.push({
        time: message.time,
        value: message.sinr,
      });
    }
    if (message.rsrp !== undefined) {
      newState.timeSeriesData.rsrp.push({
        time: message.time,
        value: message.rsrp,
      });
    }
    if (message.loss_pct !== undefined) {
      newState.timeSeriesData.loss_pct.push({
        time: message.time,
        value: message.loss_pct,
      });
    }
  }

  if (message.type === 'node_pos' && message.id !== undefined) {
    const existingNode = newState.topology.nodes.find((n) => n.id === message.id);
    if (existingNode) {
      existingNode.x = message.x || 0;
      existingNode.y = message.y || 0;
    } else {
      newState.topology.nodes.push({
        id: message.id,
        x: message.x || 0,
        y: message.y || 0,
      });
    }
    newState.topology.nodeCount = newState.topology.nodes.length;
  }

  if (message.type === 'link' && message.src !== undefined && message.dst !== undefined) {
    const existingLink = newState.topology.links.find(
      (l) => l.src === message.src && l.dst === message.dst
    );
    if (!existingLink) {
      newState.topology.links.push({
        src: message.src,
        dst: message.dst,
        delay: message.delay || 0,
      });
      newState.topology.linkCount = newState.topology.links.length;
    }
  }

  if (message.type === 'log' && message.text) {
    newState.logs.push({
      timestamp: message.time,
      message: message.text,
      type: 'status',
    });

    // Keep only last 100 logs
    if (newState.logs.length > 100) {
      newState.logs = newState.logs.slice(-100);
    }
  }

  return newState;
};
