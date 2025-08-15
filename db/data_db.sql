
INSERT INTO regiones (id, nombre, latitud, longitud) VALUES
    (1, 'Región de Arica y Parinacota', -18.477778, -70.318056),
    (2, 'Región de Tarapacá', -20.2141, -70.1524),
    (3, 'Región de Antofagasta', -23.646389, -70.398056),
    (4, 'Región de Atacama', -27.3665, -70.3323),
    (5, 'Región de Coquimbo', -29.9027, -71.252),
    (6, 'Región de Valparaíso', -33.046111, -71.619722),
    (7, 'Región Metropolitana de Santiago', -33.45, -70.666667),
    (8, 'Región del Libertador General Bernardo O''Higgins', -34.165389, -70.739806),
    (9, 'Región del Maule', -35.426944, -71.665556),
    (10, 'Región de Ñuble', -36.6067, -72.1033),
    (11, 'Región del Biobío', -36.826944, -73.050278),
    (12, 'Región de La Araucanía', -38.7399, -72.5901),
    (13, 'Región de Los Ríos', -39.8142, -73.2459),
    (14, 'Región de Los Lagos', -41.4718, -72.9396),
    (15, 'Región Aysén del General Carlos Ibáñez del Campo', -45.5712, -72.0685),
    (16, 'Región de Magallanes y Antártica Chilena', -53.1625, -70.908056);


