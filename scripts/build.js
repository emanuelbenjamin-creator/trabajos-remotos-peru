// Normaliza los feeds descargados en raw/ y genera public/index.html a partir de template.html
const fs = require("fs");
const path = require("path");
const RAW = path.join(__dirname, "..", "raw");
const j = (f) => { try { return JSON.parse(fs.readFileSync(path.join(RAW, f), "utf8")); } catch (e) { console.error("skip", f, e.message); return null; } };

const strip = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;|&rsquo;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
const fixMojibake = (s) => /Ã|Â/.test(s || "") ? Buffer.from(s, "latin1").toString("utf8") : (s || "");

// ¿Puede aplicar alguien que vive en Perú?
const PE_YES = /worldwide|anywhere|global|latam|latin america|latinoam|south america|sudam|americas|per[uú]\b|internationally|^remote$|^remoto$|todo el mundo/i;
function peru(loc, emptyMeans) {
  const l = (loc || "").trim();
  if (!l) return emptyMeans;
  return PE_YES.test(l) ? "si" : null;
}

const ES = /\b(de|para|con|los|las|una|experiencia|que|del|equipo|trabajo|conocimientos|somos|buscamos)\b/gi;
const EN = /\b(the|and|with|you|our|will|experience|team|for|are|work)\b/gi;
function language(text, hint) {
  const es = (text.match(ES) || []).length, en = (text.match(EN) || []).length;
  let spanish = hint === "es" ? true : hint === "en" ? false : es > en;
  if (hint === "es" && en > es * 3) spanish = false;
  if (!spanish) return "req";
  return /ingl[eé]s|english/i.test(text) ? "some" : "none";
}

const CATS = [
  ["ia", /\b(ai|ml|llm|nlp|ia|genai|mlops)\b|machine learning|deep learning|data scien|inteligencia artificial|prompt|data engineer|ingenier[oa] de datos|analytics|data analyst|analista de datos|cient[ií]fic[oa] de datos|\bbi\b|business intelligence/i],
  ["diseno", /design|dise[ñn]|\bux\b|\bui\b|product manager|product owner|producto|scrum|agile/i],
  ["ventas", /sales|ventas|marketing|\bseo\b|growth|account executive|business development|comercial|copywrit|content|social media|community/i],
  ["soporte", /support|soporte|customer success|customer service|atenci[oó]n|help ?desk|call center|servicio al cliente/i],
  ["ing", /engineer|developer|desarrollador|programador|devops|\bsre\b|\bqa\b|software|full.?stack|back.?end|front.?end|ingenier|architect|arquitect|sysadmin|security|cyber|mobile|android|\bios\b|java|python|react|node|\.net|php|cloud|tester|t[eé]cnic/i],
  ["admin", /admin|operations|operaciones|assistant|asistente|project manager|office|coordinator|coordinador|\bhr\b|recruit|reclut|people|talent|finance|financ|account|contab|legal|bookkeep|payroll|analyst|analista|manager|gerente|jefe|compliance|l[ií]der|director|head of|vice president|abastecimiento|log[ií]stic|supply|practicante/i],
];
const SRC_CAT = [
  [/machine learning|data sci|\bai\b|data/i, "ia"], [/design|product/i, "diseno"], [/sales|marketing|writing/i, "ventas"],
  [/support|customer/i, "soporte"], [/program|devops|sysadmin|develop|software|cyber|mobile|technical|qa|information technology|hardware/i, "ing"],
  [/operation|admin|management|finance|hr|people|legal|human|business|accounting/i, "admin"],
];
function category(title, srcCat) {
  for (const [id, re] of CATS) if (re.test(title)) return id;
  for (const [re, id] of SRC_CAT) if (re.test(srcCat || "")) return id;
  return "otros";
}

const money = (min, max, cur, per) => {
  min = +min || 0; max = +max || 0;
  if (!min && !max) return "";
  const f = (n) => n >= 1000 ? Math.round(n / 100) / 10 + "k" : String(n);
  const range = min && max && min !== max ? `${f(min)}–${f(max)}` : f(max || min);
  return `${cur || "USD"} ${range}${per ? "/" + per : ""}`;
};
const iso = (d) => { const t = typeof d === "number" ? new Date(d * 1000) : new Date(d); return isNaN(t) ? "" : t.toISOString().slice(0, 10); };

