"""
Builds web-ready media for the site from the "Портфолио" folder.

  Портфолио/
    1 Коммерческий дизайн/  Визуализации, Видео, Планировки, Рабочие чертежи
    2 Жилые интерьеры/      ...same
    3 Архитектура/          ...same
    _Обо мне/               Olga_Lavreka_.jpg (portrait photo), 1.mp4 (live portrait)
    Превью/                 background video for the first screen (first video file is used)
    _Дубликаты/             ignored

Outputs media/<section>/<type>/... and media/manifest.js (read by the site).
Source files are never modified. Files in media/ that no longer have a source are removed.
Re-run after adding or removing files:  python tools/build_media.py
Requires: Pillow, ffmpeg/ffprobe in PATH.
"""
import json
import os
import re
import subprocess
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = next((os.path.join(ROOT, n) for n in ("Портфолио", "portfolio", "Portfolio")
            if os.path.isdir(os.path.join(ROOT, n))), os.path.join(ROOT, "portfolio"))
OUT = os.path.join(ROOT, "media")

# folder name (without the leading number) -> (key, title shown on the site)
SECTIONS = {
    "Коммерческий дизайн": ("commercial", "Коммерческий дизайн"),
    "Жилые интерьеры": ("residential", "Жилые интерьеры"),
    "Архитектура": ("architecture", "Архитектура"),
}
TYPES = {  # folder -> (key, full-size long edge)
    "Визуализации": ("viz", 2000),
    "Видео": ("video", 1280),
    "Планировки": ("plan", 2400),
    "Рабочие чертежи": ("draw", 2600),
}
IMAGE_EXT = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".bmp"}
VIDEO_EXT = {".mp4", ".mov", ".m4v", ".webm", ".avi"}
PREVIEW_FOLDERS = {"превью", "первью", "preview"}
THUMB_W = 760
THUMB_SM_W = 420   # extra small thumbnail for phones (srcset)
HERO_VARIANTS = [(1600, 22), (1100, 24), (700, 27)]  # (long edge, crf) for the first-screen video
THUMB_MAX_H = 1100  # very tall sheets get a top crop for the grid

TRANSLIT = dict(zip("абвгдеёжзийклмнопрстуфхцчшщъыьэюя",
    ["a","b","v","g","d","e","e","zh","z","i","y","k","l","m","n","o","p","r","s","t","u","f","h","ts","ch","sh","sch","","y","","e","yu","ya"]))

produced = set()


def slug(name):
    base = os.path.splitext(name)[0].lower().replace("grok-video-", "v-")
    base = "".join(TRANSLIT.get(c, c) for c in base)
    base = re.sub(r"[^a-z0-9]+", "-", base).strip("-") or "item"
    return base[:40].strip("-")


def unique_name(name, used):
    n, i = name, 2
    while n in used:
        n, i = f"{name}-{i}", i + 1
    used.add(n)
    return n


def rel(path):
    return os.path.relpath(path, ROOT).replace(os.sep, "/")


def build_image(src, dst_dir, name, full_edge):
    os.makedirs(dst_dir, exist_ok=True)
    full_path = os.path.join(dst_dir, f"{name}.webp")
    thumb_path = os.path.join(dst_dir, f"{name}-thumb.webp")
    small_path = os.path.join(dst_dir, f"{name}-sm.webp")
    produced.update({full_path, thumb_path, small_path})
    fresh = all(os.path.exists(p) and os.path.getmtime(p) >= os.path.getmtime(src)
                for p in (full_path, thumb_path, small_path))

    if fresh:
        with Image.open(full_path) as f, Image.open(thumb_path) as t:
            fw, fh, tw, th = *f.size, *t.size
    else:
        im = Image.open(src).convert("RGB")
        w, h = im.size
        full = im.copy()
        if w >= h:
            full.thumbnail((full_edge, 16000), Image.LANCZOS)
        else:
            full.thumbnail((16000, full_edge), Image.LANCZOS)
            if full.width > full_edge:
                full.thumbnail((full_edge, 16000), Image.LANCZOS)
        full.save(full_path, "WEBP", quality=82, method=6)
        tw = min(THUMB_W, w)
        thumb = im.resize((tw, round(h * tw / w)), Image.LANCZOS)
        if thumb.height > THUMB_MAX_H:
            thumb = thumb.crop((0, 0, tw, THUMB_MAX_H))
        thumb.save(thumb_path, "WEBP", quality=78, method=6)
        sw = min(THUMB_SM_W, thumb.width)
        thumb.resize((sw, round(thumb.height * sw / thumb.width)), Image.LANCZOS)              .save(small_path, "WEBP", quality=72, method=6)
        fw, fh, tw, th = *full.size, *thumb.size
    return {"src": rel(full_path), "thumb": rel(thumb_path), "small": rel(small_path),
            "w": tw, "h": th, "fw": fw, "fh": fh}


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0",
                          "-show_entries", "stream=width,height", "-of", "json", path],
                         capture_output=True, text=True).stdout
    s = json.loads(out)["streams"][0]
    return s["width"], s["height"]


