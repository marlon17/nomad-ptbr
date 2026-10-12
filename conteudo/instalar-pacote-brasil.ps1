# Instala o "Pacote Brasil" (conteudo em portugues) no Project NOMAD.
# Uso:
#   powershell -ExecutionPolicy Bypass -File instalar-pacote-brasil.ps1 -Nivel padrao -Simular
#   powershell -ExecutionPolicy Bypass -File instalar-pacote-brasil.ps1 -Nivel padrao
# Niveis: essencial, padrao, completo
param(
  [ValidateSet('essencial', 'padrao', 'completo')]
  [string]$Nivel = 'padrao',
  [string]$NomadUrl = 'http://127.0.0.1:8080',
  [switch]$Simular
)

$ErrorActionPreference = 'Stop'
$pacote = Get-Content -Raw -Encoding UTF8 (Join-Path $PSScriptRoot 'pacote-brasil.json') | ConvertFrom-Json

# Junta os itens do nivel escolhido com os dos niveis que ele inclui.
function Get-ItensDoNivel([string]$id) {
  $nivel = $pacote.niveis | Where-Object { $_.id -eq $id }
  if (-not $nivel) { throw "Nivel '$id' nao existe no pacote." }
  $itens = @()
  if ($nivel.inclui) { $itens += Get-ItensDoNivel $nivel.inclui }
  if ($nivel.remove) { $itens = @($itens | Where-Object { $nivel.remove -notcontains $_.prefixo }) }
  return $itens + @($nivel.itens)
}

$itens = Get-ItensDoNivel $Nivel

Write-Host "Lendo catalogo Kiwix em portugues via NOMAD ($NomadUrl)..."
$catalogo = @()
$start = 0
do {
  $pagina = Invoke-RestMethod "$NomadUrl/api/zim/list-remote?language=por&count=100&start=$start"
  $catalogo += $pagina.items
  $start = $pagina.next_start
} while ($pagina.has_more)

$instalados = @((Invoke-RestMethod "$NomadUrl/api/zim/list").files | ForEach-Object { $_.name })

$totalBytes = 0
foreach ($item in $itens) {
  $instalado = $instalados | Where-Object { $_ -like "$($item.prefixo)*" -and $_ -notlike '*.tmp' } | Select-Object -First 1
  if ($instalado) {
    Write-Host ("[ja instalado] {0} ({1})" -f $item.titulo, $instalado) -ForegroundColor DarkGray
    continue
  }

  # Versao mais recente: o nome termina com a data (AAAA-MM), entao a ordem alfabetica serve.
  $arquivo = $catalogo | Where-Object { $_.file_name -like "$($item.prefixo)*" } |
    Sort-Object file_name -Descending | Select-Object -First 1
  if (-not $arquivo) {
    Write-Host ("[nao encontrado] {0} (prefixo {1})" -f $item.titulo, $item.prefixo) -ForegroundColor Yellow
    continue
  }

  $gb = [math]::Round($arquivo.size_bytes / 1GB, 2)
  $totalBytes += $arquivo.size_bytes

  if ($Simular) {
    Write-Host ("[simulacao] {0} - {1} ({2} GB)" -f $item.titulo, $arquivo.file_name, $gb)
    continue
  }

  $corpo = @{
    url      = $arquivo.download_url
    metadata = @{
      title      = $item.titulo
      summary    = $arquivo.summary
      author     = $arquivo.author
      size_bytes = $arquivo.size_bytes
    }
  } | ConvertTo-Json -Depth 3

  try {
    Invoke-RestMethod -Method Post "$NomadUrl/api/zim/download-remote" -ContentType 'application/json; charset=utf-8' `
      -Headers @{ Accept = 'application/json' } -Body ([Text.Encoding]::UTF8.GetBytes($corpo)) | Out-Null
    Write-Host ("[baixando] {0} - {1} ({2} GB)" -f $item.titulo, $arquivo.file_name, $gb) -ForegroundColor Green
  } catch {
    Write-Host ("[erro] {0}: {1}" -f $item.titulo, $_.Exception.Message) -ForegroundColor Red
  }
}

Write-Host ("Total do que falta baixar: {0} GB" -f [math]::Round($totalBytes / 1GB, 2))
if (-not $Simular) { Write-Host "Acompanhe o progresso no painel do NOMAD (Settings)." }
