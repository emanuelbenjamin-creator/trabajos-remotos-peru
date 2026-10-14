# Clase: Agentes de IA y MCP

Curso: WorkJob Clases, preparación para trabajos remotos desde Perú en automatización con IA. Semana 2 del plan.
Público: personas que saben usar n8n y quieren conseguir trabajo remoto en automatización, LLMs, RAG y agentes de IA. Tienen inglés básico.
Resumen: LLMs que deciden pasos y usan herramientas: patrones, memoria, MCP, límites de seguridad y agentes en n8n.

## Introducción

Un agente de IA es un LLM que trabaja en ciclo: recibe un objetivo, decide qué hacer, usa una herramienta (buscar, consultar una base, enviar un correo), mira el resultado y decide el siguiente paso, hasta terminar. Es la evolución natural del tool use que viste en la semana 1.

En el panel aparece en más de un tercio de las ofertas que coinciden con tu perfil, y es la palabra de moda en IA. Pero las empresas que saben buscan algo concreto: alguien que distinga cuándo hace falta un agente y cuándo basta un flujo fijo, y que sepa ponerle límites para que sea confiable.

En estas 8 sesiones aprendes los patrones que usan los equipos serios, construyes agentes en n8n, conoces MCP (el estándar para conectar herramientas a los modelos) y terminas el Proyecto 2 con un agente que actúa.

## Objetivos

- Distinguir flujos fijos, flujos con LLM y agentes, y elegir el adecuado.
- Aplicar patrones: encadenar, enrutar, paralelizar, orquestar y evaluar.
- Construir agentes en n8n con herramientas y memoria.
- Entender y usar MCP para conectar herramientas.
- Poner límites: pasos máximos, permisos, aprobación humana y costos.
- Conocer frameworks de código (LangGraph, CrewAI) para cuando n8n no alcance.

## Sesión 1: Qué es un agente y cuándo NO usarlo (45 minutos)

Hay un espectro. Un flujo fijo hace siempre los mismos pasos (n8n clásico). Un flujo con LLM usa el modelo en pasos definidos por ti (tu Proyecto 1). Un agente decide él mismo qué pasos dar y cuántos.

Los agentes son potentes para tareas abiertas (investigar, atender consultas variadas, resolver problemas con varias herramientas), pero son más caros, más lentos y menos predecibles. La recomendación de los equipos que más agentes construyen es empezar por lo más simple que funcione y agregar autonomía solo cuando aporta.

Pregunta clave: ¿puedo dibujar el diagrama de pasos de antemano? Si sí, haz un flujo. Si los pasos dependen de lo que se va encontrando, considera un agente.

Conceptos clave:
- Flujo fijo → flujo con LLM → agente
- Autonomía tiene costo
- Empezar simple
- ¿Puedo dibujar los pasos?

Ejercicio práctico: Lee el artículo de Anthropic «Building effective agents» y clasifica 5 procesos de una empresa (por ejemplo: facturación, soporte, reportes) como flujo fijo, flujo con LLM o agente, justificando cada uno.

Preguntas frecuentes:
- Pregunta: ¿Un chatbot es un agente?
  Respuesta: No necesariamente. Si solo conversa, es un chat. Es agente cuando decide usar herramientas y dar varios pasos para cumplir un objetivo.
- Pregunta: ¿Por qué no usar agentes para todo?
  Respuesta: Porque cada decisión del modelo puede fallar y los errores se acumulan en muchos pasos. Donde el proceso es conocido, un flujo es más barato y confiable.
- Pregunta: ¿Qué responde un buen candidato si le preguntan por agentes?
  Respuesta: Que los usa cuando la tarea es abierta, con límites claros y evaluación, y que prefiere flujos cuando el proceso es predecible.

## Sesión 2: Patrones de flujo con LLMs (50 minutos)

Antes de un agente completo existen patrones intermedios que resuelven la mayoría de casos.

Encadenar: la salida de un paso es la entrada del siguiente (extraer → verificar → redactar). Enrutar: un LLM clasifica y manda cada caso al flujo especializado (reclamos a un lado, ventas a otro). Paralelizar: varias llamadas a la vez y luego se combinan (analizar un contrato por cláusulas). Orquestador y trabajadores: un LLM divide la tarea y asigna partes. Evaluador y optimizador: un LLM genera, otro revisa con criterios y se itera.

En n8n se arman con nodos Switch, Merge, sub-flujos y varias cadenas de LLM. Conocer estos nombres te permite hablar el mismo idioma que los equipos de IA.

Conceptos clave:
- Encadenar
- Enrutar
- Paralelizar
- Orquestador-trabajadores
- Evaluador-optimizador

