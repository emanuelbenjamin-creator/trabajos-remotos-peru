# Genera un video resumen por tema de learn/temas: diapositivas + narración con voz neural + subtítulos.
# Uso: python scripts/make-videos.py [tema ...]   (sin argumentos: todos)
# Requiere: pip install edge-tts imageio-ffmpeg pillow. Las fuentes son las de Windows (Segoe UI).
# Salida: learn/videos/<tema>.mp4, <tema>.vtt (subtítulos) y <tema>.jpg (portada).
import asyncio, json, re, subprocess, sys, tempfile, textwrap
from pathlib import Path

import edge_tts
import imageio_ffmpeg
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
TEMAS = ROOT / "learn" / "temas"
OUT = ROOT / "learn" / "videos"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
VOICE, RATE = "es-PE-CamilaNeural", "+4%"
W, H = 1280, 720
PAUSE = 0.7  # silencio al final de cada diapositiva, en segundos

# Colores de template.html
BG, PANEL, LINE = (8, 10, 24), (21, 32, 43), (43, 59, 76)
INK, MUTED, MINT, LAV, PINK, YELLOW = (233, 235, 247), (141, 155, 174), (47, 245, 200), (220, 215, 255), (244, 63, 157), (245, 200, 75)
FONTS = Path("C:/Windows/Fonts")
def font(name, size):
    try: return ImageFont.truetype(str(FONTS / name), size)
    except OSError: return ImageFont.load_default(size)
F_TITLE, F_H2, F_BODY, F_SMALL = font("seguibl.ttf", 54), font("seguisb.ttf", 34), font("segoeui.ttf", 27), font("segoeui.ttf", 21)
F_MONO, F_LABEL = font("consola.ttf", 19), font("seguisb.ttf", 21)
SEMANAS = {1: "SEMANA 1 · APIS Y LLMS", 2: "SEMANA 2 · PYTHON, SQL, RAG Y AGENTES", 3: "SEMANA 3 · NEGOCIO Y POSTULACIÓN", 0: "DURANTE LAS 3 SEMANAS"}

def background():
    img = Image.new("RGB", (W, H), BG)
    glow = Image.new("RGB", (W, H), BG); g = ImageDraw.Draw(glow)
    g.ellipse((-200, 380, 520, 900), fill=(14, 80, 68)); g.ellipse((860, -220, 1500, 300), fill=(80, 14, 64))
    img = Image.blend(img, glow.filter(ImageFilter.GaussianBlur(160)), 0.85)
    d = ImageDraw.Draw(img, "RGBA")
    for x in range(0, W, 44): d.line((x, 0, x, H), fill=(47, 245, 200, 9))
    for y in range(0, H, 44): d.line((0, y, W, y), fill=(47, 245, 200, 9))
    return img
BG_IMG = background()

def plain(s):  # texto para mostrar: sin backticks
    return re.sub(r"`([^`]+)`", r"\1", s)

def wrap(d, text, f, width):
    lines, line = [], ""
    for word in text.split():
        test = (line + " " + word).strip()
        if d.textlength(test, font=f) <= width: line = test
        else: lines.append(line); line = word
    if line: lines.append(line)
    return lines

def frame(eyebrow, n, total):
    img = BG_IMG.copy(); d = ImageDraw.Draw(img, "RGBA")
    d.text((72, 52), "// " + eyebrow, font=F_MONO, fill=MINT)
    d.text((72, H - 52), "WorkJob · Clases", font=F_MONO, fill=MUTED, anchor="ls")
    d.text((W - 72, H - 52), f"{n} / {total}", font=F_MONO, fill=MUTED, anchor="rs")
    # Esquinas como en la portada de la web
    d.line((40, 40, 64, 40), fill=MINT, width=3); d.line((40, 40, 40, 64), fill=MINT, width=3)
    d.line((W - 64, H - 40, W - 40, H - 40), fill=MINT, width=3); d.line((W - 40, H - 64, W - 40, H - 40), fill=MINT, width=3)
    return img, d

def title(d, text, y, size_font=F_TITLE, color=INK, maxw=W - 144, max_lines=2):
    lines = wrap(d, plain(text), size_font, maxw)[:max_lines]
    for l in lines:
        d.text((72, y), l, font=size_font, fill=color); y += size_font.size + 12
    return y

def bullets(d, items, y, maxw=W - 190, f=F_BODY, gap=14, limit=H - 120):
    for it in items:
        lines = wrap(d, plain(it), f, maxw)
        if y + len(lines) * (f.size + 8) > limit: break
        d.ellipse((80, y + 11, 92, y + 23), fill=MINT)
        for l in lines:
            d.text((112, y), l, font=f, fill=INK); y += f.size + 8
        y += gap
    return y

def box(d, label, text, y, color=MINT):
    lines = wrap(d, plain(text), F_SMALL, W - 200)[:3]
    h = 58 + len(lines) * 30
    d.rounded_rectangle((72, y, W - 72, y + h), radius=16, fill=(47, 245, 200, 20), outline=color + (110,), width=2)
    d.text((96, y + 14), label, font=F_LABEL, fill=color)
    ty = y + 44
    for l in lines:
        d.text((96, ty), l, font=F_SMALL, fill=INK); ty += 30
    return y + h

