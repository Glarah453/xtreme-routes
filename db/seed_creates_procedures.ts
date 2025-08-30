import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

//========================================================================================================================================================
export async function createUserProcedures() {
  await sql`
    CREATE OR REPLACE PROCEDURE crear_usuario(
        p_nombre VARCHAR(100),
        p_email VARCHAR(100),
        p_fecha_nacimiento DATE,
        p_photoURL VARCHAR(100),
        p_comuna_id BIGINT,
        OUT p_usuario_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
      -- Validar que el displayname no esté registrado
        IF EXISTS (SELECT 1 FROM usuarios WHERE displayname = p_nombre) THEN
            RAISE EXCEPTION 'El displayname ya está registrado: %', p_nombre;
        END IF;


        -- Validar que el email no esté registrado
        IF EXISTS (SELECT 1 FROM usuarios WHERE email = p_email) THEN
            RAISE EXCEPTION 'El email ya está registrado: %', p_email;
        END IF;

        -- Validar que la fecha de nacimiento sea válida (no futura)
        -- IF p_fecha_nacimiento > CURRENT_DATE THEN
        --     RAISE EXCEPTION 'La fecha de nacimiento no puede ser futura: %', p_fecha_nacimiento;
        -- END IF;

        -- Insertar el usuario y devolver el ID
        INSERT INTO usuarios (displayname, email, rol, fecha_nacimiento, photoURL, comuna_id, createdIt)
        VALUES (p_nombre, p_email, 'usuario', p_fecha_nacimiento, p_photoURL, p_comuna_id, CURRENT_TIMESTAMP)
        RETURNING id INTO p_usuario_id;
    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al crear usuario: %', SQLERRM;
    END;
    $$;
  `;

  await sql`
    CREATE OR REPLACE PROCEDURE actualizar_usuario(
        p_usuario_id BIGINT,
        p_nombre VARCHAR(100),
        p_email VARCHAR(100),
        p_fecha_nacimiento DATE,
        p_photoURL VARCHAR(300),
        p_comuna_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        -- Validar que el usuario existe
        IF NOT EXISTS (SELECT 1 FROM usuarios WHERE id = p_usuario_id) THEN
            RAISE EXCEPTION 'Usuario no encontrado: %', p_usuario_id;
        END IF;


      -- Validar que el displayname no esté registrado por otro usuario
        IF EXISTS (SELECT 1 FROM usuarios WHERE displayname = p_nombre AND id != p_usuario_id) THEN
            RAISE EXCEPTION 'El displayname ya está registrado por otro usuario: %', p_nombre;
        END IF;

        -- Validar que el email no esté registrado por otro usuario
        IF EXISTS (SELECT 1 FROM usuarios WHERE email = p_email AND id != p_usuario_id) THEN
            RAISE EXCEPTION 'El email ya está registrado por otro usuario: %', p_email;
        END IF;

        -- -- Validar que la fecha de nacimiento sea válida
        -- IF p_fecha_nacimiento > CURRENT_DATE THEN
        --     RAISE EXCEPTION 'La fecha de nacimiento no puede ser futura: %', p_fecha_nacimiento;
        -- END IF;

        -- Actualizar el usuario
        UPDATE usuarios
        SET displayname = p_nombre,
            email = p_email,
            fecha_nacimiento = p_fecha_nacimiento,
            photoURL = p_photoURL,
            comuna_id = p_comuna_id,
            lastedit = CURRENT_TIMESTAMP
        WHERE id = p_usuario_id;
    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al actualizar usuario: %', SQLERRM;
    END;
    $$;
  `;

  await sql`
    CREATE OR REPLACE PROCEDURE eliminar_usuario(
        p_usuario_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        -- Verificar que el usuario existe
        IF NOT EXISTS (SELECT 1 FROM usuarios WHERE id = p_usuario_id) THEN
            RAISE EXCEPTION 'Usuario no encontrado: %', p_usuario_id;
        END IF;

        -- Eliminar el usuario (las tablas relacionadas con ON DELETE CASCADE manejarán las dependencias)
        DELETE FROM usuarios WHERE id = p_usuario_id;
    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al eliminar usuario: %', SQLERRM;
    END;
    $$;
  `;
  console.log("Creacion Procedimientos Usuarios ..... OK");
}

