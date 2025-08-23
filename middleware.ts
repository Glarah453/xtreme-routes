import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authAdmin } from '@/app/lib/firebase_Admin';
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { jwtVerify } from "jose";
import postgres from 'postgres';

 
export default NextAuth(authConfig).auth;

const PUBLIC_PATHS = new Set<string>([
  "/",
  "/login",
  "/register",
]);

function isPublicPath(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  // permite assets públicos
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets")
  ) return true;
  return false;
}

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const JWT_SECRET = process.env.JWT_SECRET!;

async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  // Lanza si el token no es válido/expiró
  return jwtVerify(token, secret);
}

// export async function middleware(req: NextRequest) {
//   const token = req.cookies.get("access_token")?.value;
//
//   // 1. No hay cookie → redirigir al login
//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
//
//   try {
//     // 2. Verificar el JWT
//     const { payload } = await jwtVerify(
//       token,
//       new TextEncoder().encode(JWT_SECRET)
//     );
//
//     await authAdmin.verifyIdToken(token);
//
//     const usuarioId = payload.usuarioId as number;
//
//     // 3. Validar que la sesión exista en DB
//     const { rows } = await sql`
//       SELECT id, estado
//       FROM sesiones
//       WHERE usuario_id = ${usuarioId}
//       AND access_token = ${token}
//       AND estado = 'activa'
//       LIMIT 1
//     `;
//
//     if (rows.length === 0) {
//       // No hay sesión activa → redirigir
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//
//     // 4. Todo ok → continuar
//     return NextResponse.next();
//   } catch (err) {
//     console.error("Error en middleware:", err);
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get("access_token")?.value ?? null;

  // Deja pasar APIs y archivos estáticos
  if (pathname.startsWith("/api") || isPublicPath(pathname)) {
    // Si el usuario ya está autenticado, opcionalmente redirigir fuera de /login o /register
    if ((pathname === "/login" || pathname.startsWith("/register")) && token) {
      try {
        await verifyToken(token);
        const url = new URL("/dashboard", req.url);
        return NextResponse.redirect(url);
      } catch {
        // token inválido -> continuar a /login o /register
      }
    }
    return NextResponse.next();
  }

  // Rutas protegidas: ejemplo, todo /dashboard
  const isProtected = pathname.startsWith("/dashboard");

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(url);
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(url);
  }
}



export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: [
    // '/((?!api|_next/static|_next/image|.*\\.png$).*)',     
    "/((?!_next/static|_next/image|favicon.ico|assets|.*\\.(?:png|jpg|svg|css|js|ico|map)).*)",
    // '/dashboard/:path*'
  ],// ajusta según tus rutas protegidas
};


