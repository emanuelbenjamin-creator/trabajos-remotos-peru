# Clase: APIs REST, JSON y webhooks

Curso: WorkJob Clases, preparación para trabajos remotos desde Perú en automatización con IA. Semana 1 del plan.
Público: personas que saben usar n8n y quieren conseguir trabajo remoto en automatización, LLMs, RAG y agentes de IA. Tienen inglés básico.
Resumen: Cómo se hablan las aplicaciones entre sí. Es la base de todo flujo de n8n, de cualquier integración y de las llamadas a un LLM.

## Introducción

Una API es la puerta por la que un programa le pide datos o acciones a otro. Cuando n8n lee una fila de Google Sheets, cuando un CRM recibe un lead o cuando le mandas un prompt a GPT o a Claude, por debajo hay una petición HTTP a una API REST que responde en JSON.

Es la habilidad técnica más pedida en las ofertas de este panel después del inglés y las habilidades blandas, y es la que más aparece en las ofertas que coinciden con tu perfil. Quien entiende APIs puede conectar cualquier herramienta con cualquier otra, aunque no exista un nodo hecho para eso.

En estas 8 sesiones vas a pasar de usar nodos ya armados a leer la documentación de cualquier API, autenticarte, manejar errores y recibir eventos con webhooks. Al final lo despliegas en la nube con Docker, que también piden muchas ofertas.

## Objetivos

- Explicar qué pasa en una petición HTTP: método, URL, headers, body y código de estado.
- Leer y escribir JSON sin errores y transformarlo en n8n.
- Autenticarte con API key, Bearer token y OAuth2.
- Consumir cualquier API desde Hoppscotch y desde el nodo HTTP Request de n8n.
- Recibir eventos con webhooks y responder correctamente.
- Manejar paginación, límites de uso y errores sin que el flujo se caiga.
- Levantar n8n con Docker y publicarlo en un servidor.

## Sesión 1: Qué es una API y cómo viaja una petición HTTP (45 minutos)

Imagina un restaurante: tú no entras a la cocina, le pides al mesero. La API es ese mesero. Tu programa (el cliente) envía una petición a una dirección (el endpoint) y el servidor responde.

Toda petición HTTP tiene cuatro partes: el método (qué quieres hacer), la URL (a qué recurso), los headers (datos extra como el formato o tu clave) y, a veces, un body con los datos que envías. La respuesta trae un código de estado y normalmente un body en JSON.

REST es un estilo de diseño: cada cosa es un recurso con su URL (/users/7, /orders) y los métodos dicen la acción. Por eso, cuando aprendes una API REST, las demás se parecen mucho.

Conceptos clave:
- Cliente, servidor y endpoint
- Método, URL, headers y body
- REST: recursos con URL propia
- Respuesta = código de estado + body

Ejercicio práctico: Abre Hoppscotch y haz un GET a https://jsonplaceholder.typicode.com/users/1. Identifica el código de estado, los headers de la respuesta y el body.

Preguntas frecuentes:
- Pregunta: ¿Cuál es la diferencia entre una API y un endpoint?
  Respuesta: La API es el conjunto completo de operaciones que ofrece un servicio. Un endpoint es una dirección concreta dentro de esa API, por ejemplo /users/1.
- Pregunta: ¿Dónde van los datos que envío al crear algo?
  Respuesta: En el body de la petición, normalmente en JSON. En la URL solo van identificadores y filtros cortos (query parameters).
- Pregunta: ¿Por qué casi todas las APIs modernas responden en JSON?
  Respuesta: Porque es texto liviano, fácil de leer para humanos y de convertir en objetos en cualquier lenguaje, incluido JavaScript, que es el lenguaje de los nodos Code de n8n.

## Sesión 2: JSON a fondo: objetos, arrays y rutas (45 minutos)

JSON solo tiene seis tipos de valor: texto entre comillas dobles, número, true/false, null, objeto {} y array []. Con eso se describe cualquier cosa: un cliente, un pedido con productos, la respuesta de un LLM.

Lo que más se practica en el trabajo es leer rutas: si la respuesta es {"data": {"items": [{"name": "Ana"}]}}, el nombre está en data.items[0].name. En n8n escribes exactamente eso dentro de una expresión: {{ $json.data.items[0].name }}.

Los errores típicos son comillas simples, comas al final y olvidar que los arrays empiezan en 0. Un validador de JSON te ahorra horas.

Conceptos clave:
- Seis tipos de valor
- Rutas con punto y corchetes
- Arrays empiezan en 0
- Expresiones de n8n: {{ $json.campo }}

