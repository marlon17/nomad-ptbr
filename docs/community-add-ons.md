# Complementos da comunidade

O Project NOMAD vem com um conjunto curado de ferramentas e conteúdos integrados, mas a comunidade começou a criar complementos que ampliam a plataforma com pacotes de conteúdo offline especializados. Esses são projetos de terceiros, não mantidos pela equipe do NOMAD. Instale-os por sua conta e risco e, por favor, envie quaisquer bugs ou pedidos de recursos para o repositório do próprio complemento.

Você criou um complemento para o NOMAD? Abra uma issue no [repositório do Project NOMAD no GitHub](https://github.com/Crosstalk-Solutions/project-nomad/issues/new) ou envie uma mensagem pelo [formulário de contato em projectnomad.us](https://www.projectnomad.us/contact), e nós vamos avaliá-lo para inclusão nesta página.

---

## Pacotes de conteúdo ZIM

Os pacotes de conteúdo ZIM adicionam material de referência offline extra à sua biblioteca do Kiwix existente. Normalmente eles vêm com um script `install.sh` que baixa o material de origem, gera um arquivo ZIM com o `zimwriterfs` e o registra no seu contêiner do Kiwix em execução.

### Manuais de campo militares dos EUA

**Repositório:** [github.com/jrsphoto/ZIM-military-field-manuals](https://github.com/jrsphoto/ZIM-military-field-manuals)

Cerca de 180 manuais de campo militares dos EUA em domínio público, abordando medicina de campo, sobrevivência, primeiros socorros em combate, leitura de mapas e muito mais. Reunidos em um ZIM pesquisável que entra direto na sua biblioteca do Kiwix.

O tamanho final do ZIM é de cerca de 2 GB. Durante a geração, o script baixa cerca de 2 GB de PDFs de origem do archive.org.

### Arquivo de programação W3Schools

**Repositório:** [github.com/kennethbrewer3/ZIM-w3schools-offline](https://github.com/kennethbrewer3/ZIM-w3schools-offline)

Uma cópia offline completa dos tutoriais de programação do W3Schools, abordando HTML, CSS, JavaScript, Python, SQL e muito mais. Ótimo para aprender a programar, consultar sintaxe ou ensinar programação em um ambiente sem internet.

O tamanho final do ZIM é de cerca de 700 MB. Durante a geração, o script baixa cerca de 6 GB de arquivos de origem de um espelho no GitHub.

---

## Instalando um complemento da comunidade

Cada complemento tem suas próprias instruções de instalação, mas a maioria dos pacotes ZIM segue o mesmo formato:

1. Clone o repositório do complemento no seu host do NOMAD via SSH.
2. Consulte o README para ver as dependências de compilação necessárias. A maioria precisa de `git`, `python3`, `unzip` e `zim-tools`.
3. Execute o `install.sh` incluído com a flag `--deploy`, apontando para o caminho da sua biblioteca do Kiwix (`/opt/project-nomad/storage/zim`) e para o nome do seu contêiner do Kiwix (`nomad_kiwix_server`).
4. O script gera o ZIM, copia-o para a sua biblioteca do Kiwix, registra-o no Kiwix e reinicia o contêiner do Kiwix.

Quando o script terminar, o novo conteúdo aparecerá na sua Biblioteca de Informações na próxima vez que você abri-la.

A geração inicial pode levar de alguns minutos a uma hora ou mais, dependendo do tamanho do complemento e da CPU do seu host.

---

## Uma observação sobre suporte

Esses complementos são criados e mantidos pela comunidade. Se algo der errado com um script de instalação ou com o conteúdo de um ZIM, por favor abra uma issue no repositório do próprio complemento, e não no do Project NOMAD. Teremos prazer em ajudar se o problema for com o próprio NOMAD, por exemplo, se o Kiwix não reconhecer um novo ZIM após uma instalação, mas não podemos manter nem dar suporte a conteúdo de terceiros.
