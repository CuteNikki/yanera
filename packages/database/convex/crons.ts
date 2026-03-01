import { cronJobs } from 'convex/server';

import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval('clear-dead-nodes', { minutes: 1 }, internal.nodes.pruneDeadNodes);

export default crons;
