# Perguntas Frequentes

## Perguntas Gerais

### O que é o NOMAD?
O NOMAD é um servidor pessoal que dá a você acesso a conhecimento, educação e assistência de IA sem precisar de conexão com a internet. Ele roda no seu próprio hardware, mantendo seus dados privados e acessíveis a qualquer momento.

### Preciso de internet para usar o NOMAD?
Não, e essa é justamente a ideia. Depois que seu conteúdo é baixado, tudo funciona offline. Você só precisa de internet para:
- Baixar conteúdo novo
- Atualizar o software
- Sincronizar as versões mais recentes da Wikipedia, mapas etc.

### Qual sistema operacional o NOMAD precisa?
Linux baseado em Debian. **O Ubuntu 26.04 LTS é o que recomendamos e usamos em nossos testes** para novas instalações.

O Ubuntu 24.04 LTS e o Debian 12 também são suportados, então não é preciso reinstalar se você já usa um deles. Usuários de Windows podem seguir o [guia do WSL2](https://www.projectnomad.us/install/wsl2), que tem suporte da comunidade.

O macOS e distribuições não baseadas em Debian, como Fedora ou Arch, não têm suporte oficial. O NOMAD não precisa de ambiente desktop, então o Ubuntu Server é uma ótima escolha se você se sente à vontade no terminal.

Para um passo a passo completo, incluindo a própria instalação do Ubuntu, veja o [Guia de Instalação](https://www.projectnomad.us/install).

### De que hardware eu preciso?
O NOMAD foi projetado para hardware capaz, principalmente se você quiser usar os recursos de IA. Recomendado:
- CPU moderna com vários núcleos (AMD Ryzen 7 com gráficos Radeon é o ponto ideal segundo a comunidade)
- 16GB+ de RAM (32GB+ para o melhor desempenho de IA)
- Armazenamento SSD (o tamanho depende do conteúdo: mínimo de 500GB, recomendado 1TB+)
- GPU NVIDIA ou AMD recomendada para respostas de IA mais rápidas

**Para recomendações detalhadas de montagem em três faixas de preço ($150–$1.000+), veja o [Guia de Hardware](https://www.projectnomad.us/hardware).**

### Quanta RAM eu preciso?

**Sem o Assistente de IA, todo o conjunto fica abaixo de 1GB.** Medido em uma
instalação em execução: Central de Comando 241MB, MySQL 444MB, Redis 9MB, Kiwix 101MB e o
índice da Base de Conhecimento 155MB. É por isso que 4GB é um mínimo real, e não
apenas uma margem de segurança.

**A IA é a variável, e quem pesa é o modelo, não o NOMAD.** O Ollama ocioso usa
cerca de 1,2GB, e um modelo precisa de aproximadamente o tamanho do seu download na memória enquanto responde,
então um modelo 8B de ~4,6GB pede mais ou menos isso a mais. **8GB funcionam para um modelo
pequeno, 16GB são confortáveis e 32GB é a recomendação se você quiser rodar modelos
maiores.**

De onde vem essa memória depende do seu hardware. Com uma GPU dedicada, o modelo
é carregado na VRAM e nunca usa a RAM do sistema, então a VRAM é o número que limita quais
modelos você consegue rodar. Com uma GPU integrada ou sem GPU, a memória sai da RAM
do sistema, e é por isso que uma máquina só com CPU precisa de mais RAM.

### Quanto armazenamento eu preciso?

**Para instalar o próprio NOMAD: cerca de 5GB, então deixe 10GB livres.** Isso cobre a
Central de Comando e seu banco de dados, antes de qualquer conteúdo. Adicionar o Assistente de IA
eleva o total para cerca de 25GB, porque o Ollama e um modelo de uso geral são
ambos grandes.

Depois disso, depende totalmente do que você baixar:
- Wikipedia completa: ~95GB
- Cursos da Khan Academy: ~50GB
- Referências médicas: ~500MB
- Mapas de estados dos EUA: ~2-3GB cada
- Modelos de IA: 10-40GB, dependendo do modelo

Comece pelo essencial e adicione mais conforme precisar.

---

## Perguntas sobre Conteúdo

### Como adiciono mais conteúdo da Wikipedia?
1. Vá em **Configurações** (menu hambúrguer → Configurações)
2. Clique em **Explorador de Conteúdo**
3. Navegue pelos pacotes da Wikipedia disponíveis
4. Clique em Download nos itens que você quiser

Você também pode usar o **Explorador de Conteúdo** para navegar por todo o conteúdo ZIM disponível além da Wikipedia.

### Como adiciono mais cursos educacionais?
1. Abra o **Kolibri**
2. Entre como administrador
3. Vá em **Device → Channels** (Dispositivo → Canais)
4. Navegue e importe os canais disponíveis

### Quão atualizado é o conteúdo?
O conteúdo é tão atual quanto a última vez em que foi baixado. Os snapshots da Wikipedia costumam ser atualizados mensalmente. Confira os nomes ou as descrições dos arquivos para ver as datas.

### Posso adicionar meus próprios arquivos?
Sim, com a Base de Conhecimento. Envie PDFs, arquivos de texto e outros documentos para a [Base de Conhecimento](/knowledge-base), e a IA poderá consultá-los ao responder suas perguntas. Isso usa busca semântica para encontrar informações relevantes nos arquivos que você enviou.

Para o conteúdo do Kiwix, o NOMAD usa arquivos ZIM padrão. Para conteúdo educacional, o Kolibri usa seu próprio formato de canais.

### O que são os níveis das coleções curadas?
Ao selecionar conteúdo no assistente de Configuração Fácil ou no Explorador de Conteúdo, as coleções são organizadas em três níveis:
- **Essencial** — Conteúdo principal da categoria (menor download)
- **Padrão** — O Essencial mais conteúdo útil adicional
- **Completo** — Tudo o que está disponível para a categoria (maior download)

Isso ajuda você a equilibrar a cobertura de conteúdo com o uso de armazenamento.

---

## Perguntas sobre IA

### Como uso o chat de IA?
1. Vá ao [Chat de IA](/chat) a partir da Central de Comando
2. Digite sua pergunta ou pedido
3. A IA responde em estilo de conversa

A IA precisa ser instalada primeiro: ative-a durante a Configuração Fácil ou instale-a pela página do [Depósito de Suprimentos](/supply-depot).

### Como envio documentos para a Base de Conhecimento?
1. Vá em **[Base de Conhecimento →](/knowledge-base)**
2. Envie seus documentos (PDFs, arquivos de texto etc.)
3. Os documentos são processados e indexados automaticamente
4. Faça perguntas no Chat de IA — a IA vai consultar seus documentos enviados quando forem relevantes

Você também pode remover documentos da Base de Conhecimento quando não precisar mais deles.

A documentação do NOMAD é adicionada automaticamente à Base de Conhecimento quando o Assistente de IA é instalado.

### O que é o Teste de Desempenho?
O Teste de Desempenho avalia o desempenho do seu hardware e gera uma Pontuação NOMAD, uma composição ponderada do desempenho de CPU, memória, disco e IA. Você pode criar uma Tag de Construtor (uma identidade com o tema do NOMAD, como "Tactical-Llama-1234") e compartilhar seus resultados no [ranking da comunidade](https://benchmark.projectnomad.us).

Vá em **[Teste de Desempenho →](/settings/benchmark)** para executar um.

### O que é o Canal de Acesso Antecipado?
O Canal de Acesso Antecipado permite que você opte por receber versões release candidate com os recursos e melhorias mais recentes antes que cheguem às versões estáveis. Você pode ativá-lo ou desativá-lo em **Configurações → Verificar Atualizações**. As versões de acesso antecipado podem conter bugs; se você prefere estabilidade, fique no canal estável.

---

## Solução de Problemas

### Um recurso não carrega ou mostra uma página em branco

**Tente estes passos:**
1. Aguarde 30 segundos — alguns recursos demoram para iniciar
2. Atualize a página (Ctrl+R ou Cmd+R)
3. Volte para a Central de Comando e tente novamente
4. Verifique em Configurações → Sistema se o serviço está em execução
5. Tente reiniciar o serviço (Parar e depois Iniciar no Depósito de Suprimentos)

### Os mapas mostram uma área cinza/em branco

O recurso de Mapas exige dados de mapa baixados. Se você vir uma área em branco:
1. Vá em **Configurações → Gerenciador de Mapas**
2. Baixe as regiões de mapa da sua área
3. Aguarde os downloads terminarem
4. Volte para Mapas e atualize a página

### ERROR: Failed to load the XML library file '/data/kiwix-library.xml'

Isso geralmente significa que o serviço da Biblioteca de Informações iniciou antes de o índice da biblioteca do Kiwix estar totalmente inicializado.

Tente este procedimento de recuperação:
1. Vá ao **[Depósito de Suprimentos](/supply-depot)**
2. Pare a **Biblioteca de Informações (Kiwix)**
3. Aguarde 10-15 segundos e inicie-a novamente
4. Se o erro continuar, execute **Forçar Reinstalação** da Biblioteca de Informações na mesma página

Depois que a reinicialização/reinstalação terminar, atualize a página da Biblioteca de Informações.

### As respostas da IA estão lentas

A IA local exige bastante poder de processamento. Para melhorar a velocidade:
- **Adicione uma GPU** — Uma GPU NVIDIA com o NVIDIA Container Toolkit pode deixar a IA 10-20x mais rápida, ou mais
- Feche outros aplicativos no servidor
- Garanta um resfriamento adequado (o superaquecimento causa redução de desempenho)
- Considere usar um modelo de IA menor/mais rápido, se houver

### Como ativo a aceleração por GPU para a IA?

O NOMAD detecta GPUs NVIDIA automaticamente quando o NVIDIA Container Toolkit está instalado no sistema host. Para configurar a aceleração por GPU:

1. **Instale uma GPU NVIDIA** no seu servidor (se ainda não houver uma)
2. **Instale o NVIDIA Container Toolkit** no host — siga o [guia de instalação oficial](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)
3. **Reinstale o Assistente de IA** — Vá ao [Depósito de Suprimentos](/supply-depot), encontre o Assistente de IA e clique em **Forçar Reinstalação**

O NOMAD vai detectar a GPU durante a instalação e configurar a IA para usá-la automaticamente. Você verá "NVIDIA container runtime detected" no progresso da instalação.

**Dica:** Execute um [Teste de Desempenho](/settings/benchmark) antes e depois para ver a diferença. Sistemas com aceleração por GPU normalmente chegam a mais de 100 tokens por segundo, contra 10-15 só com CPU.

### Adicionei/troquei minha GPU, mas a IA continua lenta

Quando você adiciona ou troca uma GPU, o NOMAD precisa reconfigurar o contêiner da IA para usá-la:

1. Verifique se o **NVIDIA Container Toolkit** está instalado no host
2. Vá ao **[Depósito de Suprimentos](/supply-depot)**
3. Encontre o **Assistente de IA** e clique em **Forçar Reinstalação**

A opção Forçar Reinstalação recria o contêiner da IA com o suporte a GPU ativado. Sem esse passo, a IA continua rodando apenas na CPU.

### Vejo um aviso de "GPU passthrough not working"

O NOMAD verifica se sua GPU está realmente acessível dentro do contêiner da IA. Se uma GPU for detectada no host, mas não estiver funcionando dentro do contêiner, você verá um banner de aviso nas páginas de Informações do Sistema e de Configurações de IA. Clique no botão **"Corrigir: Reinstalar Assistente de IA"** para recriar o contêiner com o acesso correto à GPU. Isso preserva os modelos de IA que você já baixou.

### Chat de IA indisponível

A página do Chat de IA exige que o Assistente de IA esteja instalado primeiro:
1. Vá ao **[Depósito de Suprimentos](/supply-depot)**
2. Instale o **Assistente de IA**
3. Aguarde a instalação terminar
4. O Chat de IA ficará acessível pela tela inicial ou pelo [Chat](/chat)

### Envio para a Base de Conhecimento travado

Se o envio de um documento parecer travado na Base de Conhecimento:
1. Verifique se o Assistente de IA está em execução em **Configurações → Depósito de Suprimentos**
2. Documentos grandes demoram para ser processados — aguarde alguns minutos
3. Tente enviar um documento menor para confirmar que o sistema está funcionando
4. Confira **Configurações → Sistema** para ver se há mensagens de erro

### O Teste de Desempenho não é enviado ao ranking

Para compartilhar resultados no ranking da comunidade:
- Você precisa executar um **Teste de Desempenho Completo** (não Apenas Sistema ou Apenas IA)
- O teste precisa incluir resultados de IA (o Assistente de IA precisa estar instalado e funcionando)
- Sua pontuação precisa ser maior do que qualquer envio anterior do mesmo hardware

Se o envio falhar, confira a mensagem de erro para ver os detalhes.

### "Service unavailable" ou erros de conexão

O serviço pode ainda estar iniciando. Aguarde 1-2 minutos e tente novamente.

Se o problema continuar:
1. Vá em **Configurações → Depósito de Suprimentos**
2. Encontre o serviço com problema
3. Clique em **Reiniciar**
4. Aguarde 30 segundos e tente novamente

### Os downloads estão travados ou falhando

1. Verifique sua conexão com a internet
2. Vá em **Configurações** e confira o armazenamento disponível
3. Se o armazenamento estiver cheio, exclua conteúdo que você não usa
4. Cancele o download travado e tente novamente

### O servidor não inicia

Se você não consegue acessar a Central de Comando de jeito nenhum:
1. Verifique se o hardware do servidor está ligado
2. Confira a conectividade de rede
3. Tente acessar diretamente pelo endereço IP do servidor
4. Confira os logs do servidor, se você tiver acesso ao console

### Esqueci minha senha do Kolibri

As senhas do Kolibri são gerenciadas separadamente:
1. Se você é administrador, pode redefinir as senhas dos usuários no gerenciamento de usuários do Kolibri
2. Se você esqueceu a senha de administrador, talvez precise redefini-la pela linha de comando (fale com seu administrador)

---

## Atualizações e Manutenção

### Como atualizo o NOMAD?
1. Vá em **Configurações → Verificar Atualizações**
2. Se houver uma atualização disponível, clique para instalar
3. O sistema vai baixar as atualizações e reiniciar automaticamente
4. Isso normalmente leva de 2 a 5 minutos

### Devo atualizar com frequência?
Sim, enquanto você tiver acesso à internet. As atualizações incluem:
- Correções de bugs
- Novos recursos
- Melhorias de segurança
- Melhorias de desempenho

### O NOMAD pode se atualizar automaticamente?
Sim. O NOMAD pode manter o software, os apps instalados e o conteúdo atualizados por conta própria. As atualizações automáticas são **opcionais e vêm desativadas por padrão**: você ativa o que quiser em **Configurações → Atualizações** (e, para os apps, por um botão individual em cada app no Depósito de Suprimentos). Elas só rodam dentro de uma janela de horário que você escolhe, depois de verificações de segurança, e nunca aplicam saltos de versão principal automaticamente. Veja o **[guia de Atualizações](/docs/updates)** para um passo a passo completo.

### Como atualizo o conteúdo (Wikipedia etc.)?
As atualizações de conteúdo são separadas das atualizações de software:
1. Vá em **Configurações → Gerenciador de Conteúdo** ou **Explorador de Conteúdo**
2. Verifique se há versões mais novas do conteúdo instalado
3. Baixe as versões atualizadas conforme precisar

Você também pode ativar as **atualizações automáticas de conteúdo** para que as bibliotecas Wikipedia/ZIM instaladas e as regiões de mapa sejam atualizadas sozinhas durante a noite — veja o [guia de Atualizações](/docs/updates).

Dica: novos snapshots da Wikipedia são lançados aproximadamente todo mês.

### O que acontece se uma atualização falhar?
O sistema foi projetado para se recuperar sem problemas. Se uma atualização falhar:
1. A versão anterior deve continuar funcionando
2. Tente a atualização novamente mais tarde
3. Confira Configurações → Sistema para ver se há mensagens de erro

### Manutenção pela Linha de Comando

Para solução de problemas avançada ou quando você não consegue acessar a interface web, o NOMAD inclui scripts auxiliares em `/opt/project-nomad`:

**Iniciar todos os serviços:**
```bash
sudo bash /opt/project-nomad/start_nomad.sh
```

**Parar todos os serviços:**
```bash
sudo bash /opt/project-nomad/stop_nomad.sh
```

**Atualizar a Central de Comando:**
```bash
sudo bash /opt/project-nomad/update_nomad.sh
```
*Observação: isso atualiza apenas a Central de Comando, não os apps individuais. Atualize os apps pela interface web.*

**Desinstalar o NOMAD:**
```bash
curl -fsSL https://raw.githubusercontent.com/Crosstalk-Solutions/project-nomad/refs/heads/main/install/uninstall_nomad.sh -o uninstall_nomad.sh
sudo bash uninstall_nomad.sh
```
*Atenção: isso não pode ser desfeito. Todos os dados serão excluídos.*

---

## Privacidade e Segurança

### Meus dados são privados?
Sim. O NOMAD roda inteiramente no seu hardware. Suas buscas, conversas com a IA e dados de uso nunca saem do seu servidor.

### Outras pessoas podem acessar meu servidor?
Por padrão, o NOMAD fica acessível na sua rede local. Qualquer pessoa na mesma rede pode acessá-lo. Em redes públicas, considere medidas de segurança adicionais.

### A IA envia dados para algum lugar?
Não. A IA roda totalmente local. Suas conversas não são enviadas para nenhum serviço externo. O chat de IA é integrado à Central de Comando, sem nenhum serviço separado para configurar.

---

## Como Obter Mais Ajuda

### A IA pode ajudar
Tente fazer uma pergunta no [Chat de IA](/chat). A IA local pode responder perguntas sobre muitos assuntos, incluindo solução de problemas técnicos. Se você enviou a documentação do NOMAD para a Base de Conhecimento, ela também pode ajudar com perguntas específicas sobre o NOMAD.

### Consulte a documentação
Você já está na documentação. Use o menu para encontrar assuntos específicos.

### Participe da comunidade
Receba ajuda de outros usuários do NOMAD no **[Discord](https://discord.com/invite/crosstalksolutions)**.

### Notas de Versão
Veja o que mudou em cada versão: **[Notas de Versão](/docs/release-notes)**
