# Clase: Git y GitHub

Curso: WorkJob Clases, preparación para trabajos remotos desde Perú en automatización con IA. Semana 1 del plan.
Público: personas que saben usar n8n y quieren conseguir trabajo remoto en automatización, LLMs, RAG y agentes de IA. Tienen inglés básico.
Resumen: Guardar versiones de tu trabajo, colaborar y mostrar tus proyectos. GitHub es tu portafolio técnico.

## Introducción

Git guarda la historia de tus archivos: cada cambio queda registrado y puedes volver atrás. GitHub es el sitio donde se publican esos repositorios, se colabora y, para ti, donde un reclutador ve lo que sabes hacer.

Aparece en una de cada siete ofertas, pero en la práctica lo dan por sentado en casi cualquier puesto técnico. Y hay un motivo más: tu perfil de GitHub con flujos de n8n documentados, proyectos de RAG y un README claro en inglés vale más que un certificado.

En estas 8 sesiones aprendes lo que se usa todos los días (commit, push, ramas, pull requests) y terminas con tu portafolio publicado en GitHub Pages.

## Objetivos

- Crear repositorios y guardar cambios con commits claros.
- Sincronizar tu trabajo con GitHub (push y pull).
- Trabajar con ramas y pull requests.
- Resolver un conflicto sin miedo.
- Proteger claves con .gitignore y variables de entorno.
- Publicar un portafolio y documentar proyectos con un buen README.

## Sesión 1: Por qué Git y cómo piensa (40 minutos)

Sin Git, versionas con nombres como flujo_final_v3_ahora_si.json. Con Git, cada versión es un commit: una foto del proyecto con un mensaje que explica qué cambió y quién lo hizo.

Git trabaja en tres zonas: el directorio de trabajo (tus archivos), el área de preparación o staging (lo que elegiste guardar) y el repositorio (la historia de commits). El ciclo diario es: editas, git add para preparar, git commit para guardar.

Git vive en tu PC; GitHub es un servidor donde subes una copia para respaldarla, compartirla y colaborar. Son cosas distintas: puedes usar Git sin GitHub.

Conceptos clave:
- Commit = foto con mensaje
- Trabajo → staging → repositorio
- Git (local) vs GitHub (remoto)

Ejercicio práctico: Instala Git, configura tu nombre y correo (git config --global user.name y user.email) y crea tu cuenta de GitHub con un nombre de usuario profesional.

Preguntas frecuentes:
- Pregunta: ¿Qué correo pongo en la configuración de Git?
  Respuesta: El de tu cuenta de GitHub, o el correo privado noreply que GitHub te ofrece si no quieres exponer el tuyo.
- Pregunta: ¿Git sirve para archivos que no son código?
  Respuesta: Sí, para cualquier texto: flujos de n8n exportados en JSON, prompts, documentación. Con archivos binarios grandes (videos) no es buena idea.
- Pregunta: ¿Qué nombre de usuario de GitHub conviene?
  Respuesta: Uno corto y profesional, idealmente tu nombre. Va a aparecer en tu CV y en la URL de tu portafolio.

## Sesión 2: Tu primer repositorio: init, add y commit (45 minutos)

git init convierte una carpeta en repositorio. git status te dice qué cambió y qué está preparado; úsalo todo el tiempo. git add archivo (o git add . para todo) prepara los cambios y git commit -m "mensaje" los guarda.

Un buen mensaje de commit dice qué y por qué en una línea corta, en imperativo: «Agrega reintentos al flujo de leads», no «cambios». Muchos equipos los escriben en inglés: «Add retry to lead workflow».

git log --oneline muestra la historia y git diff qué cambió antes de guardarlo. Haz commits pequeños y frecuentes: es más fácil entenderlos y deshacerlos.

Conceptos clave:
- git init, status, add, commit
- Mensajes claros en imperativo
- git log y git diff
- Commits pequeños

