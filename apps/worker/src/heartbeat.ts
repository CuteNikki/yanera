import { api } from '@yanera/database';
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
      const memoryUsage = Math.round(process.memoryUsage().rss / 1024 / 1024);

      await convex.mutation(api.nodes.heartbeat, {
        hostName: hostName,
        nodeId: nodeId,
        type: 'worker',
        eventsPerSecond: eventsPerSecond,
        totalEvents: currentEventCount,
        memoryUsage: memoryUsage,
        startedAt: STARTED_AT,
        lastHeartbeat: Date.now(),
      });
      console.log(`[Heartbeat] Sent heartbeat for ${nodeId}. Events Processed: ${currentEventCount}. EPS: ${eventsPerSecond}. Memory Usage: ${memoryUsage}MB.`);
    } catch (error) {
      console.error('[Heartbeat] Failed to send worker heartbeat to Convex:', error);
    }
  }, 15_000);
}
