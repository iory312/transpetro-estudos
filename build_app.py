#!/usr/bin/env python3
"""Gera index.html, manifest e sw.js a partir de src/ e data.json.

Uso: python3 build_app.py

Não rode extract.py aqui: ele lê /workspace/transpetro/build/*.py e a planilha
de erros, que não fazem parte deste repositório. Para mudar a interface ou a
sincronização, edite src/ e rode só este script.
"""
import hashlib, json, urllib.parse, shutil
from pathlib import Path
A = Path(__file__).parent
S = A / "src"
data = json.loads((A / "data.json").read_text(encoding="utf-8"))
dj = json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
js_files = ["storage.js", "merge.js", "a1.js", "a2.js", "a3.js", "a4.js", "a5.js", "sync.js"]
js = "\n".join((S / f).read_text(encoding="utf-8") for f in js_files)
assert "</script" not in js.lower()
icon = (S / "icon.svg").read_text(encoding="utf-8").strip()
html = (S / "template.html").read_text(encoding="utf-8")
html = html.replace("__ICON__", urllib.parse.quote(icon)).replace("__CSS__", (S / "style.css").read_text(encoding="utf-8"))
html = html.replace("__DATA__", dj).replace("__JS__", "(function(){\n" + js + "\n})();")
(A / "index.html").write_text(html, encoding="utf-8")
shutil.copy(S / "icon.svg", A / "icon.svg")
(A / "manifest.webmanifest").write_text(json.dumps({
  "name": "Transpetro 2026 · Ênfase 7", "short_name": "Transpetro E7", "lang": "pt-BR",
  "start_url": "./index.html", "scope": "./",
  "display": "standalone", "background_color": "#f4f6f9", "theme_color": "#0b6e8a",
  "icons": [{"src": "icon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any maskable"}]
}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
template = (S / "sw.template.js").read_text(encoding="utf-8")
ver = data["meta"]["versao"] + "-" + hashlib.sha256((html + template).encode("utf-8")).hexdigest()[:12]
audios = ["./" + a["file"] for a in data["audios"] if (A / a["file"]).exists()]
sw = template.replace("__CACHE__", "tp7-" + ver).replace("__AUDIOS__", json.dumps(audios, ensure_ascii=False))
(A / "sw.js").write_text(sw, encoding="utf-8")
print("index.html", len(html.encode()), "bytes; cache", "tp7-" + ver, "; audios no SW:", len(audios))
