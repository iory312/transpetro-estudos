# Áudio 1 — BIZUs de Segurança Ofensiva

Olá, Allan! Aqui é o seu resumo falado dos BIZUs do Módulo 1, Segurança Ofensiva, para a prova da Transpetro, ênfase sete, Segurança Cibernética, banca Cesgranrio. São doze BIZUs, mais as pegadinhas que mais derrubam candidato. Pode ouvir no trânsito, sem olhar para nada. Vamos lá.

Primeiro BIZU: ataque passivo contra ataque ativo. Grave assim: passivo é para prevenir. Quem só escuta a rede quase não deixa rastro, então é difícil de detectar, e a defesa certa é impedir, por exemplo com criptografia. Já o ataque ativo é para detectar e recuperar, porque é difícil preveni-lo cem por cento. E os ativos têm um mnemônico: D, R, M, N. Disfarce, Repetição, Modificação e Negação de serviço.
Agora a pegadinha: análise de tráfego funciona mesmo com criptografia. Se a alternativa disser que cifrar resolve a análise de tráfego, é falsa. E o ataque de repetição, o replay, não precisa quebrar a cifra: o atacante simplesmente reenvia o pacote cifrado do jeito que está.

Segundo BIZU: a ordem das etapas do ataque. Decore a frase: "Fui Ver Eu Ganhar, Escalei, Pus Porta, Escondi e Recusei". Isso dá: Footprinting, Varredura, Enumeração, Ganho de acesso, Escalação de privilégio, Porta dos fundos, Encobrimento de rastros e Recusa de serviço. E a diferença que a banca cobra: a varredura pergunta "o que está aberto?". A enumeração pergunta "quem, ou quais: contas, compartilhamentos e versões?". Lembre também: footprinting com fontes abertas é passivo; varredura é ativa, porque toca o alvo.

Terceiro BIZU, o do nmap, que cai muito. Vou falar flag por flag, devagar.
Menos ésse, ésse maiúsculo: é o SYN scan, o silencioso. Ele manda o SYN e não completa o handshake.
Menos ésse, tê maiúsculo: é o TCP connect, o tagarela. Esse sim completa o handshake de três vias.
Menos ésse, vê maiúsculo: versão do serviço.
Menos ó maiúsculo: sistema operacional.
Menos ésse ene, tudo minúsculo: sem portas, só descobre quem está vivo.
Menos pê, menos: todas as portas, de um a sessenta e cinco mil quinhentos e trinta e cinco.
Menos pê maiúsculo, ene: não pinga, assume que o host está vivo.
Menos ésse, u maiúsculo: varredura UDP.
E menos á maiúsculo: o modo agressivo, faz tudo.
Pegadinhas clássicas do nmap: dizer que o menos ésse ésse completa o handshake é falso, quem completa é o menos ésse tê. Dizer que o menos ésse ene varre as portas mais comuns é falso. Dizer que o menos ó descobre a versão do Apache é falso, versão de serviço é o menos ésse vê. E o ACK scan não identifica porta aberta; ele serve para mapear regras de firewall.

Quarto BIZU: ARP spoofing. Três palavras: mesma LAN, camada dois, homem no meio. O atacante anuncia: "o IP do gateway sou eu", e entrega o próprio endereço MAC. A defesa é a dupla DAI, Dynamic ARP Inspection, mais DHCP Snooping. O DAI valida as mensagens ARP contra a tabela de vínculos que o DHCP Snooping montou. Não confunda com envenenamento de DNS: o DNS falsifica a tradução de nome para IP, está na camada sete, pode ser remoto, e a defesa é DNSSEC. O ARP falsifica a tradução de IP para MAC, e só funciona na rede local.
Como a banca descreve o sintoma? Se várias estações passaram a ter o IP do roteador associado a um MAC diferente, é ARP spoofing. Se as estações recebem gateway ou DNS errados ao ligar, é DHCP falso, o rogue DHCP. E se o switch passou a se comportar como hub, é MAC flooding, estouro da tabela CAM.

Quinto BIZU: as portas que mais caem. Vou em blocos. FTP, vinte e vinte e um. SSH, vinte e dois. Telnet, vinte e três. SMTP, vinte e cinco. DNS, cinquenta e três. DHCP, sessenta e sete e sessenta e oito. HTTP, oitenta. Kerberos, oitenta e oito.
Segundo bloco: POP3, cento e dez. NTP, cento e vinte e três. IMAP, cento e quarenta e três. SNMP, cento e sessenta e um e cento e sessenta e dois. LDAP, trezentos e oitenta e nove. HTTPS, quatrocentos e quarenta e três. SMB, quatrocentos e quarenta e cinco.
Terceiro bloco: SMTPS, quatrocentos e sessenta e cinco. IKE, quinhentos. Modbus, quinhentos e dois, essa é de automação industrial, importante na Transpetro. Submission de e-mail, quinhentos e oitenta e sete. LDAPS, seiscentos e trinta e seis. IMAPS, novecentos e noventa e três. POP3S, novecentos e noventa e cinco.
E as altas: RADIUS, mil oitocentos e doze e mil oitocentos e treze. RDP, três três oito nove. E NAT Traversal do IPsec, quatro mil e quinhentos.

