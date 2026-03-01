import { REST } from '@discordjs/rest';
import { WebSocketManager, WebSocketShardEvents } from '@discordjs/ws';
import { GatewayDispatchEvents } from 'discord-api-types/v10';
import { createClient } from 'redis';

import { claimShards } from './claimShards';
import { startGatewayHeartbeat } from './heartbeat';

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error('DISCORD_TOKEN is not defined in the environment variables.');
}

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

const HOST_NAME = process.env.PHYSICAL_HOSTNAME || process.env.COMPUTERNAME || 'unknown-host';
const NODE_ID = `gateway-${process.env.HOSTNAME}`;

console.log(`[Gateway] Starting ${NODE_ID} on ${HOST_NAME}`);

const { shards: claimedShards, renewLock } = await claimShards(redis, token, NODE_ID);

const rest = new REST({ version: '10' }).setToken(token);

const manager = new WebSocketManager({
  token,
  intents: 1,
  rest,
  shardIds: claimedShards,
});

const shardPings = new Map<number, number>();
const activeGuildIds = new Set<string>();
const unavailableGuildIds = new Set<string>();

manager.on(WebSocketShardEvents.HeartbeatComplete, ({ latency }, shardId) => {
  shardPings.set(shardId, latency);
});

manager.on(WebSocketShardEvents.Dispatch, async (event) => {
  if (event.t === GatewayDispatchEvents.Ready) {
    for (const guild of event.d.guilds) {
      if (guild.unavailable) {
        unavailableGuildIds.add(guild.id);
      } else {
        activeGuildIds.add(guild.id);
      }
    }
  } else if (event.t === GatewayDispatchEvents.GuildCreate) {
    const guildId = event.d.id;
    if (event.d.unavailable) {
      unavailableGuildIds.add(guildId);
      activeGuildIds.delete(guildId);
    } else {
      activeGuildIds.add(guildId);
      unavailableGuildIds.delete(guildId);
    }
  } else if (event.t === GatewayDispatchEvents.GuildDelete) {
    const guildId = event.d.id;
    activeGuildIds.delete(guildId);
    unavailableGuildIds.delete(guildId);
  }

  await redis.rPush('discord_events_queue', JSON.stringify({ event: event.t, data: event.d }));
});

await manager.connect();
console.log(`[Gateway] ${NODE_ID} is online and listening for shards: ${claimedShards.join(', ')}`);

startGatewayHeartbeat(
  manager,
  shardPings,
  () => activeGuildIds.size,
  () => unavailableGuildIds.size,
  NODE_ID,
  HOST_NAME,
  renewLock,
);
