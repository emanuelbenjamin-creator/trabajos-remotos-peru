# Clase: LLMs por API y prompt engineering

Curso: WorkJob Clases, preparación para trabajos remotos desde Perú en automatización con IA. Semana 1 del plan.
Público: personas que saben usar n8n y quieren conseguir trabajo remoto en automatización, LLMs, RAG y agentes de IA. Tienen inglés básico.
Resumen: Llamar a GPT, Claude o Gemini desde n8n y Python, escribir prompts que funcionan siempre, obtener JSON y darle herramientas al modelo.

## Introducción

Usar un chat es fácil; integrar un LLM en un proceso que corre mil veces al día sin fallar es un oficio. Aquí está la diferencia entre «sé usar ChatGPT» y «sé construir con LLMs», que es lo que pagan las ofertas.

Prompt engineering aparece pocas veces escrito tal cual en los avisos, porque se da por incluido en «LLM», «IA generativa» y «agentes», que sí aparecen en buena parte de las ofertas de tu perfil. Lo que piden en la práctica es saber llamar al modelo por API, controlar el formato de salida y conectarlo con herramientas.

En estas 8 sesiones construyes el Proyecto 1 del plan: un flujo que recibe un formulario, usa un LLM para clasificar y resumir, guarda en Google Sheets y avisa por correo o Telegram.

## Objetivos

- Llamar a los principales modelos por API desde n8n y desde Python.
- Escribir prompts con rol, contexto, instrucciones, ejemplos y formato.
- Obtener salidas en JSON validadas.
- Usar tool use (function calling) para que el modelo use herramientas.
- Comparar prompts y modelos con un conjunto de pruebas.
- Controlar costo, latencia y errores en producción.

## Sesión 1: Tu primera llamada a un LLM por API (50 minutos)

Todas las APIs de chat funcionan parecido: envías una lista de mensajes con su rol (system con las instrucciones generales, user con lo que pide la persona y assistant con respuestas anteriores) y recibes la respuesta del modelo junto con cuántos tokens usaste.

En n8n, el nodo de chat del proveedor (OpenAI, Anthropic, Gemini u Ollama) dentro de un Basic LLM Chain hace esto por ti; solo configuras la credencial y el prompt. En Python son unas pocas líneas con el SDK oficial.

La API no recuerda conversaciones: cada llamada es independiente. Si quieres continuidad, envías el historial tú mismo. Eso explica por qué las conversaciones largas cuestan cada vez más.

Conceptos clave:
- Mensajes con rol: system, user, assistant
- Basic LLM Chain en n8n
- SDK oficial en Python
- La API no tiene memoria

Ejercicio práctico: Obtén una API key gratuita de Gemini en Google AI Studio. Llámala desde n8n (Basic LLM Chain) y desde Google Colab con Python para resumir el mismo texto en 3 viñetas.

Preguntas frecuentes:
- Pregunta: ¿Dónde guardo la API key en Colab?
  Respuesta: En los Secrets de Colab (el icono de llave), nunca escrita en una celda. Así no se filtra si compartes el notebook.
- Pregunta: ¿Para qué sirve el mensaje system?
  Respuesta: Define el rol, el tono y las reglas generales que el modelo debe seguir en toda la conversación.
- Pregunta: ¿Cómo sé cuánto me costó una llamada?
  Respuesta: La respuesta incluye los tokens de entrada y de salida. Multiplícalos por el precio por millón del modelo.

## Sesión 2: Anatomía de un buen prompt (45 minutos)

Un prompt profesional se parece a las instrucciones que le darías a un practicante nuevo. Tiene: rol (quién es), contexto (para qué empresa, qué público), tarea (qué hacer exactamente), restricciones (qué no hacer, longitud, tono) y formato de salida (cómo entregarlo).

Sé específico: «resume» es vago; «resume en 3 viñetas de máximo 15 palabras, para un gerente sin tiempo, destacando montos y fechas» funciona. Separa las instrucciones de los datos con etiquetas como <correo>...</correo>: el modelo distingue mejor y te protege de inyecciones.

Pide lo que quieres en positivo («escribe en párrafos») en vez de solo prohibir. Y escribe como si el modelo no supiera nada de tu negocio, porque no lo sabe.

Conceptos clave:
- Rol, contexto, tarea, restricciones, formato
- Ser específico y medible
- Etiquetas para separar datos
- Instrucciones en positivo

Ejercicio práctico: Escribe un prompt para clasificar correos de clientes de una tienda en «reclamo», «consulta», «pedido» u «otro», con prioridad alta, media o baja. Pruébalo con 10 correos inventados variados.

