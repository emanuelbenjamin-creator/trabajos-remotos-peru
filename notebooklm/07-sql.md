# Clase: SQL y bases de datos

Curso: WorkJob Clases, preparación para trabajos remotos desde Perú en automatización con IA. Semana 2 del plan.
Público: personas que saben usar n8n y quieren conseguir trabajo remoto en automatización, LLMs, RAG y agentes de IA. Tienen inglés básico.
Resumen: Consultar, unir y resumir datos con SQL en Postgres y Supabase. La base de reportes, CRMs y RAG.

## Introducción

SQL es el lenguaje para hablar con bases de datos relacionales: tablas con filas y columnas, como una hoja de cálculo pero con reglas, millones de filas y muchas personas usándola a la vez. Casi toda empresa guarda sus clientes, ventas y pedidos en una base así.

Aparece en cerca de una de cada cuatro ofertas del panel y es de las habilidades más transversales: la piden en ingeniería, en datos, en IA y también en puestos de operaciones y marketing. Además, en este plan la necesitas para RAG: Supabase con pgvector guarda tus documentos y sus embeddings en Postgres.

En estas 8 sesiones vas desde tu primera consulta hasta conectar Postgres con n8n y guardar los resultados de tus automatizaciones.

## Objetivos

- Escribir consultas con SELECT, WHERE, ORDER BY y LIMIT.
- Resumir datos con GROUP BY y funciones de agregación.
- Unir tablas con JOIN.
- Crear tablas, insertar, actualizar y borrar datos con cuidado.
- Diseñar un modelo de datos simple con claves primarias y foráneas.
- Usar Supabase y conectarlo con n8n.
- Escribir consultas más avanzadas con subconsultas, CTE y funciones de ventana.

## Sesión 1: Bases de datos relacionales y tu primer SELECT (45 minutos)

Una base de datos relacional guarda datos en tablas: cada fila es un registro (un cliente) y cada columna un atributo (nombre, email). Las tablas se relacionan entre sí: un pedido pertenece a un cliente.

SQL se lee casi en inglés: SELECT nombre, email FROM clientes WHERE pais = 'Perú' ORDER BY nombre LIMIT 10;. Seleccionas columnas, de una tabla, con una condición, en un orden, hasta un límite.

Postgres, MySQL, SQL Server y SQLite son motores distintos, pero el SQL básico es igual en todos. Aprende con Postgres: es el más usado en proyectos nuevos y el que usa Supabase.

Conceptos clave:
- Tablas, filas y columnas
- SELECT ... FROM ... WHERE
- ORDER BY y LIMIT
- Postgres como estándar

Ejercicio práctico: Haz las lecciones 1 a 4 de SQLBolt.

Preguntas frecuentes:
- Pregunta: ¿SQL distingue mayúsculas?
  Respuesta: Las palabras clave no (select = SELECT), pero por convención se escriben en mayúsculas. Los textos dentro de comillas sí distinguen.
- Pregunta: ¿Comillas simples o dobles?
  Respuesta: Simples para textos ('Perú'). En Postgres las dobles son para nombres de columnas o tablas con mayúsculas o espacios.
- Pregunta: ¿SELECT * está mal?
  Respuesta: Para explorar está bien. En consultas de producción, pide solo las columnas que necesitas: es más rápido y claro.

## Sesión 2: Filtros avanzados y valores nulos (40 minutos)

WHERE combina condiciones con AND, OR y NOT. IN ('Perú', 'Chile') compara contra una lista, BETWEEN 100 AND 500 contra un rango y LIKE '%gmail.com' busca patrones (en Postgres, ILIKE ignora mayúsculas).

NULL significa «sin valor» y es especial: no es igual a nada, ni siquiera a otro NULL. Por eso se compara con IS NULL o IS NOT NULL, nunca con = NULL. COALESCE(telefono, 'sin teléfono') reemplaza nulos al mostrar.

DISTINCT quita duplicados de los resultados. Con estas piezas resuelves la mayoría de búsquedas que te pedirá un jefe o un cliente.

Conceptos clave:
- AND, OR, IN, BETWEEN
- LIKE e ILIKE
- IS NULL y COALESCE
- DISTINCT

Ejercicio práctico: Termina las lecciones 5 a 8 de SQLBolt y escribe una consulta que encuentre clientes sin teléfono con correo de Gmail.

