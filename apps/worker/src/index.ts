import { REST } from '@discordjs/rest';
import { api } from '@yanera/database';
import {
  GatewayDispatchEvents,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
  Routes,
  type APIApplicationCommandInteraction,
} from 'discord-api-types/v10';
import { createClient } from 'redis';

import { db } from './database';
import { env } from './env';
import { startWorkerHeartbeat } from './heartbeat';

const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);
const redis = createClient({ url: env.REDIS_URL });
if (!redis.isOpen) await redis.connect();

const HOST_NAME = process.env.PHYSICAL_HOSTNAME || process.env.COMPUTERNAME || 'unknown-host';
const NODE_ID = `worker-${process.env.HOSTNAME}`;

console.log(`[Worker] Starting ${NODE_ID} on ${HOST_NAME}`);

let eventsProcessed = 0;

async function processQueue() {
  console.log(`[Worker] ${NODE_ID} is listening for Discord events...`);

  while (true) {
    try {
      const result = await redis.blPop('discord_events_queue', 0);
      if (!result) continue;

      eventsProcessed++;
      console.log(`[Worker] ${NODE_ID} Processing event #${eventsProcessed}`);

      const payload = JSON.parse(result.element) as { event: string; data: unknown };

      if (payload.event === GatewayDispatchEvents.InteractionCreate) {
        const interaction = payload.data as APIApplicationCommandInteraction;

        if (interaction.type === InteractionType.ApplicationCommand) {
          if (interaction.data.name === 'ping') {
            const guildId = interaction.guild_id;

            if (!guildId) {
              await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
                body: {
                  type: InteractionResponseType.ChannelMessageWithSource,
                  data: { content: 'This command can only be used in a guild.', flags: MessageFlags.Ephemeral },
                },
              });
              continue;
            }

            await rest.post(Routes.interactionCallback(interaction.id, interaction.token), {
              body: { type: InteractionResponseType.DeferredChannelMessageWithSource },
            });

            const count = await db.query(api.guild.pingCounter.getPingCount, { guildId });
            await db.mutation(api.guild.pingCounter.incrementPingCounter, { guildId });

            await rest.patch(Routes.webhookMessage(env.DISCORD_CLIENT_ID, interaction.token, '@original'), {
              body: { content: `Pong! This guild has been pinged ${count + 1} times.` },
            });
          }
        }
      }
    } catch (error) {
      console.error(`[Worker] ${NODE_ID} Error processing queue:`, error);
      // Prevent CPU spike if redis goes offline
      await new Promise((resolve) => setTimeout(resolve, 1_000));
    }
  }
}

startWorkerHeartbeat(NODE_ID, HOST_NAME, () => eventsProcessed);
processQueue();