//========================================================================================================================================================
export async function createSesionProcedures() {
  await sql`
    CREATE OR REPLACE PROCEDURE crear_sesion(
        p_usuario_id BIGINT,
        p_access_token VARCHAR(500),
        OUT p_sesion_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        -- Validar que el usuario existe
        IF NOT EXISTS (SELECT 1 FROM usuarios WHERE id = p_usuario_id) THEN
            RAISE EXCEPTION 'Usuario no encontrado: %', p_usuario_id;
        END IF;

        -- Validar que no haya una sesión activa
        IF EXISTS (
            SELECT 1 FROM sesiones 
            WHERE usuario_id = p_usuario_id 
            AND estado = 'activa' 
            AND cierre_sesion IS NULL
        ) THEN
            RAISE EXCEPTION 'El usuario ya tiene una sesión activa';
        END IF;

        -- Validar que el access_token no sea nulo o vacío
        IF p_access_token IS NULL OR p_access_token = '' THEN
            RAISE EXCEPTION 'El access_token no puede ser nulo o vacío';
        END IF;

        -- Insertar la nueva sesión con access_token
        INSERT INTO sesiones (usuario_id, inicio_sesion, estado, access_token)
        VALUES (p_usuario_id, CURRENT_TIMESTAMP, 'activa', p_access_token)
        RETURNING id INTO p_sesion_id;
    
    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al crear sesion de usuario: %', SQLERRM;
    END;
    $$;
  `;


  await sql`
    CREATE OR REPLACE PROCEDURE cerrar_sesion(
        p_usuario_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        -- Verificar que el usuario tiene una sesión activa
        IF NOT EXISTS (
            SELECT 1
            FROM sesiones
            WHERE usuario_id = p_usuario_id
            AND estado = 'activa'
            AND cierre_sesion IS NULL
        ) THEN
            RAISE EXCEPTION 'No hay sesión activa para el usuario: %', p_usuario_id;
        END IF;

        -- Cerrar la sesión activa más reciente
        UPDATE sesiones
        SET cierre_sesion = CURRENT_TIMESTAMP,
            estado = 'cerrada'
        WHERE usuario_id = p_usuario_id
        AND estado = 'activa'
        AND cierre_sesion IS NULL
        AND inicio_sesion = (
            SELECT MAX(inicio_sesion)
            FROM sesiones
            WHERE usuario_id = p_usuario_id
            AND estado = 'activa'
            AND cierre_sesion IS NULL
        );
    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al cerrar sesión: %', SQLERRM;
    END;
    $$;
  `;

  // await sql`
  //   CREATE OR REPLACE PROCEDURE cerrar_sesion(
  //       p_usuario_id BIGINT,
  //       p_access_token VARCHAR(500)
  //   )
  //   LANGUAGE plpgsql
  //   AS $$
  //   BEGIN
  //       -- Verificar que el usuario tiene una sesión activa
  //       IF NOT EXISTS (
  //           SELECT 1
  //           FROM sesiones
  //           WHERE usuario_id = p_usuario_id
  //           AND estado = 'activa'
  //           AND cierre_sesion IS NULL
  //       ) THEN
  //           RAISE EXCEPTION 'No hay sesión activa para el usuario: %', p_usuario_id;
  //       END IF;
  //
  //       -- Cerrar la sesión activa más reciente
  //       UPDATE sesiones
  //       SET cierre_sesion = CURRENT_TIMESTAMP,
  //           estado = 'cerrada'
  //       WHERE usuario_id = p_usuario_id
  //       AND access_token = p_access_token,
  //       AND estado = 'activa'
  //       AND cierre_sesion IS NULL
  //       AND inicio_sesion = (
  //           SELECT MAX(inicio_sesion)
  //           FROM sesiones
  //           WHERE usuario_id = p_usuario_id
  //           AND estado = 'activa'
  //           AND cierre_sesion IS NULL
  //       );
  //   EXCEPTION
  //       WHEN OTHERS THEN
  //           -- Revertir transacción en caso de error
  //           ROLLBACK;
  //           RAISE EXCEPTION 'Error al cerrar sesión: %', SQLERRM;
  //   END;
  //   $$;
  // `;

  console.log("Creacion Procedimientos Sesion ..... OK");
}


