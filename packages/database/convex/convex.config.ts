import shardedCounter from '@convex-dev/sharded-counter/convex.config.js';
import { defineApp } from 'convex/server';

const app = defineApp();
app.use(shardedCounter);

export default app;