Preguntas frecuentes:
- Pregunta: ¿Por qué WHERE telefono = NULL no devuelve nada?
  Respuesta: Porque cualquier comparación con NULL da «desconocido», no verdadero. Usa IS NULL.
- Pregunta: ¿Qué significa % en LIKE?
  Respuesta: Cualquier cantidad de caracteres. _ representa exactamente uno.
- Pregunta: ¿Cómo combino AND y OR sin errores?
  Respuesta: Usa paréntesis: WHERE pais = 'Perú' AND (plan = 'pro' OR plan = 'empresa').

## Sesión 3: Agregar y agrupar: COUNT, SUM y GROUP BY (50 minutos)

Las funciones de agregación resumen muchas filas en un número: COUNT(*) cuenta, SUM(total) suma, AVG promedia, MIN y MAX buscan extremos.

GROUP BY las aplica por grupo: SELECT pais, COUNT(*) FROM clientes GROUP BY pais; da cuántos clientes hay por país. Es exactamente una tabla dinámica de Excel escrita en SQL.

Para filtrar grupos se usa HAVING, no WHERE: HAVING COUNT(*) > 10 deja solo los países con más de 10 clientes. Regla: WHERE filtra filas antes de agrupar; HAVING filtra grupos después.

Conceptos clave:
- COUNT, SUM, AVG, MIN, MAX
- GROUP BY = tabla dinámica
- HAVING vs WHERE
- Agrupar por fecha

Ejercicio práctico: Carga la base Chinook en Supabase o usa SQLZoo y calcula: ventas totales por país, los 5 clientes que más compraron y el ticket promedio por mes.

Preguntas frecuentes:
- Pregunta: ¿Por qué me da error si selecciono una columna que no está en GROUP BY?
  Respuesta: Porque cada grupo tiene muchas filas y SQL no sabe cuál valor mostrar. Agrega la columna al GROUP BY o aplícale una función de agregación.
- Pregunta: ¿COUNT(*) y COUNT(columna) son iguales?
  Respuesta: No. COUNT(*) cuenta filas; COUNT(columna) cuenta solo las que no son NULL en esa columna.
- Pregunta: ¿Cómo agrupo por mes una fecha?
  Respuesta: En Postgres, DATE_TRUNC('month', fecha) convierte cada fecha al primer día de su mes; agrupa por eso.

## Sesión 4: JOIN: unir tablas (55 minutos)

Los datos se reparten en tablas para no repetirlos: los clientes en una, los pedidos en otra con una columna cliente_id. JOIN las une: SELECT c.nombre, p.total FROM pedidos p JOIN clientes c ON c.id = p.cliente_id;.

INNER JOIN (o solo JOIN) deja las filas que coinciden en ambas tablas. LEFT JOIN deja todas las de la izquierda aunque no tengan pareja (verás NULL en las columnas de la derecha); sirve para preguntas como «clientes que nunca compraron».

Los alias (c, p) acortan las consultas. Puedes encadenar varios JOIN para recorrer clientes → pedidos → productos.

Conceptos clave:
- Clave foránea (cliente_id)
- INNER JOIN
- LEFT JOIN y los NULL
- Alias de tabla

Ejercicio práctico: En Chinook: lista cada canción con su álbum y artista, y encuentra los clientes que no tienen ninguna factura usando LEFT JOIN.

Preguntas frecuentes:
- Pregunta: ¿Cómo encuentro clientes sin pedidos?
  Respuesta: LEFT JOIN pedidos y WHERE pedidos.id IS NULL.
- Pregunta: Mi JOIN devuelve muchas más filas de las esperadas. ¿Por qué?
  Respuesta: Porque la relación es de uno a muchos (un cliente, varios pedidos) o faltó una condición en el ON. Revisa qué representa cada fila del resultado.
- Pregunta: ¿Qué es un FULL JOIN?
  Respuesta: Devuelve todas las filas de ambas tablas, coincidan o no. Se usa poco; INNER y LEFT cubren casi todo.

## Sesión 5: Crear y modificar: CREATE, INSERT, UPDATE, DELETE (45 minutos)

CREATE TABLE leads (id serial primary key, nombre text not null, email text unique, creado timestamptz default now()); crea una tabla con reglas: tipos, obligatorios, únicos y valores por defecto.