INSERT INTO comunas (id, nombre, region_id) VALUES
    (1, 'Arica', 1),
    (2, 'Camarones', 1),
    (3, 'General Lagos', 1),
    (4, 'Putre', 1),
    (5, 'Alto Hospicio', 2),
    (6, 'Iquique', 2),
    (7, 'Camiña', 2),
    (8, 'Colchane', 2),
    (9, 'Huara', 2),
    (10, 'Pica', 2),
    (11, 'Pozo Almonte', 2),
    (12, 'Antofagasta', 3),
    (13, 'Mejillones', 3),
    (14, 'Sierra Gorda', 3),
    (15, 'Taltal', 3),
    (16, 'Calama', 3),
    (17, 'Ollague', 3),
    (18, 'San Pedro de Atacama', 3),
    (19, 'María Elena', 3),
    (20, 'Tocopilla', 3),
    (21, 'Chañaral', 4),
    (22, 'Diego de Almagro', 4),
    (23, 'Caldera', 4),
    (24, 'Copiapó', 4),
    (25, 'Tierra Amarilla', 4),
    (26, 'Alto del Carmen', 4),
    (27, 'Freirina', 4),
    (28, 'Huasco', 4),
    (29, 'Vallenar', 4),
    (30, 'Canela', 5),
    (31, 'Illapel', 5),
    (32, 'Los Vilos', 5),
    (33, 'Salamanca', 5),
    (34, 'Andacollo', 5),
    (35, 'Coquimbo', 5),
    (36, 'La Higuera', 5),
    (37, 'La Serena', 5),
    (38, 'Paihuaco', 5),
    (39, 'Vicuña', 5),
    (40, 'Combarbalá', 5),
    (41, 'Monte Patria', 5),
    (42, 'Ovalle', 5),
    (43, 'Punitaqui', 5),
    (44, 'Río Hurtado', 5),
    (45, 'Isla de Pascua', 6),
    (46, 'Calle Larga', 6),
    (47, 'Los Andes', 6),
    (48, 'Rinconada', 6),
    (49, 'San Esteban', 6),
    (50, 'La Ligua', 6),
    (51, 'Papudo', 6),
    (52, 'Petorca', 6),
    (53, 'Zapallar', 6),
    (54, 'Hijuelas', 6),
    (55, 'La Calera', 6),
    (56, 'La Cruz', 6),
    (57, 'Limache', 6),
    (58, 'Nogales', 6),
    (59, 'Olmue', 6),
    (60, 'Quillota', 6),
    (61, 'Algarrobo', 6),
    (62, 'Cartagena', 6),
    (63, 'El Quisco', 6),
    (64, 'El Tabo', 6),
    (65, 'San Antonio', 6),
    (66, 'Santo Domingo', 6),
    (67, 'Catemu', 6),
    (68, 'Llaillay', 6),
    (69, 'Panquehue', 6),
    (70, 'Putaendo', 6),
    (71, 'San Felipe', 6),
    (72, 'Santa María', 6),
    (73, 'Casablanca', 6),
    (74, 'Concón', 6),
    (75, 'Juan Fernández', 6),
    (76, 'Puchuncaví', 6),
    (77, 'Quilpué', 6),
    (78, 'Quintero', 6),
    (79, 'Valparaíso', 6),
    (80, 'Villa Alemana', 6),
    (81, 'Viña del Mar', 6),
    (82, 'Colina', 7),
    (83, 'Lampa', 7),
    (84, 'Tiltil', 7),
    (85, 'Pirque', 7),
    (86, 'Puente Alto', 7),
    (87, 'San José de Maipo', 7),
    (88, 'Buin', 7),
    (89, 'Calera de Tango', 7),
    (90, 'Paine', 7),
    (91, 'San Bernardo', 7),
    (92, 'Alhué', 7),
    (93, 'Curacaví', 7),
    (94, 'María Pinto', 7),
    (95, 'Melipilla', 7),
    (96, 'San Pedro', 7),
    (97, 'Cerrillos', 7),
    (98, 'Cerro Navia', 7),
    (99, 'Conchalí', 7),
    (100, 'El Bosque', 7),
    (101, 'Estación Central', 7),
    (102, 'Huechuraba', 7),
    (103, 'Independencia', 7),
    (104, 'La Cisterna', 7),
    (105, 'La Granja', 7),
    (106, 'La Florida', 7),
    (107, 'La Pintana', 7),
    (108, 'La Reina', 7),
    (109, 'Las Condes', 7),
    (110, 'Lo Barnechea', 7),
    (111, 'Lo Espejo', 7),
    (112, 'Lo Prado', 7),
    (113, 'Macul', 7),
    (114, 'Maipú', 7),
    (115, 'Ñuñoa', 7),
    (116, 'Pedro Aguirre Cerda', 7),
    (117, 'Peñalolén', 7),
    (118, 'Providencia', 7),
    (119, 'Pudahuel', 7),
    (120, 'Quilicura', 7),
    (121, 'Quinta Normal', 7),
    (122, 'Recoleta', 7),
    (123, 'Renca', 7),
    (124, 'San Miguel', 7),
    (125, 'San Joaquín', 7),
    (126, 'San Ramón', 7),
    (127, 'Santiago', 7),
    (128, 'Vitacura', 7),
    (129, 'El Monte', 7),
    (130, 'Isla de Maipo', 7),
    (131, 'Padre Hurtado', 7),
    (132, 'Peñaflor', 7),
    (133, 'Talagante', 7),
    (134, 'Codegua', 8),
    (135, 'Coínco', 8),
    (136, 'Coltauco', 8),
    (137, 'Doñihue', 8),
    (138, 'Graneros', 8),
    (139, 'Las Cabras', 8),
    (140, 'Machalí', 8),
    (141, 'Malloa', 8),
    (142, 'Mostazal', 8),
    (143, 'Olivar', 8),
    (144, 'Peumo', 8),
    (145, 'Pichidegua', 8),
    (146, 'Quinta de Tilcoco', 8),
    (147, 'Rancagua', 8),
    (148, 'Rengo', 8),
    (149, 'Requínoa', 8),
    (150, 'San Vicente de Tagua Tagua', 8),
    (151, 'La Estrella', 8),
    (152, 'Litueche', 8),
    (153, 'Marchihue', 8),
    (154, 'Navidad', 8),
    (155, 'Peredones', 8),
    (156, 'Pichilemu', 8),
    (157, 'Chépica', 8),
    (158, 'Chimbarongo', 8),
    (159, 'Lolol', 8),
    (160, 'Nancagua', 8),
    (161, 'Palmilla', 8),
    (162, 'Peralillo', 8),
    (163, 'Placilla', 8),
    (164, 'Pumanque', 8),
    (165, 'San Fernando', 8),
    (166, 'Santa Cruz', 8),
    (167, 'Cauquenes', 9),
    (168, 'Chanco', 9),
    (169, 'Pelluhue', 9),
    (170, 'Curicó', 9),
    (171, 'Hualañé', 9),
    (172, 'Licantén', 9),
    (173, 'Molina', 9),
    (174, 'Rauco', 9),
    (175, 'Romeral', 9),
    (176, 'Sagrada Familia', 9),
    (177, 'Teno', 9),
    (178, 'Vichuquén', 9),
    (179, 'Colbún', 9),
    (180, 'Linares', 9),
    (181, 'Longaví', 9),
    (182, 'Parral', 9),
    (183, 'Retiro', 9),
    (184, 'San Javier', 9),
    (185, 'Villa Alegre', 9),
    (186, 'Yerbas Buenas', 9),
    (187, 'Constitución', 9),
    (188, 'Curepto', 9),
    (189, 'Empedrado', 9),
    (190, 'Maule', 9),
    (191, 'Pelarco', 9),
    (192, 'Pencahue', 9),
    (193, 'Río Claro', 9),
    (194, 'San Clemente', 9),
    (195, 'San Rafael', 9),
    (196, 'Talca', 9),
    (197, 'Bulnes', 10),
    (198, 'Chillán', 10),
    (199, 'Chillán Viejo', 10),
    (200, 'Cobquecura', 10),
    (201, 'Coelemu', 10),
    (202, 'Coihueco', 10),
    (203, 'El Carmen', 10),
    (204, 'Ninhue', 10),
    (205, 'Ñiquén', 10),
    (206, 'Pemuco', 10),
    (207, 'Pinto', 10),
    (208, 'Portezuelo', 10),
    (209, 'Quirihue', 10),
    (210, 'Ránquil', 10),
    (211, 'Treguaco', 10),
    (212, 'Quillón', 10),
    (213, 'San Carlos', 10),
    (214, 'San Fabián', 10),
    (215, 'San Ignacio', 10),
    (216, 'San Nicolás', 10),
    (217, 'Yungay', 10),
    (218, 'Arauco', 11),
    (219, 'Cañete', 11),
    (220, 'Contulmo', 11),
    (221, 'Curanilahue', 11),
    (222, 'Lebu', 11),
    (223, 'Los Álamos', 11),
    (224, 'Tirúa', 11),
    (225, 'Alto Biobío', 11),
    (226, 'Antuco', 11),
    (227, 'Cabrero', 11),
    (228, 'Laja', 11),
    (229, 'Los Ángeles', 11),
    (230, 'Mulchén', 11),
    (231, 'Nacimiento', 11),
    (232, 'Negrete', 11),
    (233, 'Quilaco', 11),
    (234, 'Quilleco', 11),
    (235, 'San Rosendo', 11),
    (236, 'Santa Bárbara', 11),
    (237, 'Tucapel', 11),
    (238, 'Yumbel', 11),
    (239, 'Chiguayante', 11),
    (240, 'Concepción', 11),
    (241, 'Coronel', 11),
    (242, 'Florida', 11),
    (243, 'Hualpén', 11),
    (244, 'Hualqui', 11),
    (245, 'Lota', 11),
    (246, 'Penco', 11),
    (247, 'San Pedro de La Paz', 11),
    (248, 'Santa Juana', 11),
    (249, 'Talcahuano', 11),
    (250, 'Tomé', 11),
    (251, 'Carahue', 12),
    (252, 'Cholchol', 12),
    (253, 'Cunco', 12),
    (254, 'Curarrehue', 12),
    (255, 'Freire', 12),
    (256, 'Galvarino', 12),
    (257, 'Gorbea', 12),
    (258, 'Lautaro', 12),
    (259, 'Loncoche', 12),
    (260, 'Melipeuco', 12),
    (261, 'Nueva Imperial', 12),
    (262, 'Padre Las Casas', 12),
    (263, 'Perquenco', 12),
    (264, 'Pitrufquén', 12),
    (265, 'Pucón', 12),
    (266, 'Saavedra', 12),
    (267, 'Temuco', 12),
    (268, 'Teodoro Schmidt', 12),
    (269, 'Toltén', 12),
    (270, 'Vilcún', 12),
    (271, 'Villarrica', 12),
    (272, 'Angol', 12),
    (273, 'Collipulli', 12),
    (274, 'Curacautín', 12),
    (275, 'Ercilla', 12),
    (276, 'Lonquimay', 12),
    (277, 'Los Sauces', 12),
    (278, 'Lumaco', 12),
    (279, 'Purén', 12),
    (280, 'Renaico', 12),
    (281, 'Traiguén', 12),
    (282, 'Victoria', 12),
    (283, 'Corral', 13),
    (284, 'Lanco', 13),
    (285, 'Los Lagos', 13),
    (286, 'Máfil', 13),
    (287, 'Mariquina', 13),
    (288, 'Paillaco', 13),
    (289, 'Panguipulli', 13),
    (290, 'Valdivia', 13),
    (291, 'Futrono', 13),
    (292, 'La Unión', 13),
    (293, 'Lago Ranco', 13),
    (294, 'Río Bueno', 13),
    (295, 'Ancud', 14),
    (296, 'Castro', 14),
    (297, 'Chonchi', 14),
    (298, 'Curaco de Vélez', 14),
    (299, 'Dalcahue', 14),
    (300, 'Puqueldón', 14),
    (301, 'Queilén', 14),
    (302, 'Quemchi', 14),
    (303, 'Quellón', 14),
    (304, 'Quinchao', 14),
    (305, 'Calbuco', 14),
    (306, 'Cochamó', 14),
    (307, 'Fresia', 14),
    (308, 'Frutillar', 14),
    (309, 'Llanquihue', 14),
    (310, 'Los Muermos', 14),
    (311, 'Maullín', 14),
    (312, 'Puerto Montt', 14),
    (313, 'Puerto Varas', 14),
    (314, 'Osorno', 14),
    (315, 'Puerto Octay', 14),
    (316, 'Purranque', 14),
    (317, 'Puyehue', 14),
    (318, 'Río Negro', 14),
    (319, 'San Juan de la Costa', 14),
    (320, 'San Pablo', 14),
    (321, 'Chaitén', 14),
    (322, 'Futaleufú', 14),
    (323, 'Hualaihué', 14),
    (324, 'Palena', 14),
    (325, 'Aisén', 15),
    (326, 'Cisnes', 15),
    (327, 'Guaitecas', 15),
    (328, 'Cochrane', 15),
    (329, 'O''Higgins', 15),
    (330, 'Tortel', 15),
    (331, 'Coyhaique', 15),
    (332, 'Lago Verde', 15),
    (333, 'Chile Chico', 15),
    (334, 'Río Ibáñez', 15),
    (335, 'Antártica', 16),
    (336, 'Cabo de Hornos', 16),
    (337, 'Laguna Blanca', 16),
    (338, 'Punta Arenas', 16),
    (339, 'Río Verde', 16),
    (340, 'San Gregorio', 16),
    (341, 'Porvenir', 16),
    (342, 'Primavera', 16),
    (343, 'Timaukel', 16),
    (344, 'Natales', 16),
    (345, 'Torres del Paine', 16),
    (346, 'Cabildo', 6);


