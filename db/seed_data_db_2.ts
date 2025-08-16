import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function seed_data_categorias() {
  await sql`
    insert into categorias values
      (1,'Escalada'),
      (2,'Mountain Bike'),
      (3,'Trekking');
  `;
}

export async function seed_data_subcategorias() {
  await sql`
    insert into subcategorias values
      (1,'Tradicional', 'El escalador coloca sus propios seguros (fisureros, empotradores). No hay chapas fijas; más compromiso.',1),
      (2,'Deportiva', 'Escalada en rutas equipadas con chapas y anclajes fijos. Se practica tanto en roca como en muro artificial. Se usa cuerda, arnés, cintas express, etc.',1),
      (3,'Boulder', 'Sin cuerda, en bloques de poca altura (hasta ~4-5 metros). Se usan colchonetas o crashpads para amortiguar caídas.',1),
      (4,'Alpina', 'Escalada en alta montaña. Requiere ser un escalador experto, debido a las complicaciones que podrían darse, como la capacidad física, falta de seguros fijos, roca no fiable, condiciones meteorológicas, descenso complicado, etc.',1),
      (5,'Hielo', 'Se realiza en las paredes en que se forman cascadas de hielo. Es una de las más peligrosas. Se progresa con herramientas específicas: piolets y crampones, y para asegurarse se usan los tornillos de hielo.',1),
      (6,'Mixta (Alpina y Hielo)', 'Es la combinación de Escalada Alpina roca y hielo.',1),
      (7,'Grandes paredes (BigWall) o Multilargo', 'Escalada en roca que se sube un largo camino de varios trechos (largos), por lo que el ascenso normalmente requiere más de un solo día.​ Las rutas de pared grande requieren el equipo de escalada para vivir en la ruta a menudo utilizando portaledges y transportando equipo.​ Se practica en paredes con más de 450 metros de alto con caras verticales, con pocas salientes y pequeñas grietas.',1),
      (8,'Artificial', 'El escalador progresa usando material de ayuda (escalada no libre).',1),
      (9,'En Solitario', 'Escalada autoasegurado con una cuerda, pero sin acompañante.',1),
      (10,'Psicobloc', 'Escalada sin cuerda en acantilados sobre agua (mar).',1),
      (11,'Urbana', 'Se practica en los grandes edificios de las ciudades. Suele hacerse en solitario y suele ser ilegal en muchos países.',1),
      (12,'Adherencia', 'Se realiza en las paredes no completamente verticales que no disponen de presas de pie y de mano.',1),
      (13,'Vía ferrata', 'es un itinerario tanto vertical como horizontal (franqueo) equipado con diverso material: clavos, grapas, presas, pasamanos, cadenas, puentes colgantes y tirolinas, que permiten el llegar con seguridad a zonas de difícil acceso para senderistas o no habituados a la escalada. La seguridad corre a cargo de un cable de acero instalado en toda la vía y el arnés provisto de un disipador de energía y mosquetones especiales de vía ferrata (marcados con una k) que aseguran en caso de caída.',1),
      
      (14,'MTB - XCO o Cross Country', 'Carreras en circuitos con subidas, bajadas y terrenos técnicos',2),
      (15,'MTB - Enduro', 'Combinación de subidas (no cronometradas) y bajadas cronometradas.',2),
      (16,'MTB - Downhill', 'Bajadas extremadamente técnicas y rápidas, con saltos y obstáculos.',2),
      (17,'Dirt Jump', 'Saltos en tierra (dirt jumps) para realizar acrobacias.',2),
      (18,'Four Cross (4X) / Dual Slalom', 'Carreras en pistas cortas con saltos y curvas, donde compiten 4 pilotos a la vez.',2),
      (19,'Freeride', 'No es una competición, sino un estilo libre con saltos y trucos en terrenos naturales o construidos.',2),
      (20,'Trail / All Mountain', 'Mezcla de XC y Enduro, con senderos técnicos pero sin ser extremo como el DH.', 2),
      (21,'Slopestyle', 'Circuitos con rampas y obstáculos para hacer trucos (similar al BMX Freestyle).', 2),
      (22,'Fat Bike', 'Bicicletas con ruedas muy anchas para nieve o arena.', 2),
      (23,'Pumptrack', 'Circuito de bombeo (sin pedalear) con rollers y peraltes', 2),
      (24,'BMX', 'Carreras en pistas cortas con saltos o Trucos en rampas, calles o parques',2),
      
      (25,'Clásico (Senderismo Recreativo)', 'Caminatas por senderos señalizados, generalmente de corta a media distancia, en entornos naturales como bosques, montañas bajas o parques.', 3),
      (26,'Baja/Media Montaña (Hiking)', 'Ascensos a montañas o cerros con desniveles moderados, sin necesidad de equipo técnico de escalada.', 3),
      (27,'Alta Montaña (High-Altitude Trekking)', 'Caminatas en zonas por encima de 3,500 msnm, donde la altitud y el clima extremo son factores clave.', 3),
      (28,'Aventura (Expedición)', 'Rutas en lugares remotos, sin señalización, que pueden incluir cruce de ríos, selvas o glaciares.', 3),
      (29,'Larga Distancia (Thru-Hiking)', 'Recorridos de cientos o miles de kilómetros, divididos en etapas.', 3),
      (30,'Fastpacking (Trekking Ultraligero y Rápido)', 'Combinación de senderismo y trail running, con equipo mínimo para avanzar más rápido.', 3),
      (31,'Nocturno', 'Caminatas realizadas de noche, generalmente para evitar el calor diurno o por logística de ascenso.', 3),
      (32,'Desierto', 'Caminatas en zonas áridas con calor extremo y escasez de agua.', 3),
      (33,'Invernal (Nieve/Hielo)', 'Senderismo en condiciones de nieve, usando raquetas, esquís de travesía o crampones.', 3),
      (34,'Acuático (Canyoning/River Trekking)', 'Combinación de senderismo, natación y rappel en cañones o ríos.', 3);
  `;
}

