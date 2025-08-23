
'use client';

import { lusitana } from '@/app/ui/fonts';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import AcmeLogo from '@/app/ui/acme-logo';
import { Suspense } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { registerUser } from '@/app/lib/actions';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const uid = searchParams.get("uid") ?? "";
  const email = searchParams.get("email") ?? "";
  const displayName = searchParams.get("displayName") ?? "";
  const password = searchParams.get("password") ?? "";
  const fechaNacimiento = searchParams.get("fechaNacimiento") ?? "";
  const comuna = searchParams.get("comuna") ?? "";
  const photoURL = searchParams.get("photoURL") ?? "";

  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setIsPending(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.append('uid', uid);
      const result = await registerUser(undefined, formData);

      if (result?.success) {
        router.push('/dashboard');
      } else {
        setErrorMessage(result?.error || 'Error al registrar usuario');
      }
    } catch (err: any) {
setErrorMessage(err.message);
    } finally {
      setIsPending(false);
    }
  };


  return (

    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <Suspense>
          <form onSubmit={handleSubmit}>
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
              <h1 className={`${lusitana.className} mb-3 text-2xl`}>
                Complete your registration
              </h1>

              {/* Email */}
              <label className="mb-2 mt-4 block text-xs font-medium text-gray-900" htmlFor="email">
                Email
              </label>
              <input
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                defaultValue={email}
                required
                readOnly={!!email} // si viene desde Google, no dejar editar
              />

              {/* Nombre completo */}
              <label className="mb-2 mt-4 block text-xs font-medium text-gray-900" htmlFor="displayName">
                Name
              </label>
              <input
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                id="displayName"
                type="text"
                name="displayName"
                defaultValue={displayName}
                required
              />

              {/* Fegha de Nacimiento */}
              <label className="mb-2 mt-4 block text-xs font-medium text-gray-900" htmlFor="fechaNacimiento">
                Fecha de Nacimiento
              </label>
              <input
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                id="fechaNacimiento"
                type="date"
                name="fechaNacimiento"
                defaultValue={fechaNacimiento}
              />

              {/* Foto opcional */}
              <label className="mb-2 mt-4 block text-xs font-medium text-gray-900" htmlFor="comuna">
                Comuna
              </label>
              <input
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                id="comuna"
                type="number"
                name="comuna"
                defaultValue={comuna}
              />

              {/* Foto opcional */}
              <label className="mb-2 mt-4 block text-xs font-medium text-gray-900" htmlFor="photoURL">
                Profile picture (optional)
              </label>
              <input
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                id="photoURL"
                type="url"
                name="photoURL"
                defaultValue={photoURL}
              />

              {/* Contraseña (solo si es email/password) */}
              {/* {!email || !email.endsWith('@gmail.com') ? ( */}
              {/*   <> */}
              {/*     <label className="mb-2 mt-4 block text-xs font-medium text-gray-900" htmlFor="password"> */}
              {/*       Password */}
              {/*     </label> */}
              {/*     <input */}
              {/*       className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500" */}
              {/*       id="password" */}
              {/*       type="password" */}
              {/*       name="password" */}
              {/*       placeholder="Enter a password" */}
              {/*       required */}
              {/*       minLength={6} */}
              {/*     /> */}
              {/*   </> */}
              {/* ) : null} */}

              <label className="mb-2 mt-4 block text-xs font-medium text-gray-900" htmlFor="password">
                Password
              </label>
              <input
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter a password"
                required
                minLength={6}
              />

              <Button type="submit" className="mt-6 w-full" aria-disabled={isPending}>
                Register <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
              </Button>

              {/* errores */}
              {errorMessage && (
                <div className="mt-3 flex items-center space-x-2 text-red-600">
                  <ExclamationCircleIcon className="h-5 w-5" />
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}
            </div>
          </form>
        </Suspense>
      </div>
    </main>
  );
}
