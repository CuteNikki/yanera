import { WebSocketManager } from '@discordjs/ws';
import { api } from '@yanera/database/convex/_generated/api'; // Double check this path!
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);
const STARTED_AT = Date.now();

export function startGatewayHeartbeat(
  manager: WebSocketManager,
  shardPings: Map<number, number>,
  getActiveGuildCount: () => number,
  getUnavailableGuildCount: () => number,
  nodeId: string,
  hostName: string,
  renewLock: () => Promise<void>,
) {
  console.log(`[Heartbeat] Starting for Gateway Node ${nodeId} on ${hostName}`);

  setInterval(async () => {
    try {
      await renewLock();

      const memoryUsage = Math.round(process.memoryUsage().rss / 1024 / 1024);
      const activeShards = await manager.getShardIds();

      const pings = activeShards.map((shardId) => shardPings.get(shardId) || 0);
      const currentPing = pings.length > 0 ? Math.round(pings.reduce((a, b) => a + b, 0) / pings.length) : 0;

      await convex.mutation(api.nodes.heartbeat, {
        hostName: hostName,
        nodeId: nodeId,
        type: 'gateway',
        shards: activeShards,
        guildCount: getActiveGuildCount(),
        unavailableGuilds: getUnavailableGuildCount(),
        ping: currentPing,
        memoryUsage: memoryUsage,
        startedAt: STARTED_AT,
        lastHeartbeat: Date.now(),
      });
    } catch (error) {
      console.error('[Heartbeat] Failed to send gateway heartbeat to Convex:', error);
    }
  }, 15000);
}
