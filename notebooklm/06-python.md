# Clase: Python para IA y automatización

Curso: WorkJob Clases, preparación para trabajos remotos desde Perú en automatización con IA. Semana 2 del plan.
Público: personas que saben usar n8n y quieren conseguir trabajo remoto en automatización, LLMs, RAG y agentes de IA. Tienen inglés básico.
Resumen: El lenguaje de la IA. Lo justo para scripts, APIs, datos con pandas y pruebas automáticas.

## Introducción

Python es el idioma común de la inteligencia artificial: los SDK de OpenAI, Anthropic y Google, LangChain, LlamaIndex y casi todos los ejemplos de RAG y agentes están en Python. Su sintaxis es limpia y se lee casi como inglés.

Lo pide cerca de una de cada cinco ofertas, casi la mitad de las de IA y datos, y es la segunda habilidad técnica más pedida en las ofertas que coinciden con tu perfil. Con n8n resuelves mucho, pero cuando un cliente necesita algo a medida o un proceso pesado de datos, Python es la herramienta.

En estas 8 sesiones aprendes lo necesario para leer y adaptar código de IA, llamar APIs, analizar datos con pandas y escribir pruebas automáticas, que también aparecen en muchas ofertas (Testing/QA).

## Objetivos

- Escribir scripts con variables, condiciones, bucles y funciones.
- Usar listas y diccionarios para manejar datos de APIs.
- Leer y escribir archivos CSV y JSON.
- Llamar APIs con requests y con los SDK de los LLM.
- Analizar y limpiar datos con pandas.
- Organizar un proyecto con entorno virtual, .env y dependencias.
- Escribir pruebas automáticas con pytest.

## Sesión 1: Primeros pasos: variables, tipos y f-strings (45 minutos)

En Python no declaras tipos: nombre = "Ana", edad = 30, activo = True. Los tipos básicos son str, int, float, bool y None. La función type() te dice qué es algo y print() lo muestra.

La indentación (los espacios al inicio de la línea) no es estética: define los bloques de código. Usa 4 espacios y sé consistente.

Las f-strings arman textos con variables: f"Hola {nombre}, tienes {edad} años". Son el equivalente a los template strings de JavaScript y las usarás para construir prompts y mensajes.

Conceptos clave:
- Tipos: str, int, float, bool, None
- La indentación define bloques
- f-strings
- print y type

Ejercicio práctico: En Google Colab crea variables para un lead (nombre, empresa, presupuesto) y arma con una f-string un mensaje de bienvenida personalizado.

Preguntas frecuentes:
- Pregunta: ¿Colab o instalar Python en mi PC?
  Respuesta: Empieza en Colab para no perder tiempo. Instala Python en tu PC cuando necesites scripts que corran solos o proyectos con varios archivos.
- Pregunta: ¿Por qué me da IndentationError?
  Respuesta: Porque mezclaste espacios y tabulaciones o un bloque no tiene la sangría esperada. Configura tu editor para usar 4 espacios.
- Pregunta: ¿Qué diferencia hay entre = y ==?
  Respuesta: = asigna un valor; == compara si dos valores son iguales.

## Sesión 2: Condiciones, bucles y funciones (50 minutos)

if, elif y else deciden caminos. for recorre una lista: for lead in leads:. while repite mientras se cumpla una condición. range(10) genera números del 0 al 9.

Las funciones se definen con def: def iva(monto): return monto * 0.18. Pueden tener valores por defecto (def saludo(nombre, idioma="es")) y conviene documentarlas con una línea entre triples comillas.

Las comprensiones de lista son una forma corta de transformar y filtrar: [l["email"].lower() for l in leads if l["pais"] == "Perú"] hace en una línea lo que map y filter hacían en JavaScript.

Conceptos clave:
- if / elif / else
- for y range
- def y return
- Comprensiones de lista

Ejercicio práctico: Escribe clasificar_lead(lead) (la misma lógica caliente/tibio/frío que hiciste en JavaScript) y aplícala a una lista de 5 leads con una comprensión de lista.

