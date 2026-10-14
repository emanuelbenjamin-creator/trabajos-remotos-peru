# Clase: RAG y bases vectoriales

Curso: WorkJob Clases, preparación para trabajos remotos desde Perú en automatización con IA. Semana 2 del plan.
Público: personas que saben usar n8n y quieren conseguir trabajo remoto en automatización, LLMs, RAG y agentes de IA. Tienen inglés básico.
Resumen: Hacer que un LLM responda con tus documentos: embeddings, fragmentos, búsqueda semántica, citas y evaluación.

## Introducción

RAG (Retrieval-Augmented Generation, generación aumentada por recuperación) resuelve el mayor límite de los LLM: no conocen los documentos de tu empresa. En lugar de reentrenar el modelo, buscas los fragmentos relevantes de tus documentos y se los das en el prompt para que responda con ellos y cite la fuente.

Es la técnica más usada en proyectos reales de IA: asistentes de soporte, buscadores de normas, chat con manuales, análisis de contratos. En el panel aparece en menos ofertas que otras habilidades, pero en casi una de cada cinco de las que coinciden con tu perfil, y es lo que más te diferencia de quien solo usa ChatGPT.

En estas 8 sesiones construyes el Proyecto 2: un asistente que responde sobre documentos reales, cita sus fuentes y tiene su evaluación medida.

## Objetivos

- Explicar cuándo usar RAG, ajuste fino o simplemente un prompt largo.
- Entender embeddings y similitud semántica.
- Preparar documentos: extraer texto, limpiar y dividir en fragmentos.
- Guardar y buscar vectores en Supabase pgvector u otra base vectorial.
- Construir un RAG completo en n8n que cite sus fuentes.
- Mejorar la búsqueda con búsqueda híbrida, filtros y reranking.
- Evaluar un RAG con preguntas de prueba.

## Sesión 1: Qué es RAG y cuándo usarlo (45 minutos)

Un RAG tiene dos fases. Indexación (una vez): tomas los documentos, los divides en fragmentos, conviertes cada uno en un vector y los guardas. Consulta (cada pregunta): conviertes la pregunta en vector, buscas los fragmentos más parecidos y se los das al LLM con la instrucción «responde solo con esto y cita la fuente».

¿Cuándo RAG? Cuando la información cambia, es privada o es mucha para un prompt. ¿Cuándo un prompt largo? Si son pocos documentos que caben en el contexto. ¿Cuándo ajuste fino (fine-tuning)? Para enseñar un estilo o formato, no para agregar conocimiento.

El 80 % de la calidad de un RAG está en la recuperación: si no encuentras el fragmento correcto, el mejor modelo del mundo responderá mal.

Conceptos clave:
- Indexación y consulta
- RAG vs prompt largo vs fine-tuning
- La recuperación manda
- Responder citando la fuente

Ejercicio práctico: Sube 3 PDFs (un reglamento, un manual, una política) a NotebookLM, hazle 10 preguntas y anota cuáles responde bien, cuáles mal y por qué crees que falló.

Preguntas frecuentes:
- Pregunta: ¿RAG evita las alucinaciones?
  Respuesta: Las reduce mucho, pero no las elimina. Si la recuperación trae fragmentos equivocados o el prompt no obliga a usar solo el contexto, puede inventar.
- Pregunta: ¿Por qué no entrenar el modelo con mis documentos?
  Respuesta: Es caro, lento, hay que repetirlo cuando cambian los documentos y no garantiza que recuerde datos exactos. RAG se actualiza agregando documentos.
- Pregunta: ¿Qué casos de negocio son buenos para RAG?
  Respuesta: Soporte con base de conocimiento, búsqueda en normas o contratos, onboarding de empleados con manuales internos y asistentes de ventas con catálogos.

## Sesión 2: Embeddings y similitud semántica (45 minutos)

Un embedding convierte un texto en una lista de cientos o miles de números que capturan su significado. Textos con significado parecido quedan cerca: «¿cómo pido vacaciones?» y «procedimiento para solicitar días libres» tienen vectores cercanos aunque no compartan palabras.

La cercanía se mide con similitud coseno (o distancia). La búsqueda semántica consiste en encontrar los vectores más cercanos al de la pregunta.

Reglas prácticas: usa el mismo modelo de embeddings para documentos y preguntas; los modelos multilingües funcionan bien con español; y si cambias de modelo de embeddings debes volver a vectorizar todo. Son muy baratos comparados con generar texto.

Conceptos clave:
- Texto → vector
- Cercanía = similitud de significado
- Mismo modelo para indexar y consultar
- Modelos multilingües

