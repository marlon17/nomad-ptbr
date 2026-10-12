# Primeiros Passos com o NOMAD

Este guia vai ajudar você a aproveitar ao máximo o seu servidor NOMAD.

---

## Requisitos do Sistema

Se você já tem o NOMAD em execução, pode pular esta seção. Ela está aqui para quando você estiver planejando um segundo servidor, mudando para outro hardware ou ajudando outra pessoa a configurar o dela.

### Sistema Operacional

O NOMAD roda em Linux baseado em Debian.

| Nível de suporte | Sistema operacional |
|---|---|
| **Recomendado** | Ubuntu 26.04 LTS |
| **Também suportado** | Ubuntu 24.04 LTS, Debian 12 |
| **Suporte da comunidade** | Windows via WSL2, outros derivados do Debian |

O Ubuntu 26.04 LTS é a versão em que fazemos nossos testes e a que recomendamos para novas instalações. Se você já usa o 24.04 LTS ou o Debian 12, não é preciso reinstalar: ambos continuam suportados.

O Ubuntu Desktop é a opção mais amigável se você vem do Windows ou do macOS. O Ubuntu Server funciona igualmente bem se você se sente à vontade no terminal, e o NOMAD não precisa de ambiente desktop em nenhum dos casos, já que tudo é acessado pelo navegador.

O macOS e distribuições não baseadas em Debian, como Fedora ou Arch, não têm suporte oficial.

### Hardware

O NOMAD em si é leve. O que define seus requisitos é o conteúdo e as ferramentas que você escolhe instalar, e se você quer rodar IA localmente.

**Mínimo, sem IA local:**

- Processador dual-core de 2 GHz
- 4 GB de RAM
- 5 GB de espaço livre em disco, mais espaço para o conteúdo que você baixar

**Recomendado, com IA local:**

- AMD Ryzen 7 ou Intel Core i7 ou superior
- 32 GB de RAM
- NVIDIA RTX 3060 ou equivalente AMD; mais VRAM permite rodar modelos maiores
- 250 GB ou mais de espaço livre em disco, de preferência em SSD

Uma conexão estável com a internet só é necessária durante a instalação. Depois disso, o NOMAD foi projetado para funcionar totalmente offline.

### Uma observação sobre drivers de GPU

O instalador configura o Docker e o NVIDIA Container Toolkit para você, mas **não** instala o driver da GPU em si. Você precisa ter o driver no host antes.

No Ubuntu, o jeito mais fácil é marcar **"Instalar software de terceiros para placas de vídeo e Wi-Fi"** durante a instalação. Se você pulou essa opção ou adicionou a GPU depois, instale o driver primeiro e depois use **Forçar Reinstalação** no Assistente de IA, no [Depósito de Suprimentos](/supply-depot), para que ele seja reconhecido.

Sem GPU, o Assistente de IA continua funcionando. Ele só roda na CPU, o que é bem mais lento.

---

## Assistente de Configuração Fácil

Se esta é a primeira vez que você usa o NOMAD, o assistente de Configuração Fácil vai ajudar você a configurar tudo.

**[Iniciar a Configuração Fácil →](/easy-setup)**

![Assistente de Configuração Fácil — Passo 1: escolha seus recursos](/docs/easy-setup-step1.webp)

O assistente guia você por quatro passos simples:
1. **Recursos** — Escolha o que ativar: Biblioteca de Informações, Assistente de IA, Plataforma Educacional, Mapas, Ferramentas de Dados e Notas
2. **Mapas** — Selecione as regiões geográficas para os mapas offline
3. **Conteúdo** — Escolha coleções de conteúdo curadas nos níveis Essencial, Padrão ou Completo

![Níveis de conteúdo — Essencial, Padrão e Completo](/docs/easy-setup-tiers.webp)
4. **Revisão** — Confirme suas escolhas e comece os downloads

Dependendo do que você selecionou, os downloads podem demorar. Você pode acompanhar o progresso na área de Configurações, continuar usando os recursos que já estão instalados ou deixar seu servidor ligado durante a noite para downloads grandes.

---

## Conhecendo Suas Ferramentas

### Biblioteca de Informações — Conhecimento Offline (Kiwix)

A Biblioteca de Informações armazena versões compactadas de sites e referências que funcionam sem internet.

**O que está incluído:**
- Wikipedia completa (milhões de artigos)
- Referências médicas e guias de primeiros socorros
- Guias práticos e informações de sobrevivência
- Livros clássicos do Project Gutenberg

**Como usar:**
1. Clique em **Biblioteca de Informações** na tela inicial da Central de Comando ou no [Depósito de Suprimentos](/supply-depot)
2. Escolha uma coleção (como a Wikipedia)
3. Pesquise ou navegue como no site normal

