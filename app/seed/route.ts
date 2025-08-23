// import bcrypt from 'bcrypt';
import postgres from 'postgres';
// import { invoices, customers, revenue, users } from '../lib/placeholder-data';
import { seed_creates_tables } from '../../db/seed_creacion_tablas';
import { 
  seed_data_regiones, 
  seed_data_comunas
} from '../../db/seed_data_db_1';

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
  createSectorProcedures,
  createRutaProcedures,
  createPostProcedures,
  createComentarioProcedures,
  createValoracionProcedures,
  createMeGustaProcedures,
} from '../../db/seed_creates_procedures'


const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


export async function GET() {
  try {
    const result = await sql.begin((sql) => [
      seed_creates_tables(),
    ]);

    const result1 = await sql.begin((sql) => [
      seed_data_regiones(),
      seed_data_categorias(),
    ]);

    const result2 = await sql.begin((sql) => [
      seed_data_comunas(),
      seed_data_subcategorias(),
    ]);

    const result3 = await sql.begin((sql) => [
      seed_data_dificultades_escalada(),
    ]);

    const result4 = await sql.begin((sql) => [
      seed_data_dificultades_mtb(),
    ]);

    const result5 = await sql.begin((sql) => [
      seed_data_dificultades_trekking(),
    ]);

    const result6 = await sql.begin((sql) => [
      seed_data_subcategorias_dificultades_escalada(),
    ]);

    const result7 = await sql.begin((sql) => [
      seed_data_subcategorias_dificultades_mtb(),
    ]);

    const result8 = await sql.begin((sql) => [
      seed_data_subcategorias_dificultades_trekking(),
    ]);

    const result9 = await sql.begin((sql) => [
      createUserProcedures(),
      createSesionProcedures(),
      createSectorProcedures(),
      createRutaProcedures(),
      createPostProcedures(),
      createComentarioProcedures(),
      createValoracionProcedures(),
      createMeGustaProcedures(),
    ]);

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