Ejercicio práctico: En Colab, genera embeddings de 10 frases (algunas parecidas en significado, otras no) y calcula la similitud coseno entre todas. Verifica que las parecidas salen más cerca.

Preguntas frecuentes:
- Pregunta: ¿Qué pasa si indexo con un modelo de embeddings y consulto con otro?
  Respuesta: Los vectores no son comparables y la búsqueda devuelve basura. Siempre el mismo modelo.
- Pregunta: ¿Más dimensiones es mejor?
  Respuesta: No necesariamente. Más dimensiones ocupan más espacio y cuestan más; muchos modelos permiten reducirlas con poca pérdida.
- Pregunta: ¿La búsqueda semántica reemplaza a la búsqueda por palabras?
  Respuesta: No del todo. Para códigos, nombres propios o números exactos, la búsqueda por palabras es mejor. Por eso existe la búsqueda híbrida.

## Sesión 3: Preparar documentos y dividir en fragmentos (50 minutos)

La calidad del RAG empieza aquí. Primero extrae el texto limpio: los PDF escaneados necesitan OCR, las tablas suelen desordenarse y los encabezados y pies de página repetidos ensucian. Revisa a mano una muestra del texto extraído.

Después divide en fragmentos (chunks). Muy grandes mezclan temas y gastan contexto; muy pequeños pierden sentido. Un punto de partida común es 500 a 1000 tokens con un solapamiento de 10 a 20 % para no cortar ideas a la mitad. Mejor aún: dividir respetando la estructura (artículos de una norma, secciones de un manual).

Guarda metadatos con cada fragmento: documento, página, sección, fecha. Te permitirán citar la fuente y filtrar búsquedas.

Conceptos clave:
- Extraer texto limpio (y OCR si hace falta)
- Tamaño de fragmento y solapamiento
- Dividir por estructura
- Metadatos para citar y filtrar

Ejercicio práctico: Toma un documento real con estructura (por ejemplo una norma legal peruana publicada) y divídelo de dos formas: por tamaño fijo y por artículos. Compara qué fragmentos tienen más sentido por sí solos.

Preguntas frecuentes:
- Pregunta: ¿Qué tamaño de fragmento es el correcto?
  Respuesta: No hay uno universal. Empieza con 500–1000 tokens y ajústalo midiendo con tus preguntas de prueba.
- Pregunta: ¿Para qué sirve el solapamiento?
  Respuesta: Para que una idea que cae justo en el corte aparezca completa en al menos un fragmento.
- Pregunta: ¿Qué hago con tablas en PDFs?
  Respuesta: Extráelas por separado y conviértelas a texto estructurado (por ejemplo Markdown) o descríbelas. Las herramientas de lectura de documentos con IA ayudan mucho aquí.

## Sesión 4: Bases vectoriales: pgvector y alternativas (45 minutos)

Una base vectorial guarda vectores y encuentra los más cercanos rápidamente, incluso entre millones. Hay especializadas (Pinecone, Qdrant, Weaviate, Chroma) y extensiones de bases tradicionales como pgvector para Postgres.

Para tu nivel y tu plan, pgvector en Supabase es ideal: una sola base guarda el texto, los metadatos y el vector, y puedes combinar búsqueda semántica con SQL normal (filtrar por fecha o por documento). n8n tiene nodos para Supabase Vector Store.

Los índices aproximados (HNSW, IVFFlat) aceleran la búsqueda en colecciones grandes a cambio de una mínima pérdida de precisión. Con unos miles de fragmentos ni siquiera los necesitas.

Conceptos clave:
- Búsqueda del vecino más cercano
- Especializadas vs pgvector
- Texto + metadatos + vector juntos
- Índices HNSW

Ejercicio práctico: Sigue la guía de IA de Supabase para activar pgvector y crear una tabla documentos con contenido, metadatos y embedding.

Preguntas frecuentes:
- Pregunta: ¿Pinecone o pgvector?
  Respuesta: pgvector si ya usas Postgres y el volumen es moderado: menos piezas que mantener. Una especializada si tienes muchos millones de vectores o necesitas funciones avanzadas.
- Pregunta: ¿Dónde guardo el texto original?
  Respuesta: Junto al vector, en la misma fila. Lo necesitas para dárselo al LLM y para mostrar la cita.
- Pregunta: ¿Qué es top-k?
  Respuesta: Cuántos fragmentos recuperas por pregunta. Entre 3 y 8 es habitual; más da contexto pero también ruido y costo.

## Sesión 5: RAG completo en n8n (60 minutos)