Ejercicio práctico: Crea una carpeta mis-flujos-n8n, exporta un flujo de n8n en JSON, guárdalo allí y haz tres commits con cambios distintos. Revisa la historia con git log --oneline.

Preguntas frecuentes:
- Pregunta: Hice git add de un archivo por error. ¿Cómo lo saco?
  Respuesta: git restore --staged archivo lo quita del staging sin borrar tus cambios.
- Pregunta: ¿Cómo corrijo el mensaje del último commit?
  Respuesta: git commit --amend -m "nuevo mensaje", siempre que no lo hayas subido todavía.
- Pregunta: ¿Cada cuánto hago commit?
  Respuesta: Cada vez que terminas un paso que funciona. Si el mensaje necesita la palabra «y», probablemente eran dos commits.

## Sesión 3: GitHub: remote, push y pull (45 minutos)

Para subir tu repositorio crea uno vacío en GitHub y conéctalo: git remote add origin URL. Luego git push -u origin main sube tus commits. Desde ahí, git push sube lo nuevo y git pull trae lo que otros (o tú desde otra PC) subieron.

git clone URL descarga un repositorio completo, con toda su historia. Es lo que harás con los repos de este curso para estudiarlos.

GitHub ya no acepta contraseñas en la terminal: usa GitHub Desktop, el inicio de sesión de VS Code o un token personal. Es la misma idea de autenticación que viste en APIs.

Conceptos clave:
- remote add origin
- push y pull
- clone
- Autenticación con token o GitHub Desktop

Ejercicio práctico: Sube tu repo mis-flujos-n8n a GitHub. Luego clona public-apis/public-apis y busca en su README tres APIs gratuitas que no pidan clave.

Preguntas frecuentes:
- Pregunta: git push me rechaza porque hay cambios remotos. ¿Qué hago?
  Respuesta: Primero git pull para traerlos e integrarlos, resuelve conflictos si aparecen, y vuelve a hacer push.
- Pregunta: ¿Repositorio público o privado?
  Respuesta: Para portafolio, público. Para trabajo de clientes o con datos sensibles, privado.
- Pregunta: ¿Qué diferencia hay entre clone y fork?
  Respuesta: Clone copia un repo a tu PC. Fork crea tu propia copia en GitHub, desde la que puedes proponer cambios al original.

## Sesión 4: Ramas y merge (50 minutos)

Una rama es una línea de trabajo paralela. Creas una para probar algo sin tocar la versión que funciona: git switch -c nueva-funcion. Trabajas, haces commits y, cuando está lista, la unes a main con git merge.

Así trabajan los equipos: main siempre funciona y cada cambio vive en su rama hasta que se revisa. Aunque trabajes solo, es un buen hábito: si el experimento sale mal, borras la rama y listo.

Learn Git Branching te deja ver gráficamente qué pasa con cada comando; 30 minutos allí te ahorran mucha confusión.

Conceptos clave:
- git switch -c rama
- main siempre estable
- git merge
- Borrar ramas terminadas

Ejercicio práctico: Haz los primeros niveles de Learn Git Branching. Luego, en tu repo, crea una rama mejora-errores, agrega un archivo y únela a main.

Preguntas frecuentes:
- Pregunta: ¿Pierdo mis cambios al cambiar de rama?
  Respuesta: No si hiciste commit. Si tienes cambios sin guardar, Git te avisará; guárdalos con commit o git stash antes de cambiar.
- Pregunta: ¿Qué es main y qué era master?
  Respuesta: Es el nombre de la rama principal. Antes se llamaba master; hoy GitHub usa main por defecto.
- Pregunta: ¿Merge o rebase?
  Respuesta: Merge une historias y deja registro de la unión; rebase reescribe tus commits encima de otra rama. Para empezar, usa merge.

## Sesión 5: Pull requests y colaboración (45 minutos)

Un pull request (PR) es la propuesta de unir una rama a otra, con espacio para revisar el código, comentar línea por línea y aprobar. Es el corazón del trabajo en equipo en GitHub, y en una empresa remota es como más te comunicarás con otros desarrolladores.

