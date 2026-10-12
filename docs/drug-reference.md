# Referência de Medicamentos

A Referência de Medicamentos é um banco de dados offline e pesquisável de **bulas da FDA**, as informações oficiais que acompanham medicamentos isentos de prescrição e com prescrição nos EUA. Depois de instalada, você pode procurar um medicamento pelo nome, partir de uma situação para chegar aos medicamentos que a tratam e comparar duas bulas lado a lado, tudo sem conexão com a internet.

É um complemento opcional. Um NOMAD recém-instalado não o inclui até que você decida instalá-lo, porque o conjunto de dados é grande.

> **Isto é informação de saúde, não aconselhamento médico.** A Referência de Medicamentos mostra o texto da bula da FDA fornecido pelo fabricante e associa situações a opções isentas de prescrição. Ela não substitui um médico, farmacêutico ou enfermeiro. Siga sempre as instruções do produto que você realmente tem em mãos e, em uma emergência real, procure ajuda profissional se puder.

Na primeira vez que você abrir a Referência de Medicamentos em um navegador, verá este aviso em uma caixa de diálogo que precisa confirmar antes que a página carregue. Essa confirmação é lembrada por navegador, então um navegador ou dispositivo diferente vai exibi-la novamente.

---

## Instalação

Há duas formas de obter os dados, e as duas levam ao mesmo resultado.

**Pelo Explorador de Conteúdo**, como parte de uma coleção:

1. Na tela inicial, abra o **Explorador de Conteúdo**.
2. Escolha a categoria **Medicina**.
3. Selecione o nível **Padrão**. O conteúdo dele aparece listado no card, e você verá a **Referência de Medicamentos da FDA** entre os itens.
4. Confirme o download.

**Pela própria página da Referência de Medicamentos.** Abra a **Referência de Medicamentos** na tela inicial. Se não houver dados instalados, você verá um painel "Ainda não há dados de medicamentos da FDA" com um botão **Baixar dados de medicamentos da FDA**, que inicia o mesmo processo.

De qualquer forma, o processo roda em duas etapas em segundo plano:

- **Download** — o NOMAD baixa o conjunto de dados de bulas do openFDA, com cerca de **1,7 GB** compactados, em várias partes. Se a conexão cair, ele continua de onde parou.
- **Indexação** — o NOMAD carrega essas bulas em um banco de dados de busca offline rápido. Essa é a etapa mais longa, e os dados se expandem para cerca de **8 a 10 GB** em disco.

Você não precisa ficar esperando. Saia da página e o processo continua; a busca é ativada sozinha assim que a indexação termina. A página mostra o progresso das duas etapas enquanto elas rodam.

---

## Como navegar

Tudo fica atrás de um único bloco **Referência de Medicamentos** na tela inicial. Depois que os dados estão instalados, a página tem três abas.

### Buscar por medicamento

Digite o nome de um medicamento, comercial ou genérico, e o NOMAD mostra as bulas da FDA correspondentes: para que serve o medicamento, posologia, advertências e ingredientes, direto da bula oficial do fabricante.

Os resultados são **agrupados por princípio ativo**, em vez de listados como centenas de produtos quase idênticos. Uma busca por um analgésico comum retorna um grupo por princípio ativo, em vez de cada marca de farmácia separadamente, para que você veja entre o que está realmente escolhendo.

### Por situação

Comece pelo problema em vez do produto. Escolha uma ou mais situações, como queimadura, febre ou diarreia, e o NOMAD lista os medicamentos cujas bulas da FDA as abrangem.

Ao selecionar mais de uma situação, primeiro são procurados medicamentos que abrangem **todas** elas; depois, como alternativa, são mostrados resultados para cada situação separadamente. Isso é útil quando você está lidando com mais de um sintoma ao mesmo tempo e quer um único produto, se houver.

### Dados da FDA

Mostra de onde vieram os dados e o estado atual deles: se foram baixados, indexados e quantas bulas estão carregadas. É também aqui que você executa o download novamente ou reinicia a indexação se algo precisar de atenção.

---

## Comparando dois medicamentos

Na página de detalhes de um medicamento, use **Comparar advertências das bulas** para colocar duas bulas lado a lado e ler o que cada uma diz.

Isso coloca as seções de advertências dos dois fabricantes uma ao lado da outra. Isso **não** calcula interações medicamentosas e não vai dizer se uma combinação é segura. Decidir se dois medicamentos podem ser tomados juntos é exatamente o tipo de pergunta a fazer para um farmacêutico ou médico.

---

## Mantendo os dados atualizados

As bulas da FDA mudam com o tempo. Se você ativou as **atualizações automáticas de conteúdo** (Configurações → Atualizações), o NOMAD verifica periodicamente se o openFDA publicou um conjunto de dados mais novo e atualiza a Referência de Medicamentos sozinho, da mesma forma que faz com o seu outro conteúdo offline.

Com as atualizações automáticas desativadas, os dados permanecem exatamente como estavam quando você os instalou, o que não é problema para o uso offline. Você sempre pode executar o download novamente na aba **Dados da FDA** para obter a versão mais recente.

---

## Uma observação sobre armazenamento

A Referência de Medicamentos é o maior item individual da coleção Medicina → Padrão. Reserve cerca de **8 a 10 GB** de disco para ela após a indexação, além do download de 1,7 GB.

Se o espaço estiver apertado, o Explorador de Conteúdo mostra o tamanho total de um nível antes de você confirmar, para que você saiba o que está assumindo.
