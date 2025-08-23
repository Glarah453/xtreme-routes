'use server';

import postgres from 'postgres';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { cookies } from 'next/headers';
import { authAdmin } from './firebase_Admin';
import { SignJWT } from "jose"; // para firmar el access_token con clave secreta propia



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




export async function generateAccessToken(payload: Record<string, any>) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}




export async function authenticate(prevState: any | undefined, formData: FormData) {
  const provider = formData.get("provider") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

  try {
    // 🔹 Caso 1: Email + Password
    if (provider === "password") {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const { rows } = await sql`
        SELECT id, email, password, displayname, photoURL
        FROM usuarios
        WHERE email = ${email}
      `;

      if (rows === undefined) {
        return "Invalid credentials";
      }

      const user = rows[0];
      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return "Invalid credentials";
      }

      // Generar JWT y guardar en cookie
      const accessToken = await generateAccessToken({
        uid: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      });

      await sql`CALL crear_sesion(${user.id}, ${accessToken}, NULL);`;

      // 5. Guardar cookie HttpOnly
      cookies().set("access_token", accessToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === "production",
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 días
      });
      // return null; // éxito → redirección automática en el formulario
      return { success: true }; // éxito → redirección automática en el formulario
    }

    // 🔹 Caso 2: Google Sign-In
    if (provider === "google") {
      const idToken = formData.get("idToken") as string;

      // Verificar token de Google con Firebase Admin
      const decoded = await authAdmin.verifyIdToken(idToken);
      const { uid, email, name, picture } = decoded;

      const { rows } = await sql`
        SELECT id, email, displayname, photoURL
        FROM usuarios
        WHERE email = ${email}
      `;

      if (rows === undefined) {
        // Usuario no existe → falta registro
        return {   
          needsRegistration: true,
          status: "NEEDS_REGISTRATION", 
          uid, 
          email, 
          name, 
          picture 
        };
      }

      const user = rows[0];

      // Generar JWT y guardar en cookie
      
      const accessToken = await generateAccessToken({
        uid: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      });


      await sql`CALL crear_sesion(${user.id}, ${accessToken}, NULL);`;

      const cookieStore = await cookies(); // 👈 importante

      // 6. Guardar cookie
      cookieStore.set("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return { success: true, status: "OK", redirectTo };
    }

    return "Unknown provider";
  } catch (err: any) {
    console.error("Error en authenticate:", err);
    return "Authentication failed";
  }
}




//
// export async function authenticate(prevState: string | undefined, formData: FormData) {
//   try {
//
//     const provider = formData.get("provider");
//     const idToken = formData.get("idToken") as string | null;
//
//     if (provider === "google") {
//       if (!idToken) {
//         throw new Error("No se recibió un ID Token de Google");
//       }
//     }
//
//     // 1. Verificar token de Firebase
//     const decoded = await authAdmin.verifyIdToken(idToken);
//     const { uid, email, name, picture } = decoded;
//
//     // 2. Buscar en usuarios
//     const { rows } = await sql`
//       SELECT * FROM usuarios WHERE firebase_uid = ${uid} OR email = ${email};
//     `;
//
//     console.log("Resultado query:", rows); // 👀 esto devuelve un array, no { rows }
//
//     if (rows === undefined) {
//       console.log(uid, email, name, picture)
//       // Usuario no existe → falta registro
//       return { status: "NEEDS_REGISTRATION", uid, email, name, picture };
//     }
//
//     const user = rows[0];
//
//     // 3. Crear access_token propio
//     const accessToken = await generateAccessToken(user.id);
//
//     // 4. Registrar sesión en la DB
//     await sql`CALL crear_sesion(${user.id}, ${accessToken}, NULL);`;
//
//     // 5. Guardar cookie HttpOnly
//     cookies().set("access_token", accessToken, {
//       httpOnly: true,
//       // secure: process.env.NODE_ENV === "production",
//       secure: true,
//       sameSite: "lax",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 7, // 7 días
//     });
//
//     return { status: "OK", user };
//   } catch (err: any) {
//     console.error("Error en authenticate:", err);
//     return { status: "ERROR", error: err.message };
//   }
// }




