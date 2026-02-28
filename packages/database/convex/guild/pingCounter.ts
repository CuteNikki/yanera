import { ShardedCounter } from '@convex-dev/sharded-counter';
import { v } from 'convex/values';
import { components } from '../_generated/api';
import { mutation, query } from '../_generated/server';

const counter = new ShardedCounter(components.shardedCounter);

export const incrementPingCounter = mutation({
  args: { guildId: v.string() },
  handler: async (ctx, args) => {
    const counterKey = `ping_counter_${args.guildId}`;
    await counter.inc(ctx, counterKey);
  },
});

export const getPingCount = query({
  args: { guildId: v.string() },
  handler: async (ctx, args) => {
    const counterKey = `ping_counter_${args.guildId}`;
    return await counter.count(ctx, counterKey);
  },
});