---

### Plataforma Educacional — Cursos Offline (Kolibri)

A Plataforma Educacional oferece cursos educacionais completos que funcionam offline.

**O que está incluído:**
- Cursos em vídeo da Khan Academy
- Matemática, ciências, leitura e mais
- Acompanhamento de progresso dos alunos
- Funciona para todas as idades

**Como usar:**
1. Clique em **Plataforma Educacional** na tela inicial da Central de Comando ou no [Depósito de Suprimentos](/supply-depot)
2. Entre ou crie uma conta de aluno
3. Navegue pelos cursos e comece a aprender

**Dica:** O Kolibri suporta vários usuários. Crie contas para cada membro da família para acompanhar o progresso individual.

---

### Assistente de IA — Chat Integrado

![Interface do Chat de IA](/docs/ai-chat.webp)

O NOMAD inclui uma interface de chat de IA integrada, com tecnologia Ollama. Ela roda inteiramente no seu servidor: sem precisar de internet e sem enviar dados para lugar nenhum.

**O que ele pode fazer:**
- Responder perguntas sobre qualquer assunto
- Explicar conceitos complexos de forma simples
- Ajudar a escrever e revisar textos
- Consultar seus documentos enviados por meio da Base de Conhecimento
- Gerar ideias e ajudar a resolver problemas

**Como usar:**
1. Clique em **Chat de IA** na Central de Comando ou vá ao [Chat](/chat)
2. Digite sua pergunta ou pedido
3. A IA responde em estilo de conversa

**Dica:** Seja específico nas perguntas. Em vez de "me fale sobre plantas", tente "quais hortaliças crescem bem na sombra?"

**Observação:** O Assistente de IA precisa ser instalado primeiro. Ative-o durante a Configuração Fácil ou instale-o pelo [Depósito de Suprimentos](/supply-depot).

**Aceleração por GPU:** Se o seu servidor tem uma GPU NVIDIA, o instalador do NOMAD configura o suporte a GPU para você (ele instala o [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) e configura o Docker automaticamente). Você só precisa ter o driver NVIDIA no host, que no Ubuntu você obtém ativando a opção de instalar software de terceiros durante a instalação. Com uma GPU, as respostas da IA ficam muito mais rápidas (melhoria de 10-20x). Se você adicionar uma GPU depois, vá ao [Depósito de Suprimentos](/supply-depot) e use **Forçar Reinstalação** no Assistente de IA para ativá-la.

---

### Base de Conhecimento — IA que Conhece Seus Documentos

![Interface de envio da Base de Conhecimento](/docs/knowledge-base.webp)

A Base de Conhecimento permite que você envie documentos para que a IA possa consultá-los ao responder suas perguntas. Ela usa busca semântica (RAG via Qdrant) para encontrar informações relevantes nos arquivos que você enviou.

**Tipos de arquivo suportados:**
- PDFs, arquivos de texto e outros formatos de documento
- A documentação do NOMAD é carregada automaticamente quando o Assistente de IA é instalado

**Como usar:**
1. Vá em **[Base de Conhecimento →](/knowledge-base)**
2. Envie seus documentos (PDFs, arquivos de texto etc.)
3. Os documentos são processados e indexados automaticamente
4. Faça perguntas no Chat de IA — a IA vai consultar seus documentos enviados quando forem relevantes
5. Remova os documentos de que você não precisa mais — eles serão excluídos do índice e do armazenamento local

**Casos de uso:**
- Envie planos de emergência para consulta rápida durante uma crise
- Carregue manuais técnicos e procedimentos operacionais padrão (POPs) para locais de trabalho offline
- Adicione guias curriculares para ensino domiciliar
- Guarde artigos científicos para trabalhos acadêmicos

---

### Mapas — Navegação Offline

![Visualizador de mapas offline](/docs/maps.webp)

Veja mapas sem internet. Baixe as regiões de que você precisa antes de ficar offline.

**Como usar:**
1. Clique em **Mapas** na Central de Comando
2. Navegue arrastando e aplicando zoom
3. Pesquise locais usando a barra de busca

**Para adicionar mais regiões de mapa:**
1. Vá em **Configurações → Gerenciador de Mapas**
2. Selecione as regiões de que você precisa
3. Clique em Download

**Dica:** Baixe mapas das áreas para onde você viaja com frequência, além das regiões vizinhas, por precaução.

**[Abrir Mapas →](/maps)**

---

## Gerenciando Seu Servidor

### Adicionando Mais Conteúdo

À medida que suas necessidades mudam, você pode adicionar mais conteúdo a qualquer momento:

