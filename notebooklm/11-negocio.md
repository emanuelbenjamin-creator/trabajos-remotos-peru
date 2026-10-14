# Clase: CRM, Zapier y Make

Curso: WorkJob Clases, preparación para trabajos remotos desde Perú en automatización con IA. Semana 3 del plan.
Público: personas que saben usar n8n y quieren conseguir trabajo remoto en automatización, LLMs, RAG y agentes de IA. Tienen inglés básico.
Resumen: Cómo funcionan las ventas en una empresa, HubSpot como CRM, y Zapier y Make además de n8n para atender a cualquier cliente.

## Introducción

Automatizar procesos de negocio exige entender el negocio. El CRM (Customer Relationship Management) es el sistema donde una empresa guarda sus contactos, oportunidades de venta y conversaciones; es el corazón de ventas, marketing y soporte, y de los procesos que más se automatizan.

CRM aparece en cerca de una de cada siete ofertas, y es de las habilidades más pedidas en las ofertas accesibles (no senior). Zapier y Make son los competidores de n8n: muchas empresas ya los usan y saber las tres herramientas te permite aceptar más proyectos.

En estas 8 sesiones aprendes el proceso comercial, HubSpot gratis, su API, Zapier y Make, y construyes el Proyecto 3: leads que entran, se clasifican con IA, llegan al CRM y generan un reporte semanal.

## Objetivos

- Explicar el embudo de ventas y el ciclo de vida de un cliente.
- Configurar HubSpot: contactos, empresas, negocios y etapas.
- Conectar un CRM por API y con n8n.
- Construir automatizaciones equivalentes en Zapier y Make.
- Elegir la herramienta correcta según el cliente.
- Entregar el Proyecto 3 con métricas de negocio.

## Sesión 1: Cómo vende una empresa: embudo y ciclo de vida (40 minutos)

Un cliente pasa por etapas: desconocido → visitante → lead (dejó sus datos) → lead calificado (tiene interés y presupuesto) → oportunidad (hay una propuesta) → cliente → cliente recurrente. Esto es el embudo de ventas.

Marketing atrae y califica; ventas convierte; servicio retiene. En cada paso hay tareas repetitivas que se automatizan: capturar el lead, enriquecer sus datos, asignarlo a un vendedor, recordar seguimientos, enviar propuestas, pedir reseñas.

Cuando un cliente te pida «automatizar ventas», pregunta primero por su embudo: ¿de dónde vienen los leads?, ¿quién los atiende?, ¿dónde se pierden? Las respuestas te dicen qué automatizar primero.

Conceptos clave:
- Embudo: lead → calificado → oportunidad → cliente
- Marketing, ventas y servicio
- Tareas repetitivas en cada etapa
- Preguntar antes de automatizar

Ejercicio práctico: Dibuja el embudo de un negocio que conozcas (una academia, una tienda online, una clínica) y marca 5 tareas repetitivas que podrías automatizar.

Preguntas frecuentes:
- Pregunta: ¿Qué es un lead calificado?
  Respuesta: Un contacto que cumple criterios para que valga la pena que ventas lo atienda: interés real, presupuesto, necesidad y autoridad para decidir.
- Pregunta: ¿Por qué importa que yo, que soy técnico, sepa esto?
  Respuesta: Porque te permite proponer automatizaciones con impacto en dinero y hablar el idioma del cliente, no solo el de las herramientas.
- Pregunta: ¿Qué es un MQL y un SQL?
  Respuesta: Marketing Qualified Lead (marketing lo considera listo) y Sales Qualified Lead (ventas lo aceptó). Son etapas comunes en los CRM.

## Sesión 2: HubSpot: contactos, empresas y negocios (50 minutos)

HubSpot organiza la información en objetos: contactos (personas), empresas, negocios (oportunidades de venta con monto y etapa) y tickets (soporte). Los objetos se asocian entre sí: un contacto trabaja en una empresa y participa en un negocio.

Cada objeto tiene propiedades (campos): las estándar y las personalizadas que crees, por ejemplo «fuente del lead» o «puntaje IA». Los negocios avanzan por un pipeline con etapas que defines.

El plan gratuito incluye contactos ilimitados, pipelines, formularios y correo básico. Crea tu cuenta y llénala con datos de prueba: aprenderlo usándolo es mucho más rápido que solo ver videos.

Conceptos clave:
- Objetos: contactos, empresas, negocios, tickets
- Asociaciones
- Propiedades personalizadas
- Pipeline y etapas