Ejercicio práctico: Convierte tu Proyecto 1 en un enrutador: según la categoría, cada solicitud va a una cadena distinta que redacta una respuesta especializada.

Preguntas frecuentes:
- Pregunta: ¿Qué patrón uso para mejorar la calidad de un texto generado?
  Respuesta: Evaluador-optimizador: un paso genera, otro revisa con una rúbrica y devuelve correcciones, hasta cumplir o llegar a un máximo de intentos.
- Pregunta: ¿El enrutador puede ser un modelo barato?
  Respuesta: Sí, y conviene: clasificar es fácil. Deja los modelos caros para los pasos difíciles.
- Pregunta: ¿Esto es un agente?
  Respuesta: No del todo: tú definiste el camino. Son flujos agénticos, más predecibles que un agente libre.

## Sesión 3: El ciclo del agente: razonar, actuar, observar (45 minutos)

Todo agente repite el mismo ciclo: piensa qué hacer, elige una herramienta y sus parámetros, recibe el resultado, y vuelve a pensar con esa nueva información. Termina cuando decide que tiene la respuesta o cuando llega a un límite.

Sus piezas: el modelo (el cerebro), el prompt del sistema (rol, objetivo, reglas), las herramientas (con buenas descripciones), la memoria (lo que recuerda de la conversación) y los límites (pasos máximos, tiempo, costo).

Cuando un agente falla, casi siempre es por herramientas mal descritas, demasiadas herramientas parecidas o un objetivo ambiguo. Revisar la traza (qué pensó y qué herramienta llamó en cada paso) es como depurar un agente.

Conceptos clave:
- Pensar → actuar → observar
- Modelo, prompt, herramientas, memoria, límites
- Descripciones de herramientas claras
- Leer la traza

Ejercicio práctico: Haz la Unidad 1 del curso de agentes de Hugging Face y dibuja el ciclo de un agente que reserva una reunión: qué herramientas necesita y qué pasos daría.

Preguntas frecuentes:
- Pregunta: ¿Cuántas herramientas le doy a un agente?
  Respuesta: Las mínimas necesarias. Con muchas herramientas parecidas el modelo se confunde; agrúpalas o divide en agentes especializados.
- Pregunta: ¿Qué es la traza de un agente?
  Respuesta: El registro de cada paso: qué decidió, qué herramienta llamó con qué datos y qué recibió. En n8n se ve en la ejecución del AI Agent.
- Pregunta: ¿Por qué poner un máximo de pasos?
  Respuesta: Para que no quede en bucle gastando tokens si no encuentra la respuesta.

## Sesión 4: Agentes en n8n: herramientas y sub-flujos (60 minutos)

El nodo AI Agent de n8n se conecta a un modelo de chat, a una memoria y a herramientas. Las herramientas pueden ser nodos (Google Sheets, Gmail, Calendar, HTTP Request), tu Vector Store de RAG o un flujo completo de n8n usado como herramienta (Call n8n Workflow Tool).

Esto último es poderoso: encapsulas lógica compleja y confiable en un sub-flujo (por ejemplo «crear lead en el CRM con validaciones») y el agente solo decide cuándo usarlo. Así combinas la flexibilidad del agente con la fiabilidad del flujo.

Para cada herramienta escribe una descripción que diga qué hace, cuándo usarla y qué parámetros espera. Prueba con preguntas variadas y revisa en cada ejecución qué herramienta eligió.

Conceptos clave:
- AI Agent + modelo + memoria + herramientas
- Nodos como herramientas
- Sub-flujos como herramientas
- Descripciones claras

Ejercicio práctico: Crea un agente de asistente de ventas con tres herramientas: buscar productos en una hoja, consultar tu RAG de documentos y registrar un lead (como sub-flujo con validación).

Preguntas frecuentes:
- Pregunta: ¿Por qué usar un sub-flujo como herramienta en vez de un nodo directo?
  Respuesta: Porque puedes validar datos, manejar errores y reutilizarlo. El agente no puede saltarse esas reglas.
- Pregunta: El agente usa la herramienta equivocada. ¿Qué cambio primero?
  Respuesta: La descripción de las herramientas y el prompt del sistema. Si dos se parecen, hazlas más distintas o únelas.
- Pregunta: ¿Qué modelo uso para el agente?
  Respuesta: Uno con buen tool use. Los modelos pequeños fallan más eligiendo herramientas; prueba y mide.

## Sesión 5: Memoria y contexto (45 minutos)

Un agente no recuerda nada entre llamadas a menos que le des memoria. La memoria de corto plazo es el historial de la conversación: en n8n, Simple Memory guarda los últimos mensajes; para producción, una memoria en Postgres o Redis que sobreviva a reinicios. Se identifica cada conversación con un id de sesión.

