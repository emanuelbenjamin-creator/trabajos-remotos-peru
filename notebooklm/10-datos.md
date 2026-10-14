# Clase: Sheets, Excel y dashboards

Curso: WorkJob Clases, preparación para trabajos remotos desde Perú en automatización con IA. Semana 3 del plan.
Público: personas que saben usar n8n y quieren conseguir trabajo remoto en automatización, LLMs, RAG y agentes de IA. Tienen inglés básico.
Resumen: Fórmulas, tablas dinámicas, limpieza de datos y tableros en Looker Studio o Power BI para mostrar resultados.

## Introducción

Toda automatización termina en alguien que quiere ver números: cuántos leads entraron, cuánto tiempo se ahorró, qué producto vende más. Google Sheets, Excel y las herramientas de dashboards son el idioma común entre tú y el cliente.

Análisis de datos y BI aparece en cerca de una de cada seis ofertas, y Excel o Sheets en una de cada diez, sobre todo en puestos de operaciones, ventas y soporte, que suelen ser más accesibles. Además, un dashboard bien hecho es la mejor forma de mostrar el impacto de tus proyectos en el portafolio.

En estas 8 sesiones aprendes las fórmulas que se usan de verdad, tablas dinámicas, limpieza de datos, y a construir un dashboard en Looker Studio conectado a tus automatizaciones.

## Objetivos

- Usar las fórmulas clave: SI, BUSCARX, SUMAR.SI.CONJUNTO, QUERY, FILTER.
- Limpiar datos desordenados de forma repetible.
- Resumir con tablas dinámicas.
- Elegir el gráfico correcto para cada pregunta.
- Construir un dashboard en Looker Studio conectado a Sheets o Postgres.
- Conocer Power BI y cuándo lo prefieren las empresas.
- Medir y comunicar el impacto de una automatización.

## Sesión 1: Datos bien estructurados: la regla de oro (40 minutos)

La mitad de los problemas con hojas de cálculo vienen de cómo se guardan los datos. Regla de oro: una fila por registro, una columna por atributo, encabezados en la primera fila, sin celdas combinadas, sin totales en medio y sin colores como única forma de marcar información.

Esto se llama datos ordenados (tidy). Así los pueden leer n8n, una tabla dinámica, Looker Studio o pandas sin trabajo extra.

Separa siempre los datos crudos (una hoja que llena la automatización y nadie edita a mano) de los cálculos y reportes (otras hojas que leen de la primera). Es la diferencia entre una planilla que se rompe cada semana y una que funciona años.

Conceptos clave:
- Una fila por registro
- Sin celdas combinadas ni totales intercalados
- Datos crudos separados de reportes
- Formato consistente de fechas y números

Ejercicio práctico: Toma una hoja desordenada (o crea una con ventas mezcladas, totales y celdas combinadas) y reestructúrala en formato ordenado en una hoja nueva.

Preguntas frecuentes:
- Pregunta: ¿Por qué evitar celdas combinadas?
  Respuesta: Porque rompen ordenamientos, filtros, fórmulas y la lectura automática desde n8n o Looker Studio.
- Pregunta: ¿Cómo guardo fechas?
  Respuesta: Como fecha real (no texto), en un formato consistente. Idealmente año-mes-día para que ordenen bien.
- Pregunta: ¿Dónde pongo los totales?
  Respuesta: En una hoja de reporte o una tabla dinámica, no dentro de los datos.

## Sesión 2: Fórmulas esenciales (50 minutos)

Con un puñado de fórmulas resuelves casi todo. SI (IF) decide: =SI(C2>5000; "grande"; "pequeño"). SUMAR.SI.CONJUNTO y CONTAR.SI.CONJUNTO suman o cuentan con varias condiciones. BUSCARX (XLOOKUP) trae datos de otra tabla y reemplaza a BUSCARV con menos errores.

Para textos: CONCATENAR o el operador &, ESPACIOS (TRIM), MAYUSC/MINUSC, IZQUIERDA/DERECHA y DIVIDIR (SPLIT) en Sheets. Para fechas: HOY, MES, AÑO, DIAS.

Los nombres cambian según el idioma de tu hoja y el separador de argumentos puede ser coma o punto y coma según la configuración regional. Aprende los nombres en inglés también: son los que verás en tutoriales y ofertas.