// Perfil: n8n, RAG, automatización con IA y diseño
const SKILLS = [
  ["n8n", 10, /\bn8n\b/i],
  ["RAG / LLM", 8, /\brag\b|retrieval.augmented|vector ?(db|database|store)|bases? de datos vectorial|embeddings?|langchain|llamaindex|pinecone|\bllms?\b/i],
  ["Agentes de IA", 6, /\bai agents?|agentes? (de )?ia\b|agentic|ag[eé]ntic|chatbots?|prompt engineer|prompting|openai|\bgpt\b|generative ai|ia generativa|genai|ai automation/i],
  ["Automatización", 5, /automation (developer|specialist|engineer|expert)|workflow automation|automatizaci[oó]n de (procesos|flujos)|analista de automatizaci[oó]n|zapier|make\.com|no.?code|low.?code|airtable|\brpa\b/i],
  ["Diseño", 5, /dise[ñn]ador|designer|\bux\b|\bui\b|dise[ñn]o (gr[aá]fico|web|ux|ui|de producto)|(graphic|web|product|visual) design/i, true],
  ["Figma / Canva", 3, /figma|canva\b|photoshop|illustrator/i],
];
// Pestaña Skills: qué piden las ofertas. Se busca en título y descripción completos; [etiqueta, grupo, regex]
const DEMAND = [
  ["Inglés", "Idioma", /\benglish\b|\bingl[eé]s\b/i],
  ["Comunicación", "Blandas", /communication skills|excellent (written|verbal|communication)|strong communicat|habilidades de comunicaci[oó]n|comunicaci[oó]n (efectiva|asertiva|oral|escrita)/i],
  ["Autonomía y proactividad", "Blandas", /self.?starter|self.?motivated|autonom|work independently|proactiv/i],
  ["Trabajo en equipo", "Blandas", /team ?player|teamwork|trabajo en equipo|collaborative (mindset|spirit|attitude)|esp[ií]ritu colaborativo/i],
  ["Resolución de problemas", "Blandas", /problem.?solving|resoluci[oó]n de problemas|analytical (skills|thinking|mind)|pensamiento anal[ií]tico/i],
  ["LLM / IA generativa", "IA y automatización", /\bllms?\b|large language model|generative ai|\bgenai\b|ia generativa|openai|\bgpt-?\d|chatgpt|\bclaude\b|anthropic|gemini/i],
  ["Agentes de IA", "IA y automatización", /\bai agents?\b|agentes? de ia|\bagentic\b|ag[eé]ntic[oa]s?/i],
  ["Prompt engineering", "IA y automatización", /prompt(ing| engineer| design)|ingenier[ií]a de prompts/i],
  ["RAG y bases vectoriales", "IA y automatización", /\brag\b|retrieval.augmented|embeddings?|vector (db|database|store|search)|pinecone|weaviate|qdrant|pgvector|chroma ?db/i],
  ["LangChain / LlamaIndex", "IA y automatización", /langchain|langgraph|llamaindex|llama.?index/i],
  ["Machine learning", "IA y automatización", /machine learning|aprendizaje autom[aá]tico|pytorch|tensorflow|scikit|\bml (engineer|models?|ops)\b|\bmlops\b/i],
  ["n8n", "IA y automatización", /\bn8n\b/i],
  ["Zapier / Make", "IA y automatización", /zapier|make\.com|integromat/i],
  ["No-code / low-code", "IA y automatización", /\bno.?code\b|\blow.?code\b|airtable|bubble\.io|retool/i],
  ["Automatización de procesos", "IA y automatización", /workflow automation|process automation|automate (workflows|processes)|automatizaci[oó]n de (procesos|flujos|tareas)|\brpa\b|uipath|power automate/i],
  ["APIs REST y webhooks", "Programación", /\bapis?\b|\brest(ful)?\b|webhooks?|graphql/i],
  ["Python", "Programación", /\bpython\b/i],
  ["JavaScript / TypeScript", "Programación", /javascript|typescript/i],
  ["React", "Programación", /\breact(\.js|js)?\b/i],
  ["Node.js", "Programación", /\bnode(\.js|js)\b|\bnode\b(?= ?(and|&|,|\/) ?(express|typescript|react))/i],
  ["Git / GitHub", "Programación", /\bgit\b|github|gitlab|bitbucket/i],
  ["Testing / QA", "Programación", /\bqa\b|quality assurance|unit tests?|test automation|automated testing|cypress|playwright|selenium|jest\b|pytest/i],
  ["SQL y bases de datos", "Datos", /\bsql\b|postgres|mysql|mongodb|bases? de datos|database/i],
  ["Excel / Google Sheets", "Datos", /\bexcel\b|google sheets|spreadsheets?|hojas de c[aá]lculo/i],
  ["Análisis de datos / BI", "Datos", /data analy|an[aá]lisis de datos|power ?bi|tableau|looker|dashboards?|\bkpis?\b/i],
  ["AWS", "Nube", /\baws\b|amazon web services|lambda functions?|\bs3\b|\bec2\b/i],
  ["Azure / Google Cloud", "Nube", /\bazure\b|\bgcp\b|google cloud/i],
  ["Docker / Kubernetes", "Nube", /docker|kubernetes|\bk8s\b|containeri[sz]/i],
  ["Figma", "Diseño", /figma/i],
  ["Adobe / Canva", "Diseño", /photoshop|illustrator|adobe|canva\b|after effects|premiere/i],
  ["UX / UI", "Diseño", /\bux\b|\bui\b|user experience|user interface|experiencia de usuario|usabilidad|usability/i],
  ["Portafolio", "Requisitos", /portfolio|portafolio/i],
  ["Título universitario", "Requisitos", /bachelor'?s|\bdegree\b|t[ií]tulo (universitario|profesional)|licenciatura|bachiller|egresad[oa]|titulad[oa]/i],
  ["CRM (HubSpot, Salesforce)", "Negocio", /hubspot|salesforce|pipedrive|zoho|\bcrm\b/i],
  ["Atención al cliente", "Negocio", /customer (service|support|success|experience)|atenci[oó]n al cliente|servicio al cliente|soporte al cliente/i],
  ["Marketing digital y SEO", "Negocio", /\bseo\b|\bsem\b|google ads|meta ads|facebook ads|marketing digital|digital marketing|email marketing|paid (media|social)/i],
  ["Agile / Scrum / Jira", "Negocio", /\bagile\b|scrum|kanban|\bjira\b|metodolog[ií]as? [aá]giles?/i],
  ["Gestión de proyectos", "Negocio", /project management|gesti[oó]n de proyectos|asana|trello|monday\.com|clickup|notion/i],
];
const SENIOR = /\b(senior|sr\.?|lead|principal|head|director|architect|arquitecto|staff|l[ií]der|jefe|vp)\b/i;
const JUNIOR = /\b(junior|jr\.?|trainee|practicante|intern(ship)?|entry.level|pasant[eí]a?)\b/i;

const jobs = [];
function add(o, text, langHint) {
  if (!o.t || !o.u || !o.pe) return;
  text = strip(text);
  o.t = strip(o.t).slice(0, 140); o.c = strip(o.c).slice(0, 60);
  o.l = (o.l || "").replace(/\s+/g, " ").trim().slice(0, 70);
  // Avisos en alemán o portugués no sirven para este panel
  const de = (text.match(/\b(und|der|die|für|wir|mit|sind|unser)\b/gi) || []).length, pt = (text.match(/\b(você|não|com|uma|são|nossa)\b|ção\b|ções\b/gi) || []).length;
  const enN = (text.match(EN) || []).length, esN = (text.match(ES) || []).length;
  if (de > enN + 2 || (pt > 4 && pt > esN / 2 && pt > enN)) return;
  o.lang = language(o.t + " " + text, langHint);
  o.cat = category(o.t, o.sc); delete o.sc;
  o.x = text.slice(0, 170);
  const all = o.t + " " + text;
  o.dk = DEMAND.reduce((a, d, i) => (d[2].test(all) && a.push(i), a), []);
  // Coincidencia con el perfil: el título pesa completo, el cuerpo la mitad
  let m = 0; const k = [];
  for (const [label, w, re, titleOnly] of SKILLS) {
    if (re.test(o.t)) { m += w; k.push(label); }
    else if (!titleOnly && re.test(text)) { m += w / 2; k.push(label); }
  }
  // Inglés básico: suben los avisos en español; bajan los cargos de mucha senioridad
  if (m && o.lang === "none") m += 4; else if (m && o.lang === "some") m += 3;
  if (m && SENIOR.test(o.t)) m -= 3;
  if (m < 1 && k.length) m = 1;
  o.m = Math.round(m); o.k = k;
  // Experiencia: el mayor número de años que el aviso pide junto a la palabra "experiencia"; -1 = no lo dice
  let e = -1;
  for (const y of text.matchAll(/(\d{1,2})\s*\+?\s*(?:(?:-|a|to|o)\s*\d{1,2}\s*\+?\s*)?(?:years?|yrs?|años?)/gi)) {
    const n = +y[1], near = text.slice(Math.max(0, y.index - 80), y.index + 100);
    if (n >= 1 && n <= 15 && /experien/i.test(near)) e = Math.max(e, n);
  }
  if (JUNIOR.test(o.t)) e = e < 0 ? 0 : Math.min(e, 1);
  o.e = e;
  // Pago mensual en USD (punto medio del rango), solo si el aviso lo publica en USD
  const pm = /^USD ([\d.]+)(k?)(?:–([\d.]+)(k?))?\/(año|mes)/.exec(o.sal || "");
  if (pm) { const lo = pm[1] * (pm[2] ? 1000 : 1), hi = pm[3] ? pm[3] * (pm[4] ? 1000 : 1) : lo; o.pay = Math.round((lo + hi) / 2 / (pm[5] === "año" ? 12 : 1)); }
  jobs.push(o);
}

// We Work Remotely (RSS)
{
  const xml = ["wwr.xml", "wwr_design.xml"].map((f) => { try { return fs.readFileSync(path.join(RAW, f), "utf8"); } catch (e) { console.error("skip", f, e.message); return ""; } }).join("\n");
  const tag = (s, t) => { const m = s.match(new RegExp(`<${t}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${t}>`)); return m ? m[1].trim() : ""; };
  for (const it of xml.split("<item>").slice(1)) {
    const full = strip(tag(it, "title")); const i = full.indexOf(": ");
    const region = tag(it, "region");
    add({ t: i > 0 ? full.slice(i + 2) : full, c: i > 0 ? full.slice(0, i) : "", s: "We Work Remotely", u: tag(it, "link") || tag(it, "guid"), l: region, d: iso(tag(it, "pubDate")), sc: tag(it, "category"), pe: peru(region, null), sal: "" }, strip(tag(it, "description")).replace(/^Headquarters:.*?URL: \S+/, ""));
  }
}
// Remotive
for (const f of ["remotive.json", "remotive_ai.json"]) for (const r of (j(f) || { jobs: [] }).jobs)
  add({ t: r.title, c: r.company_name, s: "Remotive", u: r.url, l: r.candidate_required_location, d: iso(r.publication_date), sc: r.category, pe: peru(r.candidate_required_location, null), sal: strip(r.salary).slice(0, 40) }, r.description);
// Jobicy
for (const f of ["jobicy.json", "jobicy_latam.json", "jobicy_design.json"]) for (const r of (j(f) || { jobs: [] }).jobs || [])
  add({ t: r.jobTitle, c: r.companyName, s: "Jobicy", u: r.url, l: r.jobGeo, d: iso(r.pubDate), sc: (r.jobIndustry || []).join(" "), pe: peru(r.jobGeo, null), sal: money(r.salaryMin, r.salaryMax, r.salaryCurrency, r.salaryPeriod === "yearly" ? "año" : r.salaryPeriod === "monthly" ? "mes" : "") }, (r.jobExcerpt || "") + " " + (r.jobDescription || ""));
// Himalayas (búsqueda country=PE: restricciones vacías = todo el mundo)
for (const f of fs.readdirSync(RAW).filter((x) => /^him_pe/.test(x))) for (const r of (j(f) || { jobs: [] }).jobs || []) {
  const lr = r.locationRestrictions || [];
  const loc = !lr.length ? "Todo el mundo" : lr.length > 4 ? (lr.includes("Peru") ? `Perú + ${lr.length - 1} países` : lr.slice(0, 3).join(", ") + "…") : lr.join(", ");
  add({ t: r.title, c: r.companyName, s: "Himalayas", u: r.applicationLink || r.guid, l: loc, d: iso(r.pubDate), sc: (r.parentCategories || []).join(" "), pe: !lr.length || lr.includes("Peru") ? "si" : null, sal: money(r.minSalary, r.maxSalary, r.currency, r.salaryPeriod === "annual" ? "año" : r.salaryPeriod === "monthly" ? "mes" : "") }, (r.excerpt || "") + " " + (r.description || ""));
}
// Working Nomads
for (const r of j("nomads.json") || [])
  add({ t: r.title, c: r.company_name, s: "Working Nomads", u: r.url, l: r.location, d: iso(r.pub_date), sc: r.category_name, pe: peru(r.location, null), sal: "" }, r.description);
// Remote OK (ubicación vacía = no indica restricción: hay que verificar)
for (const f of ["remoteok.json", "rok_ai.json", "rok_design.json"]) for (const r of (j(f) || []).slice(1)) {
  const loc = fixMojibake(r.location);
  add({ t: fixMojibake(r.position), c: fixMojibake(r.company), s: "Remote OK", u: r.url, l: loc || "No indica", d: iso(r.date), sc: (r.tags || []).join(" "), pe: peru(loc, "ver"), sal: money(r.salary_min, r.salary_max, "USD", "año") }, fixMojibake(r.description));
}
// Get on Board (LatAm, mayormente en español)
for (const f of fs.readdirSync(RAW).filter((x) => /^gob_(prog|p\d|peru)/.test(x))) for (const r of (j(f) || { data: [] }).data || []) {
  const a = r.attributes, countries = a.countries || [];
  let pe = null, loc = "";
  if (a.remote_modality === "fully_remote") { pe = "si"; loc = "Remoto global"; }
  else if (a.remote_modality === "remote_local" && countries.includes("Peru")) { pe = "si"; loc = "Remoto desde " + countries.join(", ").replace("Peru", "Perú"); }
  const co = a.company && a.company.data && a.company.data.attributes ? a.company.data.attributes.name : "";
  add({ t: a.title, c: co, s: "Get on Board", u: r.links.public_url, l: loc, d: iso(a.published_at), sc: a.category_name, pe, sal: money(a.min_salary, a.max_salary, "USD", "mes") }, [a.description, a.functions, a.desirable].join(" "), a.lang === "es" || a.lang === "en" ? a.lang : undefined);
}

// Quita duplicados y ordena por fecha
const seen = new Set();
const out = jobs.filter((o) => { const k = (o.t + "|" + o.c).toLowerCase(); if (seen.has(k) || seen.has(o.u)) return false; seen.add(k); seen.add(o.u); return true; })
  .sort((a, b) => (b.d || "").localeCompare(a.d || ""));

const tally = (k) => out.reduce((m, o) => (m[o[k]] = (m[o[k]] || 0) + 1, m), {});
console.log(out.length, tally("s"), tally("cat"), tally("lang"), tally("pe"));
console.log("coinciden con el perfil:", out.filter((o) => o.m > 0).length);

// Si las fuentes fallaron y hay muy pocas ofertas, no se publica: se conserva la página anterior
if (out.length < 150) { console.error("Muy pocas ofertas (" + out.length + "); se cancela la publicación."); process.exit(1); }

// Pestaña Skills. Accesible = no es un cargo senior y pide 2 años o menos (o no lo dice)
const pct = (c, n) => n ? Math.round(c / n * 1000) / 10 : 0;
const mine = out.filter((o) => o.m > 0), acc = out.filter((o) => !SENIOR.test(o.t) && o.e <= 2);
const catN = tally("cat");
const skillList = DEMAND.map(([l, g], i) => {
  const has = (o) => o.dk.includes(i);
  const cat = {}; for (const c in catN) cat[c] = pct(out.filter((o) => o.cat === c && has(o)).length, catN[c]);
  const s = { l, g, all: pct(out.filter(has).length, out.length), mine: pct(mine.filter(has).length, mine.length), acc: pct(acc.filter(has).length, acc.length), cat };
  s.r = Math.round((s.all * 0.5 + s.mine * 0.3 + s.acc * 0.2) * 10) / 10;
  return s;
}).sort((a, b) => b.r - a.r);
const pays = out.filter((o) => o.pay).map((o) => o.pay).sort((a, b) => a - b);
const q = (p) => pays.length ? pays[Math.floor((pays.length - 1) * p)] : 0;
const expBins = { "nd": 0, "0-1": 0, "2-3": 0, "4-5": 0, "6+": 0 };
for (const o of out) expBins[o.e < 0 ? "nd" : o.e <= 1 ? "0-1" : o.e <= 3 ? "2-3" : o.e <= 5 ? "4-5" : "6+"]++;
const skills = {
  n: out.length, nMine: mine.length, nAcc: acc.length, cats: catN, list: skillList,
  exp: expBins, lang: tally("lang"),
  junior: out.filter((o) => JUNIOR.test(o.t)).length, senior: out.filter((o) => SENIOR.test(o.t)).length,
  pay: { n: pays.length, p25: q(0.25), p50: q(0.5) },
};
console.log("skills top:", skillList.slice(0, 10).map((s) => s.l + " " + s.all + "%").join(", "));
for (const o of out) delete o.dk;

const tpl = fs.readFileSync(path.join(__dirname, "..", "template.html"), "utf8");
const data = JSON.stringify({ fetched: new Date().toISOString(), jobs: out, skills }).replace(/</g, "\\u003c");
const head = '<!doctype html>\n<html lang="es">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="robots" content="noindex">\n<style>body { margin: 0 } [hidden] { display: none !important }</style>\n';
const dest = path.join(__dirname, "..", "public", "index.html");
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, head + tpl.replace("/*__DATA__*/null", () => data));
console.log("wrote", dest, Math.round(fs.statSync(dest).size / 1024) + "KB");