//========================================================================================================================================================
export async function createSectorProcedures() {
  await sql`
    CREATE OR REPLACE PROCEDURE crear_sector(
        p_usuario_id BIGINT,
        p_nombre VARCHAR(100),
        p_descripcion TEXT,
        p_image varchar(300),
        p_latitud NUMERIC(18,15),
        p_longitud NUMERIC(18,15),
        OUT p_sector_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
      -- Validar que no exista el nombre en un sector existente
      if exists (
        select 1 from sectores
        where nombre = p_nombre
      ) then
        raise exception 'El Nombre ya existe en un Sector';
      end if;

      -- Validar que no exista la descripcion en un sector existente
      if exists (
        select 1 from sectores
        where descripcion = p_descripcion
      ) then
        raise exception 'La Descripcion ya existe en un Sector';
      end if;

        -- Insertar el sector con usuario_id y devolver el ID
        INSERT INTO sectores (nombre, descripcion, image, latitud, longitud, usuario_id, fecha_creacion)
        VALUES (p_nombre, p_descripcion, p_image, p_latitud, p_longitud, p_usuario_id, CURRENT_TIMESTAMP)
        RETURNING id INTO p_sector_id;
    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al crear sector: %', SQLERRM;
    END;
    $$;
  `;

  await sql`
    CREATE OR REPLACE PROCEDURE crear_sector_en_post(
        p_post_id BIGINT,
        p_usuario_id BIGINT,
        p_nombre VARCHAR(100),
        p_descripcion TEXT,
        p_image varchar(300),
        p_latitud NUMERIC(18,15),
        p_longitud NUMERIC(18,15),
        OUT p_sector_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        -- Validar que el post existe
        IF NOT EXISTS (SELECT 1 FROM posts WHERE id = p_post_id) THEN
            RAISE EXCEPTION 'Post no encontrado: %', p_post_id;
        END IF;

        -- Validar que no exista el nombre en un sector existente
        if exists (
          select 1 from sectores
          where nombre = p_nombre
        ) then
          raise exception 'El Nombre ya existe en un Sector';
        end if;

        -- Validar que no exista la descripcion en un sector existente
        if exists (
          select 1 from sectores
          where descripcion = p_descripcion
        ) then
          raise exception 'La Descripcion ya existe en un Sector';
        end if;

        -- Insertar el sector con usuario_id
        INSERT INTO sectores (nombre, descripcion, image, latitud, longitud, usuario_id)
        VALUES (p_nombre, p_descripcion, p_image, p_latitud, p_longitud, p_usuario_id)
        RETURNING id INTO p_sector_id;

        -- Asociar el sector al post
        INSERT INTO posts_sectores (post_id, sector_id)
        VALUES (p_post_id, p_sector_id);

    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al crear sector en post: %', SQLERRM;
    END;
    $$;
  `;


  await sql`
    CREATE OR REPLACE PROCEDURE actualizar_sector(
        p_sector_id BIGINT,
        p_usuario_id BIGINT,
        p_nombre VARCHAR(100),
        p_descripcion TEXT,
        p_image varchar(300),
        p_latitud NUMERIC(18,15),
        p_longitud NUMERIC(18,15)
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
        v_post_usuario_id BIGINT;
    BEGIN
        -- Validar que el sector existe
        IF NOT EXISTS (SELECT 1 FROM sectores WHERE id = p_sector_id) THEN
            RAISE EXCEPTION 'Sector no encontrado: %', p_sector_id;
        END IF;

        -- Obtener el usuario creador del post asociado
        SELECT p.usuario_id INTO v_post_usuario_id
        FROM posts p
        JOIN posts_sectores ps ON p.id = ps.post_id
        WHERE ps.sector_id = p_sector_id;

        -- Verificar permisos: usuario creador del sector o del post
        IF NOT EXISTS (
            SELECT 1 FROM sectores
            WHERE id = p_sector_id
            AND (usuario_id = p_usuario_id OR v_post_usuario_id = p_usuario_id)
        ) THEN
            RAISE EXCEPTION 'Usuario no autorizado para actualizar este sector';
        END IF;

        -- Validar que no exista el nombre en un sector existente
        if exists (
          select 1 from sectores
          where nombre = p_nombre
        ) then
          raise exception 'El Nombre ya existe en un Sector';
        end if;

        -- Validar que no exista la descripcion en un sector existente
        if exists (
          select 1 from sectores
          where descripcion = p_descripcion
        ) then
          raise exception 'La Descripcion ya existe en un Sector';
        end if;

        -- Actualizar el sector
        UPDATE sectores
        SET nombre = p_nombre,
            descripcion = p_descripcion,
            image = p_image,
            latitud = p_latitud,
            longitud = p_longitud,
            lastEdit = CURRENT_TIMESTAMP
        WHERE id = p_sector_id;
    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al Actualizar sector en post: %', SQLERRM;
    END;
    $$;
  `;

  await sql`
    CREATE OR REPLACE PROCEDURE eliminar_sector(
        p_sector_id BIGINT,
        p_usuario_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
      v_post_usuario_id BIGINT;
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM sectores WHERE id = p_sector_id) THEN
            RAISE EXCEPTION 'Sector no encontrado: %', p_sector_id;
        END IF;
        -- Obtener el usuario creador del post asociado
        SELECT p.usuario_id INTO v_post_usuario_id
        FROM posts p
        JOIN posts_sectores ps ON p.id = ps.post_id
        WHERE ps.sector_id = p_sector_id;

        -- Verificar permisos: usuario creador del sector o del post
        IF NOT EXISTS (
            SELECT 1 FROM sectores
            WHERE id = p_sector_id
            AND (usuario_id = p_usuario_id OR v_post_usuario_id = p_usuario_id)
        ) THEN
            RAISE EXCEPTION 'Usuario no autorizado para eliminar este sector';
        END IF;

        -- Eliminar el sector
        DELETE FROM sectores WHERE id = p_sector_id;
    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al Eliminar sector en post: %', SQLERRM;
    END;
    $$;
  `;
  console.log("Creacion Procedimientos Sector ..... OK");
}