INSERT INTO leads (nombre, email) VALUES ('Ana', 'ana@x.com'); agrega filas. UPDATE leads SET estado = 'contactado' WHERE id = 5; modifica. DELETE FROM leads WHERE id = 5; borra.

La regla que evita desastres: nunca hagas UPDATE o DELETE sin WHERE, y antes de ejecutarlo corre un SELECT con el mismo WHERE para ver qué filas vas a tocar. En producción, trabaja dentro de una transacción (BEGIN ... COMMIT) para poder deshacer con ROLLBACK.

Conceptos clave:
- Tipos y restricciones
- INSERT, UPDATE, DELETE
- SELECT antes de modificar
- Transacciones

Ejercicio práctico: En Supabase crea una tabla solicitudes para guardar los resultados de tu Proyecto 1 (fecha, texto, categoría, prioridad, resumen, requiere_humano) e inserta 5 filas de prueba.

Preguntas frecuentes:
- Pregunta: ¿Qué pasa si ejecuto DELETE FROM leads; sin WHERE?
  Respuesta: Borra todas las filas. Por eso se revisa con SELECT primero y se trabaja con copias de seguridad.
- Pregunta: ¿Qué es una clave primaria?
  Respuesta: La columna que identifica cada fila de forma única, normalmente id. No puede repetirse ni ser NULL.
- Pregunta: ¿timestamptz o timestamp?
  Respuesta: timestamptz guarda la zona horaria correctamente. Úsalo siempre para fechas con hora.

## Sesión 6: Diseñar un modelo de datos simple (45 minutos)

Diseñar es decidir qué tablas existen y cómo se relacionan. Regla práctica: cada «cosa» del negocio es una tabla (clientes, productos, pedidos) y cada dato se guarda en un solo lugar. Si te ves copiando el nombre del cliente en cada pedido, falta una tabla.

Las relaciones se expresan con claves foráneas: pedidos.cliente_id REFERENCES clientes(id). Así la base impide pedidos de clientes inexistentes. Las relaciones de muchos a muchos (pedidos y productos) necesitan una tabla intermedia (pedido_items).

Los índices aceleran búsquedas frecuentes, como por email. Dibuja tu modelo antes de crearlo: un diagrama simple evita rehacer tablas después.

Conceptos clave:
- Una cosa del negocio = una tabla
- Claves foráneas
- Tabla intermedia para muchos a muchos
- Índices

Ejercicio práctico: Dibuja (en papel, Figma o dbdiagram) el modelo de una pequeña agencia: clientes, proyectos, tareas y horas trabajadas. Créalo en Supabase con sus claves foráneas.

Preguntas frecuentes:
- Pregunta: ¿Qué es normalizar?
  Respuesta: Organizar las tablas para no repetir datos. Evita inconsistencias, como un cliente con dos direcciones distintas en dos pedidos.
- Pregunta: ¿Siempre conviene normalizar al máximo?
  Respuesta: No. Para reportes a veces se duplican datos a propósito para consultar más rápido. Para datos operativos, normaliza.
- Pregunta: ¿Cuándo creo un índice?
  Respuesta: En columnas que usas mucho para buscar o unir (email, cliente_id). No en todas: cada índice hace más lentas las escrituras.

## Sesión 7: Supabase y n8n: tu base en producción (50 minutos)

Supabase te da Postgres en la nube con un editor de tablas, un editor SQL, una API REST automática y autenticación. El plan gratuito alcanza para proyectos de portafolio.

Desde n8n puedes conectarte con el nodo Postgres (usando los datos de conexión que te da Supabase) o con el nodo Supabase. Así tus flujos guardan resultados en una base real en lugar de una hoja de cálculo: más rápido, con reglas y consultable con SQL.

Activa Row Level Security (RLS) en las tablas que exponga la API pública y nunca uses la clave service_role en el navegador: es la llave maestra. En n8n, guárdala como credencial.

Conceptos clave:
- Postgres administrado
- Nodo Postgres o Supabase en n8n
- Row Level Security
- anon vs service_role

Ejercicio práctico: Cambia el destino de tu Proyecto 1: que además de Google Sheets guarde cada solicitud en la tabla solicitudes de Supabase. Luego consulta con SQL cuántas hubo por categoría.