- **Mais apps:** Configurações → Depósito de Suprimentos
- **Mais referências:** Configurações → Explorador de Conteúdo ou Gerenciador de Conteúdo
- **Mais regiões de mapa:** Configurações → Gerenciador de Mapas
- **Mais conteúdo educacional:** Pelo navegador de conteúdo integrado do Kolibri

### Seletor da Wikipedia

![Explorador de Conteúdo — navegue e baixe pacotes da Wikipedia e coleções curadas](/docs/content-explorer.webp)

O NOMAD inclui uma ferramenta dedicada de gerenciamento de conteúdo da Wikipedia para navegar e baixar pacotes da Wikipedia.

**Como usar:**
1. Vá ao **[Explorador de Conteúdo →](/settings/zim/remote-explorer)**
2. Navegue pelos pacotes da Wikipedia disponíveis por idioma e tamanho
3. Selecione e baixe os pacotes que você quiser

**Observação:** Selecionar um pacote diferente da Wikipedia substitui a versão baixada anteriormente. Só uma seleção da Wikipedia fica ativa por vez.

### Teste de Desempenho

![Teste de Desempenho com Pontuação NOMAD e Tag de Construtor](/docs/benchmark.webp)

Teste o desempenho do seu hardware e veja como a sua montagem do NOMAD se compara com a da comunidade.

**Como usar:**
1. Vá em **[Teste de Desempenho →](/settings/benchmark)**
2. Escolha um tipo de teste: Completo, Apenas Sistema ou Apenas IA
3. Veja sua Pontuação NOMAD (uma composição ponderada do desempenho de CPU, memória, disco e IA)
4. Crie uma Tag de Construtor (sua identidade com o tema do NOMAD, como "Tactical-Llama-1234")
5. Compartilhe seus resultados no [ranking da comunidade](https://benchmark.projectnomad.us)

**Observação:** Só Testes de Desempenho Completos com dados de IA podem ser compartilhados no ranking da comunidade.

### Mantendo Tudo Atualizado

Enquanto você tiver internet, verifique periodicamente se há atualizações:

1. Vá em **Configurações → Verificar Atualizações**
2. Se houver atualizações disponíveis, clique para instalar
3. Aguarde a atualização terminar (seu servidor vai reiniciar)

As atualizações de conteúdo (Wikipedia, mapas etc.) podem ser gerenciadas separadamente das atualizações de software.

**Atualizações automáticas:** O NOMAD também pode se manter atualizado sem que você precise verificar. O software, os apps instalados e o conteúdo podem, cada um, ser configurados para atualizar automaticamente de forma opcional, com verificações de segurança e uma janela de horário que você controla. Veja o **[guia de Atualizações](/docs/updates)** para o panorama completo.

**Canal de Acesso Antecipado:** Quer os recursos mais recentes antes de chegarem à versão estável? Ative o Canal de Acesso Antecipado na página Verificar Atualizações para receber versões release candidate. Você pode voltar para a versão estável a qualquer momento.

### Monitorando a Saúde do Sistema

Verifique seu servidor a qualquer momento:

1. Vá em **Configurações → Sistema**
2. Veja o uso de CPU, memória e armazenamento
3. Confira o tempo de atividade e o status do sistema

---

## Dicas para Melhores Resultados

### Antes de Ficar Offline

- **Atualize tudo** — Execute as atualizações de software e de conteúdo
- **Baixe o que você precisa** — Mapas, referências, conteúdo educacional
- **Teste** — Confirme que os recursos funcionam enquanto você ainda tem internet para resolver problemas

### Gerenciamento de Armazenamento

Seu servidor tem armazenamento limitado. Priorize:
- Conteúdo que você realmente vai usar
- Referências essenciais (médicas, de sobrevivência)
- Mapas da sua região
- Conteúdo educacional que atenda às suas necessidades

Confira o uso de armazenamento em **Configurações → Sistema**.

### Obtendo Ajuda

- **Documentação no app:** Você está lendo agora
- **Assistente de IA:** Faça uma pergunta no [Chat de IA](/chat)
- **Notas de versão:** Veja o que há de novo em cada versão

---

## Próximos Passos

Você está pronto para usar o NOMAD. Aqui estão algumas coisas para experimentar:

1. **Pesquise algo** — Procure um assunto na Biblioteca de Informações
2. **Aprenda algo** — Comece um curso da Khan Academy na Plataforma Educacional
3. **Faça uma pergunta** — Converse com a IA no [Chat de IA](/chat)
4. **Explore os mapas** — Encontre seu bairro no visualizador de Mapas
5. **Envie um documento** — Adicione um PDF à [Base de Conhecimento](/knowledge-base) e pergunte à IA sobre ele

Aproveite seu servidor de conhecimento offline!