Ejercicio práctico: Crea una cuenta gratuita de HubSpot, define un pipeline de 5 etapas para una agencia de automatización, crea 2 propiedades personalizadas y registra 10 contactos y 3 negocios de prueba.

Preguntas frecuentes:
- Pregunta: ¿Cuál es la diferencia entre contacto y negocio?
  Respuesta: El contacto es la persona; el negocio es una oportunidad de venta concreta, con monto y etapa. Un contacto puede tener varios negocios.
- Pregunta: ¿Para qué sirven las propiedades personalizadas?
  Respuesta: Para guardar datos propios del negocio que luego usas en filtros, reportes y automatizaciones, como un puntaje calculado por IA.
- Pregunta: ¿HubSpot o Salesforce?
  Respuesta: HubSpot domina en pymes y startups por su facilidad; Salesforce en grandes empresas. Los conceptos son los mismos.

## Sesión 3: La API de HubSpot y n8n (50 minutos)

Todo lo que haces en HubSpot con clics se puede hacer por API: crear contactos, actualizar propiedades, mover negocios de etapa, buscar duplicados. Para conectarte creas una app privada en HubSpot, eliges los permisos (scopes) mínimos y obtienes un token.

En n8n tienes el nodo HubSpot para las operaciones comunes y el nodo HTTP Request para todo lo demás. Un patrón clave: antes de crear un contacto, búscalo por email para no duplicar; si existe, actualízalo (upsert).

También puedes recibir eventos de HubSpot con webhooks, por ejemplo cuando un negocio cambia de etapa, para disparar acciones en otros sistemas.

Conceptos clave:
- App privada y scopes mínimos
- Nodo HubSpot y HTTP Request
- Buscar antes de crear (upsert)
- Webhooks de HubSpot

Ejercicio práctico: Crea un flujo en n8n que reciba un lead por webhook, busque en HubSpot si existe por email, lo cree o lo actualice, y cree un negocio asociado en la primera etapa.

Preguntas frecuentes:
- Pregunta: ¿Qué son los scopes?
  Respuesta: Los permisos que pides para tu token: leer contactos, escribir negocios, etc. Pide solo los necesarios.
- Pregunta: ¿Por qué evitar duplicados es tan importante?
  Respuesta: Porque los duplicados confunden a ventas, rompen reportes y pueden hacer que un cliente reciba dos veces el mismo mensaje.
- Pregunta: ¿La API de HubSpot tiene límites?
  Respuesta: Sí, de peticiones por segundo y por día según el plan. Usa batching y reintentos como viste en el tema de APIs.

## Sesión 4: Zapier: automatizar en minutos (45 minutos)

Zapier funciona con Zaps: un disparador (trigger: llegó un formulario, una fila nueva, un correo) y una o varias acciones (crear contacto, enviar mensaje). Es la herramienta más fácil y con más integraciones; muchas empresas pequeñas ya la usan.

Tiene pasos de filtro, rutas (paths), formateadores de texto y fechas, y pasos de IA. Se paga por tarea ejecutada, así que para volúmenes altos o lógica compleja se vuelve cara: ahí n8n o Make suelen ganar.

Para ti, saber Zapier significa poder decir que sí a clientes que ya lo usan y poder recomendar con criterio cuándo migrar.

Conceptos clave:
- Zap = disparador + acciones
- Filtros, rutas y formateadores
- Cobro por tarea
- Fácil pero caro a gran escala

Ejercicio práctico: Rehace en Zapier (plan gratuito) una parte de tu Proyecto 1: formulario → filtro por prioridad → mensaje. Anota cuántas tareas consume por ejecución.

Preguntas frecuentes:
- Pregunta: ¿Qué es una tarea en Zapier?
  Respuesta: Cada acción que se ejecuta con éxito. Un Zap de 3 acciones que corre 100 veces consume 300 tareas.
- Pregunta: ¿Cuándo recomendarías Zapier a un cliente?
  Respuesta: Cuando el volumen es bajo, la lógica simple y el equipo no técnico quiere mantenerlo solo.
- Pregunta: ¿Qué ventaja tiene n8n frente a Zapier?
  Respuesta: Costo a gran escala (o autoalojado), código cuando hace falta, lógica compleja y agentes de IA más flexibles.

## Sesión 5: Make: escenarios visuales (45 minutos)

