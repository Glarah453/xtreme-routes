import postgres from 'postgres';
import { NextResponse } from 'next/server';
import { auth } from '../../../../lib/firebaseAdmin';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { usuario_id, titulo, contenido, comuna_id, zona_nombre, latitud, longitud, categorias, sectores, rutas } = await request.json();
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    if (decodedToken.uid !== usuario_id.toString()) {
      return NextResponse.json({ error: 'Token no válido' }, { status: 401 });
    }
    await sql`
      CALL actualizar_post(
        ${id}, 
        ${usuario_id}, 
        ${titulo}, 
        ${contenido}, 
        ${comuna_id}, 
        ${zona_nombre}, 
        ${latitud}, 
        ${longitud}, 
        ${categorias || []}, 
        ${sectores || []}, 
        ${rutas || []}
      )
    `;
    return NextResponse.json({ mensaje: 'Post actualizado', post_id: id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { usuario_id } = await request.json();
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    if (decodedToken.uid !== usuario_id.toString()) {
      return NextResponse.json({ error: 'Token no válido' }, { status: 401 });
    }
    await sql`
      CALL eliminar_post(${id}, ${usuario_id})
    `;
    return NextResponse.json({ mensaje: 'Post eliminado' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