Conceptos clave:
- SI / IF
- SUMAR.SI.CONJUNTO / SUMIFS
- BUSCARX / XLOOKUP
- Funciones de texto y fecha

Ejercicio práctico: Con una tabla de ventas y otra de productos: trae el precio con BUSCARX, calcula el total, clasifica cada venta con SI y suma las ventas por vendedor y mes con SUMAR.SI.CONJUNTO.

Preguntas frecuentes:
- Pregunta: ¿Por qué BUSCARX en vez de BUSCARV?
  Respuesta: Busca en cualquier dirección, no se rompe si insertas columnas y permite un valor si no encuentra nada.
- Pregunta: Mi fórmula da error por las comas. ¿Qué pasa?
  Respuesta: Tu configuración regional usa punto y coma como separador de argumentos. Cambia las comas por punto y coma.
- Pregunta: ¿Cómo evito que se vea #N/A?
  Respuesta: Con SI.ERROR (IFERROR) o con el argumento de «no encontrado» de BUSCARX.

## Sesión 3: QUERY, FILTER y fórmulas de matriz en Sheets (45 minutos)

Google Sheets tiene una joya: QUERY permite escribir consultas tipo SQL sobre un rango: =QUERY(Datos!A:F; "select B, sum(F) where C = 'Perú' group by B order by sum(F) desc"). Si hiciste el tema de SQL, ya sabes usarla.

FILTER devuelve las filas que cumplen una condición, UNIQUE quita duplicados y SORT ordena. Son fórmulas de matriz: una sola fórmula llena muchas celdas y se actualiza sola cuando llegan datos nuevos desde n8n.

IMPORTRANGE trae datos de otra hoja. Combinadas, estas fórmulas te permiten armar reportes que se actualizan solos sin tocar nada.

Conceptos clave:
- QUERY con sintaxis tipo SQL
- FILTER, UNIQUE, SORT
- Fórmulas que llenan rangos
- IMPORTRANGE

Ejercicio práctico: Sobre la hoja que llena tu Proyecto 1, crea una hoja de reporte con QUERY que muestre solicitudes por categoría y prioridad de la última semana, y que se actualice sola.

Preguntas frecuentes:
- Pregunta: ¿En QUERY las columnas se llaman por su encabezado?
  Respuesta: No, por su letra (A, B, C) o como Col1, Col2 si el rango viene de otra fórmula.
- Pregunta: ¿Por qué mi FILTER da error de expansión?
  Respuesta: Porque hay datos en las celdas donde la fórmula quiere escribir. Deja libre el espacio de abajo y a la derecha.
- Pregunta: ¿QUERY existe en Excel?
  Respuesta: No con ese nombre. En Excel se usan FILTRAR, ORDENAR, tablas dinámicas o Power Query.

## Sesión 4: Limpiar datos de forma repetible (45 minutos)

Los datos reales llegan sucios: espacios extra, mayúsculas mezcladas, teléfonos en mil formatos, duplicados, fechas como texto. Limpiar a mano funciona una vez; tú necesitas que sea repetible.

Tres caminos según el caso. En la hoja: columnas auxiliares con fórmulas (ESPACIOS, MINUSC, SUSTITUIR) y quitar duplicados. En Excel: Power Query graba cada paso de limpieza y lo repite con un clic cuando llegan datos nuevos. En la automatización: limpiar en n8n (nodo Code o Set) antes de guardar, para que los datos lleguen limpios.

La mejor limpieza es la que no hace falta: valida en el origen con formularios que exijan formatos correctos.

Conceptos clave:
- Problemas típicos: espacios, formatos, duplicados
- Columnas auxiliares
- Power Query
- Limpiar en n8n antes de guardar

Ejercicio práctico: Crea una lista de 30 contactos con errores típicos y límpiala dos veces: con fórmulas en Sheets y con un nodo Code de n8n. Compara cuál mantendrías mejor.

Preguntas frecuentes:
- Pregunta: ¿Qué es Power Query?
  Respuesta: Un editor de Excel y Power BI que registra pasos de transformación (quitar columnas, cambiar tipos, unir tablas) y los repite automáticamente.
- Pregunta: ¿Cómo detecto duplicados que no son idénticos?
  Respuesta: Normaliza primero (minúsculas, sin espacios ni tildes) y compara la versión normalizada, por ejemplo el email.
