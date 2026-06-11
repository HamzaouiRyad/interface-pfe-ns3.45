# NS3 Network Simulation Dashboard

A real-time web dashboard for monitoring 4G/5G network simulations using NS3. Built with Next.js, React, and shadcn/ui components.

## Features

### Dashboard Components

1. **Header**
   - Simulation Status (Ready/Running/Stopped)
   - Real-time Simulation Time
   - WebSocket Connection Status

2. **KPI Metrics** (with Current, Min, Avg, Max)
   - Throughput (Mbps)
   - SINR (dB)
   - RSRP (dBm)
   - Packet Loss (%)

3. **Live Charts**
   - Throughput vs Time
   - SINR vs Time
   - RSRP vs Time
   - Packet Loss vs Time

4. **Network Topology**
   - Node visualization
   - Link connections with delays
   - Network statistics

5. **Event Log**
   - Real-time event tracking
   - Status, statistics, and network events
   - Warning messages

### Data Modes

- **Mock Mode**: Generates synthetic data for testing and development
- **Real Mode**: Connects to NS3 via WebSocket for live data

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   ├── globals.css         # Global styles
│   └── api/                # API routes
├── components/
│   ├── dashboard/
│   │   ├── DashboardPage.tsx      # Main dashboard
│   │   ├── DashboardHeader.tsx    # Header section
│   │   ├── KPIMetrics.tsx         # KPI cards
│   │   ├── LiveCharts.tsx         # Chart components
│   │   ├── NetworkTopology.tsx    # Topology visualization
│   │   └── LogPanel.tsx           # Event log
│   └── ui/                 # shadcn UI components
├── hooks/
│   └── useDashboard.ts     # Dashboard state management
├── lib/
│   ├── mockData.ts         # Mock data generator
│   ├── websocket.ts        # WebSocket handler
│   └── utils.ts            # Utility functions
└── types/
    └── dashboard.ts        # TypeScript types
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file:
```env
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```

## Usage

### Development Mode

```bash
npm run dev
```

Visit `http://localhost:3000` to see the dashboard.

### Mock Data Mode (Default)

The dashboard loads with mock data by default. No additional setup required.

### Real NS3 Data Mode

To connect to real NS3 data:

1. Start your NS3 simulator with WebSocket server support
2. Update `NEXT_PUBLIC_WS_URL` in `.env.local` to point to your NS3 WebSocket server
3. Change the data mode in the dashboard from "Mock" to "Real (NS3)"

## Building for Production

```bash
npm run build
npm start
```

## Backend Data Format

The dashboard expects WebSocket messages in the following JSON format:

```json
{
  "type": "status|stats|link|node_pos|log",
  "time": 0.0,
  "state": "ready|running|stopped",
  "throughput": 0.0,
  "sinr": 0.0,
  "rsrp": 0.0,
  "loss_pct": 0.0,
  "src": 0,
  "dst": 0,
  "delay": 0.0,
  "id": 0,
  "x": 0.0,
  "y": 0.0,
  "text": ""
}
```

### Message Types

- **status**: Simulation state and time update
  - `state`: Current simulation state
  - `time`: Simulation time in seconds

- **stats**: Network statistics
  - `throughput`: Current throughput in Mbps
  - `sinr`: Current SINR in dB
  - `rsrp`: Current RSRP in dBm
  - `loss_pct`: Current packet loss percentage

- **link**: Link information
  - `src`: Source node ID
  - `dst`: Destination node ID
  - `delay`: Link delay in ms

- **node_pos**: Node position
  - `id`: Node ID
  - `x`: X coordinate (0-1000)
  - `y`: Y coordinate (0-1000)

- **log**: Log message
  - `text`: Log message content

## Technology Stack

- **Framework**: Next.js 16.2
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Type Safety**: TypeScript 5

## Performance Optimization

- Client-side data management with React hooks
- Efficient rendering with React 19
- Real-time updates via WebSocket
- Time series data limiting (last 100 entries per metric)
- Canvas-based topology rendering

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Configuration

### Environment Variables

```env
# WebSocket URL for NS3 backend
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```

## Development

### File Organization

- Dashboard logic: `src/components/dashboard/`
- Hooks: `src/hooks/useDashboard.ts`
- Data services: `src/lib/mockData.ts`, `src/lib/websocket.ts`
- Types: `src/types/dashboard.ts`

### Adding New Features

1. Define types in `src/types/dashboard.ts`
2. Create component in `src/components/dashboard/`
3. Integrate in `DashboardPage.tsx`
4. Update mock data generator if needed

## Troubleshooting

### WebSocket Connection Issues

If you see "Disconnected" status:
- Verify NS3 backend is running
- Check WebSocket URL in environment variables
- Ensure firewall allows WebSocket connections
- Check browser console for errors

### No Data in Charts

- Ensure mock mode is enabled if no real data is available
- For real mode, verify NS3 is sending messages
- Check network tab in browser DevTools

## Future Enhancements

- [ ] Historical data export
- [ ] Advanced filtering and search
- [ ] Custom metric configuration
- [ ] Multi-simulation support
- [ ] Real-time alerts and notifications
- [ ] Performance analytics
- [ ] User preferences storage

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit pull requests.