Make (antes Integromat) arma escenarios con módulos conectados en un lienzo visual, muy parecido a n8n. Maneja bien datos complejos: iteradores para recorrer listas, agregadores para juntarlas, routers para bifurcar y manejadores de errores.

Se paga por operaciones (cada módulo que se ejecuta) y suele ser más barato que Zapier para la misma lógica. Es muy popular entre agencias y freelancers, sobre todo en Latinoamérica y Europa.

Si ya sabes n8n, aprenderás Make en un par de horas: los conceptos son los mismos (disparador, módulos, mapeo de datos, errores). Lo importante es conocer sus nombres y sus límites.

Conceptos clave:
- Escenario y módulos
- Iterador, agregador y router
- Cobro por operaciones
- Popular en agencias

Ejercicio práctico: Haz el curso básico de Make Academy y rehace en Make el mismo flujo que hiciste en Zapier. Compara facilidad, límites y costo estimado.

Preguntas frecuentes:
- Pregunta: ¿Qué es un iterador en Make?
  Respuesta: Un módulo que toma una lista y la convierte en elementos individuales para procesarlos uno por uno, como los items de n8n.
- Pregunta: ¿Make o n8n?
  Respuesta: Make es más fácil para empezar y no necesitas servidor. n8n es más flexible, admite código y puede ser gratis autoalojado.
- Pregunta: ¿Vale la pena la insignia de Make Academy?
  Respuesta: Sí como señal en tu perfil de Upwork o LinkedIn, sobre todo si buscas proyectos de agencias.

## Sesión 6: n8n, Zapier o Make: cómo elegir y cómo cotizar (40 minutos)

Criterios para recomendar: volumen (muchas ejecuciones favorecen n8n autoalojado o Make), complejidad (código, agentes y lógica fina favorecen n8n), quién lo mantendrá (un equipo no técnico agradece Zapier), datos sensibles (n8n autoalojado mantiene todo en servidores propios) y qué usa ya el cliente.

Para cotizar, separa el costo de construcción (tus horas o un precio por proyecto) del costo de operación (licencias, servidor, tokens de IA) y del mantenimiento (soporte mensual). Muchos freelancers cobran un monto inicial y una mensualidad.

Escribir esta comparación en una propuesta muestra criterio profesional y evita sorpresas con facturas de tareas u operaciones.

Conceptos clave:
- Volumen, complejidad, mantenimiento, privacidad
- Construcción vs operación vs mantenimiento
- Mensualidad de soporte
- Propuesta clara

Ejercicio práctico: Escribe una propuesta de una página para automatizar los leads de una pyme: problema, solución, herramienta recomendada y por qué, costo de construcción, costo mensual y qué incluye el soporte.

Preguntas frecuentes:
- Pregunta: ¿Cobro por hora o por proyecto?
  Respuesta: Por proyecto cuando el alcance es claro; por hora cuando es exploratorio. Siempre con alcance escrito para evitar trabajo infinito.
- Pregunta: ¿Quién paga las licencias y los tokens de IA?
  Respuesta: Lo ideal es que el cliente tenga sus propias cuentas y pague directamente; así no financias su uso y él es dueño de todo.
- Pregunta: ¿Qué incluye un buen soporte mensual?
  Respuesta: Monitoreo de errores, ajustes menores, actualización de herramientas y un número de horas de cambios incluido.

## Sesión 7: IA aplicada a ventas y soporte (45 minutos)

Aquí se juntan todos tus temas. Casos que las empresas pagan: calificar leads con un LLM según la información del formulario y de su web; enriquecer contactos (sector, tamaño de empresa); redactar el primer correo de seguimiento personalizado para que el vendedor lo revise; resumir llamadas y actualizar el CRM; clasificar tickets de soporte y sugerir respuestas con RAG sobre la base de conocimiento.

El patrón ganador es «la IA prepara, la persona decide»: el sistema llena el CRM y redacta, pero el vendedor aprueba lo que sale hacia el cliente.

Mide siempre: tasa de respuesta a los correos, tiempo hasta el primer contacto, tickets resueltos sin escalar.

Conceptos clave:
- Calificación y enriquecimiento con IA
- Borradores para revisión humana
- Resúmenes al CRM
- Soporte con RAG

Ejercicio práctico: Agrega a tu flujo de HubSpot un paso de IA que calcule un puntaje de 1 a 10 con su justificación y lo guarde en una propiedad personalizada.