insert into categorias values
	(1,'Escalada'),
	(2,'Mountain Bike'),
	(3,'Trekking');



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

--delete from subcategorias;

	
--==================================================================================================================================
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



--======================================================================================================================
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


--==================================================================================================================================
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


--==================================================================================================================================
--==================================================================================================================================
---------------------Subcategorias Dificultades Escalada

-- Tradicional (id = 1)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 1, id FROM dificultad WHERE sistema IN ('Yosemite', 'Francesa', 'British');

-- Deportiva (id = 2)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 2, id FROM dificultad WHERE sistema IN ('Yosemite', 'Francesa');

-- Boulder (id = 3)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 3, id FROM dificultad WHERE sistema IN ('V-Grade', 'Fontainebleau');

-- Alpina (id = 4)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 4, id FROM dificultad WHERE sistema IN ('Yosemite', 'UIAA', 'Francesa', 'Alpine Grade');

-- Hielo (id = 5)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 5, id FROM dificultad WHERE sistema IN ('Water Ice', 'Alpine Ice Grade', 'Alpine Grade');

-- Mixta (Alpina y Hielo) (id = 6)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 6, id FROM dificultad WHERE sistema IN ('Water Ice', 'Alpine Ice Grade', 'Mixed', 'Alpine Grade');

-- Grandes paredes (BigWall) (id = 7)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 7, id FROM dificultad WHERE sistema IN ('Yosemite', 'Francesa', 'Artificial', 'Alpine Grade', 'British');

