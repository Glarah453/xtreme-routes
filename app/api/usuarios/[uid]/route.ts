import postgres from 'postgres';
import { NextResponse } from 'next/server';
import { authAdmin } from '@/app/lib/firebase_Admin';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

function calcularEdad(fechaNacimiento: string): number {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesDiff = hoy.getMonth() - nacimiento.getMonth();
  if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}

export async function GET(request: Request, { params }: { params: { uid: string } }) {
  const { uid } = await params;
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    if (decodedToken.uid !== uid) {
      return NextResponse.json({ error: 'Token no válido' }, { status: 401 });
    }
    const result = await sql`
      SELECT id AS usuario_id, nombre, email, fecha_nacimiento, photoURL, comuna_id 
      FROM usuarios 
      WHERE id = ${decodedToken.usuario_id}
    `;
    if (result.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    const usuario = result[0];
    usuario.edad = calcularEdad(usuario.fecha_nacimiento);
    return NextResponse.json(usuario);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PUT(request: Request, { params }: { params: { uid: string } }) {
  const { uid } = params;
  const { nombre, email, fecha_nacimiento, photoURL, comuna_id } = await request.json();
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    if (decodedToken.uid !== uid) {
      return NextResponse.json({ error: 'Token no válido' }, { status: 401 });
    }
    const [dia, mes, anio] = fecha_nacimiento.split('/');
    const fechaNacimientoISO = `${anio}-${mes}-${dia}`;
    const fechaNacimiento = new Date(fechaNacimientoISO);
    if (isNaN(fechaNacimiento.getTime())) {
      return NextResponse.json({ error: 'Fecha de nacimiento inválida' }, { status: 400 });
    }
    if (fechaNacimiento > new Date()) {
      return NextResponse.json({ error: 'La fecha de nacimiento no puede ser futura' }, { status: 400 });
    }
    await sql`
      CALL actualizar_usuario(
        ${decodedToken.usuario_id}, 
        ${nombre}, 
        ${email}, 
        ${fechaNacimientoISO}::DATE, 
        ${photoURL || 'none'}, 
        ${comuna_id}
      )
    `;
    // Actualizar email en Firebase si cambió
    if (email !== decodedToken.email) {
      await authAdmin.updateUser(uid, { email });
    }
    return NextResponse.json({ mensaje: 'Usuario actualizado' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
