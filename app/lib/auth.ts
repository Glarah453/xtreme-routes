import NextAuth from 'next-auth';
// import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';


import { cookies } from 'next/headers';
import { SignJWT } from "jose"; // para firmar el access_token con clave secreta propia


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


// export async function generateAccessToken(payload: Record<string, any>) {
//   const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
//   return await new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("7d")
//     .sign(secret);
// }


type AccessTokenPayload = {
  uid: number;
  email: string;
  name?: string;
  picture?: string;
  provider: "google" | "password" | "register";
};

export async function generateAccessToken(payload: AccessTokenPayload) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  // Nota: agrega/ajusta claims si los necesitas
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
  return token;
}


export async function setAccessTokenCookie(accessToken: string) {
  const cookieStore = await cookies(); // Next 14+: await cookies()
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });
}


export async function deleteAccessTokenCookie() {
  // Elimina la cookie de sesión
  const cookieStore = await cookies(); // 👈 ahora con await
  cookieStore.delete("access_token");
}


async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
};

// export const { auth, signIn, signOut } = NextAuth({
//   ...authConfig,
//   providers: [
//     Credentials({
//       async authorize(credentials) {
//         const parsedCredentials = z
//           .object({ email: z.string().email(), password: z.string().min(6) })
//           .safeParse(credentials);
//
//         if (parsedCredentials.success) {
//           const { email, password } = parsedCredentials.data;
//           const user = await getUser(email);
//
//           if (!user) return null;
//
//           const passwordsMatch = await bcrypt.compare(password, user.password);
//
//           if (passwordsMatch) return user;
//         }
//
//         console.log('Invalid credentials');
//         return null;
//       },
//     }),
//   ],
// });