-- Artificial (id = 8)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 8, id FROM dificultad WHERE sistema IN ('Artificial');

-- Solo integral (id = 9)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 9, id FROM dificultad WHERE sistema IN ('Yosemite', 'Francesa');

-- Psicobloc (id = 10)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 10, id FROM dificultad WHERE sistema IN ('Yosemite', 'Francesa', 'British');

-- Urbana (id = 11)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 11, id FROM dificultad WHERE sistema IN ('Yosemite', 'Francesa', 'V-Grade');

-- Adherencia (id = 12)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 12, id FROM dificultad WHERE sistema IN ('Yosemite', 'Francesa', 'British');

-- Vía ferrata (id = 13)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 13, id FROM dificultad WHERE sistema IN ('Hüsler', 'Klettersteig');


--======================================================================================================================
--------------- Subcategorias Dificultades de MTB


-- MTB - XCO o Cross Country (id = 14)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 14, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');

-- MTB - Enduro (id = 15)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 15, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');

-- MTB - Downhill (id = 16)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 16, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');

-- Dirt Jump (id = 17)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 17, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');

-- Four Cross (4X) / Dual Slalom (id = 18)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 18, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');

-- Freeride (id = 19)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 19, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');

-- Trail / All Mountain (id = 20)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 20, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');

