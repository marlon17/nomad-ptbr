#!/bin/bash
# Aplica a tradução PT-BR no container nomad_admin e depois inicia o NOMAD normalmente.
# Roda a cada inicialização, então sobrevive às atualizações da imagem oficial.

LAYOUT=/app/resources/views/inertia_layout.edge

if [ -f /ptbr/ptbr.js ]; then
  cp /ptbr/ptbr.js /app/public/ptbr.js
  if [ -f "$LAYOUT" ] && ! grep -q '/ptbr.js' "$LAYOUT"; then
    # Logo no início do <head>: roda antes do app, para as datas/números já saírem em pt-BR.
    sed -i '0,/<head>/s|<head>|<head>\n  <script src="/ptbr.js" defer></script>|' "$LAYOUT"
  fi
  echo "[ptbr] Traducao da interface aplicada."
fi

if [ -d /ptbr/docs ]; then
  cp /ptbr/docs/*.md /app/docs/ 2>/dev/null && echo "[ptbr] Documentacao traduzida aplicada."
fi

exec /usr/local/bin/entrypoint.sh "$@"
