
drop table if exists posts_rutas;
drop table if exists posts_sectores;
drop table if exists me_gusta;
drop table if exists valoraciones;
drop table if exists comentarios;
drop table if exists posts_categorias;
drop table if exists posts;
drop table if exists waypoints;
drop table if exists rutas_subcategorias;
drop table if exists rutas;
drop table if exists sectores;
drop table if exists sesiones;
drop table if exists usuarios;
drop table if exists subcategoria_dificultad;
drop table if exists dificultad;
drop table if exists subcategorias;
drop table if exists categorias;
drop table if exists comunas;
drop table if exists regiones;

-- Tabla de regiones
CREATE TABLE IF NOT EXISTS regiones (
    id BIGSERIAL not null,
    nombre VARCHAR(100) NOT null,
    latitud NUMERIC(18,15) not null,
    longitud NUMERIC(18,15) not null,
    constraint pk_region primary key (id)
);

-- Tabla de comunas
CREATE TABLE IF NOT EXISTS comunas (
    id BIGSERIAL not null,
    nombre VARCHAR(100) NOT NULL,
    region_id BIGINT NOT NULL,
    constraint pk_comuna primary key (id),
    constraint fk_region foreign key (region_id) references regiones(id) ON DELETE CASCADE
);

-- Tabla de categorias (ej. escalada, trekking, MTB)
CREATE TABLE IF NOT EXISTS categorias (
    id BIGSERIAL not null,
    nombre VARCHAR(50) NOT null,
    constraint pk_categoria primary key (id)
);

-- Tabla de subcategorias (ej. deportiva, tradicional para escalada)
CREATE TABLE subcategorias (
    id BIGSERIAL not null,
    nombre VARCHAR(50) NOT NULL,
    descripcion varchar(500) not null,
    categoria_id BIGINT NOT NULL,
    constraint pk_subcategoria primary key (id),
    constraint fk_categoria foreign key (categoria_id) references categorias(id) ON DELETE cascade
);

-- Tabla de dificultad (niveles de dificultad por categoría)
CREATE TABLE IF NOT EXISTS dificultad (
    id BIGSERIAL not null,
    nombre VARCHAR(50) NOT NULL, -- Ej. 5.10a, Nivel 3
    --subcategoria_id BIGINT NOT NULL,
    sistema VARCHAR(50), -- YDS, Francés, UIAA, V-Grade, etc.
    constraint pk_dificultad primary key (id)
    --constraint fk_dificultad_subcategoria foreign key (subcategoria_id) references subcategorias(id) ON DELETE cascade
);

-- Relación muchos-a-muchos entre subcategorías y dificultades
CREATE TABLE IF NOT EXISTS subcategoria_dificultad (
    subcategoria_id BIGINT NOT NULL,
    dificultad_id BIGINT NOT NULL,
    CONSTRAINT pk_subcat_dificultad PRIMARY KEY (subcategoria_id, dificultad_id),
    CONSTRAINT fk_sd_subcategoria FOREIGN KEY (subcategoria_id) REFERENCES subcategorias(id) ON DELETE CASCADE,
    CONSTRAINT fk_sd_dificultad FOREIGN KEY (dificultad_id) REFERENCES dificultad(id) ON DELETE CASCADE
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL not null,
    displayname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password text,
    fecha_nacimiento DATE NOT null,
    photoURL VARCHAR(300) not null,
    comuna_id BIGINT NOT NULL,
    createdIt TIMESTAMP not null default CURRENT_TIMESTAMP,
    lastEdit TIMESTAMP,
    constraint pk_usuario primary key (id),
    constraint fk_usuario_comuna FOREIGN KEY (comuna_id) REFERENCES comunas(id) ON DELETE RESTRICT
);

-- Tabla de sesiones
CREATE TABLE IF NOT EXISTS sesiones (
    id BIGSERIAL not null,
    usuario_id BIGINT NOT NULL,
    access_token VARCHAR(500) NOT NULL, -- ID token de Firebase
    inicio_sesion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cierre_sesion TIMESTAMP, -- Nullable, ya que la sesión puede estar activa
    estado VARCHAR(20) NOT NULL DEFAULT 'activa', -- Ej. 'activa', 'cerrada'
    constraint pk_sesiones primary key (id),
    constraint fk_usuario_sesion FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT check_estado_sesion CHECK (estado IN ('activa', 'cerrada'))
);