//========================================================================================================================================================
export async function createRutaProcedures() {
  await sql`
    CREATE OR REPLACE PROCEDURE crear_ruta(
        p_usuario_id BIGINT,
        p_nombre VARCHAR(100),
        p_descripcion TEXT,
        p_sector_id BIGINT,
        p_categoria_id BIGINT,
        p_dificultad_id BIGINT,
        p_distancia NUMERIC(18,15),
        p_desnivel_acumulado NUMERIC(18,15),
        p_es_personalizada BOOLEAN,
        p_privacidad VARCHAR(20),
        p_waypoints JSONB,
        OUT p_ruta_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
        v_waypoint JSONB;
    BEGIN
        -- Validar el Sector
        IF p_sector_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM sectores WHERE id = p_sector_id) THEN
            RAISE EXCEPTION 'Sector no encontrado: %', p_sector_id;
        END IF;

        -- Validar que no exista el Nombre en una Ruta existente
        if exists (
          select 1 from rutas
          where nombre = p_nombre
        ) then
          raise exception 'El Nombre ya existe en una Ruta';
        end if;

        -- Validar que no exista la descripcion en una Ruta existente
        if exists (
          select 1 from rutas
          where descripcion = p_descripcion
        ) then
          raise exception 'La Descripcion ya existe en una Ruta';
        end if;
          
        -- insertar la ruta
        INSERT INTO rutas (
            nombre, descripcion, sector_id, categoria_id, dificultad_id, usuario_id,
            distancia, desnivel_acumulado, es_personalizada, privacidad, fecha_creacion
        )
        VALUES (
            p_nombre, p_descripcion, p_sector_id, p_categoria_id, p_dificultad_id, p_usuario_id,
            p_distancia, p_desnivel_acumulado, p_es_personalizada, p_privacidad, CURRENT_TIMESTAMP
        )
        RETURNING id INTO p_ruta_id;

      -- insertar waypoints
        IF p_waypoints IS NOT NULL THEN
            FOR v_waypoint IN SELECT * FROM jsonb_array_elements(p_waypoints)
            LOOP
                INSERT INTO waypoints (ruta_id, latitud, longitud, orden, nombre, descripcion)
                VALUES (
                    p_ruta_id,
                    (v_waypoint->>'latitud')::NUMERIC(18,15),
                    (v_waypoint->>'longitud')::NUMERIC(18,15),
                    (v_waypoint->>'orden')::INTEGER,
                    v_waypoint->>'nombre',
                    v_waypoint->>'descripcion'
                );
            END LOOP;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al crear ruta: %', SQLERRM;
    END;
    $$;
  `;


  await sql`
    CREATE OR REPLACE PROCEDURE crear_ruta_en_post(
        p_post_id BIGINT,
        p_usuario_id BIGINT,
        p_nombre VARCHAR(100),
        p_descripcion TEXT,
        p_sector_id BIGINT,
        p_categoria_id BIGINT,
        p_dificultad_id BIGINT,
        p_distancia NUMERIC(18,15),
        p_desnivel_acumulado NUMERIC(18,15),
        p_es_personalizada BOOLEAN,
        p_privacidad VARCHAR(20),
        p_waypoints JSONB,
        OUT p_ruta_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
        v_waypoint JSONB;
    BEGIN
        -- Validar que el post existe
        IF NOT EXISTS (SELECT 1 FROM posts WHERE id = p_post_id) THEN
            RAISE EXCEPTION 'Post no encontrado: %', p_post_id;
        END IF;

        -- Validar que no exista el Nombre en una ruta existente
        if exists (
          select 1 from rutas
          where nombre = p_nombre
        ) then
          raise exception 'El Nombre ya existe en una Ruta';
        end if;

        -- Validar que no exista la descripcion en una ruta existente
        if exists (
          select 1 from rutas
          where descripcion = p_descripcion
        ) then
          raise exception 'La Descripcion ya existe en una Ruta';
        end if;

        -- Insertar la ruta con usuario_id
        INSERT INTO rutas (
            nombre, descripcion, sector_id, categoria_id, dificultad_id, usuario_id,
            distancia, desnivel_acumulado, es_personalizada, privacidad, fecha_creacion
        )
        VALUES (
            p_nombre, p_descripcion, p_sector_id, p_categoria_id, p_dificultad_id, p_usuario_id,
            p_distancia, p_desnivel_acumulado, p_es_personalizada, p_privacidad, CURRENT_TIMESTAMP
        )
        RETURNING id INTO p_ruta_id;

        -- Insertar waypoints
        IF p_waypoints IS NOT NULL THEN
            FOR v_waypoint IN SELECT * FROM jsonb_array_elements(p_waypoints)
            LOOP
                INSERT INTO waypoints (ruta_id, latitud, longitud, orden, nombre, descripcion)
                VALUES (
                    p_ruta_id,
                    (v_waypoint->>'latitud')::NUMERIC(18,15),
                    (v_waypoint->>'longitud')::NUMERIC(18,15),
                    (v_waypoint->>'orden')::INTEGER,
                    v_waypoint->>'nombre',
                    v_waypoint->>'descripcion'
                );
            END LOOP;
        END IF;

        -- Asociar la ruta al post
        INSERT INTO posts_rutas (post_id, ruta_id)
        VALUES (p_post_id, p_ruta_id);

    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al crear ruta en post: %', SQLERRM;
    END;
    $$;
  `;

  await sql`
    CREATE OR REPLACE PROCEDURE actualizar_ruta(
        p_ruta_id BIGINT,
        p_usuario_id BIGINT,
        p_nombre VARCHAR(100),
        p_descripcion TEXT,
        p_sector_id BIGINT,
        p_categoria_id BIGINT,
        p_dificultad_id BIGINT,
        p_distancia NUMERIC(18,15),
        p_desnivel_acumulado NUMERIC(18,15),
        p_es_personalizada BOOLEAN,
        p_privacidad VARCHAR(20),
        p_waypoints JSONB
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
        v_post_usuario_id BIGINT;
        v_waypoint JSONB;
    BEGIN
        -- Validar que la ruta existe
        IF NOT EXISTS (SELECT 1 FROM rutas WHERE id = p_ruta_id) THEN
            RAISE EXCEPTION 'Ruta no encontrada: %', p_ruta_id;
        END IF;

        -- Obtener el usuario creador del post asociado
        SELECT p.usuario_id INTO v_post_usuario_id
        FROM posts p
        JOIN posts_rutas pr ON p.id = pr.post_id
        WHERE pr.ruta_id = p_ruta_id;

        -- Verificar permisos: usuario creador de la ruta o del post
        IF NOT EXISTS (
            SELECT 1 FROM rutas
            WHERE id = p_ruta_id
            AND (usuario_id = p_usuario_id OR v_post_usuario_id = p_usuario_id)
        ) THEN
            RAISE EXCEPTION 'Usuario no autorizado para actualizar esta ruta';
        END IF;

        -- Validar que no exista el Nombre en una ruta existente
        if exists (
          select 1 from rutas
          where nombre = p_nombre
        ) then
          raise exception 'El Nombre ya existe en una Ruta';
        end if;

        -- Validar que no exista la descripcion en una ruta existente
        if exists (
          select 1 from rutas
          where descripcion = p_descripcion
        ) then
          raise exception 'La Descripcion ya existe en una Ruta';
        end if;

        -- Actualizar la ruta
        UPDATE rutas
        SET nombre = p_nombre,
            descripcion = p_descripcion,
            sector_id = p_sector_id,
            categoria_id = p_categoria_id,
            dificultad_id = p_dificultad_id,
            distancia = p_distancia,
            desnivel_acumulado = p_desnivel_acumulado,
            es_personalizada = p_es_personalizada,
            privacidad = p_privacidad,
            lastEdit = CURRENT_TIMESTAMP
        WHERE id = p_ruta_id;

        -- Actualizar waypoints
        DELETE FROM waypoints WHERE ruta_id = p_ruta_id;

        IF p_waypoints IS NOT NULL THEN
            FOR v_waypoint IN SELECT * FROM jsonb_array_elements(p_waypoints)
            LOOP
                INSERT INTO waypoints (ruta_id, latitud, longitud, orden, nombre, descripcion)
                VALUES (
                    p_ruta_id,
                    (v_waypoint->>'latitud')::NUMERIC(18,15),
                    (v_waypoint->>'longitud')::NUMERIC(18,15),
                    (v_waypoint->>'orden')::INTEGER,
                    v_waypoint->>'nombre',
                    v_waypoint->>'descripcion'
                );
            END LOOP;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al Actualizar ruta: %', SQLERRM;
    END;
    $$;
  `;

  await sql`
    CREATE OR REPLACE PROCEDURE eliminar_ruta(
        p_ruta_id BIGINT,
        p_usuario_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
        v_post_usuario_id BIGINT;
    BEGIN
        -- Validar que la ruta existe
        IF NOT EXISTS (SELECT 1 FROM rutas WHERE id = p_ruta_id) THEN
            RAISE EXCEPTION 'Ruta no encontrada: %', p_ruta_id;
        END IF;

        -- Obtener el usuario creador del post asociado
        SELECT p.usuario_id INTO v_post_usuario_id
        FROM posts p
        JOIN posts_rutas pr ON p.id = pr.post_id
        WHERE pr.ruta_id = p_ruta_id;

        -- Verificar permisos: usuario creador de la ruta o del post
        IF NOT EXISTS (
            SELECT 1 FROM rutas
            WHERE id = p_ruta_id
            AND (usuario_id = p_usuario_id OR v_post_usuario_id = p_usuario_id)
        ) THEN
            RAISE EXCEPTION 'Usuario no autorizado para eliminar esta ruta';
        END IF;

        -- Eliminar la ruta
        DELETE FROM rutas WHERE id = p_ruta_id;

    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al Eliminar ruta: %', SQLERRM;
    END;
    $$;
  `;
  console.log("Creacion Procedimientos Rutas ..... OK");
}