En n8n un RAG son dos flujos. El de indexación: leer archivos (Google Drive, carpeta o formulario) → Default Data Loader con un Text Splitter → nodo de Embeddings → Supabase Vector Store en modo insertar. El de consulta: Chat Trigger → AI Agent o Question and Answer Chain con el Vector Store como herramienta de búsqueda → respuesta.

El prompt del sistema define el comportamiento: «Responde solo con la información de los documentos recuperados. Si no está, di que no lo sabes. Cita el documento y la sección de cada dato».

Prueba con preguntas cuya respuesta conoces, revisa en la ejecución qué fragmentos se recuperaron y ajusta el tamaño de los fragmentos, el top-k o el prompt según lo que veas.

Conceptos clave:
- Flujo de indexación
- Flujo de consulta con Chat Trigger
- Prompt de sistema con reglas de citas
- Revisar los fragmentos recuperados

Ejercicio práctico: Construye ambos flujos en n8n con 3 a 5 documentos reales. Haz 10 preguntas y, para cada una, revisa qué fragmentos se recuperaron.

Preguntas frecuentes:
- Pregunta: La respuesta es mala aunque el documento tiene la información. ¿Dónde busco el problema?
  Respuesta: Primero en la recuperación: mira qué fragmentos llegaron al modelo. Si no está el correcto, el problema es la división, los embeddings o el top-k; no el LLM.
- Pregunta: ¿Cómo actualizo un documento que cambió?
  Respuesta: Borra sus fragmentos anteriores (por eso conviene guardar el id del documento en los metadatos) y vuelve a indexarlo.
- Pregunta: ¿AI Agent o Question and Answer Chain?
  Respuesta: La cadena es más simple y predecible para preguntas y respuestas. El agente sirve si además debe usar otras herramientas o decidir cuándo buscar.

## Sesión 6: Mejorar la recuperación: híbrida, filtros y reranking (50 minutos)

Cuando el RAG básico no alcanza, estas técnicas son las que más mejoran.

Búsqueda híbrida: combina búsqueda semántica con búsqueda por palabras clave (full-text de Postgres o BM25). Rescata códigos, números de artículo y nombres propios. Filtros por metadatos: si la pregunta es sobre 2026 o sobre un documento específico, filtra antes de buscar. Reranking: recuperas 20 candidatos y un modelo especializado los reordena para quedarte con los 5 mejores.

Otras técnicas útiles: reescribir la pregunta del usuario antes de buscar (las preguntas reales son vagas), y agregar a cada fragmento un resumen del contexto del documento. Aplica una a la vez y mide si mejora.

Conceptos clave:
- Búsqueda híbrida
- Filtros por metadatos
- Reranking
- Reescritura de la pregunta

Ejercicio práctico: Agrega a tu RAG un filtro por documento o fecha y prueba si las preguntas que fallaban ahora aciertan. Documenta el antes y después.

Preguntas frecuentes:
- Pregunta: ¿Por qué la búsqueda semántica falla con «artículo 34»?
  Respuesta: Porque los números exactos no tienen un significado que el embedding capture bien. La búsqueda por palabras los encuentra; por eso conviene la híbrida.
- Pregunta: ¿El reranking es caro?
  Respuesta: Agrega una llamada por pregunta, pero suele ser barata y mejora mucho la precisión. Mídelo con tu conjunto de prueba.
- Pregunta: ¿Aplico todas las técnicas juntas?
  Respuesta: No. Cambia una cosa, mide y decide. Así sabes qué ayudó.

## Sesión 7: Evaluar un RAG (45 minutos)

Un RAG se evalúa en dos partes. Recuperación: ¿entre los fragmentos recuperados estaba el que tiene la respuesta? Generación: ¿la respuesta es correcta, usa solo el contexto (fidelidad) y responde lo que se preguntó (relevancia)?

Arma 20 a 50 preguntas con su respuesta correcta y el documento de donde sale. Incluye preguntas sin respuesta en los documentos: el sistema debe decir que no sabe. Corre todas después de cada cambio y lleva una tabla de resultados.

Librerías como Ragas automatizan métricas con LLM como juez. Para tu portafolio basta una hoja con las preguntas, lo que respondió el sistema, si acertó y el porcentaje final.

Conceptos clave:
- Recuperación vs generación
- Fidelidad y relevancia
- Preguntas sin respuesta
- Tabla de resultados por versión

Ejercicio práctico: Escribe 20 preguntas de prueba para tu RAG (incluye 3 sin respuesta en los documentos), córrelas y calcula el porcentaje de aciertos. Cambia una cosa y vuelve a medir.

