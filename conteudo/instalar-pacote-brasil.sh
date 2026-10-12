#!/bin/bash
# Baixa o "Pacote Brasil" (conteudo em portugues) no Project NOMAD.
# Uso:
#   bash instalar-pacote-brasil.sh padrao --simular   (so mostra o que seria baixado)
#   bash instalar-pacote-brasil.sh padrao             (baixa)
# Niveis: essencial, padrao, completo. Variavel opcional: NOMAD_URL (padrao http://localhost:8080)
set -e
NIVEL="${1:-padrao}"
SIMULAR="$2"
NOMAD_URL="${NOMAD_URL:-http://localhost:8080}"
PACOTE="$(cd "$(dirname "$0")" && pwd)/pacote-brasil.json"

exec python3 - "$PACOTE" "$NIVEL" "$NOMAD_URL" "$SIMULAR" <<'PY'
import json, sys, urllib.request

pacote_path, nivel_id, url, simular = sys.argv[1], sys.argv[2], sys.argv[3].rstrip('/'), sys.argv[4] == '--simular'
pacote = json.load(open(pacote_path, encoding='utf-8'))
niveis = {n['id']: n for n in pacote['niveis']}
if nivel_id not in niveis:
    sys.exit(f"Nivel invalido: {nivel_id}. Use: {', '.join(niveis)}")

def itens_do_nivel(i):
    n = niveis[i]
    itens = itens_do_nivel(n['inclui']) if n.get('inclui') else []
    itens = [x for x in itens if x['prefixo'] not in n.get('remove', [])]
    return itens + n['itens']

def get(path):
    with urllib.request.urlopen(url + path, timeout=60) as r:
        return json.load(r)

print(f"Lendo catalogo Kiwix em portugues via NOMAD ({url})...")
catalogo, start = [], 0
while True:
    pagina = get(f"/api/zim/list-remote?language=por&count=100&start={start}")
    catalogo += pagina['items']
    start = pagina['next_start']
    if not pagina['has_more']:
        break

instalados = [f['name'] for f in get('/api/zim/list')['files']]
total = 0
for item in itens_do_nivel(nivel_id):
    pre = item['prefixo']
    ja = next((n for n in instalados if n.startswith(pre) and not n.endswith('.tmp')), None)
    if ja:
        print(f"[ja instalado] {item['titulo']} ({ja})")
        continue
    cands = sorted((c for c in catalogo if c['file_name'].startswith(pre)), key=lambda c: c['file_name'], reverse=True)
    if not cands:
        print(f"[nao encontrado] {item['titulo']} (prefixo {pre})")
        continue
    arq = cands[0]
    gb = arq['size_bytes'] / 1024**3
    total += arq['size_bytes']
    if simular:
        print(f"[simulacao] {item['titulo']} - {arq['file_name']} ({gb:.2f} GB)")
        continue
    corpo = json.dumps({'url': arq['download_url'], 'metadata': {
        'title': item['titulo'], 'summary': arq.get('summary') or '', 'author': arq.get('author') or '',
        'size_bytes': arq['size_bytes']}}).encode()
    req = urllib.request.Request(url + '/api/zim/download-remote', data=corpo, method='POST',
                                 headers={'Content-Type': 'application/json', 'Accept': 'application/json'})
    try:
        urllib.request.urlopen(req, timeout=60).read()
        print(f"[baixando] {item['titulo']} - {arq['file_name']} ({gb:.2f} GB)")
    except Exception as e:
        print(f"[erro] {item['titulo']}: {e}")

print(f"Total do que falta baixar: {total / 1024**3:.2f} GB")
if not simular:
    print("Acompanhe o progresso no painel do NOMAD (Configuracoes).")
PY
