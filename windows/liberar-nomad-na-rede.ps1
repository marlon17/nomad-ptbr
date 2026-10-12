# Libera o acesso ao Project NOMAD para outros aparelhos da rede (celular, notebook, TV...).
# Rode no PowerShell COMO ADMINISTRADOR:
#   powershell -ExecutionPolicy Bypass -File liberar-nomad-na-rede.ps1
# Para desfazer:
#   powershell -ExecutionPolicy Bypass -File liberar-nomad-na-rede.ps1 -Remover
param([switch]$Remover)

$ErrorActionPreference = 'Stop'

# Painel + apps do NOMAD (Ollama, Qdrant e logs ficam de fora de proposito).
$portas = 8080, 8090, 8100, 8200, 8310, 8311, 8400, 8410, 8420, 8430, 8440, 8450, 8460, 8470, 8480, 8490, 8500
$nomeRegra = 'Project NOMAD (rede local)'

$admin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $admin) { throw 'Abra o PowerShell como Administrador e rode de novo.' }

# Remove regras antigas deste script (de qualquer IP), para poder rodar de novo quando o IP mudar.
$existentes = netsh interface portproxy show v4tov4 | Select-String '^\s*(\d+\.\d+\.\d+\.\d+)\s+(\d+)\s+127\.0\.0\.1\s+(\d+)'
foreach ($linha in $existentes) {
  $ip, $porta = $linha.Matches[0].Groups[1].Value, [int]$linha.Matches[0].Groups[2].Value
  if ($portas -contains $porta -and $ip -ne '127.0.0.1') {
    netsh interface portproxy delete v4tov4 listenaddress=$ip listenport=$porta | Out-Null
  }
}
Get-NetFirewallRule -DisplayName $nomeRegra -ErrorAction SilentlyContinue | Remove-NetFirewallRule

if ($Remover) {
  Write-Host 'Acesso pela rede removido. O NOMAD volta a abrir so neste PC.'
  exit 0
}

# IP deste PC na rede local (placa com gateway padrao, ignorando adaptadores virtuais).
$ip = Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -and $_.NetAdapter.Status -eq 'Up' } |
  ForEach-Object { $_.IPv4Address.IPAddress } | Where-Object { $_ -match '^(192\.168|10\.|172\.(1[6-9]|2\d|3[01]))\.' } |
  Select-Object -First 1
if (-not $ip) { throw 'Nao achei o IP deste PC na rede local.' }

foreach ($p in $portas) {
  netsh interface portproxy add v4tov4 listenaddress=$ip listenport=$p connectaddress=127.0.0.1 connectport=$p | Out-Null
}

# Firewall: so redes Privadas (casa), nunca Publicas.
New-NetFirewallRule -DisplayName $nomeRegra -Direction Inbound -Protocol TCP -LocalPort $portas -Action Allow -Profile Private | Out-Null

Write-Host ''
Write-Host "Pronto! Nos outros aparelhos (mesmo Wi-Fi/roteador), abra: http://${ip}:8080" -ForegroundColor Green
Write-Host 'Se o IP deste PC mudar, rode este script de novo.'
