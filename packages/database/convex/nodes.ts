import { v } from 'convex/values';

import { mutation, query } from './_generated/server';

export const heartbeat = mutation({
  args: {
    hostName: v.string(),
    nodeId: v.string(),
    type: v.union(v.literal('gateway'), v.literal('worker')),
    shards: v.optional(v.array(v.number())),

    shardData: v.optional(
      v.array(
        v.object({
          id: v.number(),
          ping: v.number(),
          totalEvents: v.number(),
          eventsPerSecond: v.optional(v.number()),
          activeGuildIds: v.array(v.string()),
          unavailableGuildIds: v.array(v.string()),
        }),
      ),
    ),

    eventsPerSecond: v.optional(v.number()),
    memoryUsage: v.number(),
    startedAt: v.number(),
    lastHeartbeat: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('nodes')
      .withIndex('by_nodeId', (q) => q.eq('nodeId', args.nodeId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        shards: args.shards,
        shardData: args.shardData,
        memoryUsage: args.memoryUsage,
        lastHeartbeat: args.lastHeartbeat,
        eventsPerSecond: args.eventsPerSecond,
      });
    } else {
      await ctx.db.insert('nodes', args);
    }
  },
});

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query('nodes').order('asc').collect();
  },
});

import { internalMutation } from './_generated/server';

export const pruneDeadNodes = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - 60 * 1000;

    const allNodes = await ctx.db.query('nodes').collect();

    let deletedCount = 0;
    for (const node of allNodes) {
      if (node.lastHeartbeat < cutoff) {
        await ctx.db.delete(node._id);
        deletedCount++;
      }
    }

    return { deleted: deletedCount };
  },
});
