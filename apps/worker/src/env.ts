import { z } from 'zod';

const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  REDIS_URL: z.url(),
  CONVEX_URL: z.url(),
});

export const env = envSchema.parse(process.env);
