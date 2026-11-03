/* Resumos Lory. Pedido só depois do login. Textos próprios, em pt-BR, no escopo do edital. */
globalThis.TP7_LORY = {
capec:{titulo:'MITRE CAPEC',html:`
<p>O CAPEC, Common Attack Pattern Enumeration and Classification, é o catálogo público da MITRE que descreve padrões de ataque: os atributos e os modos comuns com que um adversário explora fraquezas já conhecidas em software e em outras capacidades digitais. A página oficial explica que um padrão de ataque nasce da ideia de padrão de projeto, só que aplicado para destruir, não para construir, e é extraído da análise de explorações reais. Cada padrão registra como uma parte do ataque é desenhada e executada e aponta formas de reduzir o efeito. O edital pede três recortes: o que é um padrão, a visão por mecanismos e a visão por domínios. Para a Cesgranrio, o que mais cai é não confundir esse catálogo com o ATT&CK, com o CWE e com o CVE.</p>
<h3>Tópicos-chave</h3>
<ul>
<li>Padrão de ataque: descrição reutilizável de como o adversário explora uma fraqueza. Não é o nome de um produto vulnerável e não é a lista de táticas de um grupo real.</li>
<li>O catálogo foi criado no programa de Software Assurance do Departamento de Segurança Interna dos Estados Unidos e teve a primeira lista pública em 2007. Continua aberto a contribuição da comunidade.</li>
<li>Há três níveis de padrão. O meta é abstrato, sem amarrar tecnologia, e serve para modelar ameaça na arquitetura. O standard descreve uma técnica específica, em geral um pedaço de um ataque completo. O detailed desce a uma tecnologia, com fluxo de execução, e costuma encadear vários padrões standard.</li>
<li>Categoria não é padrão. A própria MITRE define categoria como um agrupamento de padrões por efeito ou intenção. A categoria organiza a árvore. Ela não é, sozinha, um ataque executável.</li>
<li>Visão Mechanisms of Attack, identificada como CAPEC-1000. Agrupa pelo mecanismo. Exemplos públicos dessa visão: Engage in Deceptive Interactions, Manipulate Data Structures, Manipulate System Resources, Inject Unexpected Items e Subvert Access Control.</li>
<li>Visão Domains of Attack, CAPEC-3000. Agrupa pelo domínio em que o ataque acontece. Na árvore pública aparecem, entre outros, Software, Communications e Supply Chain.</li>
<li>Cada padrão pode indicar o desafio que o adversário enfrenta, o fluxo da execução e mitigações. A MITRE lista usos ao longo da vida do sistema: requisitos, desenho, implementação, teste, operação e resposta a incidente.</li>
</ul>
<h3>Quem é quem</h3>
<div class="scroll"><table>
<thead><tr><th>Catálogo</th><th>Pergunta que responde</th><th>Exemplo de leitura</th></tr></thead>
<tbody>
<tr><td>CAPEC</td><td>Como o ataque é montado?</td><td>CAPEC-66, SQL injection, como padrão</td></tr>
<tr><td>CWE</td><td>Qual fraqueza do software permite isso?</td><td>CWE-89, neutralização incorreta de SQL</td></tr>
<tr><td>CVE</td><td>Qual produto, em qual versão, está vulnerável?</td><td>Um CVE numerado naquele software</td></tr>
<tr><td>ATT&CK</td><td>O que o adversário real faz, com qual tática e qual mitigação?</td><td>Uma técnica da matriz Enterprise</td></tr>
</tbody></table></div>
<p>A ligação correta numa questão é esta: o padrão CAPEC descreve o ataque, o CWE descreve a fraqueza que o ataque usa, o CVE identifica uma ocorrência daquela fraqueza num produto, e o ATT&CK descreve o comportamento do adversário observado em intrusões, com tática, técnica, procedimento e mitigação. Os quatro se referenciam. Nenhum substitui o outro.</p>
<h3>Pegadinhas da banca</h3>
<ul>
<li>Chamar o CAPEC de “lista de vulnerabilidades”. Vulnerabilidade identificada em produto é CVE. Fraqueza abstrata é CWE. Padrão de ataque é CAPEC.</li>
<li>Dizer que o CAPEC é a matriz de táticas do adversário. Essa matriz é o ATT&CK. O CAPEC não organiza a campanha em táticas como acesso inicial, persistência e exfiltração.</li>
<li>Tratar uma categoria, por exemplo Inject Unexpected Items, como se fosse um padrão executável. Categoria agrupa. O padrão está no nível de baixo.</li>
<li>Inverter meta e detailed. Meta é o mais abstrato. Detailed é o que cita tecnologia e fluxo completo.</li>
<li>Achar que Mechanisms of Attack e Domains of Attack são dois catálogos diferentes. São duas visões do mesmo CAPEC: uma pelo mecanismo, outra pelo domínio.</li>
</ul>
<div class="bizu"><b>Bizu.</b> CAPEC é o como. CWE é a falha. CVE é o caso. ATT&CK é o adversário em campo. Mecanismo responde “de que jeito”. Domínio responde “em que terreno”.</div>
<p class="fontes">Fontes: MITRE, About CAPEC (capec.mitre.org/about); visões públicas CAPEC-1000 Mechanisms of Attack e CAPEC-3000 Domains of Attack, versão 3.9.</p>`},
ferramentas:{titulo:'Ferramentas do item 1.12',html:`
<p>O item 1.12 do edital não pede que você opere as ferramentas. Pede que você reconheça, numa linha, para que cada uma serve e em que momento do ataque ou da defesa ela aparece. A lista abaixo é exatamente a do edital, na ordem em que ele a escreve. A fase usa a linguagem do próprio item 1.4: footprinting, varredura, enumeração, ganho de acesso, escalação, porta dos fundos, encobrimento e negação de serviço, mais a defesa quando a ferramenta é de detecção.</p>
<h3>A lista do edital</h3>
<div class="scroll"><table>
<thead><tr><th>Ferramenta</th><th>Função em uma frase</th><th>Fase</th></tr></thead>
<tbody>
<tr><td>amass</td><td>Mapeia nomes e subdomínios a partir de fontes públicas.</td><td>Footprinting</td></tr>
<tr><td>aircrack-ng</td><td>Captura tráfego Wi-Fi e trabalha a quebra da chave.</td><td>Ataque sem fio</td></tr>
<tr><td>airgeddon</td><td>Menu que junta ataques Wi-Fi, inclusive gêmeo maligno.</td><td>Ataque sem fio</td></tr>
<tr><td>arpwatch</td><td>Vigia pares IP/MAC e alerta quando o ARP muda.</td><td>Defesa</td></tr>
<tr><td>beef-xss</td><td>Controla o navegador da vítima depois de um XSS que instala o gancho.</td><td>Ganho de acesso</td></tr>
<tr><td>burpsuite</td><td>Proxy que intercepta e altera o HTTP da aplicação.</td><td>Teste de aplicação</td></tr>
<tr><td>ettercap</td><td>Envenena ARP e lê ou altera a sessão no meio do caminho.</td><td>Escuta ativa</td></tr>
<tr><td>ghidra</td><td>Desmonta e descompila binário para estudar o programa.</td><td>Análise</td></tr>
<tr><td>hashcat</td><td>Quebra hashes em massa, em geral com GPU.</td><td>Credencial, offline</td></tr>
<tr><td>hydra</td><td>Testa senhas direto no serviço ligado, pela rede.</td><td>Credencial, online</td></tr>
<tr><td>john the ripper</td><td>Quebra hashes que você já tem em arquivo.</td><td>Credencial, offline</td></tr>
<tr><td>nmap</td><td>Descobre host, porta, serviço e, se pedido, sistema.</td><td>Varredura</td></tr>
<tr><td>netcat</td><td>Abre e escuta conexões TCP ou UDP, inclusive um shell.</td><td>Acesso e pivô</td></tr>
<tr><td>maltego</td><td>Junta dados públicos num grafo de relações.</td><td>Footprinting</td></tr>
<tr><td>steghide</td><td>Esconde dado dentro de imagem ou áudio.</td><td>Encobrimento</td></tr>
<tr><td>masscan</td><td>Varre portas em alta velocidade, com pouco detalhe.</td><td>Varredura</td></tr>
<tr><td>mimikatz</td><td>Lê credencial na memória do Windows.</td><td>Escalação</td></tr>
<tr><td>metasploit-framework</td><td>Organiza e dispara exploits e payloads.</td><td>Ganho de acesso</td></tr>
<tr><td>set</td><td>Monta o golpe de engenharia social, como uma página falsa.</td><td>Engenharia social</td></tr>
<tr><td>smbmap</td><td>Lista compartilhamentos SMB e o que dá para ler ou gravar.</td><td>Enumeração</td></tr>
<tr><td>sqlmap</td><td>Automatiza a exploração de injeção de SQL.</td><td>Ganho de acesso</td></tr>
<tr><td>theharvester</td><td>Recolhe e-mail, host e nome em fonte aberta.</td><td>Footprinting</td></tr>
<tr><td>veil</td><td>Gera payload tentando não ser pego pelo antivírus.</td><td>Encobrimento</td></tr>
<tr><td>wireshark</td><td>Captura e decodifica o pacote para você ler a conversa.</td><td>Escuta e defesa</td></tr>
</tbody></table></div>
<h3>Como ler a tabela na prova</h3>
<ul>
<li>Footprinting é nome e relação, antes de tocar na porta. Amass, Maltego e theHarvester moram aqui. Nenhum deles explora vulnerabilidade.</li>
<li>Varredura é porta. Nmap detalha. Masscan acelera. Os dois não fazem a mesma coisa: um é mapa, o outro é rajada.</li>
<li>Enumeração é o que tem dentro do serviço já achado. Smbmap olha o compartilhamento. Não é o scan inicial.</li>
<li>Credencial offline é hash na mão: John e Hashcat. Credencial online é senha contra o serviço no ar: Hydra. Trocar esses três é a pegadinha clássica.</li>
<li>Encobrimento esconde o ato ou o dado. Steghide esconde o dado. Veil esconde o payload. Não são exploits.</li>
<li>Arpwatch é o único da lista cujo trabalho normal é defender: ele grita quando alguém mente no ARP. Ettercap é o lado que mente.</li>
</ul>
<h3>Pegadinhas da banca</h3>
<ul>
<li>Dizer que o Wireshark explora. Ele lê o pacote. Quem envenena a rede para se colocar no meio, nesta lista, é o Ettercap.</li>
<li>Dizer que o BeEF, sozinho, invade o servidor. Ele depende de um XSS que entregue o gancho ao navegador.</li>
<li>Tratar o Ghidra como scanner de rede. Ele é engenharia reversa de binário.</li>
<li>Achar que Aircrack-ng e Airgeddon são a mesma peça. O Aircrack-ng é o conjunto de captura e quebra. O Airgeddon orquestra um ataque Wi-Fi maior, inclusive o gêmeo.</li>
<li>Chamar o SET de framework de exploit genérico. Exploit genérico, nesta lista, é o Metasploit. O SET é engenharia social.</li>
</ul>
<div class="bizu"><b>Bizu.</b> Nome e e-mail: amass, maltego, theharvester. Porta: nmap e masscan. Senha no serviço: hydra. Senha no arquivo: john e hashcat. No meio do fio: ettercap lê o que o arpwatch denuncia. Esconder: steghide o dado, veil o payload.</div>
<p class="fontes">Fontes: lista literal do item 1.12 do Anexo IV do edital da Transpetro 2026; páginas públicas dos projetos (nmap.org, wireshark.org, ghidra-sre.org e os repositórios oficiais de cada ferramenta) para a função de cada nome.</p>`},
'cis-bench':{titulo:'CIS Benchmarks',html:`
<p>CIS Benchmark é recomendação de configuração de um produto concreto: um Windows, um Linux, um navegador, um banco, uma nuvem. O texto diz o que ligar, o que desligar e como o ajuste deve ficar para reduzir a superfície sem que você invente a política do zero. Isso é diferente do CIS Controls. O Control é a salvaguarda da organização, escrita em linguagem de gestão. O Benchmark é o parafuso daquele sistema. O edital junta os dois mundos no item 2.8, quando fala de CIS Benchmarks em Linux e Windows, e de novo no 3.2, quando cita o CIS Controls v8.1. A prova gosta de trocar um pelo outro.</p>
<h3>Tópicos-chave</h3>
<ul>
<li>Um benchmark nasce de consenso. Fabricante, consultor e operador discutem o ajuste até publicar um guia daquele produto e daquela versão. Trocar a versão do sistema sem trocar o benchmark é aplicar regra velha em alvo novo.</li>
<li>Há dois níveis de recomendação, no vocabulário público do CIS. O Level 1 é o que se pode aplicar na base, com ganho claro e pouco atrito no uso. O Level 2 aprofunda a defesa e pode tirar função. Ambiente comum começa no 1. Ambiente que guarda dado mais sensível discute o 2, sabendo do custo.</li>
<li>Recomendação scored entra em medida automática: uma ferramenta olha o sistema e diz se o item passou. Recomendação not scored exige gente, porque não dá para cravar só com um comando. Os dois tipos constam do mesmo guia.</li>
<li>O resultado de uma avaliação é um perfil daquele ativo, não um selo da empresa inteira. “Passamos no benchmark” significa que aquele Windows, ou aquele Linux, está perto do guia escolhido. Não significa que o processo de gente, o contrato ou o inventário estejam bons.</li>
<li>O CIS Controls v8 organiza dezoito controles da organização. A configuração segura de ativo e de software é um deles. O benchmark é um jeito prático de cumprir esse controle num produto. O control manda “configure com segurança”. O benchmark diz “neste Linux, este parâmetro fica assim”.</li>
<li>Linux e Windows não compartilham o mesmo arquivo de benchmark. A banca pode descrever um ajuste de política local do Windows e chamar de benchmark de Linux, ou o contrário. O nome do produto faz parte da resposta.</li>
<li>Aplicar o guia sem janela de teste quebra serviço. O Level 1 existe justamente para caber na operação. Quem pula direto para o Level 2, em todo o parque, costuma voltar atrás no primeiro sistema que deixa de autenticar.</li>
</ul>
<h3>Benchmark e Control</h3>
<div class="scroll"><table>
<thead><tr><th></th><th>CIS Benchmark</th><th>CIS Controls</th></tr></thead>
<tbody>
<tr><td>Unidade</td><td>Um produto, uma versão</td><td>A organização</td></tr>
<tr><td>Texto</td><td>Parâmetro e valor</td><td>Salvaguarda e resultado</td></tr>
<tr><td>Nível</td><td>Level 1 e Level 2</td><td>Os dezoito controles, com salvaguardas</td></tr>
<tr><td>Prova de conformidade</td><td>Varredura da configuração</td><td>Processo, inventário, medida</td></tr>
</tbody></table></div>
<h3>Pegadinhas da banca</h3>
<ul>
<li>Dizer que o benchmark substitui o control. Ele implementa, num ativo, o que o control pede em configuração. O resto dos dezoito controles continua de pé.</li>
<li>Tratar Level 2 como “o mais fácil”. Level 2 é o mais restrito. Level 1 é o que cabe no dia a dia.</li>
<li>Achar que scored quer dizer “mais importante”. Scored quer dizer “dá para medir com ferramenta”. Importância é outra conversa.</li>
<li>Confundir a versão 8.1 dos Controls com uma versão de benchmark de Windows. São linhas de publicação diferentes.</li>
<li>Marcar benchmark como norma certificável no molde da ISO 27001. Benchmark é guia de configuração. Não é sistema de gestão com auditoria de certificação.</li>
</ul>
<div class="bizu"><b>Bizu.</b> Control é o que a empresa deve conseguir. Benchmark é como aquele Windows ou aquele Linux fica para ajudar nisso. Level 1 cabe. Level 2 aperta. Scored é o que a ferramenta enxerga.</div>
<p class="fontes">Fontes: CIS, apresentação pública dos CIS Benchmarks (cisecurity.org/cis-benchmarks) e dos CIS Critical Security Controls; vídeo institucional do CIS “Effectively Harden Your Systems with CIS Benchmarks”.</p>`},
ot:{titulo:'NIST SP 800-82 e ISA/IEC 62443',html:`
<p>O item 2.9 junta três coisas que a prova separa mal: ameaça e vulnerabilidade em sistema que mexe no mundo físico, o ICS Advisory Project como leitura dessas vulnerabilidades, a série ISA/IEC 62443 e o NIST SP 800-82 Revisão 3. O 800-82 é guia. A 62443 é norma de requisito. Os dois falam de tecnologia operacional, mas não são o mesmo documento. Tecnologia operacional, no texto do NIST, é o conjunto de sistemas programáveis que interagem com o ambiente físico ou que comandam quem interage: controle industrial, predial, transporte, acesso físico, monitoração. A revisão 3, de setembro de 2023, substitui a revisão 2 de 2015 e alarga o título, que deixou de ser só “controle industrial” e passou a ser segurança de OT.</p>
<h3>Tópicos-chave</h3>
<ul>
<li>OT não é um servidor de escritório com outro nome. O guia do NIST destaca desempenho, confiabilidade e segurança física como restrições. Parar o processo para aplicar um patch pode ser mais grave do que o risco que o patch corrige. Em TI, o contrário costuma ser verdade.</li>
<li>O modelo de Purdue, vindo da ISA-95, é a topologia de referência que o 800-82 usa para desenhar a rede. Nível 0 é o processo. Nível 1 é o controle básico, com CLP e sensor. Nível 2 é a supervisão, com SCADA e IHM. Nível 3 é a operação da planta. Nível 4 é o negócio do sítio. Nível 5 é a empresa. Entre a operação e o negócio desenha-se, em geral, uma DMZ. Purdue não é uma das partes numeradas da 62443. É o mapa em que a zona da 62443 se apoia.</li>
<li>Zona, na 62443, é um grupo de ativos que compartilham o mesmo requisito de segurança. Conduto é o caminho de comunicação entre zonas, e é nele que o controle de fluxo mora. Separar zona sem cuidar do conduto é deixar a porta da frente fechada e a tubulação aberta.</li>
<li>Nível de segurança, security level, mede a força do adversário que o sistema deve suportar. SL 1 cobre violação casual ou acidental. SL 2 cobre intenção com meio simples, recurso baixo, habilidade genérica e motivação baixa. SL 3 sobe para meio sofisticado, recurso moderado, habilidade específica de IACS e motivação moderada. SL 4 é meio sofisticado, recurso estendido, habilidade específica e motivação alta. Há ainda o SL 0, que significa ausência de requisito específico. A banca troca SL 1 com SL 0.</li>
<li>A 62443-3-3 organiza requisitos em sete famílias: identificar e autenticar, controlar o uso, integridade do sistema, confidencialidade dos dados, fluxo restrito, resposta a tempo e disponibilidade do recurso. O SL de um requisito diz até que força aquele requisito precisa chegar.</li>
<li>A série reparte o trabalho. Quem opera o ativo, quem fabrica o produto, quem integra e quem presta serviço não recebem o mesmo caderno. A ISA descreve isso como responsabilidade compartilhada ao longo do ciclo de vida.</li>
<li>O ICS Advisory Project reúne, em formato de análise, os avisos de vulnerabilidade de ICS publicados pela CISA, com fabricante, produto e setor de infraestrutura crítica. Ele não substitui o aviso oficial da CISA. Serve para achar, depressa, o que afeta o equipamento da planta.</li>
</ul>
<h3>TI e TO</h3>
<div class="scroll"><table>
<thead><tr><th></th><th>TI</th><th>TO</th></tr></thead>
<tbody>
<tr><td>O que erra caro</td><td>Vazar ou perder o dado</td><td>Parar ou desviar o processo físico</td></tr>
<tr><td>Prioridade clássica</td><td>Confidencialidade na frente</td><td>Disponibilidade e segurança física na frente</td></tr>
<tr><td>Patch</td><td>Janela curta, ativo parecido</td><td>Janela rara, equipamento que vive décadas</td></tr>
<tr><td>Rede</td><td>Usuário e servidor</td><td>Nível Purdue, zona e conduto</td></tr>
</tbody></table></div>
<h3>Pegadinhas da banca</h3>
<ul>
<li>Dizer que a revisão 3 do 800-82 é só um novo nome do guia antigo de ICS. O NIST mudou o escopo para OT, que inclui predial, transporte e acesso físico, além do controle industrial.</li>
<li>Chamar zona de “o cabo”. Zona é o grupo de ativos. Conduto é o caminho entre zonas.</li>
<li>Ordenar SL 4 como o mais fraco porque o número assusta. SL 4 é o adversário mais capaz. SL 1 é o casual.</li>
<li>Achar que Purdue e 62443 são sinônimos. Purdue é topologia. 62443 é requisito, zona, conduto e security level.</li>
<li>Tratar o ICS Advisory Project como se fosse a norma. Ele é uma base de avisos da CISA reorganizada para análise. A norma continua sendo a 62443, e o guia continua sendo o 800-82.</li>
</ul>
<div class="bizu"><b>Bizu.</b> 800-82 ensina o terreno. 62443 cobra a cerca. Purdue é o mapa, do processo lá embaixo ao escritório lá em cima. Zona é o quarto. Conduto é a porta. SL sobe com o adversário: 1 casual, 2 simples, 3 sofisticado, 4 determinado.</div>
<p class="fontes">Fontes: NIST, SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security, setembro de 2023 (csrc.nist.gov); ISA, apresentação pública da série ISA/IEC 62443 (isa.org), incluindo zona, conduto, security level e responsabilidade compartilhada.</p>`},
csf:{titulo:'NIST CSF 2.0',html:`
<p>O Cybersecurity Framework do NIST é um quadro para a organização entender e melhorar a gestão do risco cibernético. Não é uma lista de produtos e não é uma norma que se certifica, como a ISO/IEC 27001. A versão 2.0, cuja página oficial o NIST mantém em nist.gov/cyberframework, passou a servir indústria, governo e qualquer organização, e trouxe uma função nova, Govern, ao lado das cinco que o mercado já repetia. Para a Cesgranrio, o núcleo cobrável é este: as seis funções, o que é Tier e o que é Profile. O resto, mapeamento e guia rápido, confirma que o CSF conversa com outros documentos. Não vira, ele mesmo, o controle técnico.</p>
<h3>Tópicos-chave</h3>
<ul>
<li>As seis funções da versão 2.0 são Govern, Identify, Protect, Detect, Respond e Recover. Em português de prova: Governar, Identificar, Proteger, Detectar, Responder e Recuperar. Govern não existia como função no CSF 1.1. Ela olha para a estratégia, a política, a responsabilidade e a supervisão do risco. As outras cinco continuam o ciclo operacional.</li>
<li>Govern atravessa as demais. Sem dono, sem apetite de risco e sem política, Identificar vira inventário solto e Proteger vira ferramenta sem critério. A banca descreve um comitê que define o risco aceito e pergunta a função. A resposta é Govern, não Identify.</li>
<li>Tier, no CSF, descreve o rigor com que a organização governa e gere o risco. São quatro: Tier 1 Partial, Tier 2 Risk Informed, Tier 3 Repeatable e Tier 4 Adaptive. Partial é reativo e pontual. Risk Informed já decide com consciência do risco, ainda sem repetir o método em toda parte. Repeatable formaliza e repete. Adaptive ajusta com o que aprende, de forma contínua. Tier não é nota de maturidade para “passar” e não é security level da 62443.</li>
<li>Profile é a foto dos resultados que a organização escolheu. O Current Profile diz o que ela já consegue. O Target Profile diz o que ela precisa conseguir, dado o seu risco. A diferença entre os dois é o plano, não uma falha automática. Perfil comunitário, como os que o NIST publica para um setor, é exemplo de recorte. Não é obrigação universal.</li>
<li>O CSF aponta para referências informativas: controles, normas e guias que ajudam a cumprir um resultado. A referência não entra no CSF no lugar da função. Dizer que “o CSF é o CIS Controls” é falso. O Controls pode ser uma referência. A função continua sendo do CSF.</li>
<li>Não há certificação CSF. Quem vende “certificado CSF 2.0” está vendendo outra coisa, talvez uma avaliação ou um curso. A certificação de sistema de gestão, no edital, é conversa de ISO/IEC 27001.</li>
</ul>
<h3>As seis funções</h3>
<div class="scroll"><table>
<thead><tr><th>Função</th><th>Pergunta que a organização responde</th></tr></thead>
<tbody>
<tr><td>Govern</td><td>Quem decide o risco e com qual política?</td></tr>
<tr><td>Identify</td><td>O que existe e o que está em jogo?</td></tr>
<tr><td>Protect</td><td>O que foi feito para o incidente não nascer fácil?</td></tr>
<tr><td>Detect</td><td>Como sabemos que algo saiu do trilho?</td></tr>
<tr><td>Respond</td><td>O que fazemos enquanto o incidente acontece?</td></tr>
<tr><td>Recover</td><td>Como voltamos a operar e o que aprendemos?</td></tr>
</tbody></table></div>
<h3>Pegadinhas da banca</h3>
<ul>
<li>Listar só as cinco funções antigas e chamar isso de CSF 2.0. Faltou Govern. Se o enunciado diz 2.0, são seis.</li>
<li>Colocar Govern no lugar de Respond. Govern é antes e por cima. Respond é durante o incidente.</li>
<li>Tratar Tier 4 como “conforme” e Tier 1 como “reprovado”. Tier descreve o rigor. O Profile é que diz se o resultado desejado foi alcançado.</li>
<li>Confundir Current Profile com Target Profile. Current é o hoje. Target é o destino. A distância entre eles é trabalho, não um Tier.</li>
<li>Achar que adotar o CSF dispensa a 27001 ou o CIS Controls. O CSF organiza a conversa do risco. Os outros documentos descem ao requisito e à salvaguarda.</li>
</ul>
<div class="bizu"><b>Bizu.</b> No 2.0, governa primeiro. GIDPRR não: são Govern, Identify, Protect, Detect, Respond, Recover. Tier é o jeito. Profile é a foto, de hoje e de amanhã. CSF não emite certificado.</div>
<p class="fontes">Fontes: NIST, Cybersecurity Framework 2.0 (nist.gov/cyberframework), incluindo funções, Tiers e Profiles; vídeo oficial do NIST “The NIST Cybersecurity Framework (CSF) 2.0”.</p>`},
iso27005:{titulo:'ISO/IEC 27005',html:`
<p>A ISO/IEC 27005 é a norma de gestão de riscos de segurança da informação. Ela não certifica a empresa. Quem certifica o sistema de gestão é a ISO/IEC 27001. A 27005 ensina a fazer, de forma repetível, o que a 27001 exige quando manda avaliar e tratar risco. O edital cita a edição 2023, ao lado da 27001:2022 e da 27002:2022. Para a prova, o que separa essas três é o verbo: a 27001 manda ter o sistema, a 27002 descreve controles, a 27005 descreve o processo do risco. Incidente, que é outra conversa, fica na 27035. Continuidade fica na 22301. Misturar esses números é o erro mais comum.</p>
<h3>Tópicos-chave</h3>
<ul>
<li>O processo acompanha a lógica da gestão de risco: estabelecer o contexto, avaliar, tratar, aceitar o que restar, comunicar e monitorar. Avaliação não é tratamento. Avaliar é entender. Tratar é decidir o que fazer.</li>
<li>A avaliação se parte em identificação, análise e avaliação do risco, no sentido estrito de comparar o risco com o critério. Identificar é nomear o evento, o ativo e a ameaça. Analisar é estimar impacto e verossimilhança. Avaliar é dizer se aquele nível cabe no critério que a organização escreveu, ou se precisa de tratamento.</li>
<li>O critério nasce no contexto. Sem critério, “risco alto” não significa nada. O contexto também fixa o escopo: qual processo, qual sistema, qual unidade. Risco fora do escopo não entra naquela análise, o que não o apaga do mundo.</li>
<li>O tratamento, na família ISO alinhada à 31000, cabe em quatro saídas. Modificar o risco, em geral com controle. Reter, quando o nível já é aceitável ou quando tratar custa mais do que o efeito. Evitar, parando a atividade que cria o risco. Compartilhar, passando parte do efeito a outro, como num seguro ou num contrato. Aceitar o residual é consequência, não um quinto milagre.</li>
<li>Risco residual é o que sobra depois do tratamento. A direção aceita o residual de propósito. Esquecer de registrar essa aceitação é falha de governança, não um detalhe de planilha.</li>
<li>Dono do risco é quem responde pelo ativo ou pelo processo, não necessariamente quem opera a ferramenta de scan. A norma separa quem analisa de quem decide.</li>
<li>A 27005 não lista os controles. Quem procura “use este firewall” está na 27002, ou num benchmark. A 27005 diz como chegar à conclusão de que aquele controle vale a pena.</li>
</ul>
<h3>27001, 27002 e 27005</h3>
<div class="scroll"><table>
<thead><tr><th>Norma</th><th>Papel</th><th>Certifica?</th></tr></thead>
<tbody>
<tr><td>27001</td><td>Requisitos do sistema de gestão</td><td>Sim</td></tr>
<tr><td>27002</td><td>Referência de controles</td><td>Não</td></tr>
<tr><td>27005</td><td>Processo de risco</td><td>Não</td></tr>
</tbody></table></div>
<h3>Pegadinhas da banca</h3>
<ul>
<li>Dizer que a empresa se certifica na 27005. O certificado é na 27001. A 27005 é guia do processo que a 27001 cobra.</li>
<li>Tratar a análise de risco como se fosse a gestão inteira. Análise é um pedaço da avaliação. Gestão inclui contexto, tratamento, comunicação e monitoramento.</li>
<li>Confundir 27005 com 27035. 27005 é antes do incidente, no risco. 27035 é quando o incidente existe e precisa ser gerido.</li>
<li>Listar “eliminar o risco” como obrigação. Eliminar de verdade é raro. O nome honesto, quando se deixa de fazer a atividade, é evitar. O que sobra, com controle, é residual aceito.</li>
<li>Achar que um scan de vulnerabilidade cumpre a 27005. Scan alimenta a identificação. Não substitui critério, dono, tratamento nem aceite.</li>
</ul>
<div class="bizu"><b>Bizu.</b> 01 exige, 02 controla, 05 arrisca. Avaliar é ver. Tratar é escolher: muda, retém, evita ou compartilha. O que sobra tem dono e tem aceite. Incidente é 035, não 005.</div>
<p class="fontes">Fontes: ISO/IEC 27005:2023, gestão de riscos de segurança da informação, citada no item 3.1 do edital; ISO/IEC 27001:2022, que exige o processo de risco sem ser, ela mesma, o método. O vídeo da 27035 permanece só como contraste: incidente não é risco.</p>`},
iso29100:{titulo:'ISO/IEC 29100',html:`
<p>A ISO/IEC 29100 é o framework de privacidade da ISO. O edital aponta a edição 2024. Ela não é a LGPD e não é a 27701. A LGPD é lei brasileira e obriga. A 27701 é sistema de gestão que estende a 27001 para privacidade. A 29100 é o vocabulário e o conjunto de princípios que esses outros textos usam para não falar cada um uma língua. A 29134, logo ao lado no edital, é o guia da avaliação de impacto. Aqui o foco é o framework: papéis e princípios. A avaliação em si está no outro resumo.</p>
<p><a href="#/resumo-lory/iso29134">Em seguida: ISO/IEC 29134, a avaliação de impacto.</a></p>
<h3>Tópicos-chave</h3>
<ul>
<li>O dado de que a norma cuida é informação pessoal identificável, PII: o que identifica uma pessoa ou pode identificá-la junto com outro dado. Dado de máquina, sem ligação com pessoa, fica fora. Dado que só identifica quando cruzado continua dentro.</li>
<li>Os papéis não são cargos do organograma. Titular, ou PII principal, é a pessoa a quem o dado se refere. Controlador é quem determina a finalidade e os meios do tratamento. Operador, ou PII processor, trata em nome do controlador. Terceiro é quem não é titular, nem controlador, nem operador. A banca troca controlador com operador quando a empresa só processa sob contrato.</li>
<li>Os onze princípios públicos da 29100, estáveis desde a edição de 2011 e mantidos como eixo do framework, são estes. Consentimento e escolha. Legitimidade e especificação da finalidade. Limitação da coleta. Minimização. Limitação de uso, retenção e divulgação. Exatidão e qualidade. Abertura, transparência e aviso. Participação e acesso do titular. Responsabilização. Segurança da informação. Conformidade com a privacidade.</li>
<li>Finalidade vem antes da coleta. Coletar “porque um dia serve” quebra especificação e minimização ao mesmo tempo. Reter além do necessário quebra o princípio de retenção, mesmo que a coleta original fosse lícita.</li>
<li>Segurança da informação é um princípio de privacidade, não um capítulo emprestado. Sem confidencialidade, integridade e disponibilidade do dado pessoal, o resto do framework não se sustenta. Isso explica por que a 27701 se apoia na 27001.</li>
<li>O framework não substitui a lei do país. No Brasil, a base legal da LGPD pode ser mais estreita, ou mais específica, do que um princípio genérico. A questão certa respeita os dois: o princípio diz o valor, a lei diz a obrigação.</li>
</ul>
<h3>Princípio e pergunta</h3>
<div class="scroll"><table>
<thead><tr><th>Princípio</th><th>A pergunta honesta</th></tr></thead>
<tbody>
<tr><td>Finalidade</td><td>Para que, dito antes?</td></tr>
<tr><td>Minimização</td><td>Dava para fazer com menos dado?</td></tr>
<tr><td>Retenção</td><td>Ainda preciso guardar?</td></tr>
<tr><td>Transparência</td><td>O titular foi avisado de um jeito que ele entende?</td></tr>
<tr><td>Participação</td><td>Ele consegue acessar e corrigir?</td></tr>
<tr><td>Responsabilização</td><td>Alguém responde e consegue provar?</td></tr>
</tbody></table></div>
<h3>Pegadinhas da banca</h3>
<ul>
<li>Chamar a 29100 de lei. Lei, no edital, é a LGPD, no item 3.3. A 29100 é norma de framework.</li>
<li>Dizer que a 29100 certifica o encarregado. Certificação de sistema, quando existe nesse tema, caminha pela 27701 junto da 27001. A 29100 não é o certificado.</li>
<li>Trocar a 29100 com a 29134. 29100 é o princípio e o papel. 29134 é o método da avaliação de impacto.</li>
<li>Achar que consentimento é a única base. Ele é um princípio de escolha. A lei local pode prever outras bases. A prova mistura os dois de propósito.</li>
<li>Tratar operador como se ele definisse a finalidade. Quem define finalidade é o controlador. Operador executa.</li>
</ul>
<div class="bizu"><b>Bizu.</b> 29100 é o mapa: quem é o titular, quem manda e quem só trata. Onze princípios, da finalidade ao dever de provar. Impacto não mora aqui. Impacto é 29134. Lei é LGPD. Gestão é 27701.</div>
<p class="fontes">Fontes: ISO/IEC 29100:2024, privacy framework, nomeada no item 3.1 do edital; a lista de princípios e de papéis é a do framework público da série 29100, estável desde a edição de 2011.</p>`},
iso29134:{titulo:'ISO/IEC 29134',html:`
<p>A ISO/IEC 29134 é o guia de avaliação de impacto de privacidade, a privacy impact assessment. O edital cita a edição 2024. Ela não cria um sistema de gestão e não é a lei. Ela descreve como examinar, antes e durante um tratamento, o efeito sobre o titular e o que fazer com esse efeito. A 29100 entrega o princípio. A 29134 entrega o procedimento da avaliação. A LGPD, no artigo 38, fala em relatório de impacto à proteção de dados pessoais quando o tratamento puder gerar risco. O relatório da lei e a avaliação da norma respondem à mesma preocupação. Não são o mesmo texto. A Cesgranrio cobra essa diferença.</p>
<p><a href="#/resumo-lory/iso29100">Antes, se precisar: ISO/IEC 29100, o framework.</a></p>
<h3>Tópicos-chave</h3>
<ul>
<li>Avaliação de impacto é processo, não formulário de uma página. Ela descreve o tratamento, o fluxo do dado, o titular afetado, o risco à privacidade e o controle que reduz esse risco. Sem fluxo, não há avaliação. Há só uma lista de sistemas.</li>
<li>O momento certo é antes de o tratamento escalar, e de novo quando o tratamento muda: nova finalidade, novo operador, novo país, nova tecnologia. Avaliação feita uma vez e esquecida não acompanha o princípio de responsabilização da 29100.</li>
<li>A decisão de fazer ou não a avaliação também faz parte do guia. Nem todo tratamento pede o mesmo esforço. O critério é o risco ao titular, não o tamanho da empresa. Tratamento em larga escala, dado sensível ou vigilância sistemática puxam a avaliação para cima. A lei brasileira usa lógica parecida no relatório de impacto. A norma dá o método.</li>
<li>Consulta não é enfeite. O guia espera que quem avalia ouça quem opera o processo e, quando couber, o titular ou quem o representa. Avaliação feita só pelo time de segurança, sem quem conhece a operação, erra o fluxo.</li>
<li>O resultado é um registro: risco encontrado, tratamento escolhido, risco residual e dono. Esse registro alimenta a 27701 e a prestação de contas da LGPD. Não substitui o registro de operações, que é outra obrigação legal.</li>
<li>Impacto de privacidade não é só vazamento. Uso além da finalidade, retenção excessiva, falta de acesso do titular e decisão automatizada sem aviso também são impactos. A prova reduz tudo a “incidente de confidencialidade”. Isso é incompleto.</li>
</ul>
<h3>O que a avaliação olha</h3>
<div class="scroll"><table>
<thead><tr><th>Passo</th><th>O que se responde</th></tr></thead>
<tbody>
<tr><td>Precisa?</td><td>O tratamento pode afetar o titular de modo relevante?</td></tr>
<tr><td>Descreve</td><td>Qual dado, qual fluxo, qual finalidade, quem trata?</td></tr>
<tr><td>Avalia</td><td>Qual risco de privacidade, com qual controle hoje?</td></tr>
<tr><td>Trata</td><td>O que muda, o que se aceita, quem é o dono?</td></tr>
<tr><td>Revisa</td><td>O tratamento mudou desde a última avaliação?</td></tr>
</tbody></table></div>
<h3>Pegadinhas da banca</h3>
<ul>
<li>Chamar a 29134 de LGPD. A LGPD obriga o relatório em certos casos. A 29134 ensina a conduzir a avaliação. Uma empresa pode seguir a norma e ainda assim ter de cumprir o artigo 38 com o conteúdo que a lei e a autoridade pedem.</li>
<li>Dizer que só há impacto quando o dado vaza. Retenção indevida e finalidade desviada também são impacto, mesmo com o dado guardado em cofre.</li>
<li>Confundir com a 27005. A 27005 avalia risco de segurança da informação para a organização. A 29134 avalia efeito de privacidade sobre a pessoa. O ativo, na 29134, é o titular, não o servidor.</li>
<li>Achar que a avaliação substitui a base legal. Primeiro se sabe se o tratamento pode existir. A avaliação não inventa uma base que a lei não deu.</li>
<li>Tratar a 29134 como certificável sozinha. O sistema certificável nessa vizinhança é a 27701 apoiada na 27001. A 29134 é guia.</li>
</ul>
<div class="bizu"><b>Bizu.</b> 29100 diz o princípio. 29134 mede o efeito na pessoa. 27005 mede o risco da organização. LGPD, artigo 38, é o relatório que a lei pode exigir. Mesma preocupação, documentos diferentes. Sem fluxo do dado, não começou a avaliação.</div>
<p class="fontes">Fontes: ISO/IEC 29134:2024, guidelines for privacy impact assessment, nomeada no item 3.1 do edital; ISO/IEC 29100:2024, da qual a avaliação depende para princípio e papel. A Lei 13.709/2018, artigo 38, é o contraste legal, não o texto da norma.</p>`}
};
