// components/AuthButton.js
'use client'
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function AuthButton() {
  const { data: session } = useSession();

  const handleAuthAction = async () => {
    if (session) {
      await signOut({ callbackUrl: '/' }); // Redirect to home page after sign out
    } else {
      await signIn(); // Redirect to sign-in page
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleAuthAction}
      className="bg-black text-white"
    >
      {session ? 'Logout' : 'Login'}
    </Button>
  );
}