Preguntas frecuentes:
- Pregunta: ¿Es buena idea que la IA envíe correos a clientes sola?
  Respuesta: Al empezar, no. Primero borradores revisados; cuando la calidad está medida y es alta, se automatiza lo de bajo riesgo.
- Pregunta: ¿Cómo justifico el puntaje de la IA ante ventas?
  Respuesta: Guarda junto al puntaje la razón en una línea. Así el vendedor entiende y confía, y tú puedes revisar errores.
- Pregunta: ¿Qué datos no debería usar para calificar?
  Respuesta: Datos sensibles o que puedan discriminar (edad, género, origen). Califica por necesidad, presupuesto y encaje con el producto.

## Sesión 8: Proyecto 3: de lead a reporte semanal (90 minutos)

Junta el plan completo de la semana 3. Flujo: formulario o webhook recibe el lead → limpieza de datos → búsqueda de duplicados en HubSpot → IA calcula puntaje, razón y borrador de correo → upsert del contacto y negocio en HubSpot → aviso al vendedor con el borrador para aprobar → registro en Sheets o Supabase. Y un segundo flujo programado que cada lunes envía un reporte con leads nuevos, puntaje promedio, negocios por etapa y un enlace al dashboard de Looker Studio.

Documenta el caso con números: tiempo hasta el primer contacto antes y después (estimado), horas de carga manual ahorradas y costo mensual de la solución.

Este proyecto demuestra lo que piden las ofertas accesibles: CRM, Sheets, comunicación y automatización con IA.

Conceptos clave:
- Lead → limpieza → CRM → IA → aprobación
- Reporte semanal programado
- Dashboard enlazado
- Caso con números

Ejercicio práctico: Construye y publica el Proyecto 3 con README en inglés, capturas del CRM y del dashboard, propuesta comercial y video de 2 minutos.

Preguntas frecuentes:
- Pregunta: ¿Necesito HubSpot de pago para este proyecto?
  Respuesta: No. El plan gratuito y una app privada alcanzan para todo lo descrito.
- Pregunta: ¿Cómo programo el reporte semanal en n8n?
  Respuesta: Con un Schedule Trigger cada lunes a una hora fija, consultas a HubSpot o a tu base y un correo con el resumen.
- Pregunta: ¿Qué rol puedo buscar con estos tres proyectos?
  Respuesta: Automation specialist, AI automation engineer, operaciones de ventas (RevOps) o soporte técnico de automatización; también proyectos freelance en Upwork y Workana.

## Herramientas que se usan

- HubSpot CRM: CRM con plan gratuito muy completo; ideal para aprender y para pymes. (Gratis · planes de pago)
- Zapier: La plataforma de automatización más conocida, con miles de integraciones. (Gratis con límites · planes de pago)
- Make: Automatización visual con escenarios; muy usada por agencias. (Gratis con límites · planes de pago)
- n8n: Tu herramienta principal, para comparar. (Gratis autoalojado · nube de pago)
- API de HubSpot: Documentación para integrar HubSpot por API. (Gratis)
- Salesforce Trailhead: Entorno de práctica y cursos del CRM más grande del mundo. (Gratis)

## Cursos recomendados

- HubSpot Academy (HubSpot, Inglés y español, gratis): Cursos y certificaciones gratuitas de CRM, ventas, marketing y servicio.
- HubSpot CRM (curso) (HubSpot, Inglés, gratis): Uso del CRM paso a paso.
- Inbound Marketing (certificación) (HubSpot, Inglés y español, gratis): Metodología de atracción de clientes, muy citada en marketing.
- Make Academy (Make, Inglés, gratis): Cursos oficiales de Make con insignias, de básico a avanzado.
- Guías de Zapier (Zapier, Inglés, gratis): Guías oficiales de automatización y casos por área de negocio.
- Trailhead: Salesforce (Salesforce, Inglés y español, gratis): Rutas gratuitas de Salesforce; las certificaciones oficiales son de pago.
- Curso de HubSpot (Platzi, Español, de pago): HubSpot en español aplicado a marketing y ventas.

## Repositorios para practicar

- HubSpot/hubspot-api-python: Cliente oficial de la API de HubSpot para Python.
- Zie619/n8n-workflows: Busca flujos de CRM (HubSpot, Pipedrive) para estudiar cómo se integran.
- enescingoz/awesome-n8n-templates: Plantillas de n8n de ventas, marketing y soporte.
