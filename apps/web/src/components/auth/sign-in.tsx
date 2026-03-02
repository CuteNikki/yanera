import { signIn } from '@/auth';  
import { Button } from '@/components/ui/button';

export function SignIn() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('discord', { redirectTo: '/dashboard' });
      }}
    >
      <Button type='submit'>Login with Discord</Button>
    </form>
  );
}