Un buen PR es pequeño, tiene un título claro y una descripción con qué cambia, por qué y cómo probarlo. Las revisiones son por escrito y en inglés casi siempre: practica responder comentarios con calma y precisión.

Los issues son la lista de tareas y errores de un proyecto. Leer los issues de n8n o de LangChain te enseña mucho sobre problemas reales.

Conceptos clave:
- PR = propuesta de cambio con revisión
- Título y descripción claros
- Comentarios por escrito
- Issues como lista de tareas

Ejercicio práctico: Sigue el tutorial de first-contributions: haz fork, crea una rama, agrega tu nombre y abre tu primer pull request a un proyecto real.

Preguntas frecuentes:
- Pregunta: ¿Qué pongo en la descripción de un PR?
  Respuesta: Qué cambia, por qué y cómo comprobarlo. Si hay capturas o un video corto, mejor.
- Pregunta: Me pidieron cambios en mi PR. ¿Abro otro?
  Respuesta: No. Haz nuevos commits en la misma rama y súbelos: el PR se actualiza solo.
- Pregunta: ¿Contribuir a open source ayuda a conseguir trabajo?
  Respuesta: Sí: demuestra que sabes colaborar, leer código ajeno y comunicarte por escrito en inglés, tres cosas que piden las ofertas remotas.

## Sesión 6: Conflictos y cómo deshacer cosas (45 minutos)

Un conflicto aparece cuando dos ramas cambiaron la misma línea. Git no adivina: marca el archivo con <<<<<<<, ======= y >>>>>>> mostrando ambas versiones. Tú eliges el resultado, borras las marcas, haces add y commit. VS Code te ofrece botones para aceptar una u otra.

Para deshacer: git restore archivo descarta cambios no guardados; git revert commit crea un commit que deshace otro (seguro, ideal si ya lo subiste); git reset mueve la historia hacia atrás (úsalo solo en commits que no subiste).

Regla de oro: nunca reescribas historia que ya compartiste con otros.

Conceptos clave:
- Marcas de conflicto
- Resolver, add y commit
- restore, revert, reset
- No reescribir historia compartida

Ejercicio práctico: Provoca un conflicto: cambia la misma línea en dos ramas distintas, intenta unirlas y resuélvelo en VS Code.

Preguntas frecuentes:
- Pregunta: ¿Cómo recupero un archivo que borré y ya hice commit?
  Respuesta: Si estaba en un commit anterior, git restore --source=COMMIT archivo lo recupera desde esa versión.
- Pregunta: ¿Revert o reset?
  Respuesta: Si el commit ya está en GitHub, revert. Reset solo para limpiar commits locales que nadie más tiene.
- Pregunta: ¿Cómo evito conflictos?
  Respuesta: Ramas cortas, commits pequeños y hacer pull seguido para integrar los cambios de los demás pronto.

## Sesión 7: Secretos, .gitignore y un buen README (45 minutos)

.gitignore lista lo que Git no debe guardar: archivos .env con claves, carpetas de dependencias (node_modules, .venv), datos personales. Créalo al empezar, no cuando ya subiste algo.

Los flujos de n8n exportados no incluyen las credenciales, pero revisa que no tengan claves pegadas en un nodo HTTP o en un nodo Code.

El README es la portada de tu repo. Un buen README en inglés tiene: qué problema resuelve, una captura o GIF, cómo funciona (diagrama simple), cómo instalarlo y qué tecnologías usa. Es lo primero que lee un reclutador: escríbelo como si fuera una mini propuesta comercial.

Conceptos clave:
- .gitignore desde el inicio
- Nada de claves en el código
- README: problema, captura, uso, tecnologías
- Escribirlo en inglés

Ejercicio práctico: Agrega a tu repo un .gitignore generado con gitignore.io y escribe un README en inglés con problema, captura del flujo, pasos para importarlo y tecnologías usadas.

