# NS3 Dashboard - Developer Quick Reference

## 🚀 Quick Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint code
npm run lint
```

## 📂 File Locations

| Component | Path | Size | Purpose |
|-----------|------|------|---------|
| Main Page | `src/app/page.tsx` | 0.5 KB | Entry point |
| Dashboard | `src/components/dashboard/DashboardPage.tsx` | 3.4 KB | Main container |
| Header | `src/components/dashboard/DashboardHeader.tsx` | 3.1 KB | Status display |
| KPIs | `src/components/dashboard/KPIMetrics.tsx` | 4.0 KB | Metric cards |
| Charts | `src/components/dashboard/LiveCharts.tsx` | 2.9 KB | Time series |
| Topology | `src/components/dashboard/NetworkTopology.tsx` | 5.1 KB | Network viz |
| Logs | `src/components/dashboard/LogPanel.tsx` | 3.3 KB | Event log |
| Hook | `src/hooks/useDashboard.ts` | 2.8 KB | State mgmt |
| Mock Data | `src/lib/mockData.ts` | 6.4 KB | Test data |
| WebSocket | `src/lib/websocket.ts` | 2.9 KB | Real data |
| Types | `src/types/dashboard.ts` | 1.5 KB | Interfaces |

## 🔄 Data Flow

### Mock Mode
```
generateMockMessage()
    ↓
updateStateWithMessage()
    ↓
setState() 
    ↓
Component re-render
```

### Real Mode
```
WebSocket Message
    ↓
onMessage callback
    ↓
updateStateWithMessage()
    ↓
setState()
    ↓
Component re-render
```

## 🎨 Component Tree

```
<DashboardPage>
├── <DashboardHeader />
├── <KPIMetrics />
│   ├── <KPICard />
│   ├── <KPICard />
│   ├── <KPICard />
│   └── <KPICard />
├── <LiveCharts />
│   ├── <Chart /> (Throughput)
│   ├── <Chart /> (SINR)
│   ├── <Chart /> (RSRP)
│   └── <Chart /> (Packet Loss)
├── <NetworkTopology />
│   └── <canvas> (Network Viz)
└── <LogPanel />
    └── <ScrollArea />
```

## 🎯 Customization Guide

### Change Update Frequency

In `src/hooks/useDashboard.ts`:
```typescript
// Change 100 to desired ms
mockTimerRef.current = setInterval(() => {
  // ...
}, 100);  // ← Update interval
```

### Add New KPI Metric

1. Add to `src/types/dashboard.ts`:
```typescript
export interface DashboardStats {
  // ... existing
  newMetric: KPIMetric;
}
```

2. Update `mockData.ts`:
```typescript
newMetric: 0 + random * 100
```

3. Add to `DashboardPage.tsx`:
```tsx
<KPICard
  title="New Metric"
  unit="units"
  metric={state.stats.newMetric}
  color="blue"
/>
```

### Change Colors

Edit `src/components/dashboard/KPIMetrics.tsx`:
```typescript
const colorClasses = {
  blue: { /* ... */ },
  green: { /* ... */ },
  // Add your color scheme
};
```

### Adjust Chart Domain

In `src/components/dashboard/LiveCharts.tsx`:
```tsx
<Chart
  title="..."
  yAxisDomain={[min, max]}  // ← Set here
  data={data}
/>
```

### Modify Topology Visualization

In `src/components/dashboard/NetworkTopology.tsx`:
```typescript
// Node size (line ~132)
ctx.arc(x, y, 8, 0, Math.PI * 2);  // ← Change 8 for size

// Node color (line ~130)
ctx.fillStyle = '#0ea5e9';  // ← Change color

// Link color (line ~110)
ctx.strokeStyle = '#cbd5e1';  // ← Change color
```

## 🔌 WebSocket Message Examples

### Status Update
```json
{
  "type": "status",
  "time": 1.5,
  "state": "running"
}
```

### Stats Update
```json
{
  "type": "stats",
  "time": 1.5,
  "throughput": 150.5,
  "sinr": 18.3,
  "rsrp": -105.2,
  "loss_pct": 2.1
}
```

### Node Position
```json
{
  "type": "node_pos",
  "time": 1.5,
  "id": 5,
  "x": 250.0,
  "y": 375.5
}
```

### Link Info
```json
{
  "type": "link",
  "time": 1.5,
  "src": 2,
  "dst": 7,
  "delay": 5.3
}
```

### Log Message
```json
{
  "type": "log",
  "time": 1.5,
  "text": "Device 5 connected to network"
}
```

## 🧪 Testing

### Test Mock Data
```bash
npm run dev
# Toggle to "Mock" mode - should see auto-generated data
```

### Test WebSocket
```bash
# 1. Start your WebSocket server
python server.py

# 2. Update .env.local
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws

# 3. Run dashboard
npm run dev

# 4. Toggle to "Real (NS3)" mode
```

### Debug WebSocket

In browser console:
```javascript
// Check connection status
console.log(document.title)

// Monitor messages
// Add listener in websocket.ts
ws.onmessage = (event) => {
  console.log('Received:', event.data);
};
```

## 📊 Mock Data Patterns

The mock generator creates:
- **20% Status messages** - Simulation state updates
- **20% Statistics** - Throughput, SINR, RSRP, loss
- **20% Links** - Connection info
- **20% Nodes** - Position updates
- **20% Logs** - Event messages

Interval: 100ms per message (configurable)

## 🎯 Key Functions

### State Update
```typescript
const newState = updateStateWithMessage(currentState, message);
```

Handles:
- Metric aggregation (min/avg/max)
- Time series accumulation
- Topology updates
- Log entry appending

### WebSocket Connection
```typescript
const ws = new WebSocketHandler({
  url: 'ws://...',
  onMessage: handleData,
  onConnect: () => {},
  onDisconnect: () => {},
  onError: (err) => {}
});

await ws.connect();
```

Features:
- Auto-reconnect (5 attempts, 2s delay)
- Error handling
- Connection status tracking

## 🚨 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `kill 29113` or use port 3001 |
| WebSocket won't connect | Check `NEXT_PUBLIC_WS_URL` in `.env.local` |
| No data appearing | Verify WebSocket server is running |
| Charts empty | Toggle mock mode to "Mock" first |
| Build errors | Run `npm install` again |
| Type errors | Check `src/types/dashboard.ts` |

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (single column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (4 columns for KPIs)

Breakpoints defined with Tailwind:
- `md:` = 768px
- `lg:` = 1024px

## 🔐 Environment Setup

### Development
```env
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
```

### Production
```env
NEXT_PUBLIC_WS_URL=ws://production-server.com:8080/ws
```

## 📚 Useful Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Recharts Docs](https://recharts.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)

## 🎓 Learning Path

1. Start with `src/app/page.tsx` - Entry point
2. Review `src/hooks/useDashboard.ts` - State management
3. Study mock data flow in `src/lib/mockData.ts`
4. Check WebSocket handling in `src/lib/websocket.ts`
5. Customize components as needed

## 🚀 Deployment

### Vercel (Recommended)
```bash
git push origin main
# Auto-deploys via Vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual
```bash
npm run build
npm start
# Server runs on port 3000
```

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-metric

# Make changes
git add .
git commit -m "Add new metric"

# Push to origin
git push origin feature/new-metric

# Create PR for review
```

---

**Questions?** Check:
- `DASHBOARD_README.md` - User guide
- `NS3_INTEGRATION_GUIDE.md` - Integration help
- `IMPLEMENTATION_SUMMARY.md` - Technical overview