Preguntas frecuentes:
- Pregunta: ¿Escribo los prompts en inglés o en español?
  Respuesta: Los modelos grandes entienden bien ambos. Escribe en el idioma de los datos y pide la respuesta en el idioma que necesites. Mantén consistencia.
- Pregunta: ¿Por qué usar etiquetas tipo XML?
  Respuesta: Delimitan claramente qué es instrucción y qué es dato. Si un correo dice «ignora todo», queda dentro de la etiqueta y pesa menos.
- Pregunta: ¿Un prompt largo es mejor?
  Respuesta: Uno claro es mejor. Agrega detalle donde el modelo falla en tus pruebas, no por adelantado.

## Sesión 3: Ejemplos (few-shot) y razonamiento paso a paso (45 minutos)

Mostrar es más poderoso que explicar. Con 2 a 5 ejemplos de entrada y salida esperada (few-shot), el modelo copia el patrón: formato, criterio y tono. Elige ejemplos variados, incluyendo casos difíciles y bordes.

Para tareas que requieren pensar (calcular, decidir entre opciones, analizar), pedir que razone antes de responder mejora la precisión. Pídelo en una sección separada (<analisis> y luego <respuesta>) para poder quedarte solo con la respuesta. Los modelos de razonamiento ya lo hacen internamente.

Otra técnica clave es encadenar: en lugar de un megaprompt, divide en pasos (extraer → clasificar → redactar), cada uno con su prompt. Es más fácil de depurar y suele ser más barato.

Conceptos clave:
- Few-shot con ejemplos variados
- Pensar antes de responder
- Separar análisis y respuesta
- Encadenar prompts simples

Ejercicio práctico: Mejora tu clasificador de correos agregando 4 ejemplos difíciles. Mide cuántos de tus 10 correos clasifica bien antes y después.

Preguntas frecuentes:
- Pregunta: ¿Los ejemplos no hacen el prompt más caro?
  Respuesta: Sí, agregan tokens de entrada. Pero si mejoran mucho la precisión, compensan. Con caché de prompts el costo baja.
- Pregunta: ¿Cuándo divido una tarea en varias llamadas?
  Respuesta: Cuando una sola instrucción mezcla objetivos distintos o cuando necesitas revisar un resultado intermedio.
- Pregunta: ¿El modelo copia demasiado los ejemplos?
  Respuesta: Puede pasar. Por eso deben ser variados y no compartir detalles irrelevantes como la misma longitud o las mismas palabras.

## Sesión 4: Salida en JSON estructurado (50 minutos)

Para automatizar necesitas datos, no prosa. Si el modelo devuelve {"categoria": "reclamo", "prioridad": "alta", "resumen": "..."}, el siguiente nodo puede usarlo directamente.

Hay tres niveles de seguridad. Pedirlo en el prompt con un ejemplo funciona casi siempre. Mejor aún, las APIs ofrecen salida estructurada: le pasas un JSON Schema y el modelo está obligado a cumplirlo. En n8n, el Structured Output Parser hace esto y valida el resultado.

Aun así, valida: campos obligatorios, valores permitidos (enum) y tipos. Si falla, reintenta o envía el caso a revisión. Nunca confíes en que un texto libre tendrá siempre el mismo formato.

Conceptos clave:
- JSON en lugar de prosa
- JSON Schema y salida estructurada
- Structured Output Parser de n8n
- Validar siempre

Ejercicio práctico: Haz que tu clasificador devuelva JSON con categoria (enum), prioridad (enum), resumen (texto de máximo 20 palabras) y requiere_humano (booleano). Conecta el resultado a Google Sheets.

Preguntas frecuentes:
- Pregunta: ¿Qué es un enum en un schema?
  Respuesta: Una lista cerrada de valores permitidos. Evita que el modelo invente categorías nuevas.
- Pregunta: El modelo envuelve el JSON en texto o en bloques de código. ¿Qué hago?
  Respuesta: Usa la salida estructurada de la API o el parser de n8n. Si no está disponible, pide «responde solo con JSON» y limpia el texto antes de parsear.
- Pregunta: ¿Por qué agregar requiere_humano?
  Respuesta: Para que el sistema derive los casos dudosos. Es un patrón que los clientes valoran mucho.

## Sesión 5: Tool use (function calling) (55 minutos)

Tool use le da al modelo manos. Defines herramientas con nombre, descripción y parámetros (por ejemplo buscar_pedido(numero) o consultar_clima(ciudad)). Cuando la pregunta lo requiere, el modelo no inventa: responde «quiero llamar a buscar_pedido con numero=1234». Tu código ejecuta la función, le devuelve el resultado y el modelo redacta la respuesta final.

