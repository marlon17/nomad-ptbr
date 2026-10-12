# NOMAD em Português 🇧🇷

Tradução **comunitária e não oficial** do [Project NOMAD](https://github.com/Crosstalk-Solutions/project-nomad) para o português do Brasil, junto com um pacote de conteúdo offline em português.

> Não é afiliado à Crosstalk Solutions. Os mantenedores do NOMAD planejam fazer a tradução oficial eles mesmos ([issue #1398](https://github.com/Crosstalk-Solutions/project-nomad/issues/1398)); enquanto isso, este projeto preenche a lacuna.

## O que tem aqui

| | |
|---|---|
| **Interface em PT-BR** | ~2.500 textos da Central de Comando (menus, botões, avisos, janelas, títulos), frases com variáveis, nomes de países, descrições dos modelos de IA, datas e números no formato brasileiro |
| **Documentação em PT-BR** | Início, Primeiros Passos, Perguntas Frequentes, Casos de Uso, Apps, Atualizações, Referência da API e mais |
| **Pacote Brasil** | Wikipedia, iFixit, Wikilivros, Medicina e outros conteúdos em português, com 1 comando |
| **Acesso pela rede (Windows/WSL)** | Script para abrir o NOMAD no celular e em outros aparelhos do Wi-Fi |

## Como funciona

O NOMAD continua usando a **imagem Docker oficial** — nenhum código do NOMAD é alterado. O instalador adiciona ao container `nomad_admin` um pequeno script que, a cada inicialização, injeta o tradutor na página e troca a documentação pela versão em português. No navegador, o tradutor troca os textos em inglês pelos equivalentes em português, inclusive os que aparecem depois (janelas, avisos).

Por isso, **as atualizações automáticas do NOMAD não apagam a tradução**. Textos novos de uma atualização aparecem em inglês até o dicionário ser atualizado aqui.

## Instalação

No servidor onde o NOMAD está instalado (Ubuntu/Debian, ou o Ubuntu do WSL no Windows):

```bash
git clone https://github.com/marlon17/nomad-ptbr.git
cd nomad-ptbr
sudo bash instalar.sh
```

Aguarde ~30 segundos e recarregue o NOMAD no navegador com **Ctrl+F5**.

- **Atualizar a tradução:** `git pull && sudo bash instalar.sh`
- **Remover (voltar ao inglês):** `sudo bash instalar.sh --remover`

O instalador faz backup do `/opt/project-nomad/compose.yml` antes de alterar qualquer coisa.

## Pacote Brasil (conteúdo em português)

Com o NOMAD rodando:

```bash
bash conteudo/instalar-pacote-brasil.sh completo --simular   # mostra o que seria baixado
bash conteudo/instalar-pacote-brasil.sh completo             # baixa
```

| Nível | Conteúdo | Tamanho aprox. |
|---|---|---|
| `essencial` | Wikipedia PT resumida, Medicina, Wikilivros, Wikcionário, PhET, Vikidia | ~2,6 GB |
| `padrao` | Essencial + iFixit PT, Wikiversidade, Gutenberg PT, Wikivoyage, Wikiquote, freeCodeCamp | ~6,8 GB |
| `completo` | Padrão com a Wikipedia PT completa (com imagens) + Wikisource | ~26 GB |

O script sempre pega a versão mais recente de cada item no catálogo Kiwix e pula o que já está instalado. No Windows há a versão PowerShell: `conteudo/instalar-pacote-brasil.ps1`.

## Acessar pela rede Wi-Fi (Windows + WSL)

No Linux "puro" o NOMAD já fica acessível na rede em `http://IP-DO-SERVIDOR:8080`. No Windows com WSL, as portas ficam presas ao próprio PC; para liberar, rode no **PowerShell como Administrador**:

```powershell
powershell -ExecutionPolicy Bypass -File windows\liberar-nomad-na-rede.ps1
```

Depois, nos outros aparelhos do mesmo Wi-Fi, abra `http://IP-DO-PC:8080` (o script mostra o endereço). Para desfazer, rode com `-Remover`. A liberação vale só para redes **Privadas**.

> ⚠️ O NOMAD não tem login: qualquer pessoa na sua rede poderá usar **e configurar** o servidor.

## Problemas comuns no Brasil

**Erro de certificado ("unable to verify the first certificate") ao baixar conteúdo:** antivírus como o Norton inspecionam conexões HTTPS e os containers não confiam no certificado deles. Desligue a "verificação de HTTPS" do antivírus (no Norton: Segurança avançada → Rede → Safe Web).

## Contribuindo

Encontrou um texto em inglês ou uma tradução estranha? Abra uma issue ou um PR.

- Traduções: `traducao/pt-BR.json` (formato `{ "Inglês": "Português" }`; mantenha `{0}`, `{1}`)
- Documentação: `docs/*.md`
- Depois de editar: `cd tools && npm install && cd .. && node tools/build.js` (gera `dist/ptbr.js`)

Para achar textos novos após uma atualização do NOMAD (com o repositório oficial clonado ao lado):

```bash
cd tools && npm install
node extract.js ../../project-nomad/admin/inertia novos.json
node extract-loose.js novos-amplo.json ../../project-nomad/admin/inertia ../../project-nomad/admin/app
node extract-frases.js ../../project-nomad/admin/inertia novas-frases.json
```

Frases novas (texto + variáveis) vão em `traducao/frases.json`; compare com `traducao/frases-en.json`.

Compare com `traducao/textos-en.json` e adicione as entradas que faltam em `traducao/pt-BR.json`.

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `instalar.sh` | Instala / atualiza / remove a tradução |
| `traducao/pt-BR.json` | Dicionário inglês → português (interface) |
| `traducao/frases.json` | Frases montadas em pedaços (texto + variáveis) |
| `traducao/modelos.json` | Descrições dos modelos de IA |
| `traducao/paises.json` | Nomes de países (gerado por `tools/paises.js`) |
| `traducao/textos-en.json` | Textos extraídos do código do NOMAD |
| `src/ptbr-runtime.js` | Tradutor que roda no navegador |
| `src/entrypoint-ptbr.sh` | Aplica a tradução dentro do container |
| `docs/` | Documentação traduzida |
| `dist/ptbr.js` | Arquivo final (gerado por `tools/build.js`) |
| `conteudo/` | Pacote Brasil |
| `windows/` | Acesso pela rede no Windows/WSL |

## Licença

Apache License 2.0, a mesma do Project NOMAD. Veja [LICENSE](LICENSE) e [NOTICE](NOTICE).
"Project NOMAD" é marca da Crosstalk Solutions, LLC.
