#!/bin/bash
# Instala (ou atualiza) a tradução PT-BR do Project NOMAD.
# Uso (no Ubuntu/WSL):  sudo bash instalar.sh
#        para remover:  sudo bash instalar.sh --remover
set -e

ORIGEM="$(cd "$(dirname "$0")" && pwd)"
DESTINO=/opt/project-nomad/ptbr
COMPOSE=/opt/project-nomad/compose.yml
ANCORA_VOLUME='/var/run/docker.sock:/var/run/docker.sock # Allows the admin service'
LINHA_ENTRYPOINT='    entrypoint: ["/bin/bash", "/ptbr/entrypoint-ptbr.sh"] # traducao PT-BR'
LINHA_VOLUME='      - /opt/project-nomad/ptbr:/ptbr:ro # traducao PT-BR'

if [ "$(id -u)" -ne 0 ]; then
  echo "Rode com sudo: sudo bash $0"
  exit 1
fi
if [ ! -f "$COMPOSE" ]; then
  echo "NOMAD nao encontrado em /opt/project-nomad."
  exit 1
fi

reiniciar() {
  docker compose -p project-nomad -f "$COMPOSE" up -d admin
}

if [ "$1" = "--remover" ]; then
  cp "$COMPOSE" "$COMPOSE.antes-remover-ptbr"
  sed -i '/# traducao PT-BR$/d' "$COMPOSE"
  rm -rf "$DESTINO"
  docker compose -p project-nomad -f "$COMPOSE" up -d --force-recreate admin
  echo "Traducao removida. O NOMAD voltou ao ingles."
  exit 0
fi

if [ ! -f "$ORIGEM/dist/ptbr.js" ]; then
  echo "Arquivo dist/ptbr.js nao encontrado. Gere com: node tools/build.js"
  exit 1
fi

mkdir -p "$DESTINO/docs"
cp "$ORIGEM/dist/ptbr.js" "$DESTINO/ptbr.js"
cp "$ORIGEM/src/entrypoint-ptbr.sh" "$DESTINO/entrypoint-ptbr.sh"
rm -f "$DESTINO"/docs/*.md
cp "$ORIGEM"/docs/*.md "$DESTINO/docs/" 2>/dev/null || true
sed -i 's/\r$//' "$DESTINO/entrypoint-ptbr.sh"
echo "Arquivos copiados para $DESTINO"

if grep -q '# traducao PT-BR$' "$COMPOSE"; then
  echo "compose.yml ja estava configurado."
else
  grep -q 'container_name: nomad_admin' "$COMPOSE" || { echo "Servico admin nao encontrado no compose.yml"; exit 1; }
  grep -qF "$ANCORA_VOLUME" "$COMPOSE" || { echo "Volume do admin nao encontrado no compose.yml"; exit 1; }
  cp "$COMPOSE" "$COMPOSE.antes-ptbr"
  awk -v ep="$LINHA_ENTRYPOINT" -v vol="$LINHA_VOLUME" -v anc="$ANCORA_VOLUME" '
    { print }
    /container_name: nomad_admin/ { print ep }
    index($0, anc) { print vol }
  ' "$COMPOSE.antes-ptbr" > "$COMPOSE"
  echo "compose.yml atualizado (backup em $COMPOSE.antes-ptbr)"
fi

docker compose -p project-nomad -f "$COMPOSE" up -d --force-recreate admin
echo
echo "Pronto! Aguarde ~30 segundos e recarregue o NOMAD no navegador (Ctrl+F5)."