El modelo nunca ejecuta nada por sí mismo: tú decides qué herramientas existen y qué pueden hacer. Por eso las descripciones deben ser claras y los permisos, mínimos.

Es la base de los agentes que verás en la semana 2. En n8n, el nodo AI Agent hace este ciclo por ti: conectas herramientas (Sheets, HTTP Request, otro flujo) y el agente decide cuándo usarlas.

Conceptos clave:
- Definición: nombre, descripción, parámetros
- El modelo pide, tu código ejecuta
- Ciclo: pedir → ejecutar → responder
- Permisos mínimos

Ejercicio práctico: En n8n crea un AI Agent con una herramienta que consulte una hoja de Google Sheets de pedidos. Pregúntale «¿en qué estado está el pedido 1023?» y revisa en la ejecución cómo llamó a la herramienta.

Preguntas frecuentes:
- Pregunta: ¿Qué pasa si la descripción de la herramienta es ambigua?
  Respuesta: El modelo la usa cuando no debe o no la usa cuando debería. La descripción es parte del prompt: escríbela con el mismo cuidado.
- Pregunta: ¿Puede el modelo borrar datos con una herramienta?
  Respuesta: Solo si tú creaste una herramienta que borra. Para acciones irreversibles, exige confirmación humana.
- Pregunta: ¿Function calling y tool use son lo mismo?
  Respuesta: Sí: OpenAI popularizó el nombre function calling y Anthropic usa tool use. El concepto es el mismo.

## Sesión 6: Comparar modelos y evaluar prompts (45 minutos)

¿Cómo sabes si tu prompt nuevo es mejor? Midiéndolo. Arma un conjunto de prueba: 20 a 50 casos reales con la respuesta correcta. Cada vez que cambias el prompt o el modelo, corres todos y cuentas aciertos.

Para clasificación o extracción la comparación es exacta. Para textos libres (resúmenes, respuestas) puedes usar criterios («¿menciona el monto?», «¿menos de 50 palabras?») o un segundo LLM como juez con una rúbrica clara.

Herramientas como promptfoo automatizan esto, pero una hoja de Google Sheets con columnas «entrada», «esperado» y «obtenido» ya es un sistema de evaluación. Mostrar esta tabla en tu portafolio es una señal fuerte de profesionalismo.

Conceptos clave:
- Conjunto de prueba con respuestas correctas
- Medir antes y después de cada cambio
- Rúbricas y LLM como juez
- Calidad, costo y velocidad juntos

Ejercicio práctico: Crea una hoja con 20 correos y su clasificación correcta. Haz un flujo de n8n que los pase por dos modelos distintos y calcule el porcentaje de aciertos y el costo de cada uno.

Preguntas frecuentes:
- Pregunta: ¿Cuántos casos de prueba necesito?
  Respuesta: Para empezar, 20 a 50 bien elegidos, incluyendo casos difíciles. Agrega cada error real que encuentres en producción.
- Pregunta: ¿Es confiable usar un LLM como juez?
  Respuesta: Sí con una rúbrica concreta y revisando una muestra a mano. No para decidir cosas críticas sin control humano.
- Pregunta: ¿Qué pongo en el portafolio sobre esto?
  Respuesta: La tabla de resultados: «el modelo A acierta 92 % a 3 dólares por mil correos; el B, 95 % a 12 dólares; elegí A por costo». Eso demuestra criterio.

## Sesión 7: Producción: costo, latencia, límites y seguridad (45 minutos)

En producción tu flujo hará miles de llamadas. Cuida cuatro cosas.

Costo: usa el modelo más pequeño que cumpla, limita max_tokens y aprovecha el caché de prompts para instrucciones largas que se repiten. Latencia: el streaming muestra la respuesta mientras se genera; para procesos en lote existen APIs batch más baratas. Límites: los proveedores limitan peticiones y tokens por minuto; usa reintentos con espera ante errores 429 y 529.

Seguridad: nunca pongas datos sensibles sin necesidad, separa datos de instrucciones, valida la salida y registra cada llamada (prompt, respuesta, tokens, costo) para poder auditar. Un registro en una hoja o base de datos te salvará cuando algo falle.

Conceptos clave:
- Modelo mínimo suficiente
- Caché de prompts y batch
- Reintentos ante 429
- Registrar cada llamada

Ejercicio práctico: Agrega a tu flujo un registro de cada llamada (fecha, modelo, tokens, costo, resultado) en una hoja aparte y un reintento con espera en el nodo del LLM.

Preguntas frecuentes:
- Pregunta: ¿Qué es el caché de prompts?
  Respuesta: El proveedor guarda la parte fija de tu prompt (instrucciones, ejemplos) y te cobra mucho menos cuando la repites en llamadas siguientes.
