import Image from 'next/image';

import { auth, signIn, signOut } from '@/auth';
import { getUserAvatarUrl, getUserProfile } from '@/lib/discord';

export default async function Home() {
  const session = await auth();

  // ONLY fetch the profile if we have a session.
  const profile = session ? await getUserProfile() : null;

  return (
    <main className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-2xl font-bold mb-4'>Welcome to Yanera</h1>
      {session?.user && profile ? (
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <div className='flex gap-2 items-center'>
            <Image
              src={await getUserAvatarUrl(profile.id, profile.discriminator, profile.avatar, 128)}
              alt='Avatar'
              width={40}
              height={40}
              className='rounded-full shrink-0 w-10 h-10'
            />
            <div className='leading-tight'>
              <p>{profile.global_name}</p>
              <p className='text-sm text-muted-foreground'>@{profile.username}</p>
            </div>
            <button type='submit' className='px-4 py-2 bg-red-600 text-white rounded'>
              Logout
            </button>
          </div>
        </form>
      ) : (
        <form
          action={async () => {
            'use server';
            await signIn('discord', { redirectTo: '/dashboard' });
          }}
        >
          <button type='submit' className='px-4 py-2 bg-indigo-600 text-white rounded'>
            Login with Discord
          </button>
        </form>
      )}
    </main>
  );
}