export async function seed_data_dificultades_escalada() {
  await sql`
    ---------------------Dificultades Escalada

    -- Dificultades Yosemite Decimal System (YDS)
    INSERT INTO dificultad (nombre, sistema) VALUES
      ('5.0', 'Yosemite'), ('5.1', 'Yosemite'), ('5.2', 'Yosemite'), ('5.3', 'Yosemite'), ('5.4', 'Yosemite'),
      ('5.5', 'Yosemite'), ('5.6', 'Yosemite'), ('5.7', 'Yosemite'), ('5.8', 'Yosemite'), ('5.9', 'Yosemite'),
      ('5.10a', 'Yosemite'), ('5.10b', 'Yosemite'), ('5.10c', 'Yosemite'), ('5.10d', 'Yosemite'),
      ('5.11a', 'Yosemite'), ('5.11b', 'Yosemite'), ('5.11c', 'Yosemite'), ('5.11d', 'Yosemite'),
      ('5.12a', 'Yosemite'), ('5.12b', 'Yosemite'), ('5.12c', 'Yosemite'), ('5.12d', 'Yosemite'),
      ('5.13a', 'Yosemite'), ('5.13b', 'Yosemite'), ('5.13c', 'Yosemite'), ('5.13d', 'Yosemite'),
      ('5.14a', 'Yosemite'), ('5.14b', 'Yosemite'), ('5.14c', 'Yosemite'), ('5.14d', 'Yosemite'),
      ('5.15a', 'Yosemite'), ('5.15b', 'Yosemite'), ('5.15c', 'Yosemite'), ('5.15d', 'Yosemite');

    -- Dificultades Francesas
    INSERT INTO dificultad (nombre, sistema) VALUES
      ('1', 'Francesa'), ('2', 'Francesa'), ('3', 'Francesa'),
      ('4a', 'Francesa'), ('4b', 'Francesa'), ('4c', 'Francesa'),
      ('5a', 'Francesa'), ('5b', 'Francesa'), ('5c', 'Francesa'),
      ('6a', 'Francesa'), ('6a+', 'Francesa'), ('6b', 'Francesa'), ('6b+', 'Francesa'), ('6c', 'Francesa'), ('6c+', 'Francesa'),
      ('7a', 'Francesa'), ('7a+', 'Francesa'), ('7b', 'Francesa'), ('7b+', 'Francesa'), ('7c', 'Francesa'), ('7c+', 'Francesa'),
      ('8a', 'Francesa'), ('8a+', 'Francesa'), ('8b', 'Francesa'), ('8b+', 'Francesa'), ('8c', 'Francesa'), ('8c+', 'Francesa'),
      ('9a', 'Francesa'), ('9a+', 'Francesa'), ('9b', 'Francesa'), ('9b+', 'Francesa'), ('9c', 'Francesa'), ('9c+', 'Francesa');

    -- Dificultades V-Grade
    INSERT INTO dificultad (nombre, sistema) VALUES
      ('V0', 'V-Grade'), ('V1', 'V-Grade'), ('V2', 'V-Grade'), ('V3', 'V-Grade'), ('V4', 'V-Grade'),
      ('V5', 'V-Grade'), ('V6', 'V-Grade'), ('V7', 'V-Grade'), ('V8', 'V-Grade'), ('V9', 'V-Grade'),
      ('V10', 'V-Grade'), ('V11', 'V-Grade'), ('V12', 'V-Grade'), ('V13', 'V-Grade'), ('V14', 'V-Grade'),
      ('V15', 'V-Grade'), ('V16', 'V-Grade'), ('V17', 'V-Grade'), ('V18', 'V-Grade'), ('V19', 'V-Grade');

    -- Dificultades Fontainebleau
    INSERT INTO dificultad (nombre, sistema) VALUES
      ('1', 'Fontainebleau'), ('2', 'Fontainebleau'), ('3', 'Fontainebleau'),
      ('4', 'Fontainebleau'), ('4+', 'Fontainebleau'),
      ('5', 'Fontainebleau'), ('5+', 'Fontainebleau'),
      ('6a', 'Fontainebleau'), ('6a+', 'Fontainebleau'), ('6b', 'Fontainebleau'), ('6b+', 'Fontainebleau'), ('6c', 'Fontainebleau'), ('6c+', 'Fontainebleau'),
      ('7a', 'Fontainebleau'), ('7a+', 'Fontainebleau'), ('7b', 'Fontainebleau'), ('7b+', 'Fontainebleau'), ('7c', 'Fontainebleau'), ('7c+', 'Fontainebleau'),
      ('8a', 'Fontainebleau'), ('8a+', 'Fontainebleau'), ('8b', 'Fontainebleau'), ('8b+', 'Fontainebleau'), ('8c', 'Fontainebleau'), ('8c+', 'Fontainebleau');


    -- Dificultades UIAA (Unión Internacional de Asociaciones de Alpinismo)
    INSERT INTO dificultad (nombre, sistema) VALUES
      ('I', 'UIAA'), ('II', 'UIAA'), ('III', 'UIAA'), ('IV', 'UIAA'),
      ('V-', 'UIAA'), ('V', 'UIAA'), ('V+', 'UIAA'),
      ('VI-', 'UIAA'), ('VI', 'UIAA'), ('VI+', 'UIAA'),
      ('VII-', 'UIAA'), ('VII', 'UIAA'), ('VII+', 'UIAA'),
      ('VIII-', 'UIAA'), ('VIII', 'UIAA'), ('VIII+', 'UIAA'),
      ('IX-', 'UIAA'), ('IX', 'UIAA'), ('IX+', 'UIAA'),
      ('X-', 'UIAA'), ('X', 'UIAA'), ('X+', 'UIAA'),
      ('XI-', 'UIAA'), ('XI', 'UIAA'), ('XI+', 'UIAA'),
      ('XII-', 'UIAA'), ('XII', 'UIAA'), ('XII+', 'UIAA');


    -- Dificultades British (Tradicional y Técnica)
    INSERT INTO dificultad (nombre, sistema) VALUES
      ('M', 'British'), ('D', 'British'), ('VD', 'British'), ('HVD', 'British'), ('S', 'British'),
      ('HS', 'British'), ('VS', 'British'), ('HVS', 'British'),
      ('E1', 'British'), ('E2', 'British'), ('E3', 'British'), ('E4', 'British'), ('E5', 'British'),
      ('E6', 'British'), ('E7', 'British'), ('E8', 'British'), ('E9', 'British'), ('E10', 'British'),
      ('E11', 'British'), ('E12', 'British');


    -- Dificultades Alpine Grade
    INSERT INTO dificultad (nombre, sistema) VALUES 
      ('F', 'Alpine Grade'),
      ('PD', 'Alpine Grade'),
      ('AD', 'Alpine Grade'),
      ('D', 'Alpine Grade'),
      ('TD', 'Alpine Grade'),
      ('ED1', 'Alpine Grade'),
      ('ED2', 'Alpine Grade'),
      ('ED3', 'Alpine Grade'),
      ('ABO', 'Alpine Grade');

    -- Dificultades Alpine Ice Grade
    INSERT INTO dificultad (nombre, sistema) VALUES 
      ('AI1', 'Alpine Ice Grade'),
      ('AI2', 'Alpine Ice Grade'),
      ('AI3', 'Alpine Ice Grade'),
      ('AI4', 'Alpine Ice Grade'),
      ('AI5', 'Alpine Ice Grade'),
      ('AI6', 'Alpine Ice Grade'),
      ('AI7', 'Alpine Ice Grade');

      
    -- Dificultades Klettersteig
    INSERT INTO dificultad (nombre, sistema) VALUES 
      ('A', 'Klettersteig'),
      ('B', 'Klettersteig'),
      ('C', 'Klettersteig'),
      ('D', 'Klettersteig'),
      ('E', 'Klettersteig'),
      ('F', 'Klettersteig'),
      ('G', 'Klettersteig');


    -- Dificultades WI (Water Ice – Escalada en hielo)
    INSERT INTO dificultad (nombre, sistema) VALUES
      ('WI1', 'Water Ice'), ('WI2', 'Water Ice'), ('WI3', 'Water Ice'), ('WI4', 'Water Ice'),
      ('WI5', 'Water Ice'), ('WI6', 'Water Ice'), ('WI7', 'Water Ice');


    -- Dificultades M (Mixed – Mixto alpino/hielo)
    INSERT INTO dificultad (nombre, sistema) VALUES
      ('M1', 'Mixed'), ('M2', 'Mixed'), ('M3', 'Mixed'), ('M4', 'Mixed'),
      ('M5', 'Mixed'), ('M6', 'Mixed'), ('M7', 'Mixed'), ('M8', 'Mixed'),
      ('M9', 'Mixed'), ('M10', 'Mixed'), ('M11', 'Mixed'), ('M12', 'Mixed'),
      ('M13', 'Mixed'), ('M14', 'Mixed'), ('M15', 'Mixed');


    -- Dificultades A (Artificial)
    INSERT INTO dificultad (nombre, sistema) VALUES
      ('A0', 'Artificial'), ('A1', 'Artificial'), ('A2', 'Artificial'),
      ('A3', 'Artificial'), ('A4', 'Artificial'), ('A5', 'Artificial'),
      ('A6', 'Artificial');


    -- Dificultades Vía Ferrata (Hüsler)
    INSERT INTO dificultad (nombre, sistema) VALUES
      ('F', 'Hüsler'), ('PD', 'Hüsler'), ('AD', 'Hüsler'),
      ('D', 'Hüsler'), ('TD', 'Hüsler'), ('ED', 'Hüsler'),
      ('EX', 'Hüsler');
  `;
}


