import bcrypt from 'bcrypt';
import postgres from 'postgres';
// import { invoices, customers, revenue, users } from '../lib/placeholder-data';
import { seed_creates_tables } from '../../db/seed_creacion_tablas';
import { seed_data_regiones, seed_data_comunas } from '../../db/seed_data_db_1';

import {
  seed_data_categorias,
  seed_data_subcategorias,
  seed_data_dificultades_escalada,
  seed_data_dificultades_mtb,
  seed_data_dificultades_trekking,
} from '../../db/seed_data_db_2';

import {
  seed_data_subcategorias_dificultades_escalada,
  seed_data_subcategorias_dificultades_mtb,
  seed_data_subcategorias_dificultades_trekking,
} from '../../db/seed_data_db_3';

import {
  createUserProcedures,
  createSesionProcedures,
  createsSectorProcedures,
  createRutaProcedures,
  createPostProcedures,
  createComentarioProcedures,
  createValoracionProcedures,
  createMeGustaProcedures,
} from '../../db/seed_creates_procedures'


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

//-------------------------------------- Tabla Regiones
// async function seed_regiones() {
//   // await sql`create extension if not exists "uuid-ossp"`;
//   await sql`
//     create table if not exists regiones (
//       id BIGSERIAL not null,
//       nombre varchar(255) not null,
//       latitud NUMERIC(18,15) not null,
//       longitud NUMERIC(18,15) not null,
//       constraint pk_region primary key (id)
//     );
//   `;
//
//   const insertedregiones = await promise.all(
//     regiones.map(async (region) => {
//       return sql`
//         insert into regiones (id, nombre, latitud, longitud)
//         values (${region.id}, ${region.nombre}, ${region.latitud}, ${region.latitud})
//         on conflict (id) do nothing;
//       `;
//     }),
//   );
//
//   return insertedregiones;
// }


export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      seed_creates_tables(),
      seed_data_categorias(),
      seed_data_subcategorias(),
      seed_data_dificultades_escalada(),
      seed_data_dificultades_mtb(),
      seed_data_dificultades_trekking(),
      seed_data_subcategorias_dificultades_escalada(),
      seed_data_subcategorias_dificultades_mtb(),
      seed_data_subcategorias_dificultades_trekking(),
      createUserProcedures(),
      createPostProcedures(),
      createSectorProcedures(),
      createRutaProcedures(),
      createComentarioProcedures(),
      createValoracionProcedures(),
      createMeGustaProcedures(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
