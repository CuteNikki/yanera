import Image from 'next/image';
import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { getBotGuilds, getUserGuilds } from '@/lib/discord';

export default async function Dashboard() {
  const session = await auth();

  if (!session?.accessToken) {
    return redirect('/');
  }

  const [userGuilds, botGuildIds] = await Promise.all([getUserGuilds(), getBotGuilds()]);

  const processedGuilds = userGuilds
    .map((guild) => {
      const isOwner = guild.owner; // This is a boolean field provided by Discord's API
      const isAdmin = (BigInt(guild.permissions) & BigInt(0x8)) === BigInt(0x8);
      const canManageServer = (BigInt(guild.permissions) & BigInt(0x20)) === BigInt(0x20);

      return {
        ...guild,
        isOwner: isOwner,
        isAdmin: isOwner || isAdmin,
        canManage: isOwner || isAdmin || canManageServer,
        botPresent: botGuildIds.includes(guild.id),
      };
    })
    .sort((a, b) => {
      // Priority 7: Bot is there AND I am Owner // Can directly edit
      // Priority 6: Bot is there AND I am Admin // Can directly edit
      // Priority 5: Bot is there AND I can Manage // Can directly edit
      // Priority 4: Bot is NOT there BUT I am Owner // Invite potential
      // Priority 3: Bot is NOT there BUT I am Admin // Invite potential
      // Priority 2: Bot is NOT there BUT I can Manage // Invite potential
      // Priority 1: Bot is there BUT I am just a user // Can view, but not edit
      // Priority 0: Bot is NOT there AND I am just a user // Can't do anything

      const getPriority = (g: typeof a) => {
        if (g.botPresent && g.isOwner) return 7;
        if (g.botPresent && g.isAdmin) return 6;
        if (g.botPresent && g.canManage) return 5;
        if (!g.botPresent && g.isOwner) return 4;
        if (!g.botPresent && g.isAdmin) return 3;
        if (!g.botPresent && g.canManage) return 2;
        if (g.botPresent) return 1;
        return 0;
      };

      const aPriority = getPriority(a);
      const bPriority = getPriority(b);

      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }

      return a.name.localeCompare(b.name);
    });

  return (
    <main className='p-8 mx-auto container'>
      <header className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Your Servers</h1>
      </header>

      <div className='grid lg:grid-cols-2 2xl:grid-cols-3 gap-4 w-full'>
        {processedGuilds.map((guild) => (
          <div key={guild.id} className='p-4 border border-foreground/10 rounded-lg flex items-center justify-between gap-3 min-w-0'>
            <div className='flex items-center gap-3 min-w-0 flex-1'>
              <div className='shrink-0'>
                {guild.icon ? (
                  <Image
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${guild.icon.startsWith('a_') ? 'gif' : 'png'}?size=64`}
                    alt={guild.name}
                    width={50}
                    height={50}
                    className='rounded-lg h-12 w-12 object-cover'
                  />
                ) : (
                  <div className='w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shrink-0'>
                    {guild.name
                      .replace(/'s /g, ' ')
                      .replace(/\w+/g, (e) => e[0])
                      .replace(/\s/g, '')}
                  </div>
                )}
              </div>

              <div className='flex flex-col min-w-0 flex-1'>
                <span className='font-semibold truncate block w-full text-base'>{guild.name}</span>
                <div className='block space-x-1.5 text-xs text-gray-400 truncate w-full'>
                  <span className=''>{guild.isOwner ? 'Owner' : guild.isAdmin ? 'Admin' : guild.canManage ? 'Staff' : 'User'}</span>
                  <span>•</span>
                  <span>{guild.botPresent ? 'Mutual Server' : 'Not Mutual'}</span>
                </div>
              </div>
            </div>

            <div className='shrink-0 ml-auto'>
              {guild.canManage && guild.botPresent && (
                <a href={`/dashboard/${guild.id}`} className='bg-green-600 px-3 py-1.5 text-sm rounded hover:bg-green-700 transition whitespace-nowrap'>
                  Edit
                </a>
              )}
              {guild.canManage && !guild.botPresent && (
                <a
                  href={`https://discord.com/oauth2/authorize?client_id=${process.env.AUTH_DISCORD_ID}&permissions=8&scope=bot%20applications.commands&guild_id=${guild.id}&redirect_uri=${encodeURIComponent(`http://localhost:3000/dashboard`)}&response_type=code`}
                  className='bg-indigo-500 px-3 py-1.5 text-sm rounded hover:bg-indigo-600 transition whitespace-nowrap'
                >
                  Add Bot
                </a>
              )}
              {!guild.canManage && guild.botPresent && (
                <a href={`/dashboard/${guild.id}`} className='bg-gray-500 px-3 py-1.5 text-sm rounded hover:bg-gray-600 transition whitespace-nowrap'>
                  View
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