export async function seed_data_dificultades_mtb() {
  await sql`
    --------------- Dificultad de MTB

    -- Tecnica
    insert into dificultad (nombre, sistema) values
      ('Baja', 'Tecnica de la pista'),
      ('Media', 'Tecnica de la pista'),
      ('Alta', 'Tecnica de la pista'),
      ('Extrema', 'Tecnica de la pista');


    -- Fisica
    insert into dificultad (nombre, sistema) values
      ('Baja', 'Resistencia Fisica'),
      ('Media', 'Resistencia Fisica'),
      ('Alta', 'Resistencia Fisica'),
      ('Extrema', 'Resistencia Fisica');


    -- Terreno
    insert into dificultad (nombre, sistema) values
      ('Barro', 'Terreno'),
      ('Roca', 'Terreno'),
      ('Arena/Nieve', 'Terreno'),
      ('Sendero', 'Terreno'),
      ('Sendero y rocas', 'Terreno'),
      ('Calles o Parques', 'Terreno'),
      ('Bikepark/Pistas artificiales', 'Terreno');


    -- Estilo
    insert into dificultad (nombre, sistema) values
      ('Competitivo', 'Estilo'),
      ('Freestyle', 'Estilo'),
      ('Recreativo', 'Estilo');
  `;
}


export async function seed_data_dificultades_trekking() {
  await sql`
    ---------------------Dificultades trekking
      
    -- Tecnica
    insert into dificultad (nombre, sistema) values
      ('Grado 1 (Fácil)', 'Tecnica del Terreno'),
      ('Grado 2 (Moderado)', 'Tecnica del Terreno'),
      ('Grado 3 (Difícil)', 'Tecnica del Terreno'),
      ('Grado 4 (Muy Difícil)', 'Tecnica del Terreno'),
      ('Grado 5 (Extremo)', 'Tecnica del Terreno');


    -- Fisica
    insert into dificultad (nombre, sistema) values
      ('Grado A (Leve)', 'Esfuerzo Fisico'),
      ('Grado B (Moderado)', 'Esfuerzo Fisico'),
      ('Grado C (Exigente)', 'Esfuerzo Fisico'),
      ('Grado D (Muy Exigente)', 'Esfuerzo Fisico'),
      ('Grado E (Extremo)', 'Esfuerzo Fisico');


    -- Condiciones Ambientales
    insert into dificultad (nombre, sistema) values
      ('Clase I (Estable)', 'Condiciones Ambientales'),
      ('Clase II (Variable)', 'Condiciones Ambientales'),
      ('Clase III (Adverso)', 'Condiciones Ambientales'),
      ('Clase IV (Peligroso)', 'Condiciones Ambientales');


    -- Altitud
    insert into dificultad (nombre, sistema) values
      ('Nivel 1 (Baja)', 'Altitud'),
      ('Nivel 2 (Media)', 'Altitud'),
      ('Nivel 3 (Alta)', 'Altitud'),
      ('Nivel 4 (Extrema)', 'Altitud');
  `;
}