def build_video(src, dst_dir, name, long_edge=1280, crf=26, fps=30):
    os.makedirs(dst_dir, exist_ok=True)
    mp4 = os.path.join(dst_dir, f"{name}.mp4")
    poster = os.path.join(dst_dir, f"{name}.webp")
    produced.update({mp4, poster})
    if not (os.path.exists(mp4) and os.path.getmtime(mp4) >= os.path.getmtime(src)):
        w, h = probe(src)
        scale = min(1, long_edge / max(w, h))
        vw, vh = int(w * scale) // 2 * 2, int(h * scale) // 2 * 2
        vf = f"scale={vw}:{vh}:flags=lanczos" + (f",fps={fps}" if fps else "")
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", src, "-an",
                        "-vf", vf,
                        "-c:v", "libx264", "-preset", "slow", "-crf", str(crf),
                        "-pix_fmt", "yuv420p", "-movflags", "+faststart", mp4], check=True)
        if os.path.exists(poster):
            os.remove(poster)
    vw, vh = probe(mp4)
    if not os.path.exists(poster):
        png = subprocess.run(["ffmpeg", "-v", "error", "-ss", "0.1", "-i", mp4, "-frames:v", "1",
                              "-f", "image2pipe", "-vcodec", "png", "-"], capture_output=True).stdout
        tmp = poster + ".png"
        with open(tmp, "wb") as fh:
            fh.write(png)
        Image.open(tmp).convert("RGB").save(poster, "WEBP", quality=78, method=6)
        os.remove(tmp)
    return {"src": rel(mp4), "poster": rel(poster), "w": vw, "h": vh, "type": "video"}


def strip_number(folder):
    return re.sub(r"^\s*\d+[\s._-]*", "", folder).strip()


def main():
    sections = []
    hero = None
    for folder in sorted(os.listdir(SRC)):
        path = os.path.join(SRC, folder)
        if folder.startswith("_") or not os.path.isdir(path):
            continue
        name = strip_number(folder)
        if name.lower() in PREVIEW_FOLDERS:
            videos = [f for f in sorted(os.listdir(path)) if os.path.splitext(f)[1].lower() in VIDEO_EXT]
            if videos:
                src_video = os.path.join(path, videos[0])
                hero_dir = os.path.join(OUT, "hero")
                variants = []
                for edge, crf in HERO_VARIANTS:
                    v = build_video(src_video, hero_dir, f"preview-{edge}", edge, crf, fps=None)
                    os.remove(os.path.join(hero_dir, f"preview-{edge}.webp"))  # poster made separately
                    produced.discard(os.path.join(hero_dir, f"preview-{edge}.webp"))
                    variants.append({"src": v["src"], "w": v["w"], "h": v["h"],
                                     "size": os.path.getsize(os.path.join(ROOT, v["src"]))})
                    print("hero variant:", v["w"], "x", v["h"], round(variants[-1]["size"] / 1e6, 1), "MB")
                poster = os.path.join(hero_dir, "preview-poster.webp")
                produced.add(poster)
                if not os.path.exists(poster):
                    png = subprocess.run(["ffmpeg", "-v", "error", "-ss", "2", "-i", src_video,
                                          "-frames:v", "1", "-vf", "scale=1600:-2",
                                          "-f", "image2pipe", "-vcodec", "png", "-"],
                                         capture_output=True).stdout
                    tmp = poster + ".png"
                    with open(tmp, "wb") as fh:
                        fh.write(png)
                    Image.open(tmp).convert("RGB").save(poster, "WEBP", quality=72, method=6)
                    os.remove(tmp)
                hero = {"variants": variants, "poster": rel(poster)}
            continue
        key, title = SECTIONS.get(name, (slug(name), name))
        items = {k: [] for k, _ in TYPES.values()}
        for tfolder, (tkey, edge) in TYPES.items():
            tpath = os.path.join(path, tfolder)
            if not os.path.isdir(tpath):
                continue
            used, jobs = set(), []
            for f in sorted(os.listdir(tpath), key=str.lower):
                ext = os.path.splitext(f)[1].lower()
                if (tkey == "video") != (ext in VIDEO_EXT) or ext not in IMAGE_EXT | VIDEO_EXT:
                    continue
                jobs.append((os.path.join(tpath, f), unique_name(slug(f), used)))
            dst = os.path.join(OUT, key, tkey)
            if tkey == "video":
                with ThreadPoolExecutor(3) as ex:
                    items[tkey] = list(ex.map(lambda j: build_video(j[0], dst, j[1], edge), jobs))
            else:
                with ThreadPoolExecutor(6) as ex:
                    items[tkey] = list(ex.map(lambda j: build_image(j[0], dst, j[1], edge), jobs))
        sections.append({"key": key, "title": title, "items": items})
        print(title, {k: len(v) for k, v in items.items()})

    about_src = os.path.join(SRC, "_Обо мне")
    about = {}
    for f in sorted(os.listdir(about_src)) if os.path.isdir(about_src) else []:
        ext = os.path.splitext(f)[1].lower()
        if ext in IMAGE_EXT and "photo" not in about:
            about["photo"] = build_image(os.path.join(about_src, f), os.path.join(OUT, "about"), "olga", 1400)
        elif ext in VIDEO_EXT and "video" not in about:
            about["video"] = build_video(os.path.join(about_src, f), os.path.join(OUT, "about"), "olga-live", 960, 22)

    manifest_path = os.path.join(OUT, "manifest.js")
    produced.add(manifest_path)
    with open(manifest_path, "w", encoding="utf-8") as fh:
        fh.write("/* generated by tools/build_media.py, do not edit */\n")
        fh.write("window.OLLINE_MEDIA = " + json.dumps({"sections": sections, "about": about, "hero": hero},
                                                       ensure_ascii=False, indent=1) + ";\n")

    # remove outputs whose source is gone
    removed = 0
    for root, _, files in os.walk(OUT, topdown=False):
        for f in files:
            p = os.path.join(root, f)
            if p not in produced:
                os.remove(p); removed += 1
        if root != OUT and not os.listdir(root):
            os.rmdir(root)
    print("stale files removed:", removed)


if __name__ == "__main__":
    main()
