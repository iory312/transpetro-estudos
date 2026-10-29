# -*- coding: utf-8 -*-
"""Extrai o conteúdo de /workspace/transpetro/build/*.py para data.json (app de estudo).
Reexecute após atualizar o material:  python3 extract.py  &&  python3 build_app.py
Simulado 2: se build/sim2.py expuser SIM2 com 70 questões (dict area/stem/alts/ans/com[/bizu/topic]),
ele é incluído automaticamente."""
import sys, os, re, json, datetime as dt, importlib
from pathlib import Path
from bs4 import BeautifulSoup
BUILD = Path("/workspace/transpetro/build"); sys.path.insert(0, str(BUILD)); os.chdir(BUILD)
import lib
import ofensiva, defensiva, compliance, gerais, simulado, frente   # mesma ordem do build.py (gabaritos dependem dela)
_src = open("build.py", encoding="utf-8").read()
ns = {"dt": dt}
exec(_src[_src.index("FC = ["):_src.index("\ndef flashcards")], ns)
exec(_src[_src.index("PLANO = ["):_src.index("DIAS = [")], ns)
exec(_src[_src.index("DIA_PROVA = ["):_src.index("def dia_prova")], ns)
FC, PLANO, DIA_PROVA = ns["FC"], ns["PLANO"], ns["DIA_PROVA"]

MODS = [("of", "Ofensiva", ofensiva.SECOES, "Módulo 1 — Segurança Ofensiva"),
        ("df", "Defensiva", defensiva.SECOES, "Módulo 2 — Segurança Defensiva"),
        ("cp", "Compliance", compliance.SECOES, "Módulo 3 — Compliance"),
        ("ge", "Gerais", gerais.SECOES, "Módulo 4 — Português e Inglês")]
def mod_of(tid): return {"of": "Ofensiva", "df": "Defensiva", "cp": "Compliance"}.get(tid[:2], "Português" if tid.startswith("pt") else "Inglês")

def txt(h): return BeautifulSoup(h, "html.parser").get_text(" ", strip=True)

topics, bizus = [], []
for pre, mod, secs, mtit in MODS:
    for sid, tit, body, prio in secs:
        topics.append(dict(id=sid, mod=mod_of(sid), modTitle=mtit, title=tit, prio=prio or "Média", html=body))
        soup = BeautifulSoup(body, "html.parser")
        for box in soup.select("div.box"):
            kind = [c for c in box["class"] if c != "box"][0]
            if kind not in ("bizu", "peg", "atn", "dica"): continue
            h = box.select_one(".boxh").get_text(" ", strip=True)
            b = box.select_one(".boxb").decode_contents()
            bizus.append(dict(id=f"b{len(bizus)+1}", kind=kind, topic=sid, mod=mod_of(sid), title=h, html=b))

# --- passagens (textos de PT/EN) separadas do enunciado
passages = {}
REF = re.compile(r"texto|período|sentence|text\b|paragraph|parágrafo|trecho|\(\d+\)", re.I)
def split_passage(stem, key, carry):
    m = re.match(r'\s*(<div class="texto">.*?</div>)(.*)$', stem, re.S)
    if m:
        pid = f"p{len(passages)+1}"; passages[pid] = m.group(1); return m.group(2).strip(), pid, (key, pid)
    if carry and carry[0] == key and REF.search(stem): return stem, carry[1], carry
    return stem, None, carry

questions, carry = [], None
tmeta = {t["id"]: t for t in topics}
for q in lib.QUESTOES:
    stem, pid, carry = split_passage(q["stem"], q["topic"][:2], carry)
    t = tmeta[q["topic"]]
    questions.append(dict(id=f"f{q['n']}", n=q["n"], src="fix", topic=q["topic"], mod=t["mod"], prio=t["prio"],
                          stem=stem, passage=pid, alts=q["alts"], ans=q["ans"], com=q["com"]))

AREA = {"PT": ("Português", "Língua Portuguesa"), "EN": ("Inglês", "Língua Inglesa"), "OF": ("Ofensiva", "Específicos – Ofensiva"),
        "DF": ("Defensiva", "Específicos – Defensiva"), "CP": ("Compliance", "Específicos – Compliance")}