Preguntas frecuentes:
- Pregunta: ¿Qué es None y cuándo aparece?
  Respuesta: Es «nada». Lo devuelve una función sin return y aparece en datos faltantes. Compáralo con is None, no con ==.
- Pregunta: ¿Cómo salgo de un bucle antes?
  Respuesta: Con break. Con continue saltas a la siguiente vuelta.
- Pregunta: ¿Las comprensiones siempre son mejores que un for?
  Respuesta: Para transformaciones simples sí. Si la lógica tiene varias condiciones, un for normal es más legible.

## Sesión 3: Listas, diccionarios y JSON (45 minutos)

Las listas ([]) guardan elementos en orden; los diccionarios ({}) guardan pares clave-valor. Un JSON de una API se convierte exactamente en eso: listas y diccionarios anidados.

Accedes con corchetes: respuesta["data"]["items"][0]["name"]. Si una clave puede faltar, usa .get("clave", valor_por_defecto) para no romper el programa.

El módulo json convierte texto en diccionarios (json.loads) y al revés (json.dumps). Para archivos, json.load y json.dump. Con indent=2 y ensure_ascii=False el archivo queda legible y con tildes correctas.

Conceptos clave:
- Lista vs diccionario
- Acceso anidado
- .get() para claves opcionales
- json.loads / json.dumps

Ejercicio práctico: Guarda la respuesta de /users de JSONPlaceholder en un archivo usuarios.json y luego léelo y muestra nombre y ciudad de cada usuario.

Preguntas frecuentes:
- Pregunta: ¿Por qué me da KeyError?
  Respuesta: Porque la clave no existe en ese diccionario. Usa .get() o revisa el dato con print antes.
- Pregunta: ¿Mis tildes salen como \u00e1?
  Respuesta: Agrega ensure_ascii=False en json.dumps o json.dump y abre el archivo con encoding="utf-8".
- Pregunta: ¿Qué es una tupla?
  Respuesta: Una lista que no se puede modificar, con paréntesis: (1, 2). Útil para valores fijos.

## Sesión 4: Archivos, CSV y manejo de errores (45 minutos)

Abre archivos con with open("archivo.txt", encoding="utf-8") as f:; el with cierra el archivo solo. El módulo csv lee y escribe hojas de cálculo simples: csv.DictReader te da cada fila como diccionario con los encabezados como claves.

Los errores en Python son excepciones. try / except las atrapa: try: total = monto / cantidad except ZeroDivisionError: total = 0. Atrapa errores específicos, no todos a ciegas, y registra qué pasó.

pathlib maneja rutas de archivos de forma segura en Windows, Mac y Linux: Path("datos") / "leads.csv".

Conceptos clave:
- with open(...) y encoding
- csv.DictReader
- try / except específicos
- pathlib

Ejercicio práctico: Exporta una hoja de Google Sheets con leads a CSV, léela con Python, limpia emails y teléfonos, y escribe un CSV nuevo solo con los leads válidos. Atrapa el error si el archivo no existe.

Preguntas frecuentes:
- Pregunta: ¿Por qué mi CSV de Excel sale con caracteres raros?
  Respuesta: Excel a veces guarda en otra codificación. Prueba encoding="utf-8-sig" o "latin-1" al abrir.
- Pregunta: ¿Está mal usar except: sin especificar?
  Respuesta: Oculta errores que deberías ver. Atrapa los que esperas y deja que los demás se muestren.
- Pregunta: ¿Cuándo uso CSV y cuándo JSON?
  Respuesta: CSV para tablas planas que se abren en Excel; JSON para datos anidados como respuestas de APIs.

## Sesión 5: APIs y LLMs desde Python (55 minutos)

Con requests llamas cualquier API: r = requests.get(url, headers={...}, timeout=30), luego r.raise_for_status() para detectar errores y r.json() para obtener los datos. Siempre pon timeout.

Las claves van en un archivo .env y se leen con python-dotenv y os.environ, igual que aprendiste en el tema de APIs.

Los SDK oficiales simplifican las llamadas a los LLM: con el de Anthropic es client.messages.create(model=..., max_tokens=..., messages=[...]); con el de OpenAI, una llamada equivalente. Para muchos textos, recorre la lista con un bucle, agrega pausas y guarda resultados a medida que avanzas para no perder trabajo si algo falla.

