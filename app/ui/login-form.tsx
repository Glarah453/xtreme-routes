'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { useActionState } from 'react';
import { authenticate, authenticateWithGoogle } from '@/app/lib/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { authClient } from '@/app/lib/firebase_Client';
import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  // const [errorMessage, formAction, isPending] = useActionState(
  //   authenticate,
  //   undefined,
  // );
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // const { user, usuarioData, loading } = useAuth();
  const [googleError, setGoogleError] = useState<string | null>(null);

  // useEffect(() => {
  //   if (!loading && user) {
  //     if (usuarioData) {
  //       router.replace("/dashboard"); // usuario existe en DB
  //     } else {
  //       router.replace("/register"); // nuevo usuario → completar datos
  //     }
  //   }
  // }, [user, usuarioData, loading, router]);




  // const [googleError, setGoogleError] = useState('');
  //
  // const handleGoogleLogin = async () => {
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     const result = await signInWithPopup(authClient, provider);
  //     const idToken = await result.user.getIdToken();
  //
  //     // console.log("Google ID Token:", idToken); // 👀 revisar en consola
  //
  //     // Creamos un formData simulado para reusar authenticate
  //     const formData = new FormData();
  //     formData.append('provider', 'google');
  //     formData.append('idToken', idToken);
  //     formData.append('redirectTo', callbackUrl);
  //
  //     const res = await authenticate(undefined, formData);
  //
  //     if (res?.needsRegistration) {
  //       const params = new URLSearchParams({
  //         uid: res.uid ?? '',
  //         email: res.email ?? '',
  //         displayName: res.name ?? '',
  //         photoURL: res.picture ?? '',
  //       });
  //       // console.log(params);
  //       router.push(`/register?${params.toString()}`);
  //     } else if (res?.success) {
  //       router.push(callbackUrl);  // redirigir al dashboard
  //     } 
  //   } catch (err: any) {
  //     setGoogleError(err.message);
  //   }
  // };


  // 🔑 Google login → usa Firebase + authenticate (server action)
  const handleGoogleLogin = async () => {
    try {
      setGoogleError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(authClient, provider);
      const idToken = await result.user.getIdToken();

      const fd = new FormData();
      fd.append("provider", "google");
      fd.append("idToken", idToken);
      fd.append("redirectTo", callbackUrl);

      // Importante: authenticate hará redirect en el server
      // await authenticate(undefined, fd);
      const res = await authenticate(undefined, fd);

      if (res?.needsRegistration) {
        const params = new URLSearchParams({
          uid: res.uid ?? '',
          email: res.email ?? '',
          displayName: res.name ?? '',
          photoURL: res.picture ?? '',
        });
        // console.log(params);
        router.push(`/register?${params.toString()}`);
      } else if (res?.success) {
        router.push(callbackUrl);  // redirigir al dashboard
      } 

    } catch (err) {
      console.error(err);
      setGoogleError("Error al iniciar sesión con Google.");
    }
  };


  // const handleFormSubmit = async (formData: FormData) => {
  //   const res = await authenticate(undefined, formData);
  //
  //   if (res?.needsRegistration) {
  //     const params = new URLSearchParams({
  //       email: res.email ?? '',
  //     });
  //     router.push(`/register?${params.toString()}`);
  //   } else if (res?.success) {
  //     router.push(callbackUrl);
  //   }
  // };

  // --- Email/password login ---
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.append("provider", "password");

    const res = await authenticate(undefined, formData);

    if (res?.needsRegistration) {
      const params = new URLSearchParams({
        email: res.email ?? "",
        provider: "password",
      });
      router.push(`/register?${params.toString()}`);
    } else if (res?.success) {
      router.push(callbackUrl);
    } else if (res?.error) {
      setErrorMessage(res.error);
    }
  };


  return (
    <div className="space-y-3">
      {/* <form action={formAction}> */}
      <form action={handleFormSubmit}>
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Please log in to continue.
          </h1>
          <div className="w-full">
            <div>
                          {/* Email */}
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                />
                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div className="mt-4">
                          {/* Password */}
              <label
                className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  required
                  minLength={6}
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
          <input type="hidden" name="provider" value="password" />
          <input type="hidden" name="redirectTo" value={callbackUrl} />
          <Button className="mt-4 w-full" aria-disabled={isPending}>
            Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {/* Add form errors here */}
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </div>
      </form>
                    {/* Google login button */}
      <div className="flex-1 rounded-lg bg-gray-50 px-5 pb-4 pt-0">
        <Button onClick={handleGoogleLogin} className="w-full bg-red-700 hover:bg-red-500">
          Sign in with Google <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
        {googleError && (
          <p className="text-sm text-red-500">{googleError}</p>
        )}
      </div>
    </div>
  );
}