-- Slopestyle (id = 21)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 21, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');

-- Fat Bike (id = 22)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 22, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');

-- Pumptrack (id = 23)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 23, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');

-- BMX (id = 24)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 24, id FROM dificultad WHERE sistema IN ('Tecnica de la pista', 'Resistencia Fisica', 'Terreno', 'Estilo');
	
--==================================================================================================================================
---------------------Subcategorias Dificultades trekking
	

-- Clásico (Senderismo Recreativo) (id = 25)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 25, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');

-- Baja/Media Montaña (Hiking) (id = 26)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 26, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');

-- Alta Montaña (High-Altitude Trekking) (id = 27)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 27, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');

-- Aventura (Expedición) (id = 28)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 28, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');

-- Larga Distancia (Thru-Hiking) (id = 29)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 29, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');

-- Fastpacking (Trekking Ultraligero y Rápido) (id = 30)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 30, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');

-- Nocturno (id = 31)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 31, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');

-- Desierto (id = 32)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 32, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');

-- Invernal (Nieve/Hielo) (id = 33)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 33, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');

-- Acuático (Canyoning/River Trekking) (id = 34)
INSERT INTO subcategoria_dificultad (subcategoria_id, dificultad_id)
SELECT 34, id FROM dificultad WHERE sistema IN ('Tecnica del Terreno', 'Esfuerzo Fisico', 'Condiciones Ambientales', 'Altitud');


	
