Preguntas frecuentes:
- Pregunta: ¿Qué porcentaje de aciertos es bueno?
  Respuesta: Depende del uso. Para un asistente interno con revisión humana, 85–90 % puede bastar; para respuestas legales sin revisión, ningún porcentaje reemplaza a un experto.
- Pregunta: ¿Por qué incluir preguntas sin respuesta?
  Respuesta: Para medir si el sistema admite que no sabe en lugar de inventar. Es uno de los comportamientos que más valoran los clientes.
- Pregunta: ¿Cómo presento esto a un cliente?
  Respuesta: «Probamos 50 preguntas reales: acierta 46, en 3 dice que no sabe y en 1 se equivoca; ese caso ya está corregido». Concreto y honesto.

## Sesión 8: Proyecto 2 (parte 1): asistente sobre documentos reales (90 minutos)

Elige un dominio con documentos públicos y útiles: normas legales, reglamentos de una institución, manuales de un software o políticas de una empresa ficticia. Un asistente sobre normas legales peruanas, por ejemplo, conecta con proyectos de alertas normativas que ya existen en empresas y bancos.

Construye: indexación desde una carpeta, consulta con chat y citas de documento y sección, respuesta «no lo sé» cuando no hay información y evaluación con 20 preguntas.

En el tema de agentes le agregarás herramientas (por ejemplo, avisar por correo cuando hay una norma nueva). Por ahora deja el RAG sólido y documentado: README en inglés, diagrama, tabla de evaluación y un video de 2 minutos.

Conceptos clave:
- Dominio con documentos públicos
- Citas y «no lo sé»
- Evaluación con 20 preguntas
- Documentación y video

Ejercicio práctico: Construye y publica la primera versión del Proyecto 2 con su README, su tabla de evaluación y su video demo.

Preguntas frecuentes:
- Pregunta: ¿Puedo usar documentos de mi trabajo?
  Respuesta: Solo si son públicos o tienes permiso. Para el portafolio usa documentos públicos o inventados.
- Pregunta: ¿Qué interfaz le pongo?
  Respuesta: El chat público de n8n basta para la demo. Si quieres más, una página simple que llame al webhook del chat.
- Pregunta: ¿Qué pregunta harán en una entrevista sobre este proyecto?
  Respuesta: Cómo dividiste los documentos, cómo evaluaste y qué harías para escalarlo. Ten respuestas concretas con números.

## Herramientas que se usan

- n8n (nodos Vector Store y AI): Cargar documentos, crear embeddings y consultar vectores sin código. (Gratis autoalojado)
- Supabase + pgvector: Guardar documentos y vectores en Postgres. (Gratis con límites)
- Qdrant: Base vectorial especializada, open source o en la nube. (Gratis autoalojado · nube con nivel gratuito)
- Chroma: Base vectorial simple para prototipos en Python. (Gratis (open source))
- Embeddings de OpenAI: Modelos para convertir texto en vectores. (Pago por uso, muy barato)
- NotebookLM: Ver cómo se siente un buen RAG listo para usar. (Gratis)

## Cursos recomendados

- Retrieval Augmented Generation (DeepLearning.AI) (DeepLearning.AI, Inglés, de pago): Curso completo de RAG: recuperación, bases vectoriales, evaluación y producción. El primer módulo es gratis; el resto con membresía Pro o en Coursera.
- LangChain: Chat with Your Data (DeepLearning.AI, Inglés, gratis): Curso corto: cargar documentos, dividir, vectorizar y responder.
- Vector Databases: from Embeddings to Applications (DeepLearning.AI, Inglés, gratis): Cómo funcionan las bases vectoriales por dentro.
- Building and Evaluating Advanced RAG (DeepLearning.AI, Inglés, gratis): Técnicas avanzadas y métricas de evaluación.
- Pinecone Learning Center (Pinecone, Inglés, gratis): Artículos claros sobre embeddings, chunking y búsqueda híbrida.
- IBM RAG and Agentic AI (Coursera, Inglés, de pago): Certificado profesional de IBM sobre RAG y agentes.
- Curso de RAG (Platzi, Español, de pago): RAG en español con ejemplos prácticos.

## Repositorios para practicar

- NirDiamant/RAG_Techniques: Más de 30 técnicas de RAG explicadas en notebooks.
- langchain-ai/rag-from-scratch: Serie de LangChain que construye RAG desde cero, con videos.
- pgvector/pgvector: Vectores dentro de Postgres.
- run-llama/llama_index: Framework especializado en RAG y datos.
- infiniflow/ragflow: Motor de RAG open source con buena lectura de documentos.
- vibrantlabsai/ragas: Métricas para evaluar sistemas RAG.
