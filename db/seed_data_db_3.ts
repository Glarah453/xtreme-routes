import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


export async function seed_data_subcategorias_dificultades_escalada() {
    // ---------------------Subcategorias Dificultades Escalada

    // -- Tradicional (id = 1)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 1, id FROM dificultad WHERE sistema IN ('Yosemite', 'Francesa', 'British');
  `;

    // -- Deportiva (id = 2)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 2, id FROM dificultad WHERE sistema IN ('Yosemite', 'Francesa');
  `;

    // -- Boulder (id = 3)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 3, id FROM dificultad WHERE sistema IN ('V-Grade', 'Fontainebleau');
  `;

    // -- Alpina (id = 4)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 4, id FROM dificultad WHERE sistema IN ('Yosemite', 'UIAA', 'Francesa', 'Alpine Grade');
  `;

    // -- Hielo (id = 5)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 5, id FROM dificultad WHERE sistema IN ('Water Ice', 'Alpine Ice Grade', 'Alpine Grade');
  `;

    // -- Mixta (Alpina y Hielo) (id = 6)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 6, id FROM dificultad WHERE sistema IN ('Water Ice', 'Alpine Ice Grade', 'Mixed', 'Alpine Grade');
  `;

    // -- Grandes paredes (BigWall) (id = 7)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 7, id FROM dificultad WHERE sistema IN ('Yosemite', 'Francesa', 'Artificial', 'Alpine Grade', 'British');
  `;

    // -- Artificial (id = 8)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 8, id FROM dificultad WHERE sistema IN ('Artificial');
  `;

    // -- Solo integral (id = 9)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 9, id FROM dificultad WHERE sistema IN ('Yosemite', 'Francesa');
  `;

    // -- Psicobloc (id = 10)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 10, id FROM dificultad WHERE sistema IN ('Yosemite', 'Francesa', 'British');
  `;

    // -- Urbana (id = 11)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 11, id FROM dificultad WHERE sistema IN ('Yosemite', 'Francesa', 'V-Grade');
  `;

    // -- Adherencia (id = 12)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 12, id FROM dificultad WHERE sistema IN ('Yosemite', 'Francesa', 'British');
  `;

    // -- Vía ferrata (id = 13)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 13, id FROM dificultad WHERE sistema IN ('Hüsler', 'Klettersteig');

  `;
  console.log("ingreso de datos Subcategorias Dificultades Escalada ..... OK");
}


export async function seed_data_subcategorias_dificultades_mtb() {
    // --------------- Subcategorias Dificultades de MTB

    // -- MTB - XCO o Cross Country (id = 14)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 14, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');
  `;

    // -- MTB - Enduro (id = 15)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 15, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');
  `;

    // -- MTB - Downhill (id = 16)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 16, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');
  `;

    // -- Dirt Jump (id = 17)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 17, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');
  `;

    // -- Four Cross (4X) / Dual Slalom (id = 18)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 18, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');
  `;

    // -- Freeride (id = 19)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 19, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');
  `;

    // -- Trail / All Mountain (id = 20)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 20, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');
  `;

    // -- Slopestyle (id = 21)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 21, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');
  `;

    // -- Fat Bike (id = 22)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 22, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');
  `;

    // -- Pumptrack (id = 23)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 23, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');
  `;

    // -- BMX (id = 24)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 24, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');
  `;
  console.log("ingreso de datos Subcategorias Dificultades MTB ..... OK");
}


export async function seed_data_subcategorias_dificultades_trekking() {
    // ---------------------Subcategorias Dificultades trekking

    // -- Clásico (Senderismo Recreativo) (id = 25)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 25, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');
  `;

    // -- Baja/Media Montaña (Hiking) (id = 26)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 26, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');
  `;

    // -- Alta Montaña (High-Altitude Trekking) (id = 27)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 27, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');
  `;

    // -- Aventura (Expedición) (id = 28)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 28, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');
  `;

    // -- Larga Distancia (Thru-Hiking) (id = 29)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 29, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');
  `;

    // -- Fastpacking (Trekking Ultraligero y Rápido) (id = 30)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 30, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');
  `;

    // -- Nocturno (id = 31)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 31, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');
  `;

    // -- Desierto (id = 32)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 32, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');
  `;

    // -- Invernal (Nieve/Hielo) (id = 33)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 33, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');
  `;

    // -- Acuático (Canyoning/River Trekking) (id = 34)
  await sql`
    INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
    SELECT 34, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');
  `;
  console.log("ingreso de datos Subcategorias Dificultades Trekking ..... OK");
}