La memoria de largo plazo guarda datos útiles de interacciones pasadas (preferencias del cliente, decisiones) en una base de datos o un vector store, y se recupera cuando hace falta, como un RAG de recuerdos.

Cuidado con el tamaño: más historial significa más tokens y más costo. Limita la ventana a los últimos N mensajes o resume las conversaciones largas.

Conceptos clave:
- Corto plazo: historial
- Id de sesión
- Largo plazo: base de datos o vectores
- Limitar o resumir el historial

Ejercicio práctico: Agrega a tu agente una memoria en Postgres (Supabase) con id de sesión, y comprueba que recuerda el nombre del usuario entre mensajes pero no entre sesiones distintas.

Preguntas frecuentes:
- Pregunta: ¿Simple Memory sirve en producción?
  Respuesta: Para pruebas sí; en producción se pierde al reiniciar y no escala. Usa una memoria con base de datos.
- Pregunta: ¿Qué guardo en memoria de largo plazo?
  Respuesta: Datos que sirven en el futuro y que el usuario aceptó compartir: preferencias, pedidos anteriores. Nunca datos sensibles sin necesidad.
- Pregunta: ¿Cómo evito que la conversación se vuelva carísima?
  Respuesta: Limita la ventana de mensajes o resume periódicamente el historial en un mensaje corto.

## Sesión 6: MCP: el estándar para conectar herramientas (50 minutos)

Model Context Protocol (MCP) es un estándar abierto, creado por Anthropic y adoptado por gran parte de la industria, para conectar modelos con herramientas y datos. Un servidor MCP expone herramientas (y también recursos y prompts); cualquier cliente compatible (Claude Desktop, editores de código, n8n, otros agentes) puede usarlas sin integraciones a medida.

Es como un USB para la IA: escribes la conexión una vez y sirve en muchos lugares. Ya existen servidores para GitHub, bases de datos, Google Drive, Slack, navegadores y cientos más.

n8n puede actuar como cliente (usar herramientas de un servidor MCP en su AI Agent) y como servidor (exponer tus flujos como herramientas para otros agentes). Revisa los permisos de cada servidor antes de conectarlo: tiene acceso real a tus datos.

Conceptos clave:
- Servidor y cliente MCP
- Herramientas, recursos y prompts
- Escribir una vez, usar en muchos clientes
- n8n como cliente y como servidor

Ejercicio práctico: Haz el curso corto de MCP de DeepLearning.AI. Luego conecta un servidor MCP (por ejemplo el de sistema de archivos o uno de la lista oficial) a un cliente y úsalo en una conversación.

Preguntas frecuentes:
- Pregunta: ¿MCP reemplaza a las APIs?
  Respuesta: No. Un servidor MCP normalmente llama APIs por dentro. MCP estandariza cómo un modelo descubre y usa esas capacidades.
- Pregunta: ¿Es seguro instalar cualquier servidor MCP?
  Respuesta: No. Tiene los permisos que le des. Usa servidores oficiales o revisados, con permisos mínimos y credenciales propias.
- Pregunta: ¿Por qué importa para conseguir trabajo?
  Respuesta: Porque muchas empresas están conectando sus sistemas a agentes con MCP y buscan gente que entienda cómo hacerlo de forma segura.

## Sesión 7: Agentes confiables: límites, aprobación humana y costos (45 minutos)

Un agente en producción necesita barandas. Límites: pasos máximos, tiempo máximo, presupuesto de tokens por tarea. Permisos mínimos: si solo debe leer el calendario, no le des permiso de borrar. Aprobación humana: para acciones irreversibles o caras (enviar a clientes, pagar, borrar), el agente prepara y una persona aprueba; n8n permite pausar un flujo esperando una respuesta.

Observabilidad: registra cada ejecución con sus pasos, herramientas, tokens y resultado, para auditar y mejorar. Evaluación: igual que con prompts y RAG, un conjunto de tareas de prueba con el resultado esperado.

Aquí está la diferencia entre una demo vistosa y un sistema que una empresa se anima a usar.

Conceptos clave:
- Pasos, tiempo y presupuesto máximos
- Permisos mínimos
- Aprobación humana en acciones irreversibles
- Registro y evaluación

Ejercicio práctico: Agrega a tu agente un paso de aprobación: antes de registrar un lead o enviar un correo, envía la propuesta por Telegram o correo y espera tu confirmación.