Preguntas frecuentes:
- Pregunta: Ya subí un archivo que debía ignorar. ¿Basta con agregarlo a .gitignore?
  Respuesta: No: también debes quitarlo del repo con git rm --cached archivo y hacer commit. Si tenía claves, revócalas.
- Pregunta: ¿El README va en inglés o español?
  Respuesta: En inglés para llegar a empresas extranjeras. Puedes añadir una sección corta en español si tu público también es local.
- Pregunta: ¿Qué hace que un README destaque?
  Respuesta: Una captura o GIF arriba, resultados medibles («ahorra 5 horas por semana») e instrucciones que funcionan a la primera.

## Sesión 8: Tu portafolio en GitHub Pages (60 minutos)

GitHub Pages publica gratis una web estática desde un repositorio. Si el repo se llama tuusuario.github.io, la web queda en esa dirección. Es perfecta para tu portafolio: una página con tus proyectos, enlaces a cada repo y un video demo.

También puedes fijar hasta seis repos en tu perfil de GitHub y crear un README de perfil (un repo con tu mismo nombre de usuario) que se muestra arriba de tu perfil.

Tu perfil es tu carta de presentación técnica: foto, bio en una línea («Automation & AI developer · n8n · RAG»), enlace a LinkedIn y proyectos fijados con buenos README.

Conceptos clave:
- Repo usuario.github.io
- Repos fijados
- README de perfil
- Bio clara con tus herramientas

Ejercicio práctico: Crea el repo tuusuario.github.io con un index.html sencillo que liste tus proyectos, actívalo en Settings → Pages y fija tus mejores repos en tu perfil.

Preguntas frecuentes:
- Pregunta: ¿Necesito saber diseño web para el portafolio?
  Respuesta: No. Puedes diseñarlo en Figma o Canva, partir de una plantilla o pedir a un LLM una página simple y editarla. Importa más el contenido que la decoración.
- Pregunta: ¿Puedo usar un dominio propio?
  Respuesta: Sí, GitHub Pages permite dominios personalizados con HTTPS gratis. Solo pagas el dominio.
- Pregunta: ¿Cuántos proyectos muestro?
  Respuesta: Tres buenos son mejor que diez a medias. Uno de automatización, uno de RAG o agentes y uno de negocio con resultados.

## Herramientas que se usan

- Git: El programa de control de versiones. (Gratis)
- GitHub: Alojar repositorios, colaborar y mostrar tu portafolio. (Gratis)
- GitHub Desktop: Usar Git con una interfaz visual si la terminal te intimida. (Gratis)
- Visual Studio Code: Editor con Git integrado. (Gratis)
- GitHub Pages: Publicar una web estática gratis desde un repositorio. (Gratis)
- gitignore.io: Genera el .gitignore correcto para tu proyecto. (Gratis)

## Cursos recomendados

- Pro Git (libro oficial en español) (git-scm.com, Español, gratis): La referencia completa de Git, gratis y traducida.
- GitHub Skills (GitHub, Inglés, gratis): Cursos interactivos dentro de GitHub: haces el ejercicio y un bot te corrige.
- Learn Git Branching (Web, Español, gratis): Juego visual para entender ramas, merge y rebase.
- Introduction to Git and GitHub (Google) (Coursera, Inglés, de pago): Curso de Google con certificado; puedes verlo gratis como oyente.
- Curso Profesional de Git y GitHub (Platzi, Español, de pago): Git de cero a flujo profesional, en español.
- Git Complete: The definitive guide (Udemy, Inglés, de pago): Curso práctico de Git con terminal.

## Repositorios para practicar

- firstcontributions/first-contributions: Haz tu primera contribución open source paso a paso.
- mouredev/hello-git: Curso de Git y GitHub desde cero de MoureDev, en español.
- skills/introduction-to-github: El primer curso interactivo de GitHub Skills.
- github/gitignore: Plantillas oficiales de .gitignore por lenguaje.
