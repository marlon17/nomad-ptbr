# Mantendo o NOMAD atualizado

O NOMAD funciona melhor quando é mantido em dia enquanto você tem internet, para que esteja pronto com o software e o conteúdo mais recentes na próxima vez que você ficar offline. Esta página explica o que pode ser atualizado, como atualizar quando quiser e como deixar o NOMAD cuidar disso para você automaticamente.

---

## Os três tipos de atualização

Há três coisas distintas que podem ser atualizadas, e você controla cada uma delas de forma independente:

1. **Software (o núcleo)** — o próprio NOMAD: a Central de Comando, novos recursos, correções de bugs e melhorias de segurança.
2. **Apps** — os apps instaláveis do [Depósito de Suprimentos](/supply-depot) (Kiwix, o Assistente de IA e quaisquer outros que você tenha adicionado).
3. **Conteúdo** — o seu material offline: a Wikipedia e outras bibliotecas do Kiwix, além das regiões de mapas baixadas.

Você pode atualizar qualquer um deles quando quiser ou configurar qualquer um deles para ser atualizado automaticamente.

---

## Atualizando quando quiser

Para verificar e instalar atualizações você mesmo:

1. Acesse **[Configurações → Verificar atualizações](/settings/update)**.
2. Se houver uma atualização de software disponível, clique para instalá-la. O NOMAD baixa a atualização e reinicia (normalmente leva de 2 a 5 minutos).
3. Os apps podem ser atualizados pelo card de cada um no [Depósito de Suprimentos](/supply-depot), usando **Gerenciar › Atualizar**.
4. O conteúdo é gerenciado em **Configurações → Gerenciador de Conteúdo** e no **Explorador de Conteúdo**, onde você pode baixar versões mais recentes das bibliotecas e dos mapas instalados.

Se alguma atualização de software ou de app falhar, o NOMAD foi projetado para se recuperar sem problemas — a versão anterior que funcionava continua em execução, então o seu servidor permanece no ar.

---

## Atualizações automáticas

O NOMAD pode se manter em dia sem que você precise se lembrar de verificar. **As atualizações automáticas são opcionais e vêm desativadas por padrão** — nada é atualizado sozinho até você ativar. Você gerencia tudo isso em **Configurações → Atualizações**.

Algumas regras valem para os três tipos:

- **Você escolhe uma janela de horário.** As atualizações automáticas só rodam no horário que você definir, para nunca interromper você no meio do uso.
- **Versões principais nunca são automáticas.** Somente atualizações menores e de correção são aplicadas sozinhas; um grande salto de versão sempre espera que você o faça manualmente, de propósito.
- **As verificações de segurança vêm primeiro.** Antes de aplicar qualquer coisa, o NOMAD confirma que há espaço em disco suficiente e que nenhuma outra atualização, download ou instalação já está em andamento.
- **Ficar offline não causa problemas.** Se o NOMAD não conseguir acessar a internet para verificar, ele simplesmente pula essa rodada e tenta de novo mais tarde.

### Atualizações automáticas do software (núcleo)

Ative essa opção em **Configurações → Atualizações**. Quando ativada, o NOMAD atualiza o próprio núcleo para versões mais novas dentro da mesma versão principal, durante a janela que você escolheu, após um período de **espera** configurável (para que uma versão recém-lançada tenha tempo de se provar antes de o seu servidor adotá-la). A mesma página mostra a chave de ativação, a janela, a configuração de espera e o status em tempo real. Se as atualizações falharem repetidamente por um motivo real, o NOMAD desativa o recurso e avisa você, em vez de ficar tentando para sempre.

### Atualizações automáticas dos apps

As atualizações automáticas de apps são opcionais em **dois níveis**: uma chave geral em **Configurações → Atualizações** *e* uma chave por app no card de cada app no [Depósito de Suprimentos](/supply-depot). As duas precisam estar ativadas para que um app se atualize sozinho. As atualizações de apps usam a mesma janela de atualização e o mesmo período de espera do núcleo, aplicam apenas versões menores e de correção e são suspensas automaticamente para qualquer app que continue falhando.

### Atualizações automáticas do conteúdo

As bibliotecas da Wikipedia/ZIM e as regiões de mapas instaladas também podem se atualizar sozinhas. Como os downloads de conteúdo são grandes (muitas vezes vários gigabytes), as atualizações de conteúdo rodam em uma **janela noturna própria e dedicada**, com um **limite de banda**, separada da programação de software e apps. O NOMAD consulta diretamente os catálogos de origem do Kiwix e dos mapas e, quando uma biblioteca da Wikipedia é substituída por uma versão mais nova, mantém a Base de Conhecimento da IA sincronizada automaticamente.

---

## Canal de Acesso Antecipado

Quer receber novos recursos antes que cheguem à versão estável? Ative o **Canal de Acesso Antecipado** na página [Verificar atualizações](/settings/update) para receber versões candidatas a lançamento (release candidates). Versões de acesso antecipado podem ter algumas arestas a aparar — você pode voltar para a versão estável a qualquer momento.

---

## Antes de ficar offline

Seja qual for a sua escolha, o hábito mais importante é simples: **atualize enquanto ainda tem internet.** Seja manualmente ou deixando as atualizações automáticas cuidarem disso, garanta que o seu software e o seu conteúdo estejam em dia antes de ir para algum lugar sem conexão. Quando estiver offline, você terá as últimas versões sincronizadas de tudo prontas para uso.

**[Verificar atualizações →](/settings/update)** · **[Veja as novidades de cada versão →](/docs/release-notes)**