- Pregunta: ¿Puedo usar un LLM para limpiar datos?
  Respuesta: Sí, para casos difíciles como separar nombres o normalizar direcciones. Para reglas simples, una fórmula es más barata y predecible.

## Sesión 5: Tablas dinámicas (40 minutos)

Una tabla dinámica resume miles de filas en segundos: arrastras un campo a filas (por ejemplo, vendedor), otro a columnas (mes) y otro a valores (suma de ventas). Cambiar la pregunta es arrastrar otro campo.

Sirve para explorar antes de decidir qué mostrar en un dashboard: ¿qué región crece?, ¿qué categoría de solicitud tiene más prioridad alta?, ¿en qué día llegan más leads?

Agrupa fechas por mes o semana, usa filtros para enfocarte y muestra porcentajes del total cuando importe la proporción. Es exactamente lo que hace GROUP BY en SQL, con el mouse.

Conceptos clave:
- Filas, columnas, valores y filtros
- Agrupar fechas
- Porcentaje del total
- Explorar antes de graficar

Ejercicio práctico: Con tus datos del Proyecto 1 (o la base Chinook exportada), crea tres tablas dinámicas que respondan tres preguntas de negocio distintas y escribe una conclusión de una línea para cada una.

Preguntas frecuentes:
- Pregunta: Mi tabla dinámica no muestra los datos nuevos. ¿Por qué?
  Respuesta: Porque el rango de origen es fijo. Usa columnas completas (A:F) o una tabla con formato que crezca sola, y actualiza.
- Pregunta: ¿Tabla dinámica o QUERY?
  Respuesta: La tabla dinámica para explorar con el mouse; QUERY para reportes fijos que se actualizan solos.
- Pregunta: ¿Qué es una conclusión de negocio?
  Respuesta: Una frase que lleva a una acción: «el 60 % de los reclamos son por demoras de envío; conviene revisar el proveedor logístico».

## Sesión 6: Visualización: el gráfico correcto (40 minutos)

Cada gráfico responde una pregunta. Evolución en el tiempo: línea. Comparar categorías: barras (horizontales si los nombres son largos). Parte de un total: barras apiladas o, si son pocas partes, una dona. Relación entre dos variables: dispersión. Un número clave: una tarjeta grande con su variación.

Menos es más: un color principal y otro para destacar, títulos que digan la conclusión («Los reclamos bajaron 30 % desde la automatización») en vez de solo el tema («Reclamos por mes»), ejes que empiezan en cero en barras y nada de 3D.

Piensa en quién lo mira: un gerente quiere 3 números y una tendencia, no 15 gráficos.

Conceptos clave:
- Línea, barras, dispersión, tarjeta
- Título con la conclusión
- Pocos colores con intención
- Diseñar para quien decide

Ejercicio práctico: Toma tres de tus tablas dinámicas y conviértelas en el gráfico adecuado, con títulos que expresen la conclusión.

Preguntas frecuentes:
- Pregunta: ¿Cuándo usar un gráfico circular?
  Respuesta: Casi nunca: solo para 2 o 3 partes de un total. Las barras se leen mejor.
- Pregunta: ¿Por qué el eje de las barras debe empezar en cero?
  Respuesta: Porque el largo de la barra representa el valor; cortar el eje exagera las diferencias.
- Pregunta: ¿Cómo destaco lo importante?
  Respuesta: Pinta en gris todo y en color solo la serie o el punto que quieres que vean.

## Sesión 7: Dashboard en Looker Studio (60 minutos)

Looker Studio es gratuito, funciona en el navegador y se conecta directamente a Google Sheets, a Postgres (tu Supabase) y a muchas otras fuentes. Lo que construyas se actualiza cuando cambian los datos y se comparte con un enlace, como un documento de Google.

Estructura de un buen dashboard: arriba, 3 o 4 tarjetas con los números clave y su variación; en el medio, la tendencia en el tiempo; abajo, el detalle por categoría y una tabla filtrable. Agrega un control de rango de fechas.

Los campos calculados permiten crear métricas nuevas (tasa de conversión, tiempo ahorrado) sin tocar los datos.

Conceptos clave:
- Fuentes: Sheets, Postgres
- Tarjetas, tendencia, detalle
- Control de fechas
- Campos calculados

Ejercicio práctico: Conecta Looker Studio a la hoja o a la tabla de Supabase de tu Proyecto 1 y construye un dashboard con: total de solicitudes, porcentaje de prioridad alta, tendencia diaria y desglose por categoría.