BLOCOS = [dict(id="ger", nome="Conhecimentos Gerais", areas=["PT", "EN"], max=20, min=10),
          dict(id="esp", nome="Conhecimentos Específicos", areas=["OF", "DF", "CP"], max=50, min=25)]
def build_sim(sid, nome, qs):
    out, carry = [], None
    for i, q in enumerate(qs, 1):
        stem, pid, carry = split_passage(q["stem"], q["area"], carry)
        if pid is None and q["area"] in ("PT", "EN") and carry and carry[0] == q["area"]: pid = carry[1]
        d = dict(id=f"{sid}q{i}", n=i, src=sid, area=q["area"], mod=AREA[q["area"]][0], stem=stem, passage=pid,
                 alts=q["alts"], ans=q["ans"], com=q["com"])
        if q.get("bizu"): d["bizu"] = q["bizu"]
        if q.get("topic"): d["topic"] = q["topic"]
        out.append(d)
    return dict(id=sid, nome=nome, duracaoMin=270, label="Inédita · estilo Cesgranrio", questions=out)

sims = [build_sim("s1", "Simulado 1", lib.SIMULADO)]
try:
    import contextlib, io
    try:
        with contextlib.redirect_stdout(io.StringIO()): sim2 = importlib.import_module("simulado2")
        S2 = getattr(sim2, "S2", [])
    except Exception as e0:
        print("simulado2.py falhou (", e0, ") — tentando sim2.py")
        sim2 = importlib.import_module("sim2"); S2 = getattr(sim2, "SIM2", [])
    if len(S2) == 70 and all(k in S2[0] for k in ("area", "stem", "alts", "ans", "com")):
        sims.append(build_sim("s2", "Simulado 2", S2)); print("Simulado 2 incluído")
    else: print(f"Simulado 2 ainda incompleto ({len(S2)} questões) — não incluído")
except Exception as e:
    print("Simulado 2 não incluído:", type(e).__name__, e)

# --- glossário
gloss = [dict(en=a, pt=b, tipo="Técnico") for a, b in gerais.GLOSS]
en1 = next(s for s in gerais.SECOES if s[0] == "en1")[2]
for tb in BeautifulSoup(en1, "html.parser").select("table"):
    hdr = [th.get_text(" ", strip=True) for th in tb.select("thead th")]
    for tr in tb.select("tbody tr"):
        c = [td.get_text(" ", strip=True) for td in tr.select("td")]
        if hdr and hdr[0].startswith("Falso"):
            gloss.append(dict(en=c[0], pt=c[1], tipo="Falso cognato", nota="não significa: " + c[2]))
        elif hdr and "onect" in " ".join(hdr):
            gloss.append(dict(en=c[0], pt=c[1], tipo="Conector", nota=(("equivalente: " + c[2]) if len(c) > 2 and c[2] else "")))


