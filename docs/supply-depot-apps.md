# Apps do Depósito de Suprimentos

O Depósito de Suprimentos é onde você instala apps extras no seu NOMAD, além das ferramentas integradas. Cada app roda no próprio contêiner no seu NOMAD, totalmente offline, e aparece com um botão **Abrir** assim que termina de instalar.

Esta página cobre o que você precisa saber para começar a usar cada app *especificamente no NOMAD*: se é preciso fazer login, quais são as credenciais padrão, onde seus arquivos ficam e o que você precisa ter em mãos antes. Ela não explica como usar os apps em si. Cada app é um projeto de código aberto com documentação própria, e incluímos o link para ela em todos.

Uma observação rápida sobre logins: alguns desses apps têm contas próprias, separadas do seu login no NOMAD. Quando um app pede para você entrar, informamos as credenciais iniciais e se você deve alterá-las.

---

## Gerenciando seus apps

Todo app que você instala ganha um menu **Gerenciar** no seu cartão. A partir dele, você pode:

- **Documentação** — ir direto para as notas de primeiros passos do NOMAD para aquele app (as mesmas seções por app que você encontra abaixo).
- **Editar** — alterar as configurações de um app: mapeamentos de portas, vínculos de volumes, variáveis de ambiente e limites de memória/CPU. Isso funciona também para os apps curados, não só para os personalizados. Suas edições são mescladas com a configuração existente do app, então as configurações avançadas (como o acesso à GPU no Assistente de IA) são preservadas, e um app editado deixa de ser sobrescrito pelas atualizações do catálogo.
- **Logs** e **Estatísticas** — abrir uma visualização ao vivo da saída de log de um app ou do seu uso atual de memória e CPU, útil quando algo não está funcionando direito.
- **Atualizar** e **Remover** — baixar a versão mais recente de um app ou removê-lo (opcionalmente excluindo também a imagem). Se o novo contêiner de uma atualização não conseguir iniciar, o NOMAD volta automaticamente para a versão que estava funcionando.

**Vendo qual versão você está usando:** cada cartão de app mostra a versão instalada logo ao lado do nome do app (por exemplo, `Kiwix · 3.7.0`). Quando há uma versão mais nova disponível, aparece no cartão uma etiqueta laranja **Atualização disponível**, fácil de notar de relance.

**Links "Abrir" personalizados:** por padrão, o botão **Abrir** aponta para o app no próprio endereço do seu NOMAD. Se você usa um proxy reverso ou DNS local e prefere abrir um app em um endereço mais amigável (por exemplo `https://jellyfin.myhomelab.net`), use **Gerenciar › Editar** para definir uma URL de abertura personalizada. O NOMAD guarda seu link original com segurança, então você sempre pode voltar a ele, e a substituição se mantém entre atualizações.

**Mantendo os apps atualizados automaticamente:** os apps instalados podem se atualizar sozinhos, sem intervenção. Isso é opcional em dois níveis — uma chave geral em **Configurações → Atualizações** e uma chave por app no Depósito de Suprimentos — e apenas atualizações menores e de correção são aplicadas automaticamente (versões principais continuam sempre manuais). Veja o [guia de Atualizações](/docs/updates) para todos os detalhes.

---

## Trazendo seu próprio app

Além do catálogo curado, o Depósito de Suprimentos pode rodar **seu próprio contêiner Docker** como um app gerenciado, junto com todo o resto. Clique em **Adicionar um app personalizado** e informe ao NOMAD:

- a **imagem** a baixar (por exemplo `ghcr.io/owner/app:1.2.3`),
- os **mapeamentos de portas**, **vínculos de volumes**, **variáveis de ambiente** e **limites de memória/CPU** de que ele precisa.

Enquanto você preenche, o NOMAD faz uma verificação prévia ao vivo e avisa sobre coisas como conflitos de porta ou configurações arriscadas. Alguns avisos (um registro não confiável, ou uma tag `:latest` que não permite acompanhar a versão) são apenas recomendações, e você pode escolher **Instalar mesmo assim**; configurações realmente inseguras são bloqueadas de vez.

Depois de instalado, um app personalizado se comporta como qualquer outro: ganha o mesmo menu **Gerenciar** (Editar, Logs, Estatísticas, Atualizar, Remover), mostra sua versão no cartão e pode ativar as atualizações automáticas. O NOMAD protege os vínculos com caminhos do host e restringe logs e estatísticas aos seus próprios contêineres gerenciados, para que um app personalizado não consiga alcançar nada além do que você der a ele.

> Um app personalizado é exatamente isso — seu. O NOMAD o executa e sai do caminho; ele não oferece documentação de configuração nem suporte para software fora do catálogo curado. Consulte a documentação do próprio projeto para saber como usá-lo.

---

## Stirling PDF {% #stirling-pdf %}

Uma caixa de ferramentas completa para trabalhar com PDFs, tudo no seu próprio hardware. Junte e divida arquivos, converta para PDF e de PDF, comprima, gire, adicione ou remova senhas, aplique OCR em documentos digitalizados para torná-los pesquisáveis, assine, carimbe e oculte informações. São mais de 50 ferramentas, e como tudo roda localmente, nenhum dos seus documentos sai do seu NOMAD.

