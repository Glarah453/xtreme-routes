import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { UsuarioAuth } from '@/app/lib/definitions';
import { formatCurrency, calculateAge } from '@/app/lib/utils';
import bcrypt from 'bcrypt';
import postgres from 'postgres';


import { authAdmin } from '@/app/lib/firebase_Admin';
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


async function getUser(email: string): Promise<UsuarioAuth | undefined> {
  try {
    // const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    const user = await sql<UsuarioAuth[]>`SELECT id, displayname, email, password, photoURL FROM usuarios WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
};



export async function authenticateGoogleSignIn(formData: FormData){
  const idToken = formData.get("idToken");

  if (typeof idToken !== "string" || !idToken) {
    return "Falta idToken de Google.";
  }

  // const parsedCredentials = z
  //   .object({ email: z.string().email(), password: z.string().min(6) })
  //   .safeParse(credentials);


  // 1) Verificar token de Firebase
  const decoded = await authAdmin.verifyIdToken(idToken);
  const uid = decoded.uid || "";
  const email = decoded.email || "";
  const name = decoded.name || "";
  const picture = decoded.picture || "";

  if (!email) {
    return "Tu cuenta de Google no tiene email verificado.";
  }

  // 2) Buscar usuario en DB por email
  // const result = await sql`
  //   SELECT id, displayname, photoURL
  //   FROM usuarios
  //   WHERE email = ${email}
  //   LIMIT 1
  // `;

  const dbUser = await getUser(email);

  // console.log("Busqueda de usuario: ", result);

  // if (result.length === 0) {
  if (!dbUser) {
  // if (result === null) {
    // console.log("Usuario no existe")
    // Usuario NO existe -> enviar a /register con prefill
    return {
      needsRegistration: true,
      uid,
      email,
      name,
      picture,
      provider: "google",
    }; // 🔥 no redirect aquí
  } else {

    // const dbUser = result[0];
    const userId = Number(dbUser.id);

    const accessToken = await generateAccessToken({
      uid: userId,
      email,
      name: (dbUser.displayname as string) || name || undefined,
      picture: (dbUser.photoURL as string) || picture || undefined,
      provider: "google",
    });

    // await crearSesionEnDB(userId, accessToken);
    await sql`CALL crear_sesion(${userId}, ${accessToken}, NULL);`;
    await setAccessTokenCookie(accessToken);

    // 4) Redirigir
    // redirect(redirectTo);
    return { success: true };
  }

}


export async function authenticateEmailPassword(formData: FormData) {
// ---- EMAIL + PASSWORD ----
  const email = formData.get("email");
  const password = formData.get("password");

  const parsedCredentials = z
    .object({ email: z.string().email(), password: z.string().min(6) })
    .safeParse(credentials);

  if (typeof email !== "string" || typeof password !== "string") {
    return "Parámetros inválidos.";
  }

  // 1) Buscar usuario
  // const result = await sql`
  //   SELECT id, password, displayname, photoURL
  //   FROM usuarios
  //   WHERE email = ${email}
  //   LIMIT 1
  // `;

  // console.log("Busqueda de usuario: ", result);

  const dbUser = await getUser(email);

  // if (result.length === 0) {
  if (!dbUser) {
    return {
      needsRegistration: true, 
      email, 
      provider: "password" 
    };
  } else {

    // const dbUser = result[0];
    const hash = dbUser.password as string | null;

    // if (!hash) {
    //   // El usuario existe pero no tiene password (ej: se registró con Google)
    //   return "Esta cuenta no tiene contraseña. Inicia sesión con Google.";
    // }

    const ok = await bcrypt.compare(password, hash);
    if (!ok) {
      return "Credenciales inválidas.";
    }

    // 2) OK -> token, sesión, cookie
    const userId = dbUser.id;
    const name = dbUser.displayname as string | null;
    const picture = dbUser.photoURL as string | null;

    const accessToken = await generateAccessToken({
      uid: userId,
      email,
      name: name || undefined,
      picture: picture || undefined,
      provider: "password",
    });

    // await crearSesionEnDB(userId, accessToken);
    await sql`CALL crear_sesion(${userId}, ${accessToken}, NULL);`;
    await setAccessTokenCookie(accessToken);

    // 3) Redirigir
    // redirect(redirectTo);
    return { success: true };
  }
}


// Función para generar un color hexadecimal aleatorio
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getConsistentColor(input: string) {
  const colors = ['FF5733', '33FF57', '5733FF', 'FF33A1', '33FFF5'];
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}



export async function registerUserDB(formData: FormData) {
  const uid = formData.get("uid") || "null";
  const nombre = formData.get("name");
  const email = formData.get("email");
  const fecha_nacimiento = formData.get("birthdate");
  // const photoURL = formData.get("picture") || "";
  
  const randomColor = getConsistentColor(nombre);
  
  const photoURL = formData.get("picture") || `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&size=256&background=${randomColor}&color=fff`;
  const comuna_id = formData.get("comuna");
  const password = formData.get("password"); // opcional
  // const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";
  // const redirectTo = sanitizeRedirect(formData.get("redirectTo"));

  if (
    typeof nombre !== "string" ||
    typeof email !== "string" ||
    typeof fecha_nacimiento !== "string" ||
    typeof comuna_id !== "string"
  ) {
    return "Datos de registro inválidos.";
  } else {

  // try {
    // 1) Crear usuario vía tu PROCEDURE (sin password)
    await sql`
      CALL crear_usuario(
        ${nombre},
        ${email},
        ${fecha_nacimiento},
        ${photoURL},
        ${comuna_id},
        NULL
      );
    `;

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      UPDATE usuarios
      SET firebase_uid = ${uid}, password = ${hashedPassword}
      WHERE email = ${email};
    `;


    const dbUser = await getUser(email);
    // 2) Recuperar el id del usuario recién creado
    // const result = await sql`
    //   SELECT id, displayname, photoURL
    //   FROM usuarios
    //   WHERE email = ${email}
    //   LIMIT 1
    // `;

    // if (result.length === 0) {
    if (!dbUser) {
      return "No se pudo recuperar el usuario recién creado.";
    }

    console.log("result usuario creado: ", result);

    const userId = dbUser.id;


    // 4) Generar token, guardar sesión, setear cookie
    const accessToken = await generateAccessToken({
      uid: userId,
      email,
      name: nombre,
      picture: String(photoURL || ""),
      provider: "register",
    });

    // await crearSesionEnDB(userId, accessToken);
    await sql`CALL crear_sesion(${userId}, ${accessToken}, NULL);`;
    await setAccessTokenCookie(accessToken);

    // 5) Redirigir
    // const safeRedirect = redirectTo.startsWith("/") ? redirectTo : "/dashboard";
    // redirect(safeRedirect);
    return { success: true };
  }
}








export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);

          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