# --- Leitura em Inglês (textos reais com fonte + questões inéditas)
LJ = Path("/workspace/transpetro/material/extras/ingles_leitura/passages.json")
leitura = []
if LJ.exists():
    import html as _H
    for P in json.loads(LJ.read_text(encoding="utf-8")):
        tid = f"le{P['id']}"
        paras = "".join(f"<p>{_H.escape(x)}</p>" for x in P["excerpt"].split("\n\n") if x.strip())
        src = f'<p class="small">Fonte: {_H.escape(P["fonte"])}' + (f' — <a href="{_H.escape(P["url"])}" target="_blank" rel="noopener">{_H.escape(P["url"])}</a>' if P.get("url") else "") + "</p>"
        pid = f"p{len(passages)+1}"
        passages[pid] = f'<div class="texto"><p class="tt">Text {P["id"]} — {_H.escape(P["tema"])} (texto real)</p>{paras}{src}</div>'
        voc = "".join(f"<tr><td><b>{_H.escape(a)}</b></td><td>{_H.escape(b)}</td></tr>" for a, b in P.get("vocab", []))
        body = (passages[pid] + (f'<h4>Vocabulário</h4><table class="tb"><thead><tr><th>Termo</th><th>Tradução</th></tr></thead><tbody>{voc}</tbody></table>' if voc else "")
                + (f'<div class="box bizu"><div class="boxh">Conectivos do texto</div><div class="boxb">{", ".join(_H.escape(c) for c in P.get("conectivos", []))}</div></div>' if P.get("conectivos") else ""))
        topics.append(dict(id=tid, mod="Inglês", modTitle="Leitura em Inglês (textos reais)", title=f"Text {P['id']} — {P['tema']}", prio="Alta", html=body, fonte=P["fonte"], url=P.get("url", "")))
        leitura.append(dict(id=tid, n=P["id"], tema=P["tema"], fonte=P["fonte"], url=P.get("url", ""), passage=pid, nq=len(P["qs"])))
        for j, (stem, alts, ans, com) in enumerate(P["qs"], 1):
            assert len(alts) == 5 and ans in "ABCDE"
            questions.append(dict(id=f"l{P['id']}_{j}", n=j, src="leit", topic=tid, mod="Inglês", prio="Alta", stem=_H.escape(stem), passage=pid,
                                  alts=[_H.escape(a) for a in alts], ans=ans, com=_H.escape(com)))
        for a, b in P.get("vocab", []):
            gloss.append(dict(en=a, pt=b, tipo="Leitura", nota=f"Text {P['id']}"))


# --- Rodadas diárias (planilha do caderno de erros) -> pré-carga do caderno do app
XL = Path("/workspace/transpetro/material/extras/Transpetro2026_Enfase7_Caderno_Erros.xlsx")
rodadas = []
if XL.exists():
    import openpyxl, re as _re
    KW = [("nmap", "of2"), ("ATT&CK|LSASS", "of8"), ("ARP|MitM", "of5"), ("27001", "cp1"), ("LGPD", "cp7"), ("NIST CSF", "cp5"),
          ("802.1X|RADIUS", "df2"), ("OWASP", "df2"), ("RSA|Criptografia", "df4"), ("crase", "pt3"), ("Inglês", "en1")]
    REAS = {"confundi": "Confundi conceitos parecidos", "pegadinha": "Caí na pegadinha", "atenção": "Li rápido / falta de atenção",
            "não sabia": "Não sabia o conteúdo", "chutei": "Chutei", "esqueci": "Esqueci número/detalhe"}
    ws = openpyxl.load_workbook(XL, data_only=False)["Rodadas diárias"]
    for r in ws.iter_rows(min_row=2, values_only=True):
        if not (r[0] and r[1] and r[4] and r[5]): continue
        mod = r[2]
        if mod == "Gerais": mod = "Inglês" if str(r[3]).startswith("Inglês") else "Português"
        top = next((t for k, t in KW if _re.search(k, str(r[3]))), "")
        rodadas.append(dict(id=f"r{r[0]:%Y%m%d}_{r[1]}", date=f"{r[0]:%Y-%m-%d}", n=r[1], mod=mod, topico=r[3], topic=top,
                            marcada=r[4], gabarito=r[5], ok=r[4] == r[5], motivo=REAS.get(str(r[7] or "").strip().lower(), r[7] or ""), bizu=r[8] or ""))
    print("rodadas", len(rodadas), "erros", sum(not x["ok"] for x in rodadas))

# --- cronograma (mesma lógica do build.py)
start = dt.date(2026, 10, 29); DIAS = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"]; crono = []
for i, (tx, tid) in enumerate(PLANO):
    d = start + dt.timedelta(days=i); rev = []
    if i >= 1 and PLANO[i-1][1] and i < 28: rev.append("R1: dia anterior")
    if i >= 7 and PLANO[i-7][1] and i < 28: rev.append("R7: " + PLANO[i-7][0].split(" + ")[0][:38])
    if i >= 14 and PLANO[i-14][1] and i < 28: rev.append("R14: " + PLANO[i-14][0].split(" + ")[0][:38])
    kind = "rev" if ("SIMULADO" in tx or "REVISÃO SEMANAL" in tx) else ("key" if d in (dt.date(2026,12,1), dt.date(2026,12,6), dt.date(2026,12,7), dt.date(2026,12,8)) else "")
    crono.append(dict(i=i, date=d.isoformat(), dow=DIAS[d.weekday()], task=tx, topic=tid, rev=rev, kind=kind))