Ejercicio práctico: Toma la respuesta de /users de JSONPlaceholder y escribe las rutas para obtener la ciudad del tercer usuario y el nombre de la empresa del primero. Pruébalas en un nodo Set de n8n.

Preguntas frecuentes:
- Pregunta: ¿Por qué {'a': 1} no es JSON válido?
  Respuesta: Porque JSON exige comillas dobles en las claves y en los textos. Debe ser {"a": 1}.
- Pregunta: ¿Qué devuelve items[2] si el array tiene 2 elementos?
  Respuesta: Nada (undefined): el último índice es 1. Es la causa de muchos errores en flujos que asumen que siempre hay datos.
- Pregunta: ¿Cómo trata n8n una respuesta que es un array?
  Respuesta: Normalmente separa cada elemento en un item. Así los nodos siguientes se ejecutan una vez por elemento.

## Sesión 3: Métodos y códigos de estado (40 minutos)

GET lee, POST crea, PUT reemplaza, PATCH modifica una parte y DELETE borra. GET no debe cambiar nada en el servidor; por eso puedes repetirlo sin miedo.

Los códigos de estado te dicen qué pasó sin leer el body: los 2xx son éxito (200 OK, 201 creado, 204 sin contenido), los 3xx redirecciones, los 4xx son errores tuyos (400 petición mal formada, 401 sin autenticar, 403 sin permiso, 404 no existe, 429 demasiadas peticiones) y los 5xx son errores del servidor.

Saber leerlos es la mitad del debugging: un 401 se arregla con la credencial, un 429 esperando y un 500 reintentando más tarde.

Conceptos clave:
- GET, POST, PUT, PATCH, DELETE
- 2xx éxito · 4xx tu error · 5xx error del servidor
- 401 vs 403
- 429 = límite de uso

Ejercicio práctico: En JSONPlaceholder haz un POST a /posts con un body JSON, luego un PATCH a /posts/1 y un DELETE. Anota el código que devuelve cada uno.

Preguntas frecuentes:
- Pregunta: ¿Qué diferencia hay entre 401 y 403?
  Respuesta: 401: el servidor no sabe quién eres (falta o es inválida la credencial). 403: sabe quién eres, pero no tienes permiso para eso.
- Pregunta: ¿Cuándo uso PUT y cuándo PATCH?
  Respuesta: PUT reemplaza el recurso completo; PATCH cambia solo los campos que envías. La mayoría de APIs modernas usan PATCH para actualizar.
- Pregunta: Recibo 500 de vez en cuando. ¿Qué hago?
  Respuesta: Configura reintentos con espera creciente. Si persiste, el problema es del servidor: guarda el caso y avisa al proveedor.

## Sesión 4: Autenticación: API keys, tokens y OAuth2 (50 minutos)

Casi toda API real pide identificarte. Las tres formas más comunes son: una API key en un header (x-api-key: ...), un token Bearer (Authorization: Bearer ...) y OAuth2, donde el usuario autoriza a tu app desde una pantalla de Google, HubSpot o Slack y tu app recibe un token temporal.

La regla de oro: una clave nunca va en el código ni en un repositorio público. En n8n se guardan como credenciales cifradas; en código, en variables de entorno o en un archivo .env que está en .gitignore.

Si una clave se filtra, se revoca y se crea otra. GitHub incluso escanea repos públicos buscando claves expuestas.

Conceptos clave:
- API key en header
- Bearer token
- OAuth2 y tokens que expiran
- Credenciales de n8n y archivos .env

Ejercicio práctico: Crea una cuenta gratuita en una API de la lista public-apis que pida API key (por ejemplo, clima) y llámala desde n8n guardando la clave como credencial Header Auth.

Preguntas frecuentes:
- Pregunta: ¿Por qué OAuth2 es más seguro que pedir la contraseña del usuario?
  Respuesta: Porque tu app nunca ve la contraseña: recibe un token con permisos limitados que el usuario puede revocar cuando quiera.
- Pregunta: Subí una API key a GitHub por error. ¿Basta con borrar el archivo?
  Respuesta: No. Queda en el historial de Git. Revoca la clave en el proveedor de inmediato y crea una nueva.
- Pregunta: ¿Qué es un refresh token?
  Respuesta: Un token de larga duración que sirve para pedir nuevos access tokens cuando expiran, sin que el usuario vuelva a iniciar sesión. n8n lo maneja solo en sus credenciales OAuth2.

## Sesión 5: El nodo HTTP Request de n8n (50 minutos)

