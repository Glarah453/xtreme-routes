select * from regiones;
select * from comunas;

select * from categorias;
select * from subcategorias;
select * from dificultad;
select * from subcategoria_dificultad;

select * from usuarios;
select * from sesiones;

select * from sectores;
select * from posts_sectores;

select * from rutas;
select * from posts_rutas;

select * from posts;

select * from waypoints;

select * from comentarios;

select * from valoraciones;

select * from me_gusta;

--delete from dificultad;
--delete from sectores where id = 14;
--delete from rutas where id = 5;


select * from comunas where nombre = 'Talca';
SELECT TO_DATE('15/05/1990', 'DD/MM/YYYY');

--=====================================================================================

-- Crear Usuario

DO $$
DECLARE
    v_usuario_id BIGINT;
BEGIN
    CALL crear_usuario(
        p_nombre := 'Juan Pérez 3',
        p_email := 'juan.perez3@example.com',
		p_fecha_nacimiento := TO_DATE('15/05/1990', 'DD/MM/YYYY'),
        p_photoURL := 'photo/hosodhfos/dfsoohf',
        p_comuna_id := 196,
        p_usuario_id := v_usuario_id
    );
    RAISE NOTICE 'Usuario creado con ID: %', v_usuario_id;
END;
$$;


-- Actualizar Usuario

DO $$
BEGIN
    CALL actualizar_usuario(
		p_usuario_id := 3,
        p_nombre := 'Juan Pérez 2P',
        p_email := 'juan.perez2P@example.com',
		p_fecha_nacimiento := TO_DATE('15/05/1999', 'DD/MM/YYYY'),
        p_photoURL := 'photo/hosodhfos/dfsoohf',
        p_comuna_id := 196
    );
    RAISE NOTICE 'Usuario Actualizado';
END;
$$;


-- Eliminar Usuario

DO $$
BEGIN
    CALL eliminar_usuario(
		p_usuario_id := 4
    );
    RAISE NOTICE 'Usuario Eliminado';
END;
$$;


--=====================================================================================

-- crear sesion

DO $$
DECLARE
    v_sesion_id BIGINT;
BEGIN
    CALL crear_sesion(
        p_usuario_id := 3,
        p_access_token := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikp1YW4gUGVyZXoiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        p_sesion_id := v_sesion_id
    );
    RAISE NOTICE 'Sesión usuario creada con ID: %', v_sesion_id;
END;
$$;

-- cerrar sesion

DO $$
BEGIN
    CALL cerrar_sesion(
        p_usuario_id := 3
    );
    RAISE NOTICE 'Sesión usuario cerrada';
END;
$$;

--=====================================================================================


-- crear nuevo post con sectores y rutas

DO $$
DECLARE
    v_sector_id1 BIGINT;
    v_sector_id2 BIGINT;
    v_ruta_id BIGINT;
    v_post_id BIGINT;
BEGIN
    -- Crear sector 1
    CALL crear_sector(
        p_usuario_id := 1,
        p_nombre := 'Sector Norte 4',
        p_descripcion := 'Zona alta del cerro 4',
		p_image := 'photo/sector/z',
        p_latitud := -33.447000000000000,
        p_longitud := -70.668000000000000,
        p_sector_id := v_sector_id1
    );

    -- Crear sector 2
    CALL crear_sector(
        p_usuario_id := 1,
        p_nombre := 'Sector Sur 4',
        p_descripcion := 'Zona boscosa 4',
		p_image := 'photo/sector/z',
        p_latitud := -33.450000000000000,
        p_longitud := -70.670000000000000,
        p_sector_id := v_sector_id2
    );

    -- Crear ruta
    CALL crear_ruta(
        p_usuario_id := 1,
        p_nombre := 'Ruta Principal 4',
        p_descripcion := 'Ruta de trekking 4',
        p_sector_id := v_sector_id1,
        p_categoria_id := 1,
        p_dificultad_id := 1,
        p_distancia := 5.5,
        p_desnivel_acumulado := 300.0,
        p_es_personalizada := TRUE,
        p_privacidad := 'publica',
        p_waypoints := '[
            {"latitud": -33.4471, "longitud": -70.6681, "orden": 0, "nombre": "Inicio", "descripcion": "Punto de partida"},
            {"latitud": -33.4472, "longitud": -70.6682, "orden": 1, "nombre": "Cima", "descripcion": "Punto más alto"}
        ]'::JSONB,
        p_ruta_id := v_ruta_id
    );

    -- Crear post
    CALL crear_post(
        p_usuario_id := 1,
        p_titulo := 'Aventura en el Cerro Manquehue 4',
        p_contenido := 'Un trekking increíble con vistas espectaculares 4.',
        p_comuna_id := 196,
        p_latitud := -33.448900000000000,
        p_longitud := -70.669300000000000,
        p_categorias := ARRAY[1, 2]::BIGINT[],
        p_sectores := ARRAY[v_sector_id1, v_sector_id2]::BIGINT[],
        p_rutas := ARRAY[v_ruta_id]::BIGINT[],
        p_post_id := v_post_id
    );
    RAISE NOTICE 'Post creado con ID: %', v_post_id;