Preguntas frecuentes:
- Pregunta: ¿Looker Studio es lo mismo que Looker?
  Respuesta: No. Looker Studio (antes Data Studio) es gratuito; Looker es una plataforma empresarial de pago de Google Cloud.
- Pregunta: ¿Cómo comparto el dashboard sin dar acceso a los datos?
  Respuesta: Compártelo como lector y configura las credenciales de la fuente como las del propietario.
- Pregunta: ¿Puedo poner el dashboard en mi portafolio?
  Respuesta: Sí: inclúyelo como enlace público (con datos ficticios) o como captura en tu README.

## Sesión 8: Medir y comunicar el impacto (45 minutos)

Un cliente no compra «un flujo de n8n con IA»: compra horas ahorradas, menos errores o más ventas. Medir eso es lo que convierte un proyecto técnico en un caso de éxito.

Define la línea base antes de automatizar: cuánto tiempo toma hoy, cuántos errores hay, cuánto tarda la respuesta. Después mide lo mismo. Métricas típicas: horas ahorradas por mes (y su valor en dinero), tiempo de respuesta, porcentaje de casos resueltos sin intervención, errores evitados, costo de la solución.

Presenta con la estructura problema → solución → resultado, con un número grande al inicio. Este mismo formato lo usarás en tu portafolio, en tu CV y en las entrevistas.

Conceptos clave:
- Línea base antes y después
- Horas ahorradas y su valor
- Costo de la solución
- Problema → solución → resultado

Ejercicio práctico: Escribe el caso de éxito de tu Proyecto 1 o 2 en una página: problema con números, solución en 3 líneas, resultados medidos y una captura del dashboard.

Preguntas frecuentes:
- Pregunta: No tengo datos reales de antes. ¿Qué hago?
  Respuesta: Haz una estimación razonable y explícita («si una persona tarda 2 minutos por solicitud y llegan 500 al mes...») y di que es una estimación.
- Pregunta: ¿Cómo calculo el valor en dinero?
  Respuesta: Horas ahorradas por el costo por hora de quien hacía la tarea. Réstale el costo mensual de la solución.
- Pregunta: ¿Por qué el número grande al inicio?
  Respuesta: Porque quien lee decide en segundos si sigue. «Ahorra 40 horas al mes» engancha más que la descripción técnica.

## Herramientas que se usan

- Google Sheets: Hoja de cálculo en la nube, la más usada con n8n. (Gratis)
- Looker Studio: Dashboards gratuitos conectados a Sheets, Postgres y más. (Gratis)
- Power BI Desktop: Herramienta de BI de Microsoft, muy pedida en empresas. (Gratis en escritorio · publicar requiere licencia)
- Excel: Sigue siendo el estándar en finanzas y operaciones (Exceljet es su mejor referencia de fórmulas). (De pago (Microsoft 365) · versión web gratis)
- n8n (nodo Google Sheets): Llenar y leer hojas automáticamente. (Gratis autoalojado)

## Cursos recomendados

- Exceljet (Exceljet, Inglés, gratis): Guías cortas y claras de cada fórmula de Excel, con ejemplos descargables.
- Ben Collins: cursos y tutoriales de Google Sheets (benlcollins.com, Inglés, gratis): El referente de Google Sheets: QUERY, fórmulas avanzadas y dashboards.
- Microsoft Learn: Power BI (Microsoft Learn, Inglés y español, gratis): Rutas oficiales de Power BI, desde cero hasta la certificación PL-300.
- Excel Basics for Data Analysis (IBM) (Coursera, Inglés, de pago): Excel aplicado a análisis de datos, con certificado.
- Google Data Analytics Professional Certificate (Coursera, Inglés y español, de pago): Certificado de Google muy reconocido: Sheets, SQL, Tableau y R.
- Curso de Excel Básico (Platzi, Español, de pago): Excel desde cero en español.
- Microsoft Excel: from Beginner to Advanced (Udemy, Inglés, de pago): Curso completo de Excel muy popular en Udemy.

## Repositorios para practicar

- microsoft/Data-Science-For-Beginners: Curso de Microsoft sobre ciencia de datos, incluye visualización.
- jakevdp/PythonDataScienceHandbook: Para pasar de hojas de cálculo a análisis con Python.
- lerocha/chinook-database: Datos de ventas de ejemplo para tus dashboards.