//========================================================================================================================================================
export async function createPostProcedures() {
  await sql`
    CREATE OR REPLACE PROCEDURE crear_post(
        p_usuario_id BIGINT,
        p_titulo VARCHAR(200),
        p_contenido TEXT,
        p_comuna_id BIGINT,
        p_latitud NUMERIC(18,15),
        p_longitud NUMERIC(18,15),
        p_categorias BIGINT[],
        p_sectores BIGINT[],
        p_rutas BIGINT[],
        OUT p_post_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
        v_categoria_id BIGINT;
        v_sector_id BIGINT;
        v_ruta_id BIGINT;
    BEGIN
        -- Validar que no exista el titulo en un post existente
        if exists (
          select 1 from posts
          where titulo = p_titulo
        ) then
          raise exception 'El Titulo ya existe en un Post';
        end if;

        -- Validar que no exista el contenido en un post existente
        if exists (
          select 1 from posts
          where contenido = p_contenido
        ) then
          raise exception 'El Contenido ya existe en un Post';
        end if;

        -- Insertar post y devolver el ID
        INSERT INTO posts (
            titulo, contenido, usuario_id, comuna_id, latitud, longitud, fecha_creacion
        )
        VALUES (
            p_titulo, p_contenido, p_usuario_id, p_comuna_id, p_latitud, p_longitud, CURRENT_TIMESTAMP
        )
        RETURNING id INTO p_post_id;

        -- Asociar categorías
        IF p_categorias IS NOT NULL THEN
            FOREACH v_categoria_id IN ARRAY p_categorias LOOP
                IF NOT EXISTS (SELECT 1 FROM categorias WHERE id = v_categoria_id) THEN
                    RAISE EXCEPTION 'Categoría no encontrada: %', v_categoria_id;
                END IF;
                INSERT INTO posts_categorias (post_id, categoria_id)
                VALUES (p_post_id, v_categoria_id);
            END LOOP;
        END IF;

        -- Asociar sectores
        IF p_sectores IS NOT NULL THEN
            FOREACH v_sector_id IN ARRAY p_sectores LOOP
                IF NOT EXISTS (SELECT 1 FROM sectores WHERE id = v_sector_id) THEN
                    RAISE EXCEPTION 'Sector no encontrado: %', v_sector_id;
                END IF;
                INSERT INTO posts_sectores (post_id, sector_id)
                VALUES (p_post_id, v_sector_id);
            END LOOP;
        END IF;

        -- Asociar rutas
        IF p_rutas IS NOT NULL THEN
            FOREACH v_ruta_id IN ARRAY p_rutas LOOP
                IF NOT EXISTS (
                    SELECT 1 FROM rutas WHERE id = v_ruta_id AND (privacidad = 'publica' OR usuario_id = p_usuario_id)
                ) THEN
                    RAISE EXCEPTION 'Ruta no encontrada o no accesible: %', v_ruta_id;
                END IF;
                INSERT INTO posts_rutas (post_id, ruta_id)
                VALUES (p_post_id, v_ruta_id);
            END LOOP;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al crear post: %', SQLERRM;
    END;
    $$;
  `;

  await sql`
    CREATE OR REPLACE PROCEDURE actualizar_post(
        p_post_id BIGINT,
        p_usuario_id BIGINT,
        p_titulo VARCHAR(255),
        p_contenido TEXT,
        p_comuna_id BIGINT,
        p_latitud NUMERIC(18,15),
        p_longitud NUMERIC(18,15),
        p_categorias BIGINT[],
        p_sectores BIGINT[],
        p_rutas BIGINT[]
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
        v_categoria_id BIGINT;
        v_sector_id BIGINT;
        v_ruta_id BIGINT;
    BEGIN
        -- Validar que el post existe
        IF NOT EXISTS (SELECT 1 FROM posts WHERE id = p_post_id) THEN
            RAISE EXCEPTION 'Post no encontrado: %', p_post_id;
        END IF;

        -- Validar que el usuario es el creador del post
        IF NOT EXISTS (SELECT 1 FROM posts WHERE id = p_post_id AND usuario_id = p_usuario_id) THEN
            RAISE EXCEPTION 'Usuario no autorizado para actualizar este post: %', p_usuario_id;
        END IF;

        -- Validar sectores
        IF p_sectores IS NOT NULL THEN
            FOREACH v_sector_id IN ARRAY p_sectores
            LOOP
                IF NOT EXISTS (SELECT 1 FROM sectores WHERE id = v_sector_id) THEN
                    RAISE EXCEPTION 'Sector no encontrado: %', v_sector_id;
                END IF;
            END LOOP;
        END IF;

        -- Validar rutas
        IF p_rutas IS NOT NULL THEN
            FOREACH v_ruta_id IN ARRAY p_rutas
            LOOP
                IF NOT EXISTS (SELECT 1 FROM rutas WHERE id = v_ruta_id) THEN
                    RAISE EXCEPTION 'Ruta no encontrada: %', v_ruta_id;
                END IF;
                IF NOT EXISTS (
                    SELECT 1 FROM rutas 
                    WHERE id = v_ruta_id 
                    AND (privacidad = 'publica' OR usuario_id = p_usuario_id)
                ) THEN
                    RAISE EXCEPTION 'No tienes permiso para asociar la ruta: %', v_ruta_id;
                END IF;
            END LOOP;
        END IF;


        -- Validar que no exista el titulo en un post existente
        if exists (
          select 1 from posts
          where titulo = p_titulo
        ) then
          raise exception 'El Titulo ya existe en un Post';
        end if;

        -- Validar que no exista el contenido en un post existente
        if exists (
          select 1 from posts
          where contenido = p_contenido
        ) then
          raise exception 'El Contenido ya existe en un Post';
        end if;

        -- Actualizar el post
        UPDATE posts
        SET usuario_id = p_usuario_id,
            titulo = p_titulo,
            contenido = p_contenido,
            comuna_id = p_comuna_id,
            latitud = p_latitud,
            longitud = p_longitud,
            lastedit = CURRENT_TIMESTAMP
        WHERE id = p_post_id;

        -- Eliminar asociaciones existentes
        DELETE FROM posts_categorias WHERE post_id = p_post_id;
        DELETE FROM posts_sectores WHERE post_id = p_post_id;
        DELETE FROM posts_rutas WHERE post_id = p_post_id;

        -- Insertar nuevas asociaciones de categorías
        IF p_categorias IS NOT NULL THEN
            INSERT INTO posts_categorias (post_id, categoria_id)
            SELECT p_post_id, unnest(p_categorias);
        END IF;

        -- Insertar nuevas asociaciones de sectores
        IF p_sectores IS NOT NULL THEN
            INSERT INTO posts_sectores (post_id, sector_id)
            SELECT p_post_id, unnest(p_sectores);
        END IF;

        -- Insertar nuevas asociaciones de rutas
        IF p_rutas IS NOT NULL THEN
            INSERT INTO posts_rutas (post_id, ruta_id)
            SELECT p_post_id, unnest(p_rutas);
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al Actualizar Post: %', SQLERRM;
    END;
    $$;
  `;

  await sql`
    CREATE OR REPLACE PROCEDURE eliminar_post(
        p_post_id BIGINT,
        p_usuario_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
        v_sector_id BIGINT;
        v_ruta_id BIGINT;
    BEGIN
      -- Validar usuario y sesión activa
        IF NOT EXISTS (
            SELECT 1 FROM sesiones
            WHERE usuario_id = p_usuario_id AND estado = 'activa' AND cierre_sesion IS NULL
        ) THEN
            RAISE EXCEPTION 'Usuario no autenticado o sin sesión activa';
        END IF;

        -- Validar que el post existe y pertenece al usuario
        IF NOT EXISTS (SELECT 1 FROM posts WHERE id = p_post_id AND usuario_id = p_usuario_id) THEN
          RAISE EXCEPTION 'Post no encontrado o no pertenece al usuario: %', p_post_id;
        END IF;

        -- Eliminar sectores asociados
        FOR v_sector_id IN
          SELECT sector_id FROM posts_sectores WHERE post_id = p_post_id
        LOOP
          CALL eliminar_sector(v_sector_id, p_usuario_id);
        END LOOP;

        -- Eliminar rutas asociadas
        FOR v_ruta_id IN
          SELECT ruta_id FROM posts_rutas WHERE post_id = p_post_id
        LOOP
          CALL eliminar_ruta(v_ruta_id, p_usuario_id);
        END LOOP;

        -- Eliminar el post (las relaciones se eliminan automáticamente con ON DELETE CASCADE)
        DELETE FROM posts WHERE id = p_post_id;

    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al Eliminar Post: %', SQLERRM;
    END;
    $$
  `;
  console.log("Creacion Procedimientos Post ..... OK");
}


