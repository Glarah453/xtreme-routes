'use server';

import postgres from 'postgres';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// import { cookies } from 'next/headers';
// import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { authAdmin } from './firebase_Admin';
// import { SignJWT } from "jose"; // para firmar el access_token con clave secreta propia
import { generateAccessToken, setAccessTokenCookie } from "@/app/lib/auth";



export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce.number().gt(0, { 
    message: 'Please enter an amount greater than $0.',
  }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


export async function createInvoice(prevState: State, formData: FormData) {

  // USAR FORM ENTRIES SI SON MUCHOS DATOS EN EL FORMULARIO
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    console.log(error);

    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');

}

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
 

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
 
  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }
 
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}


export async function deleteInvoice(id: string) {
    
  // throw new Error('Failed to Delete Invoice');
  
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}








//
// export async function authenticate(prevState: any | undefined, formData: FormData) {
//   const provider = formData.get("provider") as string;
//   const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";
//
//   try {
//     // 🔹 Caso 1: Email + Password
//     if (provider === "password") {
//       const email = formData.get("email") as string;
//       const password = formData.get("password") as string;
//
//       const { rows } = await sql`
//         SELECT id, email, password, displayname, photoURL
//         FROM usuarios
//         WHERE email = ${email}
//       `;
//
//       if (rows === undefined) {
//         return "Invalid credentials";
//       }
//
//       const user = rows[0];
//       const valid = await bcrypt.compare(password, user.password);
//
//       if (!valid) {
//         return "Invalid credentials";
//       }
//
//       // Generar JWT y guardar en cookie
//       const accessToken = await generateAccessToken({
//         uid: user.id,
//         email: user.email,
//         name: user.name,
//         picture: user.picture,
//       });
//
//       await sql`CALL crear_sesion(${user.id}, ${accessToken}, NULL);`;
//
//       // 5. Guardar cookie HttpOnly
//       cookies().set("access_token", accessToken, {
//         httpOnly: true,
//         // secure: process.env.NODE_ENV === "production",
//         secure: true,
//         sameSite: "lax",
//         path: "/",
//         maxAge: 60 * 60 * 24 * 7, // 7 días
//       });
//       // return null; // éxito → redirección automática en el formulario
//       return { success: true }; // éxito → redirección automática en el formulario
//     }
//
//     // 🔹 Caso 2: Google Sign-In
//     if (provider === "google") {
//       const idToken = formData.get("idToken") as string;
//
//       // Verificar token de Google con Firebase Admin
//       const decoded = await authAdmin.verifyIdToken(idToken);
//       const { uid, email, name, picture } = decoded;
//
//       const { rows } = await sql`
//         SELECT id, email, displayname, photoURL
//         FROM usuarios
//         WHERE email = ${email}
//       `;
//
//       if (rows === undefined) {
//         // Usuario no existe → falta registro
//         return {   
//           needsRegistration: true,
//           status: "NEEDS_REGISTRATION", 
//           uid, 
//           email, 
//           name, 
//           picture 
//         };
//       }
//
//       const user = rows[0];
//
//       // Generar JWT y guardar en cookie
//
//       const accessToken = await generateAccessToken({
//         uid: user.id,
//         email: user.email,
//         name: user.name,
//         picture: user.picture,
//       });
//
//
//       await sql`CALL crear_sesion(${user.id}, ${accessToken}, NULL);`;
//
//       const cookieStore = await cookies(); // 👈 importante
//
//       // 6. Guardar cookie
//       cookieStore.set("access_token", accessToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         path: "/",
//         maxAge: 60 * 60 * 24 * 7,
//       });
//
//       return { success: true, status: "OK", redirectTo };
//     }
//
//     return "Unknown provider";
//   } catch (err: any) {
//     console.error("Error en authenticate:", err);
//     return "Authentication failed";
//   }
// }

function sanitizeRedirect(to: unknown) {
  const val = typeof to === "string" ? to : "/dashboard";
  return val.startsWith("/") ? val : "/dashboard";
}



// ACTION: authenticate ------------------

