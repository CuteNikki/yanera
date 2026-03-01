import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  guildSettings: defineTable({
    guildId: v.string(),
  }).index('by_guildId', ['guildId']),

  nodes: defineTable({
    hostName: v.string(), // e.g., "yanera-13"
    nodeId: v.string(), // e.g., "node-mm4wurxf"
    type: v.union(v.literal('gateway'), v.literal('worker')),
    shards: v.optional(v.array(v.number())), // e.g., [120, 121, ..., 129]
    guildCount: v.optional(v.number()),
    unavailableGuilds: v.optional(v.number()),
    ping: v.number(),
    memoryUsage: v.number(),
    startedAt: v.number(),
    lastHeartbeat: v.number(),
  })
    .index('by_nodeId', ['nodeId'])
    .index('by_type_and_host', ['type', 'hostName']),
});