Preguntas frecuentes:
- Pregunta: ¿Qué acciones siempre deberían pasar por una persona?
  Respuesta: Las irreversibles o con impacto externo: enviar comunicaciones a clientes, pagos, borrados y cambios de permisos.
- Pregunta: ¿Cómo estimo el costo de un agente?
  Respuesta: Mide en pruebas cuántos pasos y tokens usa por tarea en promedio y en el peor caso, y multiplica por el volumen esperado.
- Pregunta: ¿Qué es la inyección de prompts indirecta en agentes?
  Respuesta: Instrucciones maliciosas dentro de datos que el agente lee (un correo, una web). Por eso los permisos mínimos y la aprobación humana son tan importantes.

## Sesión 8: Proyecto 2 (parte 2): el asistente que actúa (90 minutos)

Convierte tu RAG en un agente útil. Además de responder sobre los documentos, que pueda: avisar por correo o Telegram cuando se agregue un documento nuevo relevante, crear una tarea o ticket cuando el usuario lo pida, y derivar a una persona cuando no sepa la respuesta.

Aplica todo lo del tema: herramientas con buenas descripciones, sub-flujos con validación, memoria con base de datos, máximo de pasos, aprobación humana para acciones externas y registro de ejecuciones.

Actualiza el README con el diagrama del agente, las herramientas, los límites de seguridad y la evaluación. Graba un video de 2 a 3 minutos mostrando una conversación completa, incluyendo un caso en que el agente dice que no sabe y deriva.

Conceptos clave:
- RAG + herramientas + memoria
- Sub-flujos validados
- Límites y aprobación
- Video con caso de derivación

Ejercicio práctico: Publica la versión final del Proyecto 2: flujos exportados, README en inglés con diagrama y límites, tabla de evaluación y video.

Preguntas frecuentes:
- Pregunta: ¿Por qué mostrar en el video un caso en que no sabe?
  Respuesta: Porque demuestra que el sistema es confiable. Los clientes temen que la IA invente; ver que deriva genera confianza.
- Pregunta: ¿Y si un reclutador quiere probarlo?
  Respuesta: Ofrece un enlace al chat con límites de uso, o un video y el flujo exportado para que lo importen. No dejes abierto algo que gaste tu saldo sin control.
- Pregunta: ¿Cómo lo describo en mi CV?
  Respuesta: Una línea con resultado: «Built a RAG agent over 40 regulations with 92 % answer accuracy, source citations and human handoff (n8n, Supabase pgvector, Claude)».

## Herramientas que se usan

- n8n (AI Agent): Agentes visuales con herramientas, memoria y sub-flujos. (Gratis autoalojado)
- Model Context Protocol: Estándar abierto para conectar herramientas y datos a los LLM. (Gratis (open source))
- Claude Desktop / clientes MCP: Probar servidores MCP conectados a un asistente. (Gratis con límites)
- LangGraph: Framework en Python para agentes con estados y control fino. (Gratis (open source))
- CrewAI: Framework para equipos de agentes con roles. (Gratis (open source) · plataforma de pago)

## Cursos recomendados

- Hugging Face AI Agents Course (Hugging Face, Inglés, gratis): Curso completo y gratuito de agentes, con certificado.
- MCP: Build Rich-Context AI Apps with Anthropic (DeepLearning.AI, Inglés, gratis): Curso corto oficial sobre MCP: servidores, clientes y casos.
- Hugging Face MCP Course (Hugging Face, Inglés, gratis): MCP de cero a construir tu propio servidor.
- AI Agents in LangGraph (DeepLearning.AI, Inglés, gratis): Construir un agente desde cero y luego con LangGraph.
- Introduction to LangGraph (LangChain Academy, Inglés, gratis): Curso oficial de LangChain Academy.
- Agentic AI (Andrew Ng) (DeepLearning.AI, Inglés, gratis): Patrones de diseño de agentes: reflexión, herramientas, planificación y multiagente. Gratis como oyente; el certificado requiere la membresía Pro (≈ USD 25 al mes).
- IBM RAG and Agentic AI (Coursera, Inglés, de pago): Certificado profesional que cubre RAG y agentes.

## Repositorios para practicar

- microsoft/ai-agents-for-beginners: Curso de Microsoft sobre agentes en lecciones cortas, con traducciones.
- NirDiamant/GenAI_Agents: Decenas de agentes de ejemplo explicados paso a paso.
- modelcontextprotocol/servers: Servidores MCP oficiales y de la comunidad.
- microsoft/mcp-for-beginners: Curso de MCP para principiantes en varios lenguajes.
- Shubhamsaboo/awesome-llm-apps: Colección de apps con agentes y RAG listas para estudiar.
- langchain-ai/langgraph: Framework de agentes con estados.
