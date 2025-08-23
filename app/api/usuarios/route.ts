import postgres from 'postgres';
import { NextResponse } from 'next/server';
import { authAdmin } from '@/app/lib/firebase_Admin';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(request: Request) {
  const { nombre, email, password, fecha_nacimiento, photoURL, comuna_id } = await request.json();
  try {
    // Crear usuario en Firebase
    const userRecord = await authAdmin.createUser({ email, password });
    const [dia, mes, anio] = fecha_nacimiento.split('/');
    const fechaNacimientoISO = `${anio}-${mes}-${dia}`;
    const fechaNacimiento = new Date(fechaNacimientoISO);
    if (isNaN(fechaNacimiento.getTime())) {
      await authAdmin.deleteUser(userRecord.uid);
      return NextResponse.json({ error: 'Fecha de nacimiento inválida' }, { status: 400 });
    }
    if (fechaNacimiento > new Date()) {
      await authAdmin.deleteUser(userRecord.uid);
      return NextResponse.json({ error: 'La fecha de nacimiento no puede ser futura' }, { status: 400 });
    }

    // Crear usuario en PostgreSQL
    const result = await sql`
      CALL crear_usuario(
        ${nombre}, 
        ${email}, 
        ${fechaNacimientoISO}::DATE, 
        ${photoURL || null}, 
        ${comuna_id}, 
        NULL
      );
      SELECT currval('p_usuario_id') AS usuario_id;
    `;
    const usuario_id = result[1][0]?.usuario_id;
    if (!usuario_id) {
      await authAdmin.deleteUser(userRecord.uid);
      return NextResponse.json({ error: 'No se pudo crear el usuario en la base de datos' }, { status: 500 });
    }

    // Asociar usuario_id con Firebase
    await authAdmin.setCustomUserClaims(userRecord.uid, { usuario_id });

    return NextResponse.json({ mensaje: 'Usuario creado', usuario_id }, { status: 201 });
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
