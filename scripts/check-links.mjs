// Revisa los enlaces de learn/temas/*.json: los repos con la API de GitHub (existen, no archivados, estrellas) y el resto pidiendo la página.
// Guarda las estrellas en learn/repos.json. Sale con código 1 si hay enlaces rotos.
import fs from "node:fs";
import path from "node:path";

const LEARN = path.join(import.meta.dirname, "..", "learn");
const urls = new Map(); // url -> lugares donde aparece
for (const f of fs.readdirSync(path.join(LEARN, "temas")).filter((x) => x.endsWith(".json"))) {
  const t = JSON.parse(fs.readFileSync(path.join(LEARN, "temas", f), "utf8"));
  // Los enlaces internos (index.html#...) no se revisan
  const add = (u, where) => { if (!/^https?:/.test(u)) return; if (!urls.has(u)) urls.set(u, []); urls.get(u).push(`${f} ${where}`); };
  for (const k of ["herramientas", "cursos", "repos"]) for (const x of t[k] || []) add(x.u, k);
  (t.sesiones || []).forEach((s, i) => (s.links || []).forEach((l) => add(l.u, `sesión ${i + 1}`)));
}

const gh = { "User-Agent": "workjob-links", Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) gh.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
const UA = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36", Accept: "text/html,*/*" };
const stars = {}, broken = [], warn = [];

async function check(u) {
  const repo = /^https:\/\/github\.com\/([^/]+\/[^/#?]+)\/?$/.exec(u);
  try {
    if (repo) {
      const r = await fetch(`https://api.github.com/repos/${repo[1]}`, { headers: gh });
      // Sin token la API permite 60 consultas por hora: si se agota, basta con que la página del repo abra
      if (r.status === 403 || r.status === 429) {
        const p = await fetch(u, { headers: UA, signal: AbortSignal.timeout(20000) });
        if (p.status >= 400) broken.push(`${u} → ${p.status}`);
        return;
      }
      if (!r.ok) return broken.push(`${u} → ${r.status}`);
      const j = await r.json();
      if (j.archived) warn.push(`${u} (archivado)`);
      stars[repo[1].toLowerCase()] = j.stargazers_count;
      return;
    }
    let r = await fetch(u, { method: "GET", headers: UA, redirect: "follow", signal: AbortSignal.timeout(20000) });
    // Algunos sitios bloquean a los robots (403/429/999): se avisan, no cuentan como rotos
    if ([401, 403, 429, 999].includes(r.status)) return warn.push(`${u} → ${r.status} (bloquea robots, revisar a mano)`);
    if (r.status >= 400) broken.push(`${u} → ${r.status}`);
  } catch (e) { broken.push(`${u} → ${e.cause?.code || e.name}`); }
}

const list = [...urls.keys()];
for (let i = 0; i < list.length; i += 8) await Promise.all(list.slice(i, i + 8).map(check));

const prev = (() => { try { return JSON.parse(fs.readFileSync(path.join(LEARN, "repos.json"), "utf8")); } catch { return {}; } })();
fs.writeFileSync(path.join(LEARN, "repos.json"), JSON.stringify({ ...prev, ...stars }, null, 1) + "\n");
console.log(`${list.length} enlaces revisados, ${Object.keys(stars).length} repos`);
for (const w of warn) console.log("aviso:", w);
for (const b of broken) console.log("ROTO:", b, "←", urls.get(b.split(" ")[0]).join("; "));
process.exit(broken.length ? 1 : 0);
