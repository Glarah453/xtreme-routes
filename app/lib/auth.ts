


import { cookies } from 'next/headers';
import { SignJWT } from "jose"; // para firmar el access_token con clave secreta propia


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