Cuando n8n no tiene un nodo para un servicio, el nodo HTTP Request lo reemplaza. Configuras método, URL, autenticación, query parameters, headers y body, y el resultado sale como JSON para los nodos siguientes.

Un truco muy útil: casi toda documentación de APIs trae un ejemplo en curl. En HTTP Request puedes importar ese curl y n8n arma la petición por ti.

Aprende también las opciones avanzadas: Batching para no saturar la API, Pagination para traer todas las páginas, y Response para recibir el código de estado completo y decidir qué hacer con él.

Conceptos clave:
- Importar desde curl
- Query, headers y body
- Batching y Pagination
- Expresiones dentro de la URL

Ejercicio práctico: Construye un flujo: Manual Trigger → HTTP Request a la API de GitHub (https://api.github.com/repos/n8n-io/n8n) → Set que guarde nombre, estrellas y fecha de actualización.

Preguntas frecuentes:
- Pregunta: ¿Cómo paso un valor de un nodo anterior a la URL?
  Respuesta: Con una expresión, por ejemplo https://api.ejemplo.com/users/{{ $json.id }}.
- Pregunta: La API devuelve 100 resultados por página y hay 950. ¿Qué uso?
  Respuesta: La opción Pagination del nodo, indicando cómo se pide la siguiente página (número de página, cursor o URL que viene en la respuesta).
- Pregunta: ¿Por qué activar Batching?
  Respuesta: Para enviar las peticiones en grupos con pausas y no superar el límite de uso de la API (evitar el error 429).

## Sesión 6: Webhooks: que las apps te avisen (45 minutos)

Con una API tú preguntas; con un webhook el otro sistema te avisa. Le das una URL a Stripe, a un formulario o a GitHub, y cada vez que pasa algo (un pago, una respuesta, un push) te envía un POST con los datos.

En n8n el nodo Webhook crea esa URL. Tiene dos versiones: la de prueba, que solo escucha mientras pruebas, y la de producción, que funciona cuando el flujo está activo. Confundirlas es el error más común.

Buenas prácticas: responde rápido (un 200 en menos de unos segundos) y procesa después, valida que el aviso venga de quien dice (firma o secreto compartido) y prepárate para recibir el mismo evento dos veces.

Conceptos clave:
- Polling vs webhook
- URL de prueba vs producción
- Responder rápido
- Validar la firma y evitar duplicados

Ejercicio práctico: Crea un nodo Webhook en n8n, envíale un POST desde Hoppscotch con un JSON de un lead y guarda el lead en Google Sheets. Repite el envío con webhook.site para ver la petición cruda.

Preguntas frecuentes:
- Pregunta: Mi webhook funciona al probar pero no cuando cierro n8n. ¿Por qué?
  Respuesta: Estás usando la URL de prueba. Activa el flujo y usa la URL de producción.
- Pregunta: ¿Por qué podría llegar el mismo evento dos veces?
  Respuesta: Porque si tu servidor tarda o falla, el emisor reintenta. Guarda el id del evento y descarta los repetidos (idempotencia).
- Pregunta: ¿Qué conviene más para saber si llegó un correo nuevo: webhook o consultar cada minuto?
  Respuesta: El webhook, si el servicio lo ofrece: es inmediato y no gasta peticiones. Consultar cada cierto tiempo (polling) es el plan B.

## Sesión 7: Errores, reintentos y límites de uso (45 minutos)

Un flujo que funciona una vez no es un flujo de producción. Las APIs fallan, se demoran o te limitan. Lo que distingue a un profesional es que su automatización sigue funcionando y avisa cuando algo sale mal.

En n8n tienes tres herramientas: Retry On Fail en cada nodo (reintentos con espera), la opción On Error para seguir por otra rama en vez de detenerse, y un Error Workflow global que te manda un mensaje con el detalle cuando cualquier flujo falla.

Para los límites, lee la documentación: suelen indicar cuántas peticiones por minuto permiten y devuelven headers como Retry-After. Respeta esos números con Batching o un nodo Wait.

Conceptos clave:
- Retry On Fail
- Rama de error
- Error Workflow con aviso
- Header Retry-After

Ejercicio práctico: Crea un Error Workflow que te envíe por correo o Telegram el nombre del flujo, el nodo y el mensaje de error. Provoca un fallo con una URL inexistente y comprueba que llega el aviso.

Preguntas frecuentes:
- Pregunta: ¿Debo reintentar un error 400?
  Respuesta: No. Un 400 significa que tu petición está mal; reintentarla dará el mismo error. Se reintentan 429 y 5xx.
- Pregunta: ¿Qué información debe traer una alerta de error útil?
  Respuesta: Qué flujo, qué nodo, el mensaje, la hora y un enlace a la ejecución. Con eso cualquiera puede investigar.
- Pregunta: ¿Cómo explico esto en una entrevista?
  Respuesta: Cuenta un caso: «mis flujos tienen reintentos, una rama de error y un aviso a Slack; si una API cae, nadie pierde datos». Es justo lo que buscan.

## Sesión 8: Desplegar n8n con Docker en la nube (60 minutos)

Docker empaqueta una aplicación con todo lo que necesita en una imagen, y la ejecuta en un contenedor aislado. Así n8n corre igual en tu PC, en un servidor o en la nube. Docker y la nube (AWS, Azure, Google Cloud) aparecen en un buen número de ofertas, así que saber lo básico suma.

Con docker run o un archivo docker-compose.yml defines la imagen de n8n, el puerto, un volumen para no perder tus flujos y las variables de entorno. El starter kit oficial añade Postgres, Qdrant y Ollama para proyectos de IA.

Para publicarlo puedes usar un VPS barato, Render o Railway. Lo importante: HTTPS, una contraseña fuerte y copias de seguridad del volumen.

Conceptos clave:
- Imagen, contenedor y volumen
- docker-compose.yml
- Variables de entorno
- HTTPS y copias de seguridad

Ejercicio práctico: Instala Docker Desktop y levanta n8n en tu PC siguiendo la guía oficial. Importa un flujo, apaga y vuelve a encender el contenedor y verifica que el flujo sigue ahí gracias al volumen.

Preguntas frecuentes:
- Pregunta: ¿Por qué necesito un volumen?
  Respuesta: Porque un contenedor se puede borrar y recrear. El volumen guarda los datos de n8n fuera del contenedor para que no se pierdan.
- Pregunta: ¿n8n en la nube oficial o autoalojado?
  Respuesta: La nube oficial es más simple y tiene soporte; autoalojado es gratis y más flexible pero te toca mantenerlo. Para aprender, autoalojado en tu PC.
- Pregunta: ¿Qué es lo mínimo de seguridad al publicarlo?
  Respuesta: HTTPS, usuario con contraseña fuerte, n8n actualizado y no exponer puertos de la base de datos a internet.

## Herramientas que se usan

- n8n: Plataforma de automatización. Úsala en la nube (prueba gratis) o en tu PC con Docker. (Gratis autoalojado · nube de pago)
- Hoppscotch: Probar APIs desde el navegador sin instalar nada. (Gratis)
- Postman: El cliente de APIs más usado en empresas. Útil para colecciones y pruebas. (Gratis · planes de pago para equipos)
- webhook.site: Te da una URL para ver exactamente qué envía un webhook. (Gratis)
- JSONPlaceholder: API falsa para practicar GET, POST, PUT y DELETE. (Gratis)
- Docker Desktop: Correr n8n y bases de datos en contenedores. (Gratis para uso personal)
- Visual Studio Code: Editor para JSON, código y archivos de configuración. (Gratis)

## Cursos recomendados

- n8n Learn: cursos oficiales nivel 1 y 2 (n8n, Inglés, gratis): El camino oficial para aprender n8n, con flujos guiados y certificado.
- Postman Academy (Postman, Inglés, gratis): Fundamentos de APIs y pruebas, con insignias verificables.
- Panorama de HTTP (MDN) (MDN, Español, gratis): La referencia más confiable sobre cómo funciona HTTP.
- Docker: Get started (Docker, Inglés, gratis): Guía oficial de contenedores, imágenes y volúmenes.
- Curso de API REST (Platzi, Español, de pago): Consumo de APIs REST paso a paso, en español.
- Cursos de n8n en Udemy (Udemy, Inglés y español, de pago): Varios cursos prácticos de n8n con IA; revisa la fecha de actualización y las reseñas antes de comprar.
- Curso de n8n (Platzi, Español, de pago): Automatización con n8n en español.

## Repositorios para practicar

- public-apis/public-apis: Cientos de APIs gratuitas por categoría para practicar.
- n8n-io/n8n: El código de n8n. Mira los issues y el changelog para entender cómo evoluciona.
- enescingoz/awesome-n8n-templates: Plantillas de n8n listas para importar y estudiar.
- Zie619/n8n-workflows: Miles de flujos de n8n organizados por servicio.
- n8n-io/self-hosted-ai-starter-kit: Docker Compose oficial con n8n, Ollama, Qdrant y Postgres.
