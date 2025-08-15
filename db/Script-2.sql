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





-- Verificar el post
SELECT 
    p.id, p.titulo,  u.displayname AS usuario, c.nombre AS comuna
FROM posts p
JOIN usuarios u ON p.usuario_id = u.id
JOIN comunas c ON p.comuna_id = c.id
WHERE p.id = 1;

-- Verificar sectores asociados
SELECT 
    s.id, s.nombre, s.descripcion, s.latitud, s.longitud, u.displayname AS creador
FROM sectores s
JOIN posts_sectores ps ON s.id = ps.sector_id
JOIN usuarios u ON s.usuario_id = u.id
WHERE ps.post_id = 2;

-- Verificar rutas asociadas
SELECT 
    r.id, r.nombre, r.descripcion, u.nombre AS creador
FROM rutas r
JOIN posts_rutas pr ON r.id = pr.ruta_id
JOIN usuarios u ON r.usuario_id = u.id
WHERE pr.post_id = v_post_id;

-- Verificar waypoints de una ruta
SELECT 
    w.id, w.latitud, w.longitud, w.orden, w.nombre, w.descripcion
FROM waypoints w
WHERE w.ruta_id = v_ruta_id;







