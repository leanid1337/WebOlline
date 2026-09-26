"""
Собирает готовую к выгрузке версию сайта в папку dist/.

Что делает:
  * минифицирует index.html, 404.html, styles.css, script.js, gallery.js, media/manifest.js
  * копирует media/, icons/ и служебные файлы (robots.txt, sitemap.xml, .htaccess и т.д.)
  * подставляет домен из переменной SITE_URL во все ссылки (canonical, og:url, sitemap)

Запуск:  python tools/build_site.py
Выгружать на хостинг нужно содержимое папки dist/.
"""
import os
import re
import shutil

SITE_URL = "https://ollline.design"          # <-- поменяйте на свой домен, без слэша в конце

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist")
TEXT_FILES = ["index.html", "404.html", "styles.css", "script.js", "gallery.js", "i18n.js"]
COPY_FILES = ["robots.txt", "sitemap.xml", "site.webmanifest", "favicon.ico", ".htaccess",
              "_headers", "netlify.toml", "vercel.json"]
COPY_DIRS = ["media", "icons"]


def minify_css(css):
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)          # комментарии
    css = re.sub(r"\s*\n\s*", "\n", css)
    css = re.sub(r"\n+", "", css)
    css = re.sub(r"\s*([{};:,>])\s*", r"\1", css)
    css = css.replace(";}", "}")
    return css.strip()


def minify_js(js):
    out, i, n = [], 0, len(js)
    while i < n:
        ch = js[i]
        if ch in "\"'`":                                      # строки оставляем как есть
            quote, j = ch, i + 1
            while j < n and (js[j] != quote or js[j - 1] == "\\"):
                j += 1
            out.append(js[i:j + 1]); i = j + 1; continue
        if js.startswith("//", i):                            # строчный комментарий
            j = js.find("\n", i)
            i = n if j < 0 else j
            continue
        if js.startswith("/*", i):                            # блочный комментарий
            j = js.find("*/", i)
            i = n if j < 0 else j + 2
            continue
        out.append(ch); i += 1
    js = "".join(out)
    js = re.sub(r"[ \t]+", " ", js)
    js = re.sub(r" *\n+ *", "\n", js)
    return js.strip()


def minify_html(html):
    html = re.sub(r"<!--(?!\[if).*?-->", "", html, flags=re.S)   # комментарии, кроме условных
    html = re.sub(r"\n\s*\n+", "\n", html)
    html = re.sub(r"^\s+", "", html, flags=re.M)                 # отступы в начале строк
    return html.strip()


def main():
    if os.path.isdir(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)

    saved = []
    for name in TEXT_FILES:
        src = os.path.join(ROOT, name)
        if not os.path.exists(src):
            continue
        text = open(src, encoding="utf-8").read()
        text = text.replace("https://ollline.design", SITE_URL)
        before = len(text.encode("utf-8"))
        if name.endswith(".css"):
            text = minify_css(text)
        elif name.endswith(".js"):
            text = minify_js(text)
        else:
            text = minify_html(text)
        after = len(text.encode("utf-8"))
        open(os.path.join(DIST, name), "w", encoding="utf-8").write(text)
        saved.append((name, before, after))

    for d in COPY_DIRS:
        src = os.path.join(ROOT, d)
        if os.path.isdir(src):
            shutil.copytree(src, os.path.join(DIST, d))

    manifest = os.path.join(DIST, "media", "manifest.js")
    if os.path.exists(manifest):
        text = open(manifest, encoding="utf-8").read()
        before = len(text.encode("utf-8"))
        text = minify_js(text)
        open(manifest, "w", encoding="utf-8").write(text)
        saved.append(("media/manifest.js", before, len(text.encode("utf-8"))))

    for name in COPY_FILES:
        src = os.path.join(ROOT, name)
        if not os.path.exists(src):
            continue
        if name.endswith((".ico", ".png", ".jpg", ".webp")):   # двоичные копируем как есть
            shutil.copy2(src, os.path.join(DIST, name))
            continue
        text = open(src, encoding="utf-8").read().replace("https://ollline.design", SITE_URL)
        open(os.path.join(DIST, name), "w", encoding="utf-8").write(text)

    total = sum(os.path.getsize(os.path.join(r, f))
                for r, _, fs in os.walk(DIST) for f in fs)
    for name, before, after in saved:
        print(f"{name:22} {before/1024:7.1f} KB -> {after/1024:6.1f} KB")
    print(f"\nПапка dist готова к выгрузке. Домен: {SITE_URL}. Общий размер: {total/1e6:.1f} MB")


if __name__ == "__main__":
    main()