Conceptos clave:
- requests con timeout y raise_for_status
- .env y python-dotenv
- SDK oficiales de LLM
- Procesar en lote guardando avances

Ejercicio práctico: Escribe un script que lea tu CSV de leads, use un LLM para redactar un mensaje de seguimiento personalizado por lead y guarde los resultados en un CSV nuevo.

Preguntas frecuentes:
- Pregunta: ¿Por qué siempre timeout?
  Respuesta: Sin él, una API que no responde deja tu script colgado para siempre.
- Pregunta: ¿SDK o requests para los LLM?
  Respuesta: El SDK: maneja reintentos, tipos y cambios de la API. requests sirve si el proveedor no tiene SDK.
- Pregunta: Proceso 2000 textos y a la mitad se corta. ¿Cómo evito repetir todo?
  Respuesta: Guarda cada resultado apenas lo obtienes y, al reiniciar, salta los que ya están procesados.

## Sesión 6: Datos con pandas (55 minutos)

pandas es Excel con superpoderes en código. Un DataFrame es una tabla: df = pd.read_csv("ventas.csv"). Con df.head() ves las primeras filas, con df.info() los tipos y valores faltantes.

Las operaciones típicas: filtrar (df[df["pais"] == "Perú"]), crear columnas (df["total"] = df["precio"] * df["cantidad"]), agrupar (df.groupby("mes")["total"].sum()), unir tablas (pd.merge) y limpiar (dropna, fillna, str.strip).

Con df.to_csv o df.to_excel entregas el resultado. Para un cliente, un script de pandas que hace en segundos un reporte que antes tomaba horas es una venta clara.

Conceptos clave:
- DataFrame
- Filtrar y crear columnas
- groupby y merge
- Limpiar con dropna y fillna

Ejercicio práctico: Descarga un dataset de ventas de Kaggle, calcula las ventas por mes y por producto, encuentra los 5 productos con más ingresos y exporta el resumen a Excel.

Preguntas frecuentes:
- Pregunta: ¿pandas reemplaza a Excel?
  Respuesta: Para procesos repetitivos y datos grandes, sí. Para análisis rápidos y compartir con no técnicos, Excel o Sheets siguen siendo útiles.
- Pregunta: ¿Qué hago con valores vacíos?
  Respuesta: Depende: eliminarlos (dropna), rellenarlos con un valor (fillna) o marcarlos. Decídelo según qué significa el vacío en el negocio.
- Pregunta: ¿Cómo leo directamente una hoja de Google Sheets?
  Respuesta: Publícala como CSV y usa pd.read_csv con esa URL, o usa la API de Google Sheets con una librería como gspread.

## Sesión 7: Proyectos ordenados: entornos y dependencias (40 minutos)

Cada proyecto debe tener su entorno virtual: python -m venv .venv crea una carpeta con sus propias librerías, y así un proyecto no rompe a otro. Se activa con .venv\Scripts\activate en Windows.

pip install requests pandas instala librerías y pip freeze > requirements.txt guarda la lista exacta para que otra persona (o un servidor) instale lo mismo con pip install -r requirements.txt. Herramientas como uv hacen esto más rápido, pero el concepto es el mismo.

Estructura mínima de un proyecto: README.md, requirements.txt, .env.example (sin claves reales), .gitignore con .venv y .env, y tu código en una carpeta o archivo principal.

Conceptos clave:
- python -m venv .venv
- requirements.txt
- .env.example sin claves
- Estructura mínima de proyecto

Ejercicio práctico: Convierte tu script de mensajes de seguimiento en un proyecto ordenado con entorno virtual, requirements, .env.example, README en inglés y súbelo a GitHub.

Preguntas frecuentes:
- Pregunta: ¿Subo la carpeta .venv a GitHub?
  Respuesta: No. Se agrega a .gitignore; cada persona la crea con requirements.txt.
- Pregunta: ¿Para qué sirve .env.example?
  Respuesta: Muestra qué variables necesita el proyecto, con valores falsos, para que otros sepan qué configurar.
