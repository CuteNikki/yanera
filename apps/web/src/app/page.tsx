'use client';

import { api } from '@yanera/database';
import { useMutation, useQuery } from 'convex/react';

export default function Home() {
  const guildId = '741742952979890276';

  const pingCount = useQuery(api.guild.pingCounter.getPingCount, { guildId });
  const incrementPingCounter = useMutation(api.guild.pingCounter.incrementPingCounter);

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-24'>
      <h1 className='text-4xl font-bold mb-8'>Yanera Dashboard</h1>

      <div className='p-8 rounded-xl border shadow-2xl text-center min-w-75'>
        <h2 className='text-sm font-semibold tracking-widest uppercase mb-4'>Live Ping Count</h2>
        <button
          onClick={() => {
            incrementPingCounter({ guildId });
          }}
          className='text-7xl font-mono'
        >
          {pingCount === undefined ? '...' : pingCount}
        </button>
      </div>
    </main>
  );
}
