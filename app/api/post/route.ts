import postgres from 'postgres';
import { NextResponse } from 'next/server';
import { auth } from '../../../lib/firebaseAdmin';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(request: Request) {
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
    const result = await sql`
      CALL crear_post(
        ${usuario_id}, 
        ${titulo}, 
        ${contenido}, 
        ${comuna_id}, 
        ${zona_nombre}, 
        ${latitud}, 
        ${longitud}, 
        ${categorias || []}, 
        ${sectores || []}, 
        ${rutas || []}, 
        NULL
      );
      SELECT currval('p_post_id') AS post_id;
    `;
    const post_id = result[1][0]?.post_id;
    return NextResponse.json({ mensaje: 'Post creado', post_id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