//========================================================================================================================================================
export async function createComentarioProcedures() {
  await sql`
    CREATE OR REPLACE PROCEDURE crear_comentario(
        p_usuario_id BIGINT,
        p_post_id BIGINT,
        p_contenido TEXT,
        OUT p_comentario_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        -- Validar que el post existe
        IF NOT EXISTS (SELECT 1 FROM posts WHERE id = p_post_id) THEN
            RAISE EXCEPTION 'Post no encontrado: %', p_post_id;
        END IF;

        -- Validar que el contenido no sea vacío
        IF p_contenido IS NULL OR p_contenido = '' THEN
            RAISE EXCEPTION 'El contenido del comentario no puede ser vacío';
        END IF;

        -- Validar que no exista el contenido en un comentario existente
        if exists (
          select 1 from comentarios
          where contenido = p_contenido
        ) then
          raise exception 'El contenido ya existe en un Comentario';
        end if;

        -- Insertar el comentario y devolver el ID
        INSERT INTO comentarios (usuario_id, post_id, contenido, fecha_creacion)
        VALUES (p_usuario_id, p_post_id, p_contenido, CURRENT_TIMESTAMP)
        RETURNING id INTO p_comentario_id;

    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al Crear Comentario: %', SQLERRM;
    END;
    $$;
  `;

  await sql`
    CREATE OR REPLACE PROCEDURE actualizar_comentario(
        p_comentario_id BIGINT,
        p_usuario_id BIGINT,
        p_contenido TEXT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        -- Validar que el comentario existe
        IF NOT EXISTS (SELECT 1 FROM comentarios WHERE id = p_comentario_id) THEN
            RAISE EXCEPTION 'Comentario no encontrado: %', p_comentario_id;
        END IF;

        -- Validar que el usuario es el creador del comentario
        IF NOT EXISTS (SELECT 1 FROM comentarios WHERE id = p_comentario_id AND usuario_id = p_usuario_id) THEN
            RAISE EXCEPTION 'Usuario no autorizado para actualizar este comentario';
        END IF;

        -- Validar que el contenido no sea vacío
        IF p_contenido IS NULL OR p_contenido = '' THEN
            RAISE EXCEPTION 'El contenido del comentario no puede ser vacío';
        END IF;

        -- Validar que no exista el contenido en un comentario existente
        if exists (
          select 1 from comentarios
          where contenido = p_contenido
        ) then
          raise exception 'El contenido ya existe en un Comentario';
        end if;

        -- Actualizar el comentario
        UPDATE comentarios
        SET contenido = p_contenido,
            lastedit = CURRENT_TIMESTAMP
        WHERE id = p_comentario_id;

    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al Actualizar Comentario: %', SQLERRM;
    END;
    $$;
  `;

  await sql`
    CREATE OR REPLACE PROCEDURE eliminar_comentario(
        p_comentario_id BIGINT,
        p_usuario_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    DECLARE
        v_post_usuario_id BIGINT;
    BEGIN
        -- Validar que el comentario existe
        IF NOT EXISTS (SELECT 1 FROM comentarios WHERE id = p_comentario_id) THEN
            RAISE EXCEPTION 'Comentario no encontrado: %', p_comentario_id;
        END IF;

        -- Obtener el usuario creador del post asociado
        SELECT p.usuario_id INTO v_post_usuario_id
        FROM posts p
        JOIN comentarios c ON p.id = c.post_id
        WHERE c.id = p_comentario_id;

        -- Verificar permisos: usuario creador del comentario o del post
        IF NOT EXISTS (
            SELECT 1 FROM comentarios
            WHERE id = p_comentario_id
            AND (usuario_id = p_usuario_id OR v_post_usuario_id = p_usuario_id)
        ) THEN
            RAISE EXCEPTION 'Usuario no autorizado para eliminar este comentario';
        END IF;

        -- Eliminar el comentario
        DELETE FROM comentarios WHERE id = p_comentario_id;

    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al eliminar Comentario: %', SQLERRM;
    END;
    $$;
  `;
  console.log("Creacion Procedimientos Comentarios ..... OK");
}