export async function authenticate(_: unknown, formData: FormData) {
  // const provider = (formData.get("provider") || "password") as string;
  // const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

  // Normaliza: si vienes desde un botón o desde <form>, asegúrate de no
  // enviar cosas raras de vuelta al cliente
  // const safeRedirect = redirectTo.startsWith("/") ? redirectTo : "/dashboard";
  const provider = String(formData.get("provider") || "password");
  const redirectTo = sanitizeRedirect(formData.get("redirectTo"));


  try {
    if (provider === "google") {
      // ---- GOOGLE SIGN-IN ----
      const idToken = formData.get("idToken");
      if (typeof idToken !== "string" || !idToken) {
        return "Falta idToken de Google.";
      }

      // 1) Verificar token de Firebase
      const decoded = await authAdmin.verifyIdToken(idToken);
      const email = decoded.email || "";
      const name = decoded.name || "";
      const picture = decoded.picture || "";

      if (!email) {
        return "Tu cuenta de Google no tiene email verificado.";
      }

      // 2) Buscar usuario en DB por email
      const result = await sql`
        SELECT id, displayname, photoURL
        FROM usuarios
        WHERE email = ${email}
        LIMIT 1
      `;

      console.log("Busqueda de usuario: ", result);

      if (result.length === 0) {
      // if (result === null) {
        console.log("Usuario no existe")
        // Usuario NO existe -> enviar a /register con prefill
        // const params = new URLSearchParams();
        // params.set("email", email);
        // if (name) params.set("displayName", name);
        // if (picture) params.set("photoURL", picture);
        // // Puedes pasar también algún flag para saber que vienes de Google
        // params.set("provider", "google");
        //
        // revalidatePath(`/register?${params.toString()}`);
        // redirect(`/register?${params.toString()}`);
        return {
          needsRegistration: true,
          email,
          name,
          picture,
          provider: "google",
        }; // 🔥 no redirect aquí
      }

      // 3) Usuario existe -> generar JWT, crear sesión, setear cookie
      // const userId = result[0].id;
      // const accessToken = await generateAccessToken({
      //   uid: userId,
      //   email,
      //   name,
      //   picture,
      //   provider: "google",
      // });

      const dbUser = result[0];
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

    if (provider === "password") {
      // ---- EMAIL + PASSWORD ----
      const email = formData.get("email");
      const password = formData.get("password");

      if (typeof email !== "string" || typeof password !== "string") {
        return "Parámetros inválidos.";
      }

      // 1) Buscar usuario
      const result = await sql/*sql*/`
        SELECT id, password, displayname, photoURL
        FROM usuarios
        WHERE email = ${email}
        LIMIT 1
      `;

      console.log("Busqueda de usuario: ", result);

      if (result.length === 0) {
      // if (result === null) {
        // Si quieres forzar que vaya a register cuando no existe:
        // const params = new URLSearchParams();
        // params.set("email", email);
        // params.set("provider", "password");
        //
        // revalidatePath(`/register?${params.toString()}`);
        // redirect(`/register?${params.toString()}`);

        return { needsRegistration: true, email, provider: "password" };
      }

      const dbUser = result[0];
      const hash = dbUser.password as string | null;

      if (!hash) {
        // El usuario existe pero no tiene password (ej: se registró con Google)
        return "Esta cuenta no tiene contraseña. Inicia sesión con Google.";
      }

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

    // Provider desconocido
    return "Proveedor no soportado.";
  } catch (err: any) {
    console.error("Error en authenticate:", err);
    // Mensaje genérico para el UI
    return "Algo salió mal al iniciar sesión.";
  }
}





// export async function registerUser( prevState: string | undefined, formData: FormData ) {
//   const uid = formData.get("uid") as string;
//   const displayname = formData.get("displayName") as string;
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;
//   const fecha_nacimiento = formData.get("fechaNacimiento") as string;
//   const photoURL = formData.get("photoURL") as string;
//   const comuna_id = formData.get("comuna") as string;
//
//   try {
//     // // 🔹 1. Crear usuario en Firebase
//     // const userRecord = await authAdmin.createUser({
//     //   email,
//     //   password,
//     //   // displayName: displayname,
//     //   // photoURL,
//     // });
//     //
//     // // 🔹 Datos que trae Firebase (si es Google ya vienen llenos)
//     // const displayName = userRecord.displayName || email.split("@")[0];
//     // const photoURL =
//     //   userRecord.photoURL ||
//     //   "https://ui-avatars.com/api/?name=" + encodeURIComponent(displayName);
//     //
//
//
//     console.log(formData);
//
//     // 🔹 2. Guardar en Postgres usando tu procedimiento
//     const result = await sql`
//       CALL crear_usuario(
//         ${displayname},
//         ${email},
//         ${fecha_nacimiento},
//         ${photoURL},
//         ${comuna_id},
//         NULL
//       );
//     `;
//
//     console.log("procedimiento: ", result);
//
//     const hashedPassword = await bcrypt.hash(password, 10);
//
//     await sql`
//       UPDATE usuarios
//       SET firebase_uid = ${uid}, password = ${hashedPassword}
//       WHERE email = ${email};
//     `;
//
//     // 2. Obtener id recién creado
//     // const { rows } = await sql`
//     //   SELECT id FROM usuarios WHERE email = ${email};
//     // `;
//
//
//     const result1 = await sql`
//       SELECT id FROM usuarios WHERE email = ${email};
//     `;
//
//     // console.log(result1);
//
//     const userId = result1[0].id;
//     // console.log("Usuario encontrado con ID:", userId);    // 🔹 3. Relacionar el firebase_uid con el usuario insertado
//     //
//
//
//
//     // 4. Crear access_token
//     // const accessToken = await generateAccessToken(userId);
//     const accessToken = await generateAccessToken({
//         uid: uid,
//         id: userId,
//         email: email,
//         name: displayname,
//         picture: photoURL,
//       });
//
//     // 5. Registrar sesión en DB
//     await sql`CALL crear_sesion(${userId}, ${accessToken}, NULL);`;
//
//
//     const cookieStore = await cookies(); // 👈 importante
//
//     // 6. Guardar cookie
//     cookieStore.set("access_token", accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 7,
//     });
//
//     return { success: true, uid: uid };
//   } catch (err: any) {
//     return { success: false, error: err.message };
//   }
// }




// ACTION: registerUser ------------------

export async function registerUser(_: unknown, formData: FormData) {
  // Campos mínimos requeridos por tu PROCEDURE crear_usuario
  const uid = formData.get("uid") as string;
  const nombre = formData.get("displayName");
  const email = formData.get("email");
  const fecha_nacimiento = formData.get("fechaNacimiento");
  const photoURL = formData.get("photoURL") || "";
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
  }

  try {
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


    // 2) Recuperar el id del usuario recién creado
    const result = await sql`
      SELECT id, displayname, photoURL
      FROM usuarios
      WHERE email = ${email}
      LIMIT 1
    `;

    if (result.length === 0) {
      return "No se pudo recuperar el usuario recién creado.";
    }

    console.log("result usuario creado: ", result);

    const userId = result[0].id;


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
  } catch (err: any) {
    console.error("Error en registerUser:", err);
    // Si tu PROCEDURE lanza excepciones, aquí caerán.
    return err?.message || "No se pudo registrar al usuario.";
  }
}


