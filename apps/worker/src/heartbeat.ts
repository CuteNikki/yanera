// apps/worker/src/heartbeat.ts
import { api } from '@yanera/database/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);
const STARTED_AT = Date.now();

let lastEventCount = 0;

export function startWorkerHeartbeat(nodeId: string, hostName: string, getEvents: () => number) {
  console.log(`[Heartbeat] Starting for Worker ${nodeId} on ${hostName}`);

  setInterval(async () => {
    try {
      const currentEventCount = getEvents();
      const deltaEvents = currentEventCount - lastEventCount;
      const rawEPS = deltaEvents / 15;
      const eventsPerSecond = rawEPS > 0 && rawEPS < 1 ? parseFloat(rawEPS.toFixed(2)) : Math.round(rawEPS);

      lastEventCount = currentEventCount;

      await convex.mutation(api.nodes.heartbeat, {
        hostName: hostName,
        nodeId: nodeId,
        type: 'worker',
        ping: eventsPerSecond,
        memoryUsage: Math.round(process.memoryUsage().rss / 1024 / 1024),
        startedAt: STARTED_AT,
        lastHeartbeat: Date.now(),
      });
    } catch (error) {
      console.error('[Heartbeat] Failed to send worker heartbeat to Convex:', error);
    }
  }, 15_000);
}
