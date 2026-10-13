# WorkJob

Panel de ofertas remotas a las que se puede postular desde Perú, ordenadas por coincidencia con un perfil de n8n, RAG, automatización con IA y diseño.

GitHub Actions lo actualiza solo cada 3 horas y lo publica en GitHub Pages.

## Cómo funciona

- `scripts/fetch.mjs` descarga las ofertas de las fuentes públicas de We Work Remotely, Remotive, Himalayas, Jobicy, Working Nomads, Remote OK y Get on Board, y las guarda en `raw/`.
- `scripts/build.js` descarta las que no aplican a Perú, las clasifica (área, inglés, años de experiencia, coincidencia con el perfil) y genera `public/index.html` a partir de `template.html`.
- `.github/workflows/actualizar.yml` ejecuta ambos pasos y publica el resultado.

## Probar en tu computadora

```bash
node scripts/fetch.mjs
node scripts/build.js
```

Luego abre `public/index.html` en el navegador.

## Cambiar el perfil

Las habilidades y sus pesos están en la lista `SKILLS` de `scripts/build.js`.

## Pestaña Skills

En `#skills` la página muestra qué habilidades piden las ofertas, el mínimo de experiencia e inglés y un plan de 12 semanas. Las cifras se recalculan en cada actualización a partir de la lista `DEMAND` de `scripts/build.js`; el texto del plan está en `PLAN` dentro de `template.html`. Los términos de búsqueda están en `GOB_QUERIES` y `HIM_QUERIES` de `scripts/fetch.mjs`.

## Actualizar a mano

En GitHub: pestaña **Actions** → **Actualizar ofertas** → **Run workflow**.

Cada oferta enlaza a su aviso original en la bolsa de donde salió.
