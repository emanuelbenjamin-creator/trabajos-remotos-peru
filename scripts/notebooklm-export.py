# Exporta cada tema de learn/temas a un texto listo para subir a NotebookLM (Video Overview).
# Uso: python scripts/notebooklm-export.py   →   notebooklm/<nn>-<tema>.md
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "notebooklm"
ORDER = ["apis", "js", "git", "llm", "prompt", "python", "sql", "rag", "agentes", "datos", "negocio", "postular", "ingles"]
SEMANA = {1: "Semana 1 del plan", 2: "Semana 2 del plan", 3: "Semana 3 del plan", 0: "Se estudia durante las 3 semanas del plan"}

def clean(s):
    return re.sub(r"`([^`]+)`", r"\1", s)

def export(n, tid):
    t = json.loads((ROOT / "learn" / "temas" / f"{tid}.json").read_text(encoding="utf-8"))
    L = [f"# Clase: {t['titulo']}", "",
         f"Curso: WorkJob Clases, preparación para trabajos remotos desde Perú en automatización con IA. {SEMANA[t['semana']]}.",
         f"Público: personas que saben usar n8n y quieren conseguir trabajo remoto en automatización, LLMs, RAG y agentes de IA. Tienen inglés básico.",
         f"Resumen: {clean(t['resumen'])}", "", "## Introducción", "", clean(t["intro"]), "", "## Objetivos", ""]
    L += [f"- {clean(o)}" for o in t["objetivos"]]
    for i, s in enumerate(t["sesiones"], 1):
        L += ["", f"## Sesión {i}: {clean(s['t'])} ({s['min']} minutos)", "", clean(s["texto"]), "", "Conceptos clave:"]
        L += [f"- {clean(c)}" for c in s["claves"]]
        L += ["", f"Ejercicio práctico: {clean(s['practica'])}", "", "Preguntas frecuentes:"]
        for q in s["preguntas"]:
            L += [f"- Pregunta: {clean(q['q'])}", f"  Respuesta: {clean(q['a'])}"]
    L += ["", "## Herramientas que se usan", ""]
    L += [f"- {h['n']}: {clean(h['para'])} ({h['costo']})" for h in t["herramientas"]]
    L += ["", "## Cursos recomendados", ""]
    L += [f"- {c['n']} ({c['plataforma']}, {c['idioma']}, {'gratis' if c['costo'] == 'gratis' else 'de pago'}): {clean(c.get('para', ''))}" for c in t["cursos"]]
    L += ["", "## Repositorios para practicar", ""]
    L += [f"- {r['u'].replace('https://github.com/', '')}: {clean(r['para'])}" for r in t["repos"]]
    name = f"{n:02d}-{tid}.md"
    (OUT / name).write_text("\n".join(L) + "\n", encoding="utf-8")
    return name, t["titulo"]

if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    for n, tid in enumerate(ORDER, 1):
        print(*export(n, tid))