export async function registerUser( prevState: string | undefined, formData: FormData ) {
  const uid = formData.get("uid") as string;
  const displayname = formData.get("displayName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fecha_nacimiento = formData.get("fechaNacimiento") as string;
  const photoURL = formData.get("photoURL") as string;
  const comuna_id = formData.get("comuna") as string;

  try {
    // // 🔹 1. Crear usuario en Firebase
    // const userRecord = await authAdmin.createUser({
    //   email,
    //   password,
    //   // displayName: displayname,
    //   // photoURL,
    // });
    //
    // // 🔹 Datos que trae Firebase (si es Google ya vienen llenos)
    // const displayName = userRecord.displayName || email.split("@")[0];
    // const photoURL =
    //   userRecord.photoURL ||
    //   "https://ui-avatars.com/api/?name=" + encodeURIComponent(displayName);
    //

   
    console.log(formData);

    // 🔹 2. Guardar en Postgres usando tu procedimiento
    const result = await sql`
      CALL crear_usuario(
        ${displayname},
        ${email},
        ${fecha_nacimiento},
        ${photoURL},
        ${comuna_id},
        NULL
      );
    `;

    console.log("procedimiento: ", result);

    const hashedPassword = await bcrypt.hash(password, 10);

    await sql`
      UPDATE usuarios
      SET firebase_uid = ${uid}, password = ${hashedPassword}
      WHERE email = ${email};
    `;

    // 2. Obtener id recién creado
    // const { rows } = await sql`
    //   SELECT id FROM usuarios WHERE email = ${email};
    // `;


    const result1 = await sql`
      SELECT id FROM usuarios WHERE email = ${email};
    `;

    // console.log(result1);

    const userId = result1[0].id;
    // console.log("Usuario encontrado con ID:", userId);    // 🔹 3. Relacionar el firebase_uid con el usuario insertado
    //
    
    

    // 4. Crear access_token
    // const accessToken = await generateAccessToken(userId);
    const accessToken = await generateAccessToken({
        uid: uid,
        id: userId,
        email: email,
        name: displayname,
        picture: photoURL,
      });

    // 5. Registrar sesión en DB
    await sql`CALL crear_sesion(${userId}, ${accessToken}, NULL);`;


    const cookieStore = await cookies(); // 👈 importante

    // 6. Guardar cookie
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, uid: uid };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}


export async function registerUser1( prevState: string | undefined, formData: FormData ) {
  const displayname = formData.get("displayname") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fecha_nacimiento = formData.get("fecha_nacimiento") as string;
  const photoURL = formData.get("photoURL") as string;
  const comuna_id = formData.get("comuna_id") as string;

  try {
    // 🔹 1. Crear usuario en Firebase
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: displayname,
      photoURL,
    });

    // 🔹 2. Guardar en Postgres usando tu procedimiento
    const result = await sql`
      CALL crear_usuario(
        ${displayname},
        ${email},
        ${fecha_nacimiento},
        ${photoURL},
        ${comuna_id},
        NULL
      );
    `;

    // 🔹 3. Relacionar el firebase_uid con el usuario insertado
    await sql`
      UPDATE usuarios
      SET firebase_uid = ${userRecord.uid}, password = ${password}
      WHERE email = ${email};
    `;

    return { success: true, uid: userRecord.uid };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}


export async function registerUser2({
  uid,
  email,
  displayName,
  photoURL,
  fechaNacimiento,
  comunaId,
}: {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  fechaNacimiento: string;
  comunaId: number;
}) {
  try {
    // 1. Crear usuario con procedimiento
    const result = await sql`
      CALL crear_usuario(${displayName}, ${email}, ${fechaNacimiento}, ${photoURL}, ${comunaId}, NULL);
    `;

    // 2. Obtener id recién creado
    const { rows } = await sql`
      SELECT id FROM usuarios WHERE email = ${email};
    `;
    const userId = rows[0].id;

    // 3. Asociar firebase_uid
    await sql`
      UPDATE usuarios SET firebase_uid = ${uid} WHERE id = ${userId};
    `;

    // 4. Crear access_token
    const accessToken = await generateAccessToken(userId);

    // 5. Registrar sesión en DB
    await sql`CALL crear_sesion(${userId}, ${accessToken}, NULL);`;

    // 6. Guardar cookie
    cookies().set("access_token", accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production",
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { status: "OK", userId };
  } catch (err: any) {
    console.error("Error en registerUser:", err);
    return { status: "ERROR", error: err.message };
  }
}