- Pregunta: Funciona en mi PC pero no en otra. ¿Por qué?
  Respuesta: Casi siempre por versiones distintas de librerías o variables de entorno faltantes. Un requirements.txt fijo y un README claro lo evitan.

## Sesión 8: Pruebas automáticas con pytest (50 minutos)

Testing y QA aparecen en casi una de cada cinco ofertas. Una prueba automática es código que verifica que tu código hace lo que debe: def test_iva(): assert iva(100) == 18. Corres pytest y te dice qué pasó y qué falló.

Prueba las funciones que transforman datos y los casos borde: listas vacías, campos faltantes, textos con tildes, montos en cero. Cada error que encuentres en producción se convierte en una prueba nueva para que no vuelva.

Con IA esto se vuelve más importante: tus pruebas de prompts (el conjunto de evaluación) son la versión para LLMs de lo mismo. Saber hablar de pruebas en una entrevista te separa de quien solo hace demos.

Conceptos clave:
- assert y pytest
- Casos borde
- Cada bug, una prueba
- Evaluación de prompts = pruebas para LLMs

Ejercicio práctico: Escribe 6 pruebas con pytest para clasificar_lead, incluyendo un lead sin email, uno con presupuesto en texto y una lista vacía. Arregla la función hasta que todas pasen.

Preguntas frecuentes:
- Pregunta: ¿Cómo pruebo una función que llama a un LLM?
  Respuesta: Separa la lógica: prueba aparte el armado del prompt y el procesamiento de la respuesta usando respuestas de ejemplo guardadas, sin llamar a la API en cada prueba.
- Pregunta: ¿Cuántas pruebas son suficientes?
  Respuesta: Las que cubran los casos normales, los bordes y los errores que ya tuviste. Más vale pocas y útiles que muchas triviales.
- Pregunta: ¿Qué es QA?
  Respuesta: Quality Assurance: asegurar la calidad de un producto. Incluye pruebas manuales y automáticas. Hay puestos de QA que son una buena puerta de entrada al sector tecnológico.

## Herramientas que se usan

- Python: El intérprete. Instala la versión estable más reciente. (Gratis)
- Google Colab: Notebooks de Python en el navegador, sin instalar nada. (Gratis · planes de pago con más GPU)
- Visual Studio Code: Editor con la extensión de Python. (Gratis)
- Cursor: Editor con IA integrada para escribir y entender código más rápido. (Gratis con límites · plan de pago)
- requests: La librería estándar para llamar APIs. (Gratis)
- pytest: Escribir y correr pruebas automáticas. (Gratis)

## Cursos recomendados

- CS50's Introduction to Programming with Python (Harvard) (Harvard, Inglés (subtítulos), gratis): El mejor curso introductorio: clases excelentes, ejercicios y certificado gratis.
- Python para todos (Py4E) (Py4E, Español, gratis): Curso clásico del Dr. Chuck, traducido al español.
- Kaggle Learn: Python y pandas (Kaggle, Inglés, gratis): Micro cursos prácticos en notebooks, con certificado.
- Tutorial oficial de Python (python.org, Español, gratis): La documentación oficial, en español.
- 100 Days of Code: The Complete Python Pro Bootcamp (Udemy, Inglés, de pago): Curso de Angela Yu con un proyecto por día.
- Python for Everybody (Universidad de Michigan) (Coursera, Inglés, de pago): La versión con certificado de Py4E.
- Curso de Fundamentos de Python (Platzi, Español, de pago): Python desde cero en español.

## Repositorios para practicar

- mouredev/Hello-Python: Curso de Python desde cero de MoureDev con clases en video, en español.
- Asabeneh/30-Days-Of-Python: Reto de 30 días con teoría y ejercicios.
- trekhleb/learn-python: Playground de Python con ejemplos y pruebas por tema.
- anthropics/anthropic-sdk-python: SDK oficial de Claude para Python.
- openai/openai-python: SDK oficial de OpenAI para Python.
- jakevdp/PythonDataScienceHandbook: Libro gratuito de ciencia de datos con Python y pandas.
