import asyncio, json, os, sys, threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from playwright.async_api import async_playwright

ROOT = os.path.dirname(os.path.abspath(__file__))
SH = "/tmp/tp7-screens/"
os.makedirs(SH, exist_ok=True)

def start_server():
    serve_root = "/tmp/tp7-http"
    os.makedirs(serve_root, exist_ok=True)
    link = os.path.join(serve_root, "transpetro-estudos")
    if not os.path.islink(link):
        os.symlink(ROOT, link)
    class Handler(SimpleHTTPRequestHandler):
        extensions_map = {
            **SimpleHTTPRequestHandler.extensions_map,
            ".webmanifest": "application/manifest+json",
            ".js": "application/javascript",
            ".svg": "image/svg+xml",
            ".mp3": "audio/mpeg",
            ".html": "text/html; charset=utf-8",
        }
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=serve_root, **kwargs)
        def log_message(self, fmt, *args):
            return
    httpd = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, "http://127.0.0.1:%d/transpetro-estudos/" % httpd.server_address[1]

httpd = None
if len(sys.argv) > 1:
    URL = sys.argv[1]
    if not URL.endswith("/"):
        URL += "/"
else:
    httpd, URL = start_server()
errs = []; log = []
def ok(c, m): log.append(("OK " if c else "FAIL ") + m)
async def run():
  async with async_playwright() as p:
    b = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--autoplay-policy=no-user-gesture-required", "--no-sandbox", "--disable-dev-shm-usage"])
    for name, vp, mob in [("mobile", {"width":390, "height":844}, True), ("desktop", {"width":1280, "height":800}, False)]:
      ctx = await b.new_context(viewport=vp, is_mobile=mob, has_touch=mob, device_scale_factor=2 if mob else 1, accept_downloads=True)
      pg = await ctx.new_page()
      pg.on("console", lambda m: m.type == "error" and errs.append(f"{name} console: {m.text}"))
      pg.on("pageerror", lambda e: errs.append(f"{name} pageerror: {e}"))
      pg.on("dialog", lambda d: asyncio.ensure_future(d.accept()))
      await pg.goto(URL); await pg.wait_for_timeout(400)
      ok(await pg.locator("#main .card").count() > 0, f"{name} home renders")
      if mob: await pg.screenshot(path=SH + "01_home_mobile.png", full_page=False)
      # all screens
      for r in ["home","questoes","simulado","flashcards","mais","erros","bizus","resumos","leitura","glossario","cronograma","prova","ouvir","sobre","sobre/raiox","backup","sincronizar","tec","resumos/of1","bizus/m/Ofensiva","resumos/le1"]:
        await pg.goto(URL + "#/" + r); await pg.wait_for_timeout(150)
        t = await pg.inner_text("#main"); ok("Erro ao abrir" not in t and len(t) > 30, f"{name} #{r} ({len(t)} chars)")
      if name == "mobile":
        # questões: answer 3 (first wrong, then right)
        await pg.goto(URL + "#/questoes"); await pg.wait_for_timeout(150)
        await pg.click("#go"); await pg.wait_for_timeout(150)
        for k in range(3):
          ans = await pg.evaluate("(() => { const s = QS; return null })()") if False else None
          btns = pg.locator(".alts button"); await btns.nth(k % 5).click(); await pg.wait_for_timeout(120)
          if k == 0 and await pg.locator(".bizuhot").count(): await pg.screenshot(path=SH + "02_questao_bizu_mobile.png", full_page=False)
          rc = pg.locator("[data-reason] .chip")
          if await rc.count(): await rc.nth(2).click()
          nx = pg.locator("button:has-text('Próxima')")
          if await nx.count(): await nx.first.click(); await pg.wait_for_timeout(120)
        # leitura questions
        await pg.goto(URL + "#/leitura"); await pg.wait_for_timeout(150); await pg.click("#lall"); await pg.wait_for_timeout(150)
        ok(await pg.locator("details.passage").count() == 1, "leitura question shows passage")
        await pg.locator(".alts button").nth(0).click(); await pg.wait_for_timeout(120)
        await pg.screenshot(path=SH + "03_leitura_ingles_mobile.png", full_page=False)
        # flashcards
        await pg.goto(URL + "#/flashcards"); await pg.wait_for_timeout(150)
        for g in [0, 1, 2, 2]:
          await pg.click("#show"); await pg.wait_for_timeout(80); await pg.click(f"[data-g='{g}']"); await pg.wait_for_timeout(80)
        await pg.click("#show"); await pg.wait_for_timeout(80); await pg.screenshot(path=SH + "04_flashcards_mobile.png")
        # simulado
        await pg.goto(URL + "#/simulado"); await pg.wait_for_timeout(150); await pg.click("[data-start='s1']"); await pg.wait_for_timeout(200)
        for i in range(25):
          await pg.locator(".alts button").nth(i % 5).click(); await pg.wait_for_timeout(30)
          if i == 3: await pg.click("#flag"); await pg.wait_for_timeout(50)
          await pg.click("#next"); await pg.wait_for_timeout(40)
        pill = await pg.inner_text("#tpill"); ok(pill.startswith("⏱ 4:"), f"timer pill {pill}")
        await pg.screenshot(path=SH + "05_simulado_mobile.png")
        await pg.reload(); await pg.wait_for_timeout(300)
        st = await pg.evaluate("JSON.parse(localStorage.getItem('tp7:progresso'))")
        ok(len(st["sims"]["s1"]["cur"]["ans"]) == 25, "simulado answers persisted after reload: %d" % len(st["sims"]["s1"]["cur"]["ans"]))
        ok(len(st["answers"]) >= 4 and len(st["cards"]) >= 3 and len(st["errors"]) >= 1, f"persisted answers={len(st['answers'])} cards={len(st['cards'])} errors={len(st['errors'])}")
        await pg.goto(URL + "#/simulado/s1/run/folha"); await pg.wait_for_timeout(150)
        await pg.click("#entregar"); await pg.wait_for_timeout(400)
        t = await pg.inner_text("#main"); ok("ELIMINADO" in t or "APROVADO" in t, "simulado result: " + t.split("\n")[0])
        await pg.screenshot(path=SH + "06_resultado_simulado_mobile.png")
        await pg.goto(URL + "#/erros"); await pg.wait_for_timeout(150)
        ok("para hoje" in await pg.inner_text("#main"), "erros view")
        t = await pg.inner_text("#main"); ok("Rodadas diárias" in t and "LSASS" in t and "29/10: 6/13" in t, "rodadas pré-carregadas no caderno")
        await pg.evaluate("(() => { const s = JSON.parse(localStorage.getItem('tp7:progresso')); s.rod = {r20261029_1:{stage:0, due:'2026-10-01', done:false}}; localStorage.setItem('tp7:progresso', JSON.stringify(s)); })()")
        await pg.reload(); await pg.wait_for_timeout(300); await pg.click("[data-rok='r20261029_1']"); await pg.wait_for_timeout(200)
        st = await pg.evaluate("JSON.parse(localStorage.getItem('tp7:progresso')).rod.r20261029_1"); ok(st["stage"] == 1, f"rodada revisada -> {st}")
        # Simulado 2
        await pg.goto(URL + "#/simulado"); await pg.wait_for_timeout(150); await pg.click("[data-start='s2']"); await pg.wait_for_timeout(200)
        for i in range(22):
          await pg.locator(".alts button").nth(i % 5).click(); await pg.click("#next"); await pg.wait_for_timeout(30)
        await pg.click("#entregar"); await pg.wait_for_timeout(400)
        t = await pg.inner_text("#main"); ok("Simulado 2" in await pg.inner_text("#ttl") and ("ELIMINADO" in t or "APROVADO" in t), "simulado 2 resultado")
        await pg.screenshot(path=SH + "07_simulado2_resultado_mobile.png")
        await pg.goto(URL + "#/erros"); await pg.wait_for_timeout(200); await pg.evaluate("document.querySelector('.card:nth-of-type(2)') && document.querySelectorAll('.card')[1].scrollIntoView()"); await pg.wait_for_timeout(300)
        await pg.screenshot(path=SH + "04_caderno_erros_rodadas_mobile.png")
        # export
        await pg.goto(URL + "#/backup"); await pg.wait_for_timeout(150)
        async with pg.expect_download() as dl: await pg.click("#exp")
        d = await dl.value; path = await d.path(); data = json.load(open(path)); ok(data["app"] == "tp7", "export download ok")
        # reset then import replace
        await pg.click("#rst"); await pg.wait_for_timeout(200)
        ok(await pg.evaluate("Object.keys(JSON.parse(localStorage.getItem('tp7:progresso')).answers).length") == 0, "reset ok")
        await pg.goto(URL + "#/backup"); await pg.wait_for_timeout(150)
        await pg.fill("#txt", json.dumps(data)); await pg.click("#imp"); await pg.wait_for_timeout(200)
        n = await pg.evaluate("Object.keys(JSON.parse(localStorage.getItem('tp7:progresso')).answers).length"); ok(n == len(data["state"]["answers"]), f"import merge restored answers={n}")
        # dark theme
        await pg.click("#themeBtn"); await pg.goto(URL + "#/home"); await pg.wait_for_timeout(200)
        ok(await pg.evaluate("document.documentElement.dataset.theme") in ("dark","light"), "theme toggle")
        await pg.screenshot(path=SH + "07_home_escuro_mobile.png")
        await pg.goto(URL + "#/ouvir/02"); await pg.wait_for_timeout(800)
        ok(await pg.evaluate("$ = null, document.querySelector('#au').readyState") >= 1 if False else True, "")
        rs = await pg.evaluate("document.querySelector('#au').readyState"); ok(rs >= 1, f"audio metadata loaded readyState={rs}")
        ok(not await pg.locator("#aerr").is_visible(), "no missing-audio notice")
      else:
        await pg.goto(URL + "#/resumos/of2"); await pg.wait_for_timeout(200)
        await pg.screenshot(path=SH + "08_resumo_desktop.png")
        sw = await pg.evaluate("""async () => {
          const r = await fetch('sw.js', {cache:'no-store'});
          const t = await r.text();
          const man = await fetch('manifest.webmanifest', {cache:'no-store'});
          const j = await man.json();
          const lib = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/+esm');
          return {sw:r.ok && /const C = 'tp7-/.test(t) && t.includes('caches.delete') && t.includes('networkFirst'),
                  manifest:man.ok && j.start_url === './index.html' && j.scope === './',
                  cdn:typeof lib.createClient === 'function'};
        }""")
        ok(sw["sw"], "service worker versionado e com rede primeiro")
        ok(sw["manifest"], "manifest com caminhos relativos ao subpath")
        ok(sw["cdn"], "supabase-js disponível no CDN")
        await pg.goto(URL + "#/tec"); await pg.wait_for_selector("a[data-tec='of1']")
        ntec = await pg.locator("#main a.btn[data-tec]").count()
        ok(ntec == 46, f"46 links de tópico no TEC ({ntec})")
        ok("Abra logado e clique em Salvar" in await pg.inner_text("#main"), "cadernos guia com a dica de salvar")
        rels = await pg.eval_on_selector_all("#main a[data-tec]", "els => els.length > 0 && els.every(a => (a.getAttribute('rel') || '').includes('noopener') && a.target === '_blank')")
        ok(rels, "links do TEC abrem em nova aba")
        await pg.goto(URL + "#/resumos/of1"); await pg.wait_for_selector("text=Resolver no TEC")
        ok("No TEC, filtre a banca CESGRANRIO" in await pg.inner_text("#main"), "resumo do tópico pede o filtro Cesgranrio")
        await pg.goto(URL + "#/questoes/t/of2"); await pg.wait_for_selector("text=Resolver no TEC")
        ok(await pg.locator("a[data-tec='of2']").count() == 1, "lista de questões do tópico tem o botão do TEC")
      await pg.goto(URL + "#/sincronizar"); await pg.wait_for_selector("#sync-email"); await pg.wait_for_selector("#sync-in"); await pg.wait_for_selector("#sync-up")
      t = await pg.inner_text("#main")
      ok("voltar ao app e entrar" in t and "Criar conta" in t, f"{name} tela Sincronizar")
      ok(await pg.locator("#syncBtn").count() == 1, f"{name} indicador de sync")
      st = await pg.locator("#syncState").get_attribute("data-status")
      ok(st in ("local", "offline"), f"{name} sem login o estado é local/offline ({st})")
      await ctx.close()
    await b.close()
try:
    asyncio.run(run())
finally:
    if httpd: httpd.shutdown()
print("URL", URL)
print("\n".join(l for l in log if l.strip() not in ("OK",)))
print("ERRORS:", len(errs)); print("\n".join(errs))
failed = [l for l in log if l.startswith("FAIL")]
sys.exit(1 if failed or errs else 0)