# --- áudios (roteiros existentes; MP3 com nome relativo audios/*.mp3)
AUD = Path("/workspace/transpetro/material/extras/audios"); audios = []
NAMES = {"01": "01_Ofensiva_BIZUs.mp3", "02": "02_Defensiva_BIZUs.mp3", "03": "03_Compliance_BIZUs.mp3",
         "04": "04_Portugues_BIZUs.mp3", "05": "05_Ingles_BIZUs.mp3", "06": "06_Top_BIZUs.mp3"}
mp3s = {p.name[:2]: p.name for p in AUD.glob("*.mp3")}
for r in sorted((AUD / "roteiros").glob("*.md")):
    lines = r.read_text(encoding="utf-8").splitlines()
    title = lines[0].lstrip("# ").strip() if lines and lines[0].startswith("#") else r.stem
    body = "\n".join(l for l in lines if not l.startswith("# ")).strip()
    k = r.name[:2]
    audios.append(dict(id=k, title=title, file="audios/" + mp3s.get(k, NAMES.get(k, r.stem + ".mp3")), script=body))

info = [dict(id=i, title=t, html=getattr(frente, v)) for i, t, v in
        [("como", "Como usar este material", "COMO_USAR"), ("raiox", "Raio-X do edital 2026.4", "RAIOX"),
         ("compara", "Comparação com o edital 2023", "COMPARA"), ("maiscai", "O que mais cai", "MAIS_CAI"),
         ("perfil", "Perfil da Cesgranrio", "PERFIL")]]

for it in info:
    for box in BeautifulSoup(it["html"], "html.parser").select("div.box"):
        kind = [c for c in box["class"] if c != "box"][0]
        if kind not in ("bizu", "peg", "atn", "dica"): continue
        bizus.append(dict(id=f"b{len(bizus)+1}", kind=kind, topic=it["id"], mod="Geral", title=box.select_one(".boxh").get_text(" ", strip=True), html=box.select_one(".boxb").decode_contents()))
data = dict(
    meta=dict(titulo="Transpetro 2026 · Ênfase 7", subtitulo="Análise de Sistemas — Segurança Cibernética e da Informação",
              candidato="Allan Oliveira", banca="Cesgranrio", prova="2026-12-06", duracaoMin=270, versao=dt.date.today().isoformat(),
              rotulo="Questão inédita no estilo Cesgranrio",
              estrutura=dict(total=70, PT=10, EN=10, especificos=50),
              eliminacao=dict(especificosMin=25, geraisMin=10, ptMin=1, enMin=1),
              nota="Eliminação: Específicos < 25, Gerais < 10, ou zero em PT ou em EN. Ranqueamento: Específicos; nota final = Específicos + Gerais."),
    areas={k: dict(mod=v[0], nome=v[1]) for k, v in AREA.items()}, blocos=BLOCOS,
    topics=topics, bizus=bizus, passages=passages, questions=questions, simulados=sims,
    flashcards=[dict(id=f"c{i}", q=a, a=b) for i, (a, b) in enumerate(FC, 1)],
    glossario=gloss, cronograma=crono, diaProva=[dict(id=f"d{i}", html=t, item=it) for i, (t, it) in enumerate(DIA_PROVA)],
    audios=audios, info=info, leitura=leitura, rodadas=rodadas)
out = Path("/workspace/transpetro/app/data.json")
out.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
print("topics", len(topics), "bizus", len(bizus), {k: sum(b['kind'] == k for b in bizus) for k in ("bizu", "peg", "atn", "dica")},
      "questões", len(questions), "simulados", [(s['id'], len(s['questions'])) for s in sims], "flash", len(FC),
      "gloss", len(gloss), "crono", len(crono), "diaProva", len(DIA_PROVA), "audios", [a['file'] for a in audios],
      "passages", len(passages), "leitura", len(leitura), sum(q["src"]=="leit" for q in questions), "bytes", out.stat().st_size)