Preguntas frecuentes:
- Pregunta: ¿Sheets o base de datos para mis automatizaciones?
  Respuesta: Sheets para cosas pequeñas que personas no técnicas editan. Base de datos cuando hay volumen, varias tablas relacionadas o necesitas reglas e historial.
- Pregunta: ¿Qué es RLS?
  Respuesta: Reglas en Postgres que limitan qué filas puede ver o modificar cada usuario. Sin ellas, la API pública podría exponer toda la tabla.
- Pregunta: ¿El plan gratuito de Supabase se pausa?
  Respuesta: Los proyectos gratuitos sin actividad durante un tiempo pueden pausarse; se reactivan desde el panel. Revisa las condiciones vigentes.

## Sesión 8: SQL avanzado: subconsultas, CTE y funciones de ventana (50 minutos)

Una subconsulta es una consulta dentro de otra: WHERE total > (SELECT AVG(total) FROM pedidos). Los CTE hacen lo mismo con más claridad: WITH ventas_mes AS (SELECT ...) SELECT * FROM ventas_mes WHERE .... Divide problemas complejos en pasos con nombre.

Las funciones de ventana calculan sobre grupos sin colapsar las filas: ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY fecha DESC) numera los pedidos de cada cliente del más reciente al más antiguo; filtrando por 1 obtienes el último pedido de cada uno. También sirven para acumulados y comparaciones con el mes anterior.

Estas tres herramientas aparecen en entrevistas técnicas de datos y en reportes reales.

Conceptos clave:
- Subconsultas
- CTE con WITH
- ROW_NUMBER() OVER (PARTITION BY ...)
- Acumulados y comparaciones

Ejercicio práctico: En Chinook: obtén la última factura de cada cliente con ROW_NUMBER, y con un CTE calcula las ventas por mes y la variación respecto al mes anterior usando LAG.

Preguntas frecuentes:
- Pregunta: ¿CTE o subconsulta?
  Respuesta: Dan el mismo resultado en general. El CTE es más legible cuando hay varios pasos.
- Pregunta: ¿Qué diferencia hay entre GROUP BY y una función de ventana?
  Respuesta: GROUP BY devuelve una fila por grupo; la función de ventana mantiene todas las filas y agrega el cálculo como columna.
- Pregunta: ¿Un LLM puede escribir SQL por mí?
  Respuesta: Sí, y muy bien, si le das el esquema de las tablas. Pero debes entender la consulta para verificar que responde la pregunta correcta.

## Herramientas que se usan

- Supabase: Postgres en la nube con interfaz web, API automática y pgvector para IA. (Gratis con límites · planes de pago)
- SQLBolt: Ejercicios de SQL en el navegador. (Gratis)
- DBeaver: Cliente de escritorio para conectarte a cualquier base de datos. (Gratis)
- n8n (nodo Postgres): Leer y escribir en Postgres desde tus flujos. (Gratis autoalojado)
- Chinook database: Base de datos de ejemplo de una tienda de música para practicar. (Gratis)

## Cursos recomendados

- SQLBolt (SQLBolt, Inglés, gratis): Lecciones cortas e interactivas, ideal para empezar hoy.
- Kaggle Learn: Intro to SQL y Advanced SQL (Kaggle, Inglés, gratis): SQL sobre datos reales en BigQuery, con certificado.
- SQLZoo (SQLZoo, Inglés, gratis): Ejercicios graduados con autocorrección.
- PostgreSQL Tutorial (Neon, Inglés, gratis): Referencia práctica de Postgres con ejemplos.
- Documentación de Supabase: base de datos (Supabase, Inglés, gratis): Cómo crear tablas, permisos y conectarte.
- The Complete SQL Bootcamp (Jose Portilla) (Udemy, Inglés, de pago): Curso de PostgreSQL muy valorado, de cero a intermedio.
- Introduction to Structured Query Language (Michigan) (Coursera, Inglés, de pago): Fundamentos de SQL con certificado universitario.

## Repositorios para practicar

- lerocha/chinook-database: Base de datos de ejemplo para practicar consultas reales.
- WebDevSimplified/Learn-SQL: Ejemplos de consultas SQL del curso de Web Dev Simplified.
- supabase/supabase: El código de Supabase y ejemplos de uso.
- pgvector/pgvector: La extensión de Postgres para vectores que usarás en RAG.