// Clases: un JSON por tema en learn/temas, con el % de ofertas de su habilidad y las estrellas de learn/repos.json
{
  const LEARN = path.join(__dirname, "..", "learn");
  const stars = (() => { try { return JSON.parse(fs.readFileSync(path.join(LEARN, "repos.json"), "utf8")); } catch (e) { return {}; } })();
  const order = ["apis", "js", "git", "llm", "prompt", "python", "sql", "rag", "agentes", "datos", "negocio", "postular", "ingles"];
  const temas = fs.readdirSync(path.join(LEARN, "temas")).filter((f) => f.endsWith(".json")).map((f) => {
    const t = JSON.parse(fs.readFileSync(path.join(LEARN, "temas", f), "utf8"));
    const bad = [];
    for (const k of ["id", "titulo", "resumen", "skill", "intro", "objetivos", "herramientas", "cursos", "repos", "sesiones"]) if (t[k] == null) bad.push(k);
    if (!Array.isArray(t.sesiones) || t.sesiones.length !== 8) bad.push("8 sesiones");
    (t.sesiones || []).forEach((s, i) => { for (const k of ["t", "min", "texto", "claves", "practica", "preguntas"]) if (s[k] == null) bad.push(`sesión ${i + 1}: ${k}`); });
    if (!DEMAND.some((d) => d[0] === t.skill)) bad.push("skill desconocida: " + t.skill);
    if (bad.length) { console.error(`learn/temas/${f}: falta ${bad.join(", ")}`); process.exit(1); }
    for (const r of t.repos) { const k = r.u.replace("https://github.com/", "").toLowerCase(); if (stars[k]) r.stars = stars[k]; }
    return t;
  }).sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  const pct = {}; for (const s of skillList) pct[s.l] = s.all;
  const css = tpl.match(/<style>([\s\S]*?)<\/style>/)[1];
  const page = fs.readFileSync(path.join(LEARN, "template.html"), "utf8")
    .replace("/*__BASE_CSS__*/", () => css)
    .replace("/*__LEARN__*/null", () => JSON.stringify({ temas, pct }).replace(/</g, "\u003c"));
  const out2 = path.join(__dirname, "..", "public", "clases.html");
  fs.writeFileSync(out2, head + page);
  console.log("wrote", out2, temas.length, "temas", Math.round(fs.statSync(out2).size / 1024) + "KB");
}
