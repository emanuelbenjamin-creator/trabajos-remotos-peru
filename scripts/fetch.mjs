// Descarga las ofertas de las bolsas públicas a raw/. Un fallo en una fuente no detiene a las demás.
import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAW = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "raw");
const UA = "Mozilla/5.0 (trabajos-remotos; panel personal de empleo)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (q) => q.toLowerCase().replace(/[^a-z0-9]/g, "");

// Términos del perfil: n8n, RAG, automatización con IA y diseño
const GOB_QUERIES = ["remoto", "peru", "inteligencia artificial", "administracion", "ventas", "soporte", "n8n", "automatizacion", "automation", "rag", "llm", "chatbot", "no-code", "zapier", "diseño", "ux", "figma", "agentes ia", "prompt"];
const HIM_QUERIES = ["n8n", "automation", "rag", "ai automation", "llm", "no-code", "zapier", "designer", "ux designer", "graphic designer", "prompt engineer", "chatbot", "ai agent"];

const gob = (q, page = 1) => `https://www.getonbrd.com/api/v0/search/jobs?query=${encodeURIComponent(q)}&per_page=100&page=${page}&expand=${encodeURIComponent('["company"]')}`;
const him = (extra) => `https://himalayas.app/jobs/api/search?country=PE&sort=recent${extra}`;

// Una lista por sitio: dentro de cada sitio las descargas van una tras otra, con pausa
const HOSTS = [
  [
    ...[1, 2, 3, 4].map((p) => [`gob_p${p}.json`, gob("remoto", p)]),
    ...GOB_QUERIES.slice(1).map((q) => [`gob_p9${slug(q)}.json`, gob(q)]),
  ],
  [
    ...Array.from({ length: 12 }, (_, i) => [`him_pe${i + 1}.json`, him(`&page=${i + 1}`)]),
    ...HIM_QUERIES.map((q) => [`him_pe_q${slug(q)}.json`, him(`&q=${encodeURIComponent(q)}`)]),
  ],
  [
    ["jobicy.json", "https://jobicy.com/api/v2/remote-jobs?count=100"],
    ["jobicy_latam.json", "https://jobicy.com/api/v2/remote-jobs?count=100&geo=latam"],
    ["jobicy_design.json", "https://jobicy.com/api/v2/remote-jobs?count=100&industry=design-multimedia"],
  ],
  [
    ["remoteok.json", "https://remoteok.com/api"],
    ["rok_ai.json", "https://remoteok.com/api?tag=ai"],
    ["rok_design.json", "https://remoteok.com/api?tag=design"],
  ],
  [
    ["wwr.xml", "https://weworkremotely.com/remote-jobs.rss"],
    ["wwr_design.xml", "https://weworkremotely.com/categories/remote-design-jobs.rss"],
  ],
  [["remotive.json", "https://remotive.com/api/remote-jobs"]],
  [["nomads.json", "https://www.workingnomads.com/api/exposed_jobs/"]],
];

async function get(file, url) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json, application/xml, */*" }, signal: AbortSignal.timeout(60000) });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const body = await res.text();
      await writeFile(path.join(RAW, file), body);
      return true;
    } catch (e) {
      console.error(`fallo ${file} (intento ${attempt}): ${e.message}`);
      await sleep(3000);
    }
  }
  return false;
}

await rm(RAW, { recursive: true, force: true });
await mkdir(RAW, { recursive: true });
const results = await Promise.all(HOSTS.map(async (list) => {
  let ok = 0;
  for (const [file, url] of list) { if (await get(file, url)) ok++; await sleep(700); }
  return [ok, list.length];
}));
const ok = results.reduce((n, r) => n + r[0], 0), total = results.reduce((n, r) => n + r[1], 0);
console.log(`descargas correctas: ${ok} de ${total}`);