//========================================================================================================================================================
export async function createValoracionProcedures() {
  await sql`
    CREATE OR REPLACE PROCEDURE crear_valoracion(
        p_usuario_id BIGINT,
        p_post_id BIGINT,
        p_valor INT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        -- Validar que el post existe
        IF NOT EXISTS (SELECT 1 FROM posts WHERE id = p_post_id) THEN
            RAISE EXCEPTION 'Post no encontrado: %', p_post_id;
        END IF;

        -- Validar que el valor esté entre 1 y 5
        IF p_valor < 1 OR p_valor > 5 THEN
            RAISE EXCEPTION 'El valor de la valoración debe estar entre 1 y 5: %', p_valor;
        END IF;

        -- Validar que el usuario no haya valorado ya el post
        IF EXISTS (SELECT 1 FROM valoraciones WHERE usuario_id = p_usuario_id AND post_id = p_post_id) THEN
            RAISE EXCEPTION 'El usuario ya ha valorado este post';
        END IF;

        -- Insertar la valoración
        INSERT INTO valoraciones (usuario_id, post_id, valor, fecha_creacion)
        VALUES (p_usuario_id, p_post_id, p_valor, CURRENT_TIMESTAMP);

    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al Crear Valoracion: %', SQLERRM;
    END;
    $$;
  `;

  await sql`
    CREATE OR REPLACE PROCEDURE actualizar_valoracion(
        p_usuario_id BIGINT,
        p_post_id BIGINT,
        p_valor INT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        -- Validar que la valoración existe
        IF NOT EXISTS (SELECT 1 FROM valoraciones WHERE usuario_id = p_usuario_id AND post_id = p_post_id) THEN
            RAISE EXCEPTION 'Valoración no encontrada para el usuario: % y post: %', p_usuario_id, p_post_id;
        END IF;

        -- Validar que el valor esté entre 1 y 5
        IF p_valor < 1 OR p_valor > 5 THEN
            RAISE EXCEPTION 'El valor de la valoración debe estar entre 1 y 5: %', p_valor;
        END IF;

        -- Actualizar la valoración
        UPDATE valoraciones
        SET valor = p_valor,
            lastedit = CURRENT_TIMESTAMP
        WHERE usuario_id = p_usuario_id AND post_id = p_post_id;

    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al Actualizar Valoracion: %', SQLERRM;
    END;
    $$;
  `;

  await sql`
    CREATE OR REPLACE PROCEDURE eliminar_valoracion(
        p_usuario_id BIGINT,
        p_post_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        -- Validar que la valoración existe
        IF NOT EXISTS (SELECT 1 FROM valoraciones WHERE usuario_id = p_usuario_id AND post_id = p_post_id) THEN
            RAISE EXCEPTION 'Valoración no encontrada para el usuario: % y post: %', p_usuario_id, p_post_id;
        END IF;

        -- Eliminar la valoración
        DELETE FROM valoraciones WHERE usuario_id = p_usuario_id AND post_id = p_post_id;

    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al Eliminar Valoracion: %', SQLERRM;
    END;
    $$;
  `;
  console.log("Creacion Procedimientos Valoraciones ..... OK");
}