END;
$$;


-- Actualizar Post

DO $$
BEGIN
    -- actualizar post
    CALL actualizar_post(
		p_post_id := 4,
        p_usuario_id := 2,
        p_titulo := 'Aventura en el Cerro Manquehue 33',
        p_contenido := 'Un trekking increíble con vistas espectaculares 33.',
        p_comuna_id := 196,
        p_latitud := -33.448900000000000,
        p_longitud := -70.669300000000000,
        p_categorias := ARRAY[1, 2]::BIGINT[],
        p_sectores := ARRAY[11, 12]::BIGINT[],
        p_rutas := ARRAY[4]::BIGINT[]
    );
    RAISE NOTICE 'Post actualizado';
END;
$$;


-- Eliminar Post

DO $$
BEGIN
    -- Eliminar post
    CALL eliminar_post(
		p_post_id := 6,
        p_usuario_id := 1
    );
    RAISE NOTICE 'Post eliminado';
END;
$$;

--=====================================================================================

-- crear sector en un post existente

DO $$
DECLARE
    v_sector_id BIGINT;
BEGIN
    -- Crear sector
    CALL crear_sector_en_post(
		p_post_id := 2,
        p_usuario_id := 1,
        p_nombre := 'Sector Centro 222',
        p_descripcion := 'Zona centro del cerro 222',
		p_image := 'photo/sector/z',
        p_latitud := -33.445000000000000,
        p_longitud := -70.667000000000000,
        p_sector_id := v_sector_id
    );

    RAISE NOTICE 'Sector creado en Post existente con ID: %', v_sector_id;
END;
$$;

-- actualizar sector

DO $$
BEGIN
    CALL actualizar_sector(
		p_sector_id := 10,
        p_usuario_id := 1,
        p_nombre := 'Sector Centro 23',
        p_descripcion := 'Zona centro del cerro 23',
		p_image := 'photo/sector/z',
        p_latitud := -33.445000000000000,
        p_longitud := -70.667000000000000
    );
    RAISE NOTICE 'Sector Actualizado';
END;
$$;

-- eliminar sector

DO $$
BEGIN
    CALL eliminar_sector(
		p_sector_id := 9,
        p_usuario_id := 1
    );
    RAISE NOTICE 'Sector Eliminado';
END;
$$;

--=====================================================================================

-- crear ruta en un post existente

DO $$
DECLARE
    v_ruta_id BIGINT;

BEGIN
    -- Crear ruta en post existente
    CALL crear_ruta_en_post(
		    p_post_id := 4,
        p_usuario_id := 1,
        p_nombre := 'Ruta Principal 23',
        p_descripcion := 'Ruta de trekking 23',
        p_sector_id := 5,
        p_categoria_id := 1,
        p_dificultad_id := 1,
        p_distancia := 5.5,
        p_desnivel_acumulado := 300.0,
        p_es_personalizada := TRUE,
        p_privacidad := 'publica',
        p_waypoints := '[
            {"latitud": -33.4471, "longitud": -70.6681, "orden": 0, "nombre": "Inicio", "descripcion": "Punto de partida"},
            {"latitud": -33.4472, "longitud": -70.6682, "orden": 1, "nombre": "curva 1", "descripcion": "primera curva"},
            {"latitud": -33.4473, "longitud": -70.6683, "orden": 2, "nombre": "curva 2", "descripcion": "segunda curva"},
            {"latitud": -33.4474, "longitud": -70.6684, "orden": 3, "nombre": "recta 1", "descripcion": "primera recta"},
            {"latitud": -33.4475, "longitud": -70.6685, "orden": 4, "nombre": "curva 3", "descripcion": "tercera curva"},
            {"latitud": -33.4476, "longitud": -70.6686, "orden": 5, "nombre": "Cima", "descripcion": "Punto más alto"}
        ]'::JSONB,
        p_ruta_id := v_ruta_id
    );

    RAISE NOTICE 'Ruta creada en Post existente con ID: %', v_ruta_id;