- Pregunta: ¿Cuándo uso la API batch?
  Respuesta: Para procesar grandes volúmenes que no necesitan respuesta inmediata, como clasificar todo el histórico de correos. Suele costar la mitad.
- Pregunta: ¿Qué hago si el proveedor se cae?
  Respuesta: Ten un modelo de respaldo de otro proveedor y una ruta de error que guarde el caso para reprocesarlo.

## Sesión 8: Proyecto 1: clasificador inteligente de solicitudes (90 minutos)

Junta todo en un proyecto para tu portafolio. Flujo: un formulario (n8n Form o Google Forms) o un webhook recibe una solicitud → el LLM devuelve JSON con categoría, prioridad, resumen y si requiere humano → se guarda en Google Sheets → si la prioridad es alta, llega un aviso por correo o Telegram → cualquier error dispara tu Error Workflow.

Docúmentalo como un caso real: el problema (un equipo pierde horas leyendo y repartiendo solicitudes), la solución (diagrama del flujo), los resultados (precisión medida con tu conjunto de prueba, costo por cada mil solicitudes, tiempo ahorrado estimado) y cómo instalarlo.

Súbelo a GitHub con el flujo exportado, capturas y un README en inglés. Graba un video de 2 minutos mostrándolo funcionar.

Conceptos clave:
- Formulario → LLM → Sheets → aviso
- JSON validado
- Error Workflow
- Métricas: precisión, costo, tiempo

Ejercicio práctico: Construye y publica el Proyecto 1 completo. Checklist: flujo exportado sin claves, README en inglés, captura del flujo, tabla de evaluación, video de 2 minutos.

Preguntas frecuentes:
- Pregunta: ¿Cómo calculo el tiempo ahorrado?
  Respuesta: Estima cuánto tarda una persona en leer y clasificar una solicitud (por ejemplo, 2 minutos), multiplica por el volumen mensual y réstale el tiempo de revisar los casos derivados.
- Pregunta: ¿Uso datos reales?
  Respuesta: Usa datos inventados o anonimizados. Nunca publiques datos de clientes reales en un repo público.
- Pregunta: ¿Qué hace que este proyecto destaque frente a otros?
  Respuesta: Las métricas y el manejo de errores. Muchos portafolios muestran un flujo que funciona una vez; pocos muestran precisión medida y qué pasa cuando algo falla.

## Herramientas que se usan

- Anthropic Console (API de Claude): Crear tu API key y probar prompts con Claude. (Pago por uso · créditos iniciales a veces)
- OpenAI Platform: API de los modelos GPT. (Pago por uso)
- Google AI Studio: API de Gemini con nivel gratuito para practicar. (Gratis con límites)
- n8n (nodos AI): Nodos de chat, Basic LLM Chain y Structured Output Parser. (Gratis autoalojado)
- Google Colab: Ejecutar Python en el navegador para probar las APIs. (Gratis)
- promptfoo: Probar y comparar prompts y modelos automáticamente. (Gratis (open source))

## Cursos recomendados

- ChatGPT Prompt Engineering for Developers (DeepLearning.AI, Inglés, gratis): El curso corto más conocido sobre prompts por API, con Andrew Ng e Isa Fulford.
- Building Systems with the ChatGPT API (DeepLearning.AI, Inglés, gratis): Encadenar llamadas, clasificar, moderar y evaluar.
- Tutorial interactivo de prompt engineering de Anthropic (GitHub, Inglés, gratis): 9 capítulos con ejercicios, del prompt básico a técnicas avanzadas.
- Prompt Engineering Guide (en español) (DAIR.AI, Español, gratis): Guía de referencia con todas las técnicas y ejemplos.
- Learn Prompting (Learn Prompting, Inglés, gratis): Curso abierto de prompting desde lo básico.
- Prompt Engineering for ChatGPT (Vanderbilt) (Coursera, Inglés, de pago): Patrones de prompt con certificado universitario.
- Curso de Prompt Engineering (Platzi, Español, de pago): Técnicas de prompting en español.

## Repositorios para practicar

- anthropics/prompt-eng-interactive-tutorial: El tutorial oficial de Anthropic en notebooks.
- dair-ai/Prompt-Engineering-Guide: La guía de prompting más completa, con papers y ejemplos.
- openai/openai-cookbook: Ejemplos oficiales de OpenAI: structured outputs, function calling, embeddings.
- anthropics/claude-cookbooks: Recetas oficiales de Anthropic: tool use, RAG, extracción de datos.
- google-gemini/cookbook: Ejemplos oficiales de la API de Gemini.
- f/prompts.chat: Colección comunitaria de prompts para inspirarte.
