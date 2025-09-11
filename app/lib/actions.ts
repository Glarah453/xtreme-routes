'use server';

import postgres from 'postgres';
// import bcrypt from 'bcrypt';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// import { cookies } from 'next/headers';
// import { signIn } from '@/auth';
// import { AuthError } from 'next-auth';
import { authAdmin } from './firebase_Admin';
// import { SignJWT } from "jose"; // para firmar el access_token con clave secreta propia
import { 
  // generateAccessToken, 
  // setAccessTokenCookie, 
  deleteAccessTokenCookie,
} from "@/app/lib/auth";

import { 
  getRandomColor, 
  getConsistentColor, 
  calculateAge,
} from '@/app/lib/utils';

import { 
  // fetchAllRegiones, 
  // fetchAllComunasByRegionID,
  getCheckUsernameForUser,
  getCheckEmailForUser,
} from '@/app/lib/data'


import { 
  authenticateGoogleSignIn, 
  authenticateEmailPassword, 
  registerUserDB,
} from '@/context/auth';




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
  // const redirectTo = sanitizeRedirect(formData.get("redirectTo"));


  try {
    if (provider === "google") {
      // ---- GOOGLE SIGN-IN ----
      const idToken = formData.get("idToken");
      if (typeof idToken !== "string" || !idToken) {
        return "Falta idToken de Google.";
      }

      // 1) Verificar token de Firebase
      const decoded = await authAdmin.verifyIdToken(idToken);
      const uid = decoded.uid || "";
      const email = decoded.email || "";
      const name = decoded.name || "";
      const picture = decoded.picture || "";

      if (!email) {
        return "Tu cuenta de Google no tiene email verificado.";
      }

      // const result = await authenticateGoogleSignIn(formData);
      const result = await authenticateGoogleSignIn(uid, email, name, picture);

      // console.log("result authenticate", result);

      return result;
    }

    if (provider === "password") {
      // ---- EMAIL + PASSWORD ----
      const email = formData.get("email");
      const password = formData.get("password");


      // const parsedCredentials = z
      //   .object({ email: z.string().email(), password: z.string().min(6) })
      //   .safeParse(credentials);


      if (typeof email !== "string" || typeof password !== "string") {
        return "Parámetros inválidos.";
      }

      // const result = await authenticateEmailPassword(formData);
      const result = await authenticateEmailPassword(email, password);

      if(result.success) {
        revalidatePath('/');
        // redirect('/');
        return result;
      } else {
        return result;
    
      }
    }
    // Provider desconocido
    // return "Proveedor no soportado.";
  } catch (err: any) {
    console.error("Error en authenticate:", err);
    // Mensaje genérico para el UI
    return "Algo salió mal al iniciar sesión.";
  }
}



// ACTION: registerUser ------------------

export async function registerUser(_: unknown, formData: FormData) {
  // Campos mínimos requeridos por tu PROCEDURE crear_usuario
  const uid = formData.get("uid") || "";
  const nombre = formData.get("name");
  const email = formData.get("email");
  const fecha_nacimiento = formData.get("birthdate");
  
  const randomColor = getConsistentColor(nombre);
  //
  const photoURL = formData.get("picture") || `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&size=256&background=${randomColor}&color=fff`;
  
  const comuna_id = formData.get("comuna");
  const password = formData.get("password"); // opcional
  // const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";
  // const redirectTo = sanitizeRedirect(formData.get("redirectTo"));

  // if (
  //   typeof nombre !== "string" ||
  //   typeof email !== "string" ||
  //   typeof fecha_nacimiento !== "string" ||
  //   typeof comuna_id !== "string"
  // ) {
  //   return "Datos de registro inválidos.";
  // }
  
  

  const check_user = await getCheckUsernameForUser(nombre);
  // console.log("checkUser ",check_user);
  if (check_user.exists === true) {
    return { error: 'El username ya Existe.'};
  }

  const check_email = await getCheckEmailForUser(email);

  if (check_email.exists === true) {
    return { error: 'El Email ya se encuentra registrado.'};
  }

  const age = await calculateAge(fecha_nacimiento);
  if (age < 15) {
    return { error: 'Debes tener al menos 15 años para registrarte' };
    // return;
  }

  if (age > 90) {
    return { error: 'Debes tener menos de 90 años para registrarte' };
    // return;
  }

  try {

    const result = registerUserDB(uid, nombre, email, fecha_nacimiento, photoURL, comuna_id, password);

    return result;

  } catch (err: any) {
    console.error("Error en registerUser:", err);
    // Si tu PROCEDURE lanza excepciones, aquí caerán.
    return err?.message || "No se pudo registrar al usuario.";
  }
}


export async function logOutUser(id: number) {
  try{
    await sql`
      CALL cerrar_sesion(
        ${id}
      )
    `;
    await deleteAccessTokenCookie();
    revalidatePath('/');
    // redirect('/');
  } catch (err: any) {
    console.error("Error al cerrar sesion en db: ", err);
    return err?.message || "No se pudo cerrar sesión.";
  }
}


