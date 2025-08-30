
import AuthForm from '@/app/ui/auth/auth-form.tsx';

import { Suspense } from 'react';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Authenticate',
};


export default function AuthPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <Suspense>
        <AuthForm />
        {/* <AuthForm /> */}
      </Suspense>
    </main>
  );
}