def chip(d, text, x, y, fg=MINT, bg=(47, 245, 200, 34)):
    w = d.textlength(text, font=F_SMALL) + 36
    d.rounded_rectangle((x, y, x + w, y + 40), radius=20, fill=bg)
    d.text((x + 18, y + 8), text, font=F_SMALL, fill=fg)
    return x + w + 12

# Texto para narrar: sin símbolos que la voz leería mal; se omiten las frases con código
def speak(s):
    out = []
    for sent in re.split(r"(?<=[.!?])\s+", s.replace("\n", " ")):
        bad = False
        def code(m):
            nonlocal bad
            c = m.group(1)
            if re.fullmatch(r"[\w .\-/áéíóúñÁÉÍÓÚÑ]{1,30}", c): return c
            bad = True; return ""
        sent = re.sub(r"`([^`]+)`", code, sent)
        if bad or not sent.strip(): continue
        out.append(sent)
    t = " ".join(out)
    for a, b in [("→", ", "), ("≈", "unos "), ("·", ","), ("«", ""), ("»", ""), ("(", ", "), (")", ","), (" ,", ","), (",,", ",")]: t = t.replace(a, b)
    return re.sub(r"\s+", " ", t).strip()

def first_par(s): return s.split("\n\n")[0]

def slides_for(t, pct):
    total = 5 + len(t["sesiones"])
    week = SEMANAS.get(t["semana"], "")
    out = []
    # 1. Portada
    img, d = frame(f"CLASES · {week}", 1, total)
    y = title(d, t["titulo"], 210, font("seguibl.ttf", 64), LAV, max_lines=3)
    for l in wrap(d, plain(t["resumen"]), F_BODY, W - 300)[:3]:
        d.text((72, y + 10), l, font=F_BODY, fill=MUTED); y += 38
    x = chip(d, f"Lo piden {round(pct)} % de las ofertas", 72, y + 40, (251, 127, 191), (244, 63, 157, 40)) if pct is not None else 72
    chip(d, "8 sesiones", x, y + 40)
    out.append((img, f"{t['titulo']}. {t['resumen']}" + (f" Este tema lo piden alrededor del {round(pct)} por ciento de las ofertas del panel." if pct is not None else "") + " Son ocho sesiones; en este video te cuento qué vas a aprender en cada una."))
    # 2. Introducción
    img, d = frame(f"INTRODUCCIÓN · {t['titulo'].upper()}", 2, total)
    y = title(d, "¿Qué es y por qué importa?", 110, F_H2, MINT)
    pars = t["intro"].split("\n\n")
    for p in pars[:2]:
        for l in wrap(d, plain(p), F_BODY, W - 144)[:6]:
            d.text((72, y + 10), l, font=F_BODY, fill=INK); y += 38
        y += 22
    out.append((img, speak(" ".join(pars[:2]))))
    # 3. Objetivos
    img, d = frame("AL TERMINAR PODRÁS", 3, total)
    y = title(d, "Objetivos del tema", 110, F_H2, MINT)
    bullets(d, t["objetivos"], y + 20, f=F_BODY, gap=10)
    out.append((img, "Al terminar este tema podrás: " + "; ".join(o.rstrip(".") for o in [speak(x) for x in t["objetivos"]]) + "."))
    # 4. Una por sesión
    for i, s in enumerate(t["sesiones"], 1):
        img, d = frame(f"SESIÓN {i} DE {len(t['sesiones'])} · {s['min']} MIN", 3 + i, total)
        y = title(d, s["t"], 100)
        y = bullets(d, s["claves"], y + 24, limit=H - 230)
        box(d, "Práctica", s["practica"], max(y + 10, H - 270))
        out.append((img, f"Sesión {i}: {plain(s['t'])}. " + speak(first_par(s["texto"]))))
    # 5. Herramientas y cursos
    img, d = frame("HERRAMIENTAS Y CURSOS", total - 1, total)
    title(d, "Lo que vas a necesitar", 100, F_H2, MINT)
    free = [c for c in t["cursos"] if c["costo"] == "gratis"]; paid = [c for c in t["cursos"] if c["costo"] != "gratis"]
    cols = [("Herramientas", [h["n"] for h in t["herramientas"]][:6], MINT), ("Cursos gratis", [c["n"] + " · " + c["plataforma"] for c in free][:5], MINT), ("Cursos de pago", [c["n"] + " · " + c["plataforma"] for c in paid][:5], YELLOW)]
    cw = (W - 144 - 40) // 3
    for k, (head, items, col) in enumerate(cols):
        x0 = 72 + k * (cw + 20)
        d.rounded_rectangle((x0, 170, x0 + cw, H - 100), radius=16, fill=PANEL + (235,), outline=LINE, width=1)
        d.text((x0 + 22, 190), head, font=font("seguisb.ttf", 24), fill=col)
        yy = 236
        for it in items:
            for l in wrap(d, it, F_SMALL, cw - 44)[:2]:
                if yy > H - 140: break
                d.text((x0 + 22, yy), l, font=F_SMALL, fill=INK); yy += 28
            yy += 12
    narr = "Para estudiar este tema vas a usar: " + ", ".join(h["n"] for h in t["herramientas"][:5]) + "."
    if free: narr += " Cursos gratis recomendados: " + " y ".join(c["n"] for c in free[:2]) + "."
    if paid: narr += " Y si buscas un certificado, una buena opción de pago es " + paid[0]["n"] + "."
    out.append((img, speak(narr)))
    # 6. Cierre
    img, d = frame("TU SIGUIENTE PASO", total, total)
    y = title(d, "Empieza por la sesión 1", 220, font("seguibl.ttf", 60), LAV)
    for l in wrap(d, "Cada sesión tiene la explicación completa, un ejercicio práctico, preguntas con respuesta y enlaces para profundizar. Marca tus sesiones como completadas para ver tu progreso.", F_BODY, W - 300):
        d.text((72, y + 10), l, font=F_BODY, fill=MUTED); y += 38
    chip(d, "WorkJob → Clases → " + t["titulo"], 72, y + 40)
    out.append((img, "Todo el detalle, los ejercicios, las preguntas con sus respuestas y los enlaces a cursos y repositorios están en la página del tema. Empieza por la sesión uno y marca tu avance. ¡Muchos éxitos!"))
    return out

