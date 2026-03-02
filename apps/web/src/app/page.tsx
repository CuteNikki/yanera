import { ArrowRightIcon, RadioTowerIcon } from 'lucide-react';
import Link from 'next/link';

import { auth } from '@/auth';

import { getUserProfile } from '@/lib/discord';

import { SignIn } from '@/components/auth/sign-in';
import { SignOut } from '@/components/auth/sign-out';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const session = await auth();
  const profile = session ? await getUserProfile() : null;

  return (
    <main className='flex min-h-screen flex-col items-center justify-center'>
      <h1 className='mb-4 text-2xl font-bold'>Welcome to Yanera</h1>
      {session?.user && profile ? (
        <div className='flex flex-col items-center gap-4'>
          <div className='flex flex-col items-center gap-2'>
            <Button variant='secondary' asChild>
              <Link href='/dashboard'>
                Dashboard
                <ArrowRightIcon className='size-5 shrink-0' />
              </Link>
            </Button>
            <Button variant='outline' asChild>
              <Link href='/status'>
                Status Page
                <RadioTowerIcon className='size-5 shrink-0' />
              </Link>
            </Button>
          </div>
          <SignOut profile={profile} />
        </div>
      ) : (
        <SignIn />
      )}
    </main>
  );
}
