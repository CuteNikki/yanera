import Image from 'next/image';

import { signOut } from '@/auth';

import { DiscordProfile } from '@/lib/discord';
import { getUserAvatarUrl } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function SignOut({ profile }: { profile: DiscordProfile }) {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <Card className='sm:min-w-80'>
        <CardContent className='flex flex-row items-center justify-between gap-8'>
          <div className='flex flex-row items-center gap-2'>
            <Image
              src={getUserAvatarUrl(profile.id, profile.discriminator, profile.avatar, 128)}
              alt='Avatar'
              width={40}
              height={40}
              className='h-10 w-10 shrink-0 rounded-full'
            />
            {profile.global_name ? (
              <div className='leading-tight'>
                <p>{profile.global_name}</p>
                <p className='text-muted-foreground text-sm'>@{profile.username}</p>
              </div>
            ) : (
              <div>
                <p>@{profile.username}</p>
              </div>
            )}
          </div>
          <Button variant='destructive' type='submit'>
            Logout
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