async def tts(text, mp3):
    com = edge_tts.Communicate(text, VOICE, rate=RATE)
    sub = edge_tts.SubMaker()
    with open(mp3, "wb") as f:
        async for ch in com.stream():
            if ch["type"] == "audio": f.write(ch["data"])
            elif ch["type"] in ("WordBoundary", "SentenceBoundary"): sub.feed(ch)
    return sub.get_srt()

def duration(path):
    err = subprocess.run([FFMPEG, "-i", str(path)], capture_output=True, text=True).stderr
    h, m, s = re.search(r"Duration: (\d+):(\d+):([\d.]+)", err).groups()
    return int(h) * 3600 + int(m) * 60 + float(s)

def srt_cues(srt):
    for block in srt.strip().split("\n\n"):
        lines = block.strip().splitlines()
        if len(lines) < 3: continue
        a, b = [sum(float(x) * k for x, k in zip(t.replace(",", ".").split(":"), (3600, 60, 1))) for t in lines[1].split(" --> ")]
        yield a, b, " ".join(lines[2:])

def ts(x):
    h, r = divmod(x, 3600); m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"

def build(tid, pct):
    t = json.loads((TEMAS / f"{tid}.json").read_text(encoding="utf-8"))
    slides = slides_for(t, pct)
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp); parts, vtt, offset = [], ["WEBVTT", ""], 0.0
        for k, (img, text) in enumerate(slides):
            png, mp3, mp4 = tmp / f"{k}.png", tmp / f"{k}.mp3", tmp / f"{k}.mp4"
            img.save(png)
            if k == 0: img.convert("RGB").save(OUT / f"{tid}.jpg", quality=82)
            srt = asyncio.run(tts(text, mp3))
            dur = duration(mp3) + PAUSE
            subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-loop", "1", "-framerate", "5", "-i", str(png), "-i", str(mp3),
                            "-af", f"apad=pad_dur={PAUSE}", "-t", f"{dur:.3f}", "-c:v", "libx264", "-tune", "stillimage", "-crf", "30",
                            "-pix_fmt", "yuv420p", "-r", "5", "-g", "50", "-c:a", "aac", "-b:a", "64k", "-ar", "24000", "-ac", "1", str(mp4)], check=True)
            for a, b, cue in srt_cues(srt):
                vtt += [f"{ts(offset + a)} --> {ts(offset + b)}", cue, ""]
            offset += duration(mp4); parts.append(mp4)
        lst = tmp / "list.txt"; lst.write_text("".join(f"file '{p.as_posix()}'\n" for p in parts), encoding="utf-8")
        subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-c", "copy", "-movflags", "+faststart", str(OUT / f"{tid}.mp4")], check=True)
    (OUT / f"{tid}.vtt").write_text("\n".join(vtt), encoding="utf-8")
    size = (OUT / f"{tid}.mp4").stat().st_size / 1e6
    print(f"{tid}: {len(slides)} diapositivas, {offset / 60:.1f} min, {size:.1f} MB")

def skill_pct():
    # El % de ofertas sale de la última página generada por build.js
    try:
        html = (ROOT / "public" / "index.html").read_text(encoding="utf-8")
        data = json.loads(re.search(r'<script id="data" type="application/json">(.*?)</script>', html, re.S).group(1))
        return {s["l"]: s["all"] for s in data["skills"]["list"]}
    except Exception: return {}

if __name__ == "__main__":
    pct = skill_pct()
    ids = sys.argv[1:] or sorted(p.stem for p in TEMAS.glob("*.json"))
    for tid in ids:
        skill = json.loads((TEMAS / f"{tid}.json").read_text(encoding="utf-8"))["skill"]
        build(tid, pct.get(skill))