//========================================================================================================================================================
export async function createMeGustaProcedures() {
  await sql`
    CREATE OR REPLACE PROCEDURE crear_me_gusta(
        p_usuario_id BIGINT,
        p_post_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        -- Validar que el post existe
        IF NOT EXISTS (SELECT 1 FROM posts WHERE id = p_post_id) THEN
            RAISE EXCEPTION 'Post no encontrado: %', p_post_id;
        END IF;

        -- Validar que el usuario no haya dado "me gusta" ya
        IF EXISTS (SELECT 1 FROM me_gusta WHERE usuario_id = p_usuario_id AND post_id = p_post_id) THEN
            RAISE EXCEPTION 'El usuario ya ha dado "me gusta" a este post';
        END IF;

        -- Insertar el "me gusta"
        INSERT INTO me_gusta (usuario_id, post_id, fecha_creacion)
        VALUES (p_usuario_id, p_post_id, CURRENT_TIMESTAMP);

    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al Crear Me_gusta: %', SQLERRM;
    END;
    $$;
  `;

  await sql`
    CREATE OR REPLACE PROCEDURE eliminar_me_gusta(
        p_usuario_id BIGINT,
        p_post_id BIGINT
    )
    LANGUAGE plpgsql
    AS $$
    BEGIN
        -- Validar que el "me gusta" existe
        IF NOT EXISTS (SELECT 1 FROM me_gusta WHERE usuario_id = p_usuario_id AND post_id = p_post_id) THEN
            RAISE EXCEPTION 'Me gusta no encontrado para el usuario: % y post: %', p_usuario_id, p_post_id;
        END IF;

        -- Eliminar el "me gusta"
        DELETE FROM me_gusta WHERE usuario_id = p_usuario_id AND post_id = p_post_id;

    EXCEPTION
        WHEN OTHERS THEN
            -- Revertir transacción en caso de error
            ROLLBACK;
            RAISE EXCEPTION 'Error al Eliminar Me_gusta: %', SQLERRM;
    END;
    $$;
  `;
  console.log("Creacion Procedimientos Megusta ..... OK");
}


