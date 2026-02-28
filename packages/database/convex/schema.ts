import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  guildSettings: defineTable({
    guildId: v.string(),
  }).index('by_guildId', ['guildId']), 
});
