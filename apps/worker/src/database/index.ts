import { ConvexHttpClient } from 'convex/browser';
import { env } from '../env';

export const db = new ConvexHttpClient(env.CONVEX_URL);
