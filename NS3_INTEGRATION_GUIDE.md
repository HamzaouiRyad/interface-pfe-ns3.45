# NS3 Integration Guide

## Overview

This guide explains how to integrate your NS3 simulation with the dashboard for real-time data visualization.

## Architecture

```
NS3 Simulator
    ↓
WebSocket Server (Node.js/Python)
    ↓
Dashboard (React/Next.js)
```

## Integration Steps

### 1. NS3 Side

Your NS3 simulation needs to:
1. Collect network metrics (throughput, SINR, RSRP, packet loss)
2. Track node positions and link information
3. Send data to a WebSocket server

Example metrics to collect:
- Throughput from `Ipv4L3Protocol` or application layer
- SINR from physical layer (LTE/NR module)
- RSRP from the UE measurement reports
- Packet loss from MAC/RLC layers

### 2. WebSocket Server

Create a server that:
1. Receives data from NS3
2. Formats it according to the dashboard message schema
3. Broadcasts to connected clients

#### Python Example (Flask + Flask-SocketIO)

```python
from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Store connected clients
clients = set()

@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')
    clients.add(request.sid)
    emit('connection_response', {'data': 'Connected to NS3 Dashboard Server'})

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')
    clients.discard(request.sid)

@app.route('/api/metrics', methods=['POST'])
def receive_metrics():
    data = request.get_json()
    
    # Validate and format the message
    message = {
        'type': data.get('type'),  # 'stats', 'status', 'link', 'node_pos', 'log'
        'time': data.get('time'),
        'state': data.get('state'),
        'throughput': data.get('throughput'),
        'sinr': data.get('sinr'),
        'rsrp': data.get('rsrp'),
        'loss_pct': data.get('loss_pct'),
        'src': data.get('src'),
        'dst': data.get('dst'),
        'delay': data.get('delay'),
        'id': data.get('id'),
        'x': data.get('x'),
        'y': data.get('y'),
        'text': data.get('text'),
    }
    
    # Broadcast to all connected clients
    socketio.emit('dashboard_update', message, broadcast=True)
    
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8080, debug=True)
```

#### Node.js Example (Express + ws)

```javascript
const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

const clients = new Set();

wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

app.post('/api/metrics', (req, res) => {
  const data = req.body;

  const message = JSON.stringify({
    type: data.type,
    time: data.time,
    state: data.state,
    throughput: data.throughput,
    sinr: data.sinr,
    rsrp: data.rsrp,
    loss_pct: data.loss_pct,
    src: data.src,
    dst: data.dst,
    delay: data.delay,
    id: data.id,
    x: data.x,
    y: data.y,
    text: data.text,
  });

  // Broadcast to all connected clients
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });

  res.json({ status: 'success' });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
```

### 3. Dashboard Configuration

1. Update `.env.local`:
```env
NEXT_PUBLIC_WS_URL=ws://your-ns3-server:8080/ws
```

2. Change data mode to "Real (NS3)" in the dashboard UI

## Message Frequency Recommendations

- **Status updates**: Every 0.1-1.0 second
- **Statistics**: Every 0.1-0.5 second
- **Node position**: Every 1-5 seconds
- **Link changes**: On demand
- **Log messages**: On demand

## Performance Tips

1. **Batch Updates**: Send multiple metrics in a single message
2. **Sampling**: Sample data to avoid overwhelming the dashboard
3. **Compression**: Consider gzip compression for large messages
4. **Time Series Limits**: Dashboard keeps last 100 data points per metric

## Testing

1. **Start WebSocket Server**:
```bash
python server.py  # or node server.js
```

2. **Start Dashboard**:
```bash
npm run dev
```

3. **Send Test Data**:
```bash
curl -X POST http://localhost:8080/api/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "type": "stats",
    "time": 0.5,
    "throughput": 150,
    "sinr": 15,
    "rsrp": -100,
    "loss_pct": 2
  }'
```

## Troubleshooting

### "Disconnected" Status
- Check WebSocket server is running
- Verify firewall allows WebSocket connections
- Check browser console for errors

### No Data Appearing
- Verify messages are being sent to the server
- Check message format matches schema
- Monitor Network tab in browser DevTools

### Performance Issues
- Reduce message frequency
- Implement server-side sampling
- Check dashboard log for errors

## Advanced Integration

### Custom Message Types

Add new message types to `src/types/dashboard.ts`:

```typescript
export type MessageType = 'status' | 'stats' | 'link' | 'node_pos' | 'log' | 'custom_metric';
```

### Data Persistence

To save historical data:
1. Store metrics in a database (PostgreSQL, MongoDB, etc.)
2. Create API endpoints for data retrieval
3. Add export functionality to dashboard

## Example NS3 Integration Points

### In NS3 Main Script

```cpp
#include "ns3/core-module.h"
// ... other includes

// HTTP client to send data
void SendMetricsToServer(double time, double throughput, double sinr, 
                         double rsrp, double loss_pct) {
  // Use HTTP POST or WebSocket to send data
  // Format: {"type":"stats","time":0.5,"throughput":150,...}
}

int main() {
  // ... NS3 setup ...
  
  // Periodically collect and send metrics
  Simulator::Schedule(Seconds(0.1), [](){ 
    SendMetricsToServer(Simulator::Now().GetSeconds(), 
                       CalculateThroughput(), 
                       CalculateSINR(), 
                       CalculateRSRP(),
                       CalculatePacketLoss());
  });
  
  Simulator::Run();
  return 0;
}
```

## Best Practices

1. **Time Synchronization**: Keep NS3 simulation time in sync with real-time
2. **Error Handling**: Implement reconnection logic in dashboard
3. **Data Validation**: Validate all incoming data server-side
4. **Security**: Use WSS (WebSocket Secure) in production
5. **Monitoring**: Log all messages for debugging

## Next Steps

1. Set up your WebSocket server
2. Configure the dashboard with your server URL
3. Integrate NS3 metrics collection
4. Test with mock data first, then real data
5. Optimize message frequency and payload size

For more information, see `DASHBOARD_README.md`.
