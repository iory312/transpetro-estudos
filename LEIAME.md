# Transpetro 2026 · Ênfase 7 — App de estudo

Site: <https://iory312.github.io/transpetro-estudos/>

O app abre nesse endereço (GitHub Pages, subpasta do repositório). Também dá para abrir `index.html` no navegador. A interface é em português. Os 6 áudios ficam em `audios/`, ao lado do `index.html`.

Conteúdo: 46 tópicos/resumos · 73 caixas BIZU/pegadinha · 97 questões de fixação + 36 de Leitura em Inglês (12 textos reais) · Simulado 1 e Simulado 2 (70 questões cada, inéditas no estilo Cesgranrio, com gabarito comentado e regra de eliminação) · 74 flashcards (SM-2) · 193 termos de glossário · cronograma de 41 dias · checklist do dia da prova · 6 áudios · caderno de erros automático (+1/+7/+14) com os 7 erros das rodadas diárias de 29/10 pré-carregados da planilha.

## Progresso neste aparelho

Tudo passa por `Storage` (`src/storage.js`: `get`, `set`, `onChange`, `useAdapter`, `pull`). A chave no navegador é `tp7:progresso`. Dá para exportar e importar em Mais → Progresso. Sem conta e sem internet o app continua inteiro, só com esse armazenamento local.

## Sincronização (opcional)

Mais → Sincronizar, ou o botão ao lado do tema. Login por e-mail e senha (criar conta ou entrar). A biblioteca é `@supabase/supabase-js` 2.118.0, carregada por CDN só quando existe sessão ou quando a tela de sincronizar precisa falar com o servidor.

- Projeto: `https://epmvolilhwlgpitnhrck.supabase.co`
- Tabela já existente: `public.transpetro_progress` (`user_id`, `data` jsonb, `updated_at`). O app não altera o schema.
- A chave no cliente é a publishable (pública). O RLS só deixa o usuário autenticado ler e gravar a própria linha.
- O link de confirmação usa `emailRedirectTo` igual à URL atual (sem o hash). Depois de confirmar o e-mail, é só voltar ao app e entrar.
- Com sessão, o app baixa a linha remota, mescla com o local e faz upsert da união. Novas alterações esperam cerca de 1,5 s e também disparam ao voltar o foco, ao ficar visível de novo ou quando a rede volta. Se a gravação falhar, o app mostra o erro e segue no aparelho.
- Indicador: **sincronizado**, **pendente**, **offline**, **erro**. Sem sessão: **neste aparelho**. Sair não apaga o progresso local.

### Como o merge funciona

A função `mergeState` (`src/merge.js`) une os dois lados. Nada de resposta é descartado.

- Respostas: união, sem repetir o mesmo instante e alternativa.
- Erros e flashcards: por item, fica o registro com a data ou `last` mais recente. A contagem de erros fica com o maior valor e o motivo é preservado se o mais novo estiver vazio.
- Simulados: o histórico une pelo instante de início. Um simulado em andamento junta as marcações; se a mesma questão foi marcada dos dois lados, vale a tentativa que começou por último.
- Cronograma, checklist da prova e etapas dos resumos: se está marcado em qualquer lado, continua marcado.
- Rodadas diárias: fica o estágio mais alto.
- Dias estudados: fica o maior número.
- Posição do áudio: fica o ponto mais avançado. Tema, filtros das questões e velocidade do áudio permanecem os do aparelho que está mesclando.
- `created` fica o mais antigo e `updated` o mais novo. A coluna `updated_at` da tabela só registra a hora do upsert; a decisão por item usa os dados acima, não essa coluna sozinha, para não apagar o que o outro aparelho fez.

### O que configurar no Supabase

Em Authentication → URL Configuration, se o link de confirmação ainda não abrir o Pages:

- Site URL: `https://iory312.github.io/transpetro-estudos/`
- Redirect URLs: `https://iory312.github.io/transpetro-estudos/**`

## Publicação

O workflow `.github/workflows/pages.yml` publica a raiz com `actions/deploy-pages` a cada push na `main`. O arquivo `.nojekyll` impede o Jekyll de ignorar arquivos. Manifest, service worker e áudios usam caminho relativo (`./`), então funcionam na subpasta `/transpetro-estudos/`.

O service worker chama o cache de `tp7-` mais um hash do `index.html` e do template. Na ativação ele apaga os caches antigos. Página, manifest e ícone são buscados na rede primeiro (e guardados se a rede falhar). O `sw.js` em si não é servido pelo cache do worker, e o registro usa `updateViaCache: 'none'`. Quando um deploy troca o worker que já controlava a aba, a página recarrega. Pedidos para outro domínio (Supabase, CDN) não entram no cache.

## Desenvolvimento

`python3 build_app.py` gera `index.html`, `manifest.webmanifest`, `icon.svg` e `sw.js` a partir de `src/` e `data.json`.

`python3 extract.py` depende de arquivos que não estão neste repositório (`/workspace/transpetro/build/*.py` e a planilha de erros). Sem eles, edite `src/` e rode só `build_app.py`.

Testes:

- `node test_merge.mjs` — união do progresso, sem Supabase e sem criar usuário.
- `python3 test_app.py` — sobe um servidor local em `/transpetro-estudos/` e roda o Playwright (Chrome). Confere as telas, o áudio, o service worker, o manifest e a tela Sincronizar sem login.