END;
$$;

-- actualizar ruta

DO $$
BEGIN
    CALL actualizar_ruta(
		    p_ruta_id := 7,
        p_usuario_id := 1,
        p_nombre := 'Ruta Principal 22',
        p_descripcion := 'Ruta de trekking 22',
        p_sector_id := 5,
        p_categoria_id := 1,
        p_dificultad_id := 1,
        p_distancia := 5.5,
        p_desnivel_acumulado := 300.0,
        p_es_personalizada := TRUE,
        p_privacidad := 'publica',
        p_waypoints := '[
            {"latitud": -33.4471, "longitud": -70.6681, "orden": 0, "nombre": "Inicio", "descripcion": "Punto de partida"},
            {"latitud": -33.4472, "longitud": -70.6682, "orden": 1, "nombre": "curva 1", "descripcion": "primera curva"},
            {"latitud": -33.4473, "longitud": -70.6683, "orden": 2, "nombre": "curva 2", "descripcion": "segunda curva"},
            {"latitud": -33.4474, "longitud": -70.6684, "orden": 3, "nombre": "recta 1", "descripcion": "primera recta"},
            {"latitud": -33.4475, "longitud": -70.6685, "orden": 4, "nombre": "curva 3", "descripcion": "tercera curva"},
            {"latitud": -33.4476, "longitud": -70.6686, "orden": 5, "nombre": "Cima", "descripcion": "Punto más alto"}
        ]'::JSONB
    );
    RAISE NOTICE 'Ruta Actualizada';
END;
$$;

-- Eliminar Ruta

DO $$
BEGIN
    CALL eliminar_ruta(
		p_ruta_id := 8,
        p_usuario_id := 1
    );

    RAISE NOTICE 'Ruta Eliminada';
END;
$$;


--=====================================================================================

--  Crear Comentario

DO $$
DECLARE
    v_comentario_id BIGINT;
BEGIN
    CALL crear_comentario(
        p_usuario_id := 1,
		p_post_id := 2,
        p_contenido := 'Mala la Ruta Principal 23',
        p_comentario_id := v_comentario_id
    );

    RAISE NOTICE 'Comentario creado en Post con ID: %', v_comentario_id;
END;
$$;

-- actualizar comentario

DO $$
BEGIN
    CALL actualizar_comentario(
		p_comentario_id := 2,
        p_usuario_id := 1,
        p_contenido := 'Mala la Ruta Principal 21'
    );

    RAISE NOTICE 'Comentario Actualizado';
END;
$$;

-- Eliminar comentario

DO $$
BEGIN
    CALL eliminar_comentario(
		p_comentario_id := 3,
        p_usuario_id := 1
    );

    RAISE NOTICE 'Comentario Eliminado';
END;
$$;

--=====================================================================================

--       crear valoracion

DO $$
BEGIN
    CALL crear_valoracion(
        p_usuario_id := 1,
		p_post_id := 2,
        p_valor := 2
    );

    RAISE NOTICE 'valoracion creada en Post';
END;
$$;

--       actualizar valoracion

DO $$
BEGIN
    CALL actualizar_valoracion(
        p_usuario_id := 1,
		p_post_id := 2,
        p_valor := 1
    );

    RAISE NOTICE 'valoracion Actualizada en Post';
END;
$$;

--       eliminar valoracion

DO $$
BEGIN
    CALL eliminar_valoracion(
        p_usuario_id := 1,
		p_post_id := 4
    );

    RAISE NOTICE 'valoracion Eliminada en Post';
END;
$$;


--=====================================================================================

--       crear me_gusta

DO $$
BEGIN
    CALL crear_me_gusta(
        p_usuario_id := 1,
		p_post_id := 4
    );

    RAISE NOTICE 'Me_gusta creada en Post';
END;
$$;

--       eliminar me_gusta

DO $$
BEGIN
    CALL eliminar_me_gusta(
        p_usuario_id := 1,
		p_post_id := 4
    );

    RAISE NOTICE 'Me_gusta Eliminado en Post';
END;
$$;

--=====================================================================================