Sexto BIZU: Wi-Fi em uma linha. Rogue é o intruso plugado na sua rede. Evil Twin é o clone do nome da rede, o SSID. Tracking é te seguir pelas mensagens de probe que o seu celular envia. Jamming é barulho de rádio frequência, ataque físico, não de protocolo. E Deauth é o quadro de desautenticação forjado que derruba o cliente; quem resolve é o PMF, Protected Management Frames, do padrão oitocentos e dois ponto onze dáblio.
Pegadinha: o rogue AP está conectado à rede interna, é ameaça à empresa. O evil twin imita uma rede para enganar os clientes.

Sétimo BIZU: sniffing, spoofing e homem no meio. Sniffing é ouvir, é passivo. Spoofing é fingir, é ativo. E o homem no meio é ficar no meio da conversa, e numa rede comutada ele precisa de spoofing para chegar lá. A ferramenta defensiva da lista do edital é o arpwatch, que detecta mudança no par IP e MAC.

Oitavo BIZU: o ciclo da engenharia social, P, R, E, U. Pesquisa, Relacionamento, Exploração e Utilização. Pegadinha: pharming não é phishing. No pharming a vítima digita o endereço correto e mesmo assim cai no site falso, porque o DNS ou o arquivo hosts foi adulterado. E whaling é o spear phishing contra a alta direção, os "peixes grandes".

Nono BIZU: vírus, worm e cavalo de Troia. O vírus precisa de hospedeiro e de execução. O worm anda sozinho pela rede. O cavalo de Troia é o presente de grego: parece útil e não se replica. E ainda: keylogger captura o teclado; screenlogger captura a tela, por isso o teclado virtual não salva você do screenlogger.
Pegadinhas: rootkit não serve, por definição, para obter acesso; serve para esconder e manter o acesso. Formjacking ataca o site de comércio eletrônico, não o computador do cliente. E cryptojacking não cifra arquivos: ele minera criptomoeda escondido. Quem cifra arquivos é o ransomware.

Décimo BIZU: MITRE ATT&CK. Lembre: pegou senha, hash ou ticket, é a tática Credential Access, tê á zero zero zero seis. Despejar a memória do processo LSASS com o mimikatz é a técnica tê mil e três ponto zero zero um. Usar o hash para entrar em outra máquina, o pass the hash, é Lateral Movement, técnica tê mil quinhentos e cinquenta ponto zero zero dois, que também aparece em Defense Evasion. Phishing é Initial Access. Tarefa agendada ou chave Run no registro é Persistence. Cifrar arquivos para pedir resgate é Impact. Apagar logs é Defense Evasion.
E a ordem das catorze táticas, numa frase: "Recebi Recursos, Invadi, Executei, Persisti, Privilegiei, Desviei, Credenciei, Descobri, Lateralizei, Coletei, C2, Exfiltrei, Impactei". Ou seja: Reconhecimento, Desenvolvimento de recursos, Acesso inicial, Execução, Persistência, Escalação de privilégio, Evasão de defesa, Acesso a credenciais, Descoberta, Movimento lateral, Coleta, Comando e controle, Exfiltração e Impacto.
Pegadinhas: o ATT&CK não é sequencial obrigatório como a Cyber Kill Chain. Tática é o objetivo, técnica é o como: Credential Access é tática; OS Credential Dumping é técnica. E uma técnica pode pertencer a mais de uma tática.

Décimo primeiro BIZU: a sopa de letrinhas do MITRE. CVE é a vulnerabilidade específica, aquela falha naquele produto. CWE é a fraqueza, o tipo de erro, de weakness. CAPEC é o padrão de ataque. E o ATT&CK é o comportamento do adversário. No CAPEC, os mecanismos respondem "como ataca", e os domínios respondem "onde ataca".

Décimo segundo e último BIZU deste módulo: as vinte e quatro ferramentas do edital, agrupadas por fase.
Reconhecimento: amass, theHarvester e Maltego.
Varredura: nmap e masscan. Masscan é mais rápido, mas não detecta versão e sistema no mesmo nível.
Enumeração: smbmap.
Sniffing e homem no meio: Wireshark e Ettercap. E o arpwatch para detectar.
Wi-Fi: aircrack-ng e airgeddon.
Senhas: o hydra ataca o serviço ao vivo, é online. John the Ripper e hashcat quebram hash já obtido, são offline, e o hashcat usa a placa de vídeo.
Exploração: Metasploit, sqlmap, BeEF, que depende de XSS para fisgar o navegador, e Burp.
Pós-exploração e credenciais: mimikatz.
Evasão de antivírus: Veil.
Engenharia social: SET, o Social Engineer Toolkit.
Engenharia reversa: Ghidra, que não é scanner de vulnerabilidades.
Esconder dados dentro de imagem ou áudio: steghide. Ele não cifra disco.
E o canivete suíço de rede: netcat.

Recapitulando o módulo em dez segundos: passivo previne, ativo detecta. Menos ésse ésse não completa o handshake. ARP é camada dois e local; DNS é camada sete. Vírus precisa de hospedeiro, worm anda sozinho. E hydra é online, john e hashcat são offline. Fim do áudio de Segurança Ofensiva. Bons estudos!
