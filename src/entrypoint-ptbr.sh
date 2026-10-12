#!/bin/bash
# Aplica a tradução PT-BR no container nomad_admin e depois inicia o NOMAD normalmente.
# Roda a cada inicialização, então sobrevive às atualizações da imagem oficial.

LAYOUT=/app/resources/views/inertia_layout.edge

if [ -f /ptbr/ptbr.js ]; then
  cp /ptbr/ptbr.js /app/public/ptbr.js
  if [ -f "$LAYOUT" ] && ! grep -q '/ptbr.js' "$LAYOUT"; then
    sed -i 's|</head>|  <script src="/ptbr.js" defer></script>\n</head>|' "$LAYOUT"
  fi
  echo "[ptbr] Traducao da interface aplicada."
fi

if [ -d /ptbr/docs ]; then
  cp /ptbr/docs/*.md /app/docs/ 2>/dev/null && echo "[ptbr] Documentacao traduzida aplicada."
fi

exec /usr/local/bin/entrypoint.sh "$@"