-- Tabla de sectores
CREATE TABLE IF NOT EXISTS sectores (
    id BIGSERIAL not null,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT, -- Descripción del sector
    image varchar(300),
    usuario_id BIGINT NOT NULL, -- Creador del sector
    latitud NUMERIC(18,15) not null, -- Coordenadas del sector
    longitud NUMERIC(18,15) not null,
	  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lastEdit TIMESTAMP,
    constraint pk_sectores primary key (id),
    constraint fk_sector_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de rutas
CREATE TABLE IF NOT EXISTS rutas (
    id BIGSERIAL not null,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT, -- Descripción de la ruta
    sector_id BIGINT, -- Nullable para rutas personalizadas no asociadas a un sector
    categoria_id BIGINT NOT NULL,
    dificultad_id BIGINT, -- Nullable para rutas personalizadas sin dificultad definida
    usuario_id BIGINT NOT NULL, -- Creador de la ruta
    distancia NUMERIC(18,15), -- Distancia en kilómetros
    desnivel_acumulado NUMERIC(18,15), -- Desnivel acumulado positivo en metros
    es_personalizada BOOLEAN NOT NULL DEFAULT FALSE, -- TRUE para rutas creadas por usuarios
    privacidad VARCHAR(20) NOT NULL DEFAULT 'publica', -- 'publica' o 'privada'
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lastEdit TIMESTAMP,
    constraint pk_rutas primary key (id),
    constraint fk_rutas_sector FOREIGN KEY (sector_id) REFERENCES sectores(id) ON DELETE CASCADE,
    constraint fk_rutas_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    constraint fk_rutas_dificultad FOREIGN KEY (dificultad_id) REFERENCES dificultad(id) ON DELETE SET NULL,
    constraint fk_rutas_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE cascade,
    CONSTRAINT check_privacidad CHECK (privacidad IN ('publica', 'privada'))
);

-- Tabla de rutas y subcategorias
CREATE TABLE IF NOT EXISTS rutas_subcategorias (
    ruta_id BIGINT NOT NULL,
    subcategoria_id BIGINT NOT NULL,
    CONSTRAINT pk_rutas_subcategorias PRIMARY KEY (ruta_id, subcategoria_id),
    CONSTRAINT fk_rs_ruta FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE,
    CONSTRAINT fk_rs_subcategoria FOREIGN KEY (subcategoria_id) REFERENCES subcategorias(id) ON DELETE CASCADE
);

-- Tabla de waypoints
CREATE TABLE IF NOT EXISTS waypoints (
    id BIGSERIAL not null,
    ruta_id BIGINT NOT NULL,
    latitud NUMERIC(18,15) NOT NULL,
    longitud NUMERIC(18,15) NOT NULL,
    orden INTEGER NOT NULL, -- Orden del waypoint en la ruta
    nombre VARCHAR(100), -- Nombre opcional del waypoint
    descripcion TEXT, -- Descripción opcional del waypoint
    constraint pk_waypoints primary key (id),
    constraint fk_waypoints_rutas FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE,
    CONSTRAINT check_orden CHECK (orden >= 0)
);

-- Tabla de posts
CREATE TABLE IF NOT EXISTS posts (
    id BIGSERIAL not null,
    titulo VARCHAR(200) NOT NULL, -- Título del post
    contenido TEXT NOT NULL,
    usuario_id BIGINT NOT NULL,
    comuna_id BIGINT NOT NULL,
    latitud NUMERIC(18,15) NOT NULL, -- Coordenadas del lugar
    longitud NUMERIC(18,15) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastEdit TIMESTAMP,
    constraint pk_posts primary key (id),
    constraint fk_posts_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    constraint fk_posts_comuna FOREIGN KEY (comuna_id) REFERENCES comunas(id) ON DELETE RESTRICT
);

-- Tabla de comentarios
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

-- Tabla de valoraciones (1 a 5)
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

-- Tabla de me gusta
CREATE TABLE IF NOT EXISTS me_gusta (
    usuario_id BIGINT NOT NULL,
    post_id BIGINT NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    constraint pk_megusta_user_post PRIMARY KEY (usuario_id, post_id),
    constraint fk_megusta_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    constraint fk_megusta_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- Relación muchos-a-muchos entre posts y categorías
CREATE TABLE IF NOT EXISTS posts_categorias (
    post_id BIGINT NOT NULL,
    categoria_id BIGINT NOT NULL,
    CONSTRAINT pk_posts_categoria PRIMARY KEY (post_id, categoria_id),
    CONSTRAINT fk_pc_posts FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_pc_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

-- Tabla intermedia para relacionar posts con sectores (N:N)
CREATE TABLE IF NOT EXISTS posts_sectores (
    post_id BIGINT NOT NULL,
    sector_id BIGINT NOT NULL,
    constraint pk_posts_sectores PRIMARY KEY (post_id, sector_id),
    constraint fk_postsectores_usuario FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    constraint fk_postsectores_post FOREIGN KEY (sector_id) REFERENCES sectores(id) ON DELETE CASCADE
);

-- Tabla intermedia para relacionar posts con rutas (N:N)
CREATE TABLE IF NOT EXISTS posts_rutas (
    post_id BIGINT NOT NULL,
    ruta_id BIGINT NOT NULL,
    constraint pk_posts_rutas PRIMARY KEY (post_id, ruta_id),
    constraint fk_postrutas_usuario FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    constraint fk_postrutas_post FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE
);


-- Índices para mejorar el rendimiento
/*
CREATE INDEX idx_comunas_region_id ON comunas (region_id);
CREATE INDEX idx_subcategorias_categoria_id ON subcategorias (categoria_id);
CREATE INDEX idx_subcategorias_dificultades_subcategoria_id ON subcategorias_dificultades (subcategoria_id);
CREATE INDEX idx_subcategorias_dificultades_dificultad_id ON subcategorias_dificultades (dificultad_id);
CREATE INDEX idx_usuarios_comuna_id ON usuarios (comuna_id);
CREATE INDEX idx_sesiones_usuario_id ON sesiones (usuario_id);
CREATE INDEX idx_sesiones_estado ON sesiones (estado);
CREATE INDEX idx_rutas_sector_id ON rutas (sector_id);
CREATE INDEX idx_rutas_categoria_id ON rutas (categoria_id);
CREATE INDEX idx_rutas_dificultad_id ON rutas (dificultad_id);
CREATE INDEX idx_rutas_usuario_id ON rutas (usuario_id);
CREATE INDEX idx_waypoints_ruta_id ON waypoints (ruta_id);
CREATE INDEX idx_posts_usuario_id ON posts (usuario_id);
CREATE INDEX idx_posts_comuna_id ON posts (comuna_id);
CREATE INDEX idx_posts_zona_nombre ON posts (zona_nombre);
CREATE INDEX idx_posts_categorias_post_id ON posts_categorias (post_id);
CREATE INDEX idx_posts_categorias_categoria_id ON posts_categorias (categoria_id);
CREATE INDEX idx_comentarios_usuario_id ON comentarios (usuario_id);
CREATE INDEX idx_comentarios_post_id ON comentarios (post_id);
CREATE INDEX idx_valoraciones_usuario_id ON valoraciones (usuario_id);
CREATE INDEX idx_valoraciones_post_id ON valoraciones (post_id);
CREATE INDEX idx_me_gusta_usuario_id ON me_gusta (usuario_id);
CREATE INDEX idx_me_gusta_post_id ON me_gusta (post_id);
CREATE INDEX idx_posts_sectores_sector_id ON posts_sectores (sector_id);
CREATE INDEX idx_posts_sectores_post_id ON posts_sectores (post_id);
CREATE INDEX idx_posts_rutas_ruta_id ON posts_rutas (ruta_id);
CREATE INDEX idx_posts_rutas_post_id ON posts_rutas (post_id);
CREATE INDEX idx_sectores_latitud_longitud ON sectores (latitud, longitud);
CREATE INDEX idx_posts_latitud_longitud ON posts (latitud, longitud);
CREATE INDEX idx_waypoints_latitud_longitud ON waypoints (latitud, longitud);
*/