**Site oficial:** [stirlingpdf.com](https://stirlingpdf.com) · **Código-fonte:** [github.com/Stirling-Tools/Stirling-PDF](https://github.com/Stirling-Tools/Stirling-PDF)

**Na primeira vez que você abrir:** ele abre direto nas ferramentas, sem login. Configuramos o Stirling para pular a tela de login, já que no NOMAD ele é uma ferramenta pessoal na sua própria rede e uma barreira de senha só atrapalha. Você verá "Guest" no canto inferior esquerdo, o que é normal.

**Atenção, ele demora para iniciar:** o Stirling PDF é um aplicativo Java grande. Depois de instalá-lo, dê de 30 a 60 segundos para ele terminar de iniciar antes de carregar corretamente. Ele também consome bastante memória (cerca de um gigabyte), então funciona melhor em um NOMAD com folga de recursos.

**Quer uma senha nele?** Se você prefere que o Stirling exija login (por exemplo, se algumas pessoas compartilham seu NOMAD e você quer este app protegido), pode reativar o login pelo NOMAD:

1. Na página do Depósito de Suprimentos, encontre o Stirling PDF e clique em **Gerenciar > Editar**.
2. Em **Variáveis de ambiente**, troque `SECURITY_ENABLELOGIN=false` por `SECURITY_ENABLELOGIN=true`.
3. Salve. O NOMAD reconstrói o app, e a tela de login volta.

Na primeira vez que você entrar depois disso, use o usuário `admin` e a senha `stirling`. O Stirling vai pedir que você defina sua própria senha imediatamente. Observe que esta é a única forma de reativar o login: o menu de configurações do próprio Stirling só fica acessível depois de fazer login, então, com o login desativado, você o reativa pela tela Editar do NOMAD, e não de dentro do Stirling.

**Seus dados:** suas configurações ficam na pasta `storage/stirling-pdf` do seu NOMAD. Os PDFs em que você trabalha são enviados para a operação e baixados de volta para o seu próprio dispositivo. O Stirling não é uma biblioteca de longo prazo, então ele não guarda seus documentos.

**De onde vêm seus PDFs (e por que você não vê os arquivos do seu NOMAD):** o Stirling trabalha com arquivos do dispositivo que você estiver usando, seja notebook, celular ou tablet. Você clica em "Open from computer", escolhe um PDF, trabalha nele e baixa o resultado de volta para aquele dispositivo. O Stirling não consegue acessar arquivos guardados em outros lugares do seu NOMAD, então ele não mostra sua pasta de livros, os documentos da sua Base de Conhecimento nem nada que esteja no File Browser. Se o PDF que você quer já está no seu NOMAD, baixe-o primeiro de onde ele estiver (pelo File Browser, por exemplo) e depois abra essa cópia no Stirling. É um passo a mais, mas é também por isso que seus arquivos ficam exatamente onde você os colocou, em vez de serem puxados para outro app.

**Funciona offline:** todas as ferramentas de PDF rodam localmente no seu NOMAD, então a caixa de ferramentas em si funciona totalmente offline. Alguns recursos secundários acessam a internet e não fazem nada quando você está desconectado: a opção de importação do "Google Drive" e os links do rodapé (Survey, Discord, GitHub). Nenhum deles importa para trabalhar de fato com PDFs. O único recurso principal com uma parte online é o OCR, que lê o texto de páginas digitalizadas: ele já vem com o inglês instalado, e adicionar outros idiomas é a única parte que exigiria conexão.

## File Browser {% #file-browser %}

Um gerenciador de arquivos baseado na web para o seu NOMAD. Navegue por pastas, envie e baixe arquivos, crie pastas, renomeie, mova e exclua, tudo pelo navegador, sem instalar nada no seu computador. É uma forma prática de colocar arquivos no dispositivo e tirá-los de lá, ou de organizar as coisas sem precisar usar a linha de comando.

**Site oficial:** [filebrowser.org](https://filebrowser.org) · **Código-fonte:** [github.com/filebrowser/filebrowser](https://github.com/filebrowser/filebrowser)

**Na primeira vez que você abrir:** você verá uma tela de login. Entre com o usuário `admin` e a senha `nomad`. **Troque essa senha imediatamente.** Ela é o mesmo padrão em todo NOMAD, então, até você trocá-la, qualquer pessoa na sua rede que a conheça pode entrar. Clique na engrenagem de configurações, abra as configurações do seu perfil e defina uma nova senha.

Diferente da maioria dos apps daqui, o File Browser mantém o login de propósito. Ele pode renomear e excluir arquivos reais no seu NOMAD, então uma senha é a escolha certa mesmo na sua própria rede.

**O que você pode ver:** o File Browser mostra as pastas de conteúdo do seu NOMAD em um só lugar:

- **books** - e-books, incluindo tudo o que você quer que o Calibre-Web leia
- **maps** - dados de mapas baixados
- **media** - vídeos, músicas e fotos, incluindo tudo o que você quer que o Jellyfin disponibilize
- **zim** - conteúdo offline baixado, como a Wikipedia e outras bibliotecas de referência
- **kb_uploads** - documentos que você adicionou à Base de Conhecimento

Você pode enviar, baixar, renomear, mover e excluir dentro dessas pastas, e tudo o que você colocar no nível principal também é salvo. As pastas internas em que os apps realmente funcionam (coisas como os modelos de IA, o índice de busca e o cofre de senhas) ficam deliberadamente fora do File Browser, para que você não consiga navegar por elas ou excluí-las por acidente.

> **Uma palavra sobre exclusão:** o que você exclui aqui some de verdade, não existe lixeira. O conteúdo é, em sua maioria, substituível (você pode baixar de novo um mapa ou uma biblioteca da Wikipedia), mas se você excluir um livro ou vídeo que você mesmo adicionou, aquela cópia se perde. Exclua com o mesmo cuidado que teria no seu próprio computador.

**Funciona offline:** totalmente offline. O File Browser roda inteiramente no seu NOMAD e não acessa a internet para nada, então funciona exatamente igual, conectado ou não.

## Calibre-Web {% #calibre-web %}

Um leitor e gerenciador de biblioteca baseado na web para a sua coleção de e-books. Leia livros direto no navegador, organize-os por autor, série e tags, e envie-os para um Kindle ou outro leitor de e-books. Ele trabalha em conjunto com a pasta de livros do seu NOMAD, então toda a sua biblioteca fica no dispositivo e vai aonde ele for.

**Site oficial:** [github.com/janeczku/calibre-web](https://github.com/janeczku/calibre-web)

**Na primeira vez que você abrir:** o Calibre-Web precisa de uma biblioteca para usar, e o NOMAD cria uma vazia para você durante a instalação, para que você não fique travado em um erro de configuração. Este é o fluxo, feito uma única vez:

1. Abra o Calibre-Web. Ele abre em uma tela **Database Configuration**.
2. No campo **Location of Calibre Database**, digite `/books` e clique em **Save**. Você verá "Database Settings updated" e sua biblioteca (vazia) será aberta.
3. Pronto, a configuração está feita. Sua biblioteca está pronta para ser preenchida.

Se em algum momento ele pedir para você entrar, o login padrão é `admin` / `admin123`. **Troque essa senha** depois de entrar (clique em `admin` no canto superior direito e depois em Edit). Ela é o mesmo padrão em todo NOMAD.

**Adicionando livros:** o envio pela página web vem desativado por padrão. Para ativá-lo, vá em **Admin** (canto superior direito) e edite a configuração básica para permitir envios; aí aparecerá um botão Upload. Você também pode colocar arquivos de e-book direto na pasta de livros usando o File Browser e depois usar o "scan" do Calibre-Web para encontrá-los.

**Seus dados:** sua biblioteca fica na pasta `books` do seu NOMAD (a mesma `books` que você vê no File Browser). Todo livro que você adiciona é guardado ali, então fazer backup dessa única pasta faz backup de toda a sua coleção.

**Funciona offline:** ler e gerenciar sua biblioteca funciona totalmente offline. O único recurso que acessa a internet é o "fetch metadata", que busca capas e descrições de livros em fontes online. Essa parte não faz nada quando você está offline, mas não afeta a leitura nem a organização dos livros que você já tem.

## IT Tools {% #it-tools %}

Uma coleção com mais de 100 pequenos utilitários que, de outra forma, você teria que procurar online: geradores de hash, codificadores base64 e de URL, formatadores de JSON e SQL, geradores de UUID, um criador de QR code, conversores de cores e muito mais. Tudo roda localmente no seu NOMAD, então você pode usá-lo sem conexão com a internet.

**Site oficial:** [it-tools.tech](https://it-tools.tech) · **Código-fonte:** [github.com/CorentinTh/it-tools](https://github.com/CorentinTh/it-tools)

**Na primeira vez que você abrir:** ele abre direto nas ferramentas. Sem login, sem conta, sem configuração. Escolha uma ferramenta na barra lateral e use.

**Seus dados:** não há nada para gerenciar. O IT Tools não guarda nada no seu NOMAD entre as sessões, então não há arquivos, nem biblioteca para configurar, nem credenciais para controlar. É o app mais simples do Depósito de Suprimentos.

**Funciona offline:** todas as ferramentas rodam direto no seu navegador, usando a cópia que está no seu NOMAD. Nada aqui acessa a internet, então tudo continua funcionando quando você está offline.

## Excalidraw {% #excalidraw %}

Um quadro branco virtual para diagramas e esboços rápidos, com aparência de desenho à mão. Desenhe caixas, setas e formas livres, insira textos e imagens, e monte um fluxograma, um diagrama de rede ou uma ideia preliminar em segundos. Tudo tem um visual amigável, como se fosse rabiscado em um guardanapo, e roda direto no seu navegador.

**Site oficial:** [excalidraw.com](https://excalidraw.com) · **Código-fonte:** [github.com/excalidraw/excalidraw](https://github.com/excalidraw/excalidraw)

**Na primeira vez que você abrir:** ele abre direto em uma tela em branco. Sem login, sem conta, sem configuração. Escolha uma forma na barra de ferramentas e comece a desenhar. Você verá uma breve nota de boas-vindas lembrando que seu trabalho é salvo no navegador, o que leva à única coisa que vale a pena entender sobre o Excalidraw no NOMAD.

**Onde seus desenhos ficam (leia esta parte):** esta versão do Excalidraw não tem armazenamento no seu NOMAD. Seu desenho é salvo dentro do navegador que você está usando, naquele único dispositivo. Disso decorrem algumas coisas:

- Seu desenho **não é compartilhado entre dispositivos**. O que você desenha no notebook não aparece quando você abre o Excalidraw no celular, porque cada navegador guarda a sua própria cópia.
- Se você **limpar os dados do navegador**, ou usar uma janela privada/anônima, o desenho some. Não há cópia no NOMAD para recorrer.
- Por isso, **salve seu trabalho em um arquivo.** Use o menu (canto superior esquerdo) para **Save to...** um arquivo `.excalidraw` e guarde-o em um lugar seguro, por exemplo na sua pasta media ou de documentos pelo File Browser. Para retomá-lo depois, use **Open** e carregue esse arquivo. Esta é a única forma de manter um desenho a longo prazo ou levá-lo para outro dispositivo.

**Seus dados:** como tudo fica no seu navegador, não há pastas do NOMAD nem credenciais para gerenciar no Excalidraw. Os arquivos que você salva ficam onde você escolher colocá-los.

**Funciona offline:** o quadro branco em si funciona offline; você pode desenhar, editar e salvar arquivos sem internet. Três coisas para saber:

- **A fonte característica de desenho à mão vem da internet.** Quando seu NOMAD está offline, o Excalidraw não consegue buscá-la e usa uma fonte simples, então seus diagramas ficam com um ar um pouco menos de rascunho. Seus desenhos em si não são afetados em nada; só muda a fonte exibida na tela.
- **O Excalidraw envia análises de uso anônimas quando seu NOMAD está online.** Os criadores do app incluem um rastreamento básico de visualizações de página (por meio de um serviço chamado Simple Analytics) que registra que o app foi aberto. Ele não vê seus desenhos e não consegue alcançar nada quando seu NOMAD está offline, mas queremos que você saiba que ele existe, já que o NOMAD foi feito, em tudo o mais, para não se comunicar com o exterior.
- **Alguns botões são recursos de nuvem que não funcionam no NOMAD.** "Live collaboration", "Sign up" e "Excalidraw+" apontam para o serviço online pago dos criadores e precisam de internet. Eles não fazem parte do seu quadro branco offline, então você pode ignorá-los. O mesmo vale para o navegador **Library** de formas, que busca de uma galeria online.

## Homebox {% #homebox %}

Um sistema de inventário doméstico para acompanhar tudo o que você possui. Catalogue seus pertences por locais e etiquetas, anexe fotos, registre números de série, preços de compra, datas de garantia e recibos, e encontre qualquer coisa com uma busca. É uma ferramenta realmente útil para registros de seguro, controle de garantias e para saber o que você tem e onde está.

**Site oficial:** [homebox.software](https://homebox.software) · **Código-fonte:** [github.com/sysadminsmedia/homebox](https://github.com/sysadminsmedia/homebox)

**Na primeira vez que você abrir:** o Homebox abre em uma tela de login, mas você ainda não tem uma conta, então precisa criar uma. Clique em **Register** e preencha:

- **seu e-mail** (usado como nome de usuário para entrar),
- **seu nome**,
- **uma senha** (o Homebox mostra um medidor de força e não deixa você se registrar até que a senha seja forte o suficiente, então use uma senha de verdade).

Clique em **Register** e depois entre com esse e-mail e senha. A primeira conta que você cria é a **proprietária** deste Homebox. Não há credenciais padrão para trocar; a conta é sua desde o início.

**Compartilha seu NOMAD com outras pessoas?** Por padrão, o Homebox permite que qualquer pessoa que consiga acessá-lo crie a própria conta. Tudo bem se for só você, ou se você confia em todos na sua rede. Se preferir bloquear para que ninguém mais possa se registrar depois de você criar sua conta:

1. Crie primeiro sua conta de proprietário (acima).
2. Na página do Depósito de Suprimentos, encontre o Homebox e clique em **Gerenciar > Editar**.
3. Em **Variáveis de ambiente**, adicione `HBOX_OPTIONS_ALLOW_REGISTRATION=false`.
4. Salve. O NOMAD reconstrói o app, e o botão Register deixa de criar novas contas. Você continua podendo entrar normalmente.

**Seus dados:** tudo o que o Homebox guarda fica em uma única pasta no seu NOMAD, `storage/homebox`, como um único arquivo de banco de dados (mais as fotos e recibos que você anexar). Fazer backup dessa única pasta faz backup de todo o seu inventário.

**Funciona offline:** totalmente offline. O Homebox roda inteiramente no seu NOMAD, guarda todos os seus dados localmente e não tem rastreamento de uso, então funciona exatamente igual, esteja seu NOMAD conectado ou não. Os links do cabeçalho (GitHub, Discord, o site do projeto) precisam de internet, mas são apenas atalhos para as páginas do projeto e não têm nada a ver com o seu inventário.

## Vaultwarden {% #vaultwarden %}

Um gerenciador de senhas privado que roda no seu próprio NOMAD. Ele é compatível com o Bitwarden, então você pode guardar logins, notas seguras e dados de cartões em um cofre criptografado, e usar as extensões oficiais do Bitwarden para navegador e os apps de celular para acessá-lo, tudo apontando para o seu NOMAD em vez da nuvem de outra pessoa.

**Site oficial:** [bitwarden.com](https://bitwarden.com) (para os apps e extensões) · **Código-fonte:** [github.com/dani-garcia/vaultwarden](https://github.com/dani-garcia/vaultwarden)

**Na primeira vez que você abrir, verá um aviso de segurança. Isso é esperado, e aqui está o porquê:** um gerenciador de senhas só funciona por uma conexão segura (HTTPS), então o NOMAD configura o Vaultwarden com HTTPS automaticamente. Como seu NOMAD é um dispositivo privado seu e não um site público, ele usa um certificado de segurança autoassinado, e os navegadores mostram um aviso na primeira vez que veem um. Parece alarmante, mas é normal para um dispositivo na sua própria rede. Para passar por ele uma vez:

1. Clique em **Abrir** no cartão do Vaultwarden. Seu navegador mostrará algo como *"Sua conexão não é particular"* ou *"Não seguro".*
2. Clique em **Avançado** e depois em **Ir para (o endereço do seu NOMAD)**. (Em alguns navegadores o botão diz "Continuar" ou "Aceitar o risco".)
3. Você chegará ao cofre do Vaultwarden. Seu navegador lembra da sua escolha, então você não verá o aviso de novo naquele dispositivo.

**Criando seu cofre:** na página de login, clique em **Create account** e defina seu **e-mail** e uma **senha mestra**.

> **Sua senha mestra não pode ser recuperada.** O Vaultwarden não tem e-mail de "esqueci minha senha" nem redefinição, por design, porque ele nunca vê sua senha. Se você esquecê-la, o cofre e tudo o que há nele ficam bloqueados para sempre. Escolha algo forte que você não vá perder e considere anotá-la em algum lugar fisicamente seguro.

**Compartilha seu NOMAD com outras pessoas?** Por padrão, qualquer pessoa que consiga acessar o Vaultwarden pode criar a própria conta (cada conta é separada e criptografada). Se você preferir que ninguém mais possa se registrar depois de configurar a sua:

1. Crie primeiro sua própria conta.
2. Na página do Depósito de Suprimentos, encontre o Vaultwarden e clique em **Gerenciar > Editar**.
3. Em **Variáveis de ambiente**, adicione `SIGNUPS_ALLOWED=false`.
4. Salve. O NOMAD reconstrói o app e os novos cadastros são desativados; as contas existentes continuam funcionando.

**Usando pelo celular e pelo navegador:** instale o app oficial do Bitwarden ou a extensão para navegador e, na tela de login, escolha **self-hosted** (ou "Server URL") e digite `https://(your NOMAD's address):8480`. Observe que alguns apps de celular são mais rígidos com certificados autoassinados e podem se recusar a conectar; o cofre web que você abre pelo NOMAD sempre funciona.

**Seus dados:** seu cofre criptografado fica na pasta `storage/vaultwarden` do seu NOMAD. Fazer backup dessa pasta faz backup de tudo. (O painel de administração integrado fica desativado a menos que você defina um token de administrador, o que a maioria das pessoas não precisa.)

**Funciona offline:** totalmente offline e privado. O Vaultwarden roda inteiramente no seu NOMAD, guarda seu cofre localmente e não se comunica com ninguém. Os apps e extensões do Bitwarden também mantêm uma cópia local do seu cofre, então conseguem ler suas senhas mesmo quando seu NOMAD ou seu celular estão offline.

## Jellyfin {% #jellyfin %}

Seu próprio servidor de mídia. Aponte o Jellyfin para uma pasta de filmes, séries, músicas e fotos no seu NOMAD, e ele organiza tudo com imagens e detalhes e transmite para um navegador, celular, tablet, smart TV ou para os apps do Jellyfin. É uma alternativa privada e offline aos grandes serviços de streaming para as mídias que você já tem.

**Site oficial:** [jellyfin.org](https://jellyfin.org) · **Código-fonte:** [github.com/jellyfin/jellyfin](https://github.com/jellyfin/jellyfin)

**Na primeira vez que você abrir, passará por um assistente de configuração.** São algumas telas rápidas:

1. **Idioma** - escolha o idioma de exibição e clique em Next.
2. **Crie sua conta de administrador** - digite um nome de usuário e uma senha. Esta é a conta principal que controla o servidor, então use uma senha de verdade e guarde-a bem. (Você pode adicionar mais usuários depois, inclusive contas limitadas para crianças, pelo Dashboard.)
3. **Adicione suas mídias** - clique em **Add Media Library** e escolha um tipo de conteúdo. Para facilitar, o NOMAD já criou uma pasta correspondente para cada tipo dentro da sua pasta media, então basta apontar cada biblioteca para a pasta adequada:
   - Biblioteca **Movies** → a pasta `Movies`
   - Biblioteca **Shows** → a pasta `TV Shows`
   - Biblioteca **Music** → a pasta `Music`
   - Biblioteca **Photos** → a pasta `Photos`

   **Aponte cada biblioteca para a sua própria pasta, não para a pasta `media` inteira.** Isso é importante: se você apontar uma biblioteca para a própria `media` (que contém todas as outras) e outra biblioteca para, digamos, `Music` dentro dela, o Jellyfin vê os mesmos arquivos reivindicados duas vezes, considera isso um "caminho duplicado" e suas músicas simplesmente não aparecem, sem aviso. Uma pasta por biblioteca mantém tudo organizado e funcionando. Você também pode pular esta etapa e adicionar bibliotecas depois pelo Dashboard.
4. **Metadados, acesso remoto, concluir** - aceite os padrões nas telas restantes e conclua. Depois, entre com a conta que você acabou de criar.

**Colocando suas mídias:** coloque seus arquivos na subpasta correspondente da pasta **media** do seu NOMAD (a mesma pasta `media` que você vê no File Browser): filmes em **Movies**, séries em **TV Shows**, músicas em **Music** (uma pasta por álbum funciona muito bem), fotos em **Photos**. O fluxo mais fácil é enviar os arquivos pelo File Browser (ou colocá-los lá como preferir) e depois, no Jellyfin, clicar em **Scan Library** para encontrá-los. O Jellyfin lê subpastas, então uma pasta de álbum inteira colocada em **Music** entra como um único álbum. Ele também funciona melhor quando os arquivos têm nomes claros (por exemplo `Movie Name (2020).mp4`), o que ajuda a associar as imagens e os detalhes corretos.

**Seus dados:** suas mídias ficam em `storage/media`. As configurações do próprio Jellyfin, as contas de usuário e as imagens que ele baixa ficam em `storage/jellyfin`. Seus arquivos de mídia nunca são modificados; o Jellyfin apenas os lê.

**Funciona offline:** transmitir suas próprias mídias funciona totalmente offline, e esse é justamente o objetivo. A única parte que usa a internet é a **busca de metadados**: quando o Jellyfin adiciona um filme ou série, ele tenta baixar uma imagem de capa, descrição e informações do elenco de bancos de dados online. Offline, ele não consegue fazer isso, então os itens aparecem com nomes simples e sem imagens, mas continuam sendo reproduzidos perfeitamente. Quando você voltar a ficar online, uma varredura da biblioteca preenche as imagens que faltam.

> **Uma observação sobre o desempenho de reprodução:** o Jellyfin reproduz a maioria dos arquivos sem esforço, mas se o formato de um vídeo não for compatível com o seu dispositivo, o Jellyfin precisa convertê-lo em tempo real ("transcodificação"), o que é um trabalho pesado para o processador. O NOMAD não configura aceleração por placa de vídeo para isso por padrão, então vídeos muito grandes ou de alta resolução podem travar em um NOMAD modesto. Reproduzir arquivos em um formato amplamente compatível (como MP4/H.264) evita a transcodificação e garante a reprodução mais suave.

## Meshtastic Web {% #meshtastic-web %}

Um painel de controle baseado no navegador para dispositivos [Meshtastic](https://meshtastic.org). O Meshtastic é um sistema de mensagens por rádio de longo alcance e fora da rede convencional: rádios LoRa pequenos e baratos que formam a própria rede mesh e enviam mensagens de texto e localizações GPS por quilômetros, sem sinal de celular, sem internet e sem tarifas. Este app é a forma de configurar esses rádios e de ler e enviar mensagens em uma tela de tamanho normal.

**Site oficial:** [meshtastic.org](https://meshtastic.org) · **Código-fonte:** [github.com/meshtastic/web](https://github.com/meshtastic/web)

**Você precisa de um rádio Meshtastic para usar isto.** Este app é apenas o painel de controle. Sozinho, ele abre em uma tela "No devices connected", porque o trabalho de verdade acontece em um dispositivo Meshtastic físico (e na rede de outros rádios com que ele se comunica). Se você ainda não tem um, o app não fará muita coisa.

**Na primeira vez que você abrir:** ele abre direto, sem login. Clique em **New Connection** e você verá três formas de se conectar ao seu rádio:

- **HTTP** - conectar a um rádio que já está na sua rede Wi-Fi, digitando o endereço IP dele. **Este é o método a usar no NOMAD** (veja abaixo).
- **Bluetooth** - parear com um rádio próximo via Bluetooth.
- **Serial** - conectar a um rádio ligado a uma porta USB.

**O detalhe específico do NOMAD (Bluetooth e Serial exigem HTTPS):** os navegadores só permitem que um site use Bluetooth ou USB quando a página é carregada por uma conexão segura (HTTPS). O NOMAD disponibiliza o Meshtastic Web por HTTP simples, então no NOMAD **as opções Bluetooth e Serial não vão conectar**, porque seu navegador as bloqueia. A que funciona é a **HTTP**: coloque seu rádio Meshtastic na mesma rede Wi-Fi (os rádios Meshtastic podem se conectar ao Wi-Fi) e conecte-se a ele aqui pelo endereço IP. Se você precisar especificamente parear por USB ou Bluetooth, faça isso pelo app oficial do Meshtastic para celular ou pelo site do Meshtastic.

**Seus dados:** não há nada para configurar ou guardar no seu NOMAD para este app. As configurações do seu rádio ficam no próprio rádio, e as preferências deste app ficam no seu navegador. Não há pasta do NOMAD para gerenciar.

**Funciona offline:** totalmente offline, que é exatamente a proposta do Meshtastic. O app é disponibilizado pelo seu NOMAD, e a comunicação com seus rádios acontece pela sua rede local ou por rádio, nunca pela internet. As únicas partes online são os links do rodapé (Vercel, informações legais), que não importam para usar sua rede mesh.

## Plataforma Educacional (Kolibri) {% #kolibri %}

Uma plataforma de aprendizagem offline completa, da Learning Equality. O Kolibri reúne videoaulas, exercícios e leituras em canais estruturados, organiza tudo em turmas e lições, acompanha o progresso dos alunos e funciona inteiramente no seu NOMAD, sem internet. Ele foi feito para escolas e estudantes em lugares com pouca ou nenhuma conectividade.

**Site oficial:** [learningequality.org/kolibri](https://learningequality.org/kolibri) · **Código-fonte:** [github.com/learningequality/kolibri](https://github.com/learningequality/kolibri)

**Na primeira vez que você abrir, passará por um assistente de configuração rápido.** Escolha o tipo de instituição e crie a **conta de administrador** (este é o superusuário que gerencia o dispositivo inteiro, então use uma senha de verdade e guarde-a bem). Depois de entrar, você importa o conteúdo de aprendizagem na forma de **canais**.

**Importando conteúdo:** o conteúdo do Kolibri é distribuído em canais que você importa. Abra **Device → Channels → Import** e baixe canais do Kolibri Studio (online) ou importe de uma unidade local ou de outro dispositivo Kolibri, se você já tiver os arquivos de conteúdo. Há muita coisa disponível, então importe só os canais de que precisa; eles podem ser grandes.

**Migrando conteúdo da Plataforma Educacional (Gen 1):** versões anteriores do NOMAD traziam um Kolibri bem mais antigo (a imagem `treehouses/kolibri:0.12.8`). A Plataforma Educacional "Gen 2" é um Kolibri mais novo, oficial do projeto original, e é instalada **do zero** — seus canais antigos e os dados dos alunos **não** são transferidos automaticamente, porque as duas versões armazenam os dados de forma diferente demais para migrar com segurança. Se você usava a antiga e quer importar seus canais existentes para a nova, este é o processo:

1. Instale a "Education Platform (Gen 2)" pelo catálogo (ela roda ao lado da antiga, em uma porta diferente, então nada é interrompido enquanto você a configura).
2. Abra a nova, siga o assistente de configuração e, no menu da barra lateral, vá até **Device > Channels > Import**. Escolha a opção "Local network or internet" e depois "Add new device". Na caixa de diálogo que aparecer, digite o endereço IP do seu NOMAD com a porta da Plataforma Educacional antiga (8300 por padrão; por exemplo, `http://192.168.1.36:8300`), dê um nome a ela (o que você quiser) e clique em "Add" e depois em "Continue". 
3. Agora você pode selecionar canais individuais da Plataforma Educacional antiga ou escolher "Select entire channels instead" para importar tudo de uma vez. Clique em "Import" quando estiver pronto, e a transferência começará.
3. Quando estiver satisfeito com a nova instalação e tiver copiado o conteúdo que quiser, desinstale a Plataforma Educacional antiga pelo cartão dela (ele traz um selo **legacy**). Também é recomendável escolher remover a imagem antiga e o volume de dados ao desinstalar, para evitar confusão e liberar espaço, mas se você quiser mantê-la por um tempo, só por precaução, tudo bem também.

**Seus dados:** seus canais importados, turmas e o progresso dos alunos ficam na pasta `storage/kolibri-gen2` do seu NOMAD. Fazer backup dessa pasta faz backup de todo o seu Kolibri.

**Funciona offline:** totalmente offline depois que o conteúdo é importado, e é para isso que o Kolibri existe. A única etapa que usa a internet é a importação de canais do Kolibri Studio; tudo o que vem depois, navegar pelas lições, fazer exercícios e acompanhar o progresso, roda inteiramente no seu NOMAD.
## MeshCore Web {% #meshcore-web %}

Um cliente baseado no navegador para rádios [MeshCore](https://meshcore.io). O MeshCore é outra abordagem para mensagens mesh LoRa de longo alcance e fora da rede convencional, um irmão do Meshtastic: rádios pequenos que formam a própria rede e transmitem texto e localização por quilômetros, sem sinal de celular, sem internet e sem tarifas. Este app é a forma de configurar um rádio MeshCore e de ler e enviar mensagens em uma tela de tamanho normal. Se você ainda não usa equipamentos MeshCore, o cliente Meshtastic acima é o ponto de partida mais comum. Este aqui está disponível para quem usa MeshCore.

**Site oficial:** [meshcore.io](https://meshcore.io) · **Código-fonte:** [github.com/aXistem-dev/meshcore-web](https://github.com/aXistem-dev/meshcore-web) (uma versão empacotada do cliente MeshCore de Liam Cottle)

**Você precisa de um rádio MeshCore para usar isto.** Assim como o cliente Meshtastic, este é apenas o painel de controle. Sem um rádio conectado, não há nada com que ele se comunicar.

**Na primeira vez que você abrir, verá um aviso de segurança. Isso é esperado, e aqui está o porquê:** o MeshCore se conecta ao seu rádio por USB ou Bluetooth, e os navegadores só deixam uma página web usar USB ou Bluetooth quando ela é carregada por uma conexão segura (HTTPS). Por isso, o NOMAD disponibiliza este app por HTTPS e, como seu NOMAD é um dispositivo privado sem endereço web público, ele usa um certificado autoassinado, sobre o qual os navegadores avisam na primeira vez que o veem. Para passar por ele uma vez:

1. Clique em **Abrir** no cartão do MeshCore Web. Seu navegador mostrará algo como *"Sua conexão não é particular"* ou *"Não seguro".*
2. Clique em **Avançado** e depois em **Ir para (o endereço do seu NOMAD)**. (Em alguns navegadores o botão diz "Continuar" ou "Aceitar o risco".)
3. Você chegará ao MeshCore Web. Seu navegador lembra da sua escolha, então você não verá o aviso de novo naquele dispositivo.

**Conectando seu rádio:** use o **Chrome ou o Edge**, que têm o melhor suporte a USB e Bluetooth no navegador. Ligue o rádio ao computador em que você está navegando (USB), ou deixe-o por perto (Bluetooth), e conecte-se a ele de dentro do app. O rádio se conecta **ao computador que você está usando**, não ao NOMAD em si, então conecte a partir de um dispositivo que tenha o rádio ligado ou dentro do alcance do Bluetooth. Alguns celulares são mais rígidos com certificados autoassinados e podem se recusar a conectar; um Chrome ou Edge no computador é a opção mais confiável.

**Seus dados:** não há nada para configurar ou guardar no seu NOMAD para este app. As configurações do seu rádio ficam no próprio rádio, e as preferências do app ficam no seu navegador. Não há pasta do NOMAD para gerenciar.

**Funciona offline:** totalmente offline, que é exatamente a proposta do MeshCore. O app é disponibilizado pelo seu NOMAD e se comunica com seu rádio diretamente por USB ou Bluetooth, nunca pela internet.

## Biblioteca Traduzida {% #offline-translation %}

Lê a Biblioteca de Informações em outro idioma. Abra um artigo e uma barra **Traduzir esta página** aparece no topo, com um botão para cada idioma instalado, além de **Original** para voltar. Sua escolha se mantém enquanto você navega para outros artigos.

**Por que usar isto em vez do Assistente de IA:** o Assistente de IA consegue traduzir, mas isto é cerca de 1.600 vezes mais rápido na mesma máquina e não precisa de placa de vídeo, então funciona em todo NOMAD. Também é mais cuidadoso com nomes: se você pedir para traduzir uma página, o Assistente de IA vai traduzir alegremente "Project NOMAD" para outro idioma, e isto não.

**Escolhendo idiomas:** francês, espanhol e alemão vêm configurados por padrão. Para adicionar ou remover idiomas:

1. No **Depósito de Suprimentos**, abra o menu **Gerenciar** da Biblioteca Traduzida e escolha **Editar**.
2. Em **Variáveis de ambiente**, encontre `TRANSLATE_LANGS=fr,es,de`.
3. Altere a lista de códigos de idioma, separados por vírgulas. Por exemplo, `TRANSLATE_LANGS=fr,es,de,sv` adiciona o sueco.
4. Clique em **Salvar**. O app reinicia, baixa os novos idiomas e adiciona um botão para cada um na barra **Traduzir esta página**.

Adicionar um idioma exige conexão com a internet, e cada um ocupa entre cerca de 45 MB e 140 MB de disco. Os idiomas que você já tem continuam funcionando offline. Remover um código da lista não remove um idioma que você já baixou; ele continua em `storage/translate/models` e mantém seu botão.

Estes 50 idiomas estão disponíveis. O chinês ainda não está disponível.

| Idioma | Código |
|---|---|
| Africâner | `af` |
| Árabe | `ar` |
| Basco | `eu` |
| Bengali | `bn` |
| Bósnio | `bs` |
| Búlgaro | `bg` |
| Catalão | `ca` |
| Croata | `hr` |
| Tcheco | `cs` |
| Dinamarquês | `da` |
| Holandês | `nl` |
| Estoniano | `et` |
| Finlandês | `fi` |
| Francês | `fr` |
| Galego | `gl` |
| Alemão | `de` |
| Grego | `el` |
| Guzerate | `gu` |
| Hebraico | `he` |
| Hindi | `hi` |
| Húngaro | `hu` |
| Islandês | `is` |
| Indonésio | `id` |
| Italiano | `it` |
| Japonês | `ja` |
| Canarim | `kn` |
| Coreano | `ko` |
| Letão | `lv` |
| Lituano | `lt` |
| Malaio | `ms` |
| Malaiala | `ml` |
| Marati | `mr` |
| Norueguês | `nb` |
| Persa | `fa` |
| Polonês | `pl` |
| Português | `pt` |
| Romeno | `ro` |
| Russo | `ru` |
| Sérvio | `sr` |
| Eslovaco | `sk` |
| Esloveno | `sl` |
| Espanhol | `es` |
| Sueco | `sv` |
| Tâmil | `ta` |
| Telugo | `te` |
| Tailandês | `th` |
| Turco | `tr` |
| Ucraniano | `uk` |
| Urdu | `ur` |
| Vietnamita | `vi` |

**A primeira inicialização precisa de internet.** Os modelos de idioma são baixados quando o app roda pela primeira vez, assim como na instalação de qualquer outro app. Depois disso, tudo funciona inteiramente offline. Se você instalar isto sem conexão, o app ainda inicia e a biblioteca ainda funciona, só que sem tradução até que ele consiga baixar os modelos.

**O que não é traduzido:** tabelas e quadros informativos (infoboxes), o título da página na aba do navegador e os próprios resultados de busca do Kiwix. A busca também continua correspondendo ao idioma original, então pesquise em inglês e traduza o artigo que encontrar.

**Uma observação sobre os dois botões de idioma:** a própria barra de ferramentas da biblioteca tem um globo que muda os *menus* ao redor da página. A barra que este app adiciona muda o *artigo*. São coisas diferentes e ficam próximas uma da outra, o que é uma pena, mas não é algo que possamos mudar de lugar.

**Precisão:** esta é uma tradução automática, e ela é literal. É muito boa para entender o sentido de um artigo. Tenha cuidado ao confiar nela para termos médicos ou de segurança exatos, em que o termo correto em outro idioma muitas vezes não é o literal.

**Seus dados:** os modelos de idioma ficam em `storage/translate/models`. Nada do que você lê é guardado ou enviado para lugar algum.

**Funciona offline:** sim, depois que os modelos forem baixados.
