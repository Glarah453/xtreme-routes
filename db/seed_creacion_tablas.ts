import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });


export async function seed_creates_tables() {

  // Eliminación de tablas si existen
  // await sql`
  //   drop table if exists posts_rutas;
  //   drop table if exists posts_sectores;
  //   drop table if exists me_gusta;
  //   drop table if exists valoraciones;
  //   drop table if exists comentarios;
  //   drop table if exists posts_categorias;
  //   drop table if exists posts;
  //   drop table if exists waypoints;
  //   drop table if exists rutas_subcategorias;
  //   drop table if exists rutas;
  //   drop table if exists sectores;
  //   drop table if exists sesiones;
  //   drop table if exists usuarios;
  //   drop table if exists subcategoria_dificultad;
  //   drop table if exists dificultad;
  //   drop table if exists subcategorias;
  //   drop table if exists categorias;
  //   drop table if exists comunas;
  //   drop table if exists regiones;
  // `;

  //-- Tabla de regiones
  await sql`
    CREATE TABLE IF NOT EXISTS regiones (
      id BIGSERIAL not null,
      nombre VARCHAR(100) NOT null,
      latitud NUMERIC(18,15) not null,
      longitud NUMERIC(18,15) not null,
      constraint pk_region primary key (id)
    );
  `;

  // -- Tabla de comunas
  await sql`
    CREATE TABLE IF NOT EXISTS comunas (
      id BIGSERIAL not null,
      nombre VARCHAR(100) NOT NULL,
      region_id BIGINT NOT NULL,
      constraint pk_comuna primary key (id),
      constraint fk_region foreign key (region_id) references regiones(id) ON DELETE CASCADE
    );
  `;

  // -- Tabla de categorias (ej. escalada, trekking, MTB)
  await sql`
    CREATE TABLE IF NOT EXISTS categorias (
      id BIGSERIAL not null,
      nombre VARCHAR(50) NOT null,
      constraint pk_categoria primary key (id)
);
  `;

  // -- Tabla de subcategorias (ej. deportiva, tradicional para escalada)
  await sql`
    CREATE TABLE subcategorias (
      id BIGSERIAL not null,
      nombre VARCHAR(50) NOT NULL,
      descripcion varchar(500) not null,
      categoria_id BIGINT NOT NULL,
      constraint pk_subcategoria primary key (id),
      constraint fk_categoria foreign key (categoria_id) references categorias(id) ON DELETE cascade
    );
  `;

  // -- Tabla de dificultad (niveles de dificultad por categoría)
  await sql`
    CREATE TABLE IF NOT EXISTS dificultad (
      id BIGSERIAL not null,
      nombre VARCHAR(50) NOT NULL,
      sistema VARCHAR(50),
      constraint pk_dificultad primary key (id)
    );
  `;

  // -- Relación muchos-a-muchos entre subcategorías y dificultades
  await sql`
    CREATE TABLE IF NOT EXISTS subcategoria_dificultad (
      subcategoria_id BIGINT NOT NULL,
      dificultad_id BIGINT NOT NULL,
      CONSTRAINT pk_subcat_dificultad PRIMARY KEY (subcategoria_id, dificultad_id),
      CONSTRAINT fk_sd_subcategoria FOREIGN KEY (subcategoria_id) REFERENCES subcategorias(id) ON DELETE CASCADE,
      CONSTRAINT fk_sd_dificultad FOREIGN KEY (dificultad_id) REFERENCES dificultad(id) ON DELETE CASCADE
    );
  `;

  // -- Tabla de usuarios
  await sql`
    CREATE TABLE IF NOT EXISTS usuarios (
      id BIGSERIAL not null,
      displayname VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password text,
      rol VARCHAR(25) not null,
      fecha_nacimiento DATE NOT null,
      photoURL VARCHAR(300) not null,
      comuna_id BIGINT NOT NULL,
      createdIt TIMESTAMP not null default CURRENT_TIMESTAMP,
      lastEdit TIMESTAMP,
      constraint pk_usuario primary key (id),
      constraint fk_usuario_comuna FOREIGN KEY (comuna_id) REFERENCES comunas(id) ON DELETE RESTRICT,
      CONSTRAINT check_rol_user CHECK (rol IN ('admin', 'usuario'))
    );
  `;

  // -- Tabla de sesiones
  await sql`
    CREATE TABLE IF NOT EXISTS sesiones (
      id BIGSERIAL not null,
      usuario_id BIGINT NOT NULL,
      access_token VARCHAR(500) NOT NULL, 
      inicio_sesion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      cierre_sesion TIMESTAMP, 
      estado VARCHAR(20) NOT NULL DEFAULT 'activa',  
      constraint pk_sesiones primary key (id),
      constraint fk_usuario_sesion FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      CONSTRAINT check_estado_sesion CHECK (estado IN ('activa', 'cerrada'))
    );
  `;

  // -- Tabla de sectores
  await sql`
    CREATE TABLE IF NOT EXISTS sectores (
      id BIGSERIAL not null,
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT, 
      image varchar(300),
      usuario_id BIGINT NOT NULL, 
      latitud NUMERIC(18,15) not null, 
      longitud NUMERIC(18,15) not null,
      fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastEdit TIMESTAMP,
      constraint pk_sectores primary key (id),
      constraint fk_sector_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );
  `;

  // -- Tabla de rutas
  await sql`
    CREATE TABLE IF NOT EXISTS rutas (
      id BIGSERIAL not null,
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT, 
      sector_id BIGINT NOT NULL,
      categoria_id BIGINT NOT NULL,
      dificultad_id BIGINT,  
      usuario_id BIGINT NOT NULL,
      distancia NUMERIC(18,15),
      desnivel_acumulado NUMERIC(18,15), 
      es_personalizada BOOLEAN NOT NULL DEFAULT FALSE, 
      privacidad VARCHAR(20) NOT NULL DEFAULT 'publica', 
      fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastEdit TIMESTAMP,
      constraint pk_rutas primary key (id),
      constraint fk_rutas_sector FOREIGN KEY (sector_id) REFERENCES sectores(id) ON DELETE CASCADE,
      constraint fk_rutas_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
      constraint fk_rutas_dificultad FOREIGN KEY (dificultad_id) REFERENCES dificultad(id) ON DELETE SET NULL,
      constraint fk_rutas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE cascade,
      CONSTRAINT check_privacidad CHECK (privacidad IN ('publica', 'privada'))
    );
  `;

  // -- Tabla de rutas y subcategorias
  await sql`
    CREATE TABLE IF NOT EXISTS rutas_subcategorias (
      ruta_id BIGINT NOT NULL,
      subcategoria_id BIGINT NOT NULL,
      CONSTRAINT pk_rutas_subcategorias PRIMARY KEY (ruta_id, subcategoria_id),
      CONSTRAINT fk_rs_ruta FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE,
      CONSTRAINT fk_rs_subcategoria FOREIGN KEY (subcategoria_id) REFERENCES subcategorias(id) ON DELETE CASCADE
    );
  `;

  // -- Tabla de waypoints
  await sql`
    CREATE TABLE IF NOT EXISTS waypoints (
      id BIGSERIAL not null,
      ruta_id BIGINT NOT NULL,
      latitud NUMERIC(18,15) NOT NULL,
      longitud NUMERIC(18,15) NOT NULL,
      orden INTEGER NOT NULL, 
      nombre VARCHAR(100), 
      descripcion TEXT,
      constraint pk_waypoints primary key (id),
      constraint fk_waypoints_rutas FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE,
      CONSTRAINT check_orden CHECK (orden >= 0)
    );
  `;

  // -- Tabla de posts
  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id BIGSERIAL not null,
      titulo VARCHAR(200) NOT NULL, 
      contenido TEXT NOT NULL,
      usuario_id BIGINT NOT NULL,
      comuna_id BIGINT NOT NULL,
      latitud NUMERIC(18,15) NOT NULL, 
      longitud NUMERIC(18,15) NOT NULL,
      fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      lastEdit TIMESTAMP,
      constraint pk_posts primary key (id),
      constraint fk_posts_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      constraint fk_posts_comuna FOREIGN KEY (comuna_id) REFERENCES comunas(id) ON DELETE RESTRICT
    );
  `;

  // -- Tabla de comentarios
  await sql`
    CREATE TABLE IF NOT EXISTS comentarios (
      id BIGSERIAL not null,
      contenido TEXT NOT NULL,
      usuario_id BIGINT NOT NULL,
      post_id BIGINT NOT NULL,
      fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastEdit TIMESTAMP,
      constraint pk_comentarios primary key (id),
      constraint fk_comentarios_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      constraint fk_comentarios_posts FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );
  `;

  // -- Tabla de valoraciones (1 a 5)
  await sql`
    CREATE TABLE IF NOT EXISTS valoraciones (
      usuario_id BIGINT NOT NULL,
      post_id BIGINT NOT NULL,
      valor INTEGER NOT NULL CHECK (valor BETWEEN 1 AND 5),
      fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      lastEdit TIMESTAMP,
      constraint pk_valoracion_user_post PRIMARY KEY (usuario_id, post_id),
      constraint fk_valoracion_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      constraint fk_valoracion_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );
  `;

  // -- Tabla de me gusta
  await sql`
    CREATE TABLE IF NOT EXISTS me_gusta (
      usuario_id BIGINT NOT NULL,
      post_id BIGINT NOT NULL,
      fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      constraint pk_megusta_user_post PRIMARY KEY (usuario_id, post_id),
      constraint fk_megusta_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      constraint fk_megusta_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );
  `;

  // -- Relación muchos-a-muchos entre posts y categorías
  await sql`
    CREATE TABLE IF NOT EXISTS posts_categorias (
      post_id BIGINT NOT NULL,
      categoria_id BIGINT NOT NULL,
      CONSTRAINT pk_posts_categoria PRIMARY KEY (post_id, categoria_id),
      CONSTRAINT fk_pc_posts FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      CONSTRAINT fk_pc_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
    );
  `;

  // -- Tabla intermedia para relacionar posts con sectores (N:N)
  await sql`
    CREATE TABLE IF NOT EXISTS posts_sectores (
      post_id BIGINT NOT NULL,
      sector_id BIGINT NOT NULL,
      constraint pk_posts_sectores PRIMARY KEY (post_id, sector_id),
      constraint fk_postsectores_usuario FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      constraint fk_postsectores_post FOREIGN KEY (sector_id) REFERENCES sectores(id) ON DELETE CASCADE
    );
  `;
  
  // -- Tabla intermedia para relacionar posts con rutas (N:N)
  await sql`
    CREATE TABLE IF NOT EXISTS posts_rutas (
      post_id BIGINT NOT NULL,
      ruta_id BIGINT NOT NULL,
      constraint pk_posts_rutas PRIMARY KEY (post_id, ruta_id),
      constraint fk_postrutas_usuario FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      constraint fk_postrutas_post FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE
    );
  `;
  console.log("!!!! creacion de tablas Completa ..... OK");
}


