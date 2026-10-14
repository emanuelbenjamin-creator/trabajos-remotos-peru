# Videos de las clases con NotebookLM

En esta carpeta hay 13 archivos, uno por tema (`01-apis.md` … `13-ingles.md`). Cada uno tiene todo el contenido del tema: introducción, objetivos, las 8 sesiones con sus conceptos, ejercicios, preguntas y respuestas, herramientas, cursos y repositorios.

Para cada tema harás lo mismo. Toma unos 5 minutos de tu parte, más la espera mientras NotebookLM genera el video.

## Pasos por tema

1. Entra a https://notebooklm.google.com con tu cuenta de Google y crea un **cuaderno nuevo**. Usa un cuaderno por tema, para que el video hable solo de ese tema.
2. Ponle de nombre el título del tema, por ejemplo «RAG y bases vectoriales».
3. **Agrega la fuente**: sube el archivo `.md` del tema. Si no te deja subir `.md`, abre el archivo, copia todo y usa la opción de pegar texto (Copied text).
4. Revisa que el idioma de salida esté en **Español**: en Configuración → Idioma de salida (Output language).
5. En el panel **Studio**, busca **Video Overview** (Resumen en video). Antes de generarlo, usa el lápiz o la opción de personalizar:
   - Si te deja elegir formato, elige **Explicativo** (Explainer), no el breve.
   - Si te deja elegir estilo visual, elige uno limpio o clásico.
   - En el cuadro de instrucciones, pega el texto de la sección «Instrucción para el video» de abajo.
6. Genera el video y espera. Puede tardar varios minutos; puedes cerrar la pestaña y volver.
7. Míralo completo. Si algo está mal explicado, puedes generarlo otra vez con una instrucción más precisa.
8. **Descárgalo** (menú de tres puntos del video → Descargar) y guárdalo con el nombre corto del tema, sin el número (ver la tabla de abajo), en esta carpeta del proyecto:

   `trabajos-remotos/learn/videos/notebooklm/`

   Por ejemplo: `learn/videos/notebooklm/rag.mp4`

Cuando tengas uno o varios, avísame y los publico. La web usa el video de NotebookLM en los temas donde exista, y el video actual con voz sintética en los demás.

## Instrucción para el video (pégala en el cuadro de personalización)

> Explica este tema en español neutro, de forma clara y práctica, para alguien que ya usa n8n y busca su primer trabajo remoto en automatización con IA. Recorre las 8 sesiones en orden. En cada una explica la idea principal con un ejemplo concreto de negocio y menciona el ejercicio práctico. Usa diagramas simples para los procesos (por ejemplo: formulario → LLM → Google Sheets). No leas listas de cursos ni de enlaces; menciona solo que están en la página del tema. Cierra con los 3 errores más comunes y cómo evitarlos.

## Nombres de archivo

| Archivo fuente | Guardar el video como |
|---|---|
| 01-apis.md | `apis.mp4` |
| 02-js.md | `js.mp4` |
| 03-git.md | `git.mp4` |
| 04-llm.md | `llm.mp4` |
| 05-prompt.md | `prompt.mp4` |
| 06-python.md | `python.mp4` |
| 07-sql.md | `sql.mp4` |
| 08-rag.md | `rag.mp4` |
| 09-agentes.md | `agentes.mp4` |
| 10-datos.md | `datos.mp4` |
| 11-negocio.md | `negocio.mp4` |
| 12-postular.md | `postular.mp4` |
| 13-ingles.md | `ingles.mp4` |

## Notas

- Los videos de NotebookLM pueden durar más que los actuales y no traen subtítulos aparte.
- NotebookLM tiene un límite diario de videos que depende de tu plan. Si llegas al límite, sigue al día siguiente.
- Si cambias el contenido de una clase, vuelve a generar el `.md` con `python scripts/notebooklm-export.py` y crea el video otra vez.
- Revisa cada video antes de publicarlo: la IA puede simplificar de más o equivocarse en algún detalle.
