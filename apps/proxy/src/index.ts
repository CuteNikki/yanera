import { REST } from '@discordjs/rest';
import { WebSocketManager, WebSocketShardEvents } from '@discordjs/ws';
import { createClient } from 'redis';

const token = process.env.DISCORD_TOKEN;

if (!token) {
  throw new Error('DISCORD_TOKEN is not defined in the environment variables.');
}

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();

const rest = new REST({ version: '10' }).setToken(token);

const manager = new WebSocketManager({
  token,
  intents: 1,
  rest,
  shardIds: null,
  // shardIds: null means the manager will automatically determine which shard IDs to spawn based on the total number of guilds the bot is in
  shardCount: null,
  // shardCount: null means the manager will automatically determine the shard count based on the total number of guilds the bot is in
});

manager.on(WebSocketShardEvents.Dispatch, async (event) => {
  await redis.rPush('discord_events_queue', JSON.stringify({ event: event.t, data: event.d }));
});

await manager.connect();
console.log('Gateway is online and listening.');
