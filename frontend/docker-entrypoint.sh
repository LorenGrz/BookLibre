#!/bin/sh
set -e

# Solo instala si node_modules no existe o si package.json fue modificado
# después de la última instalación
if [ ! -d /app/node_modules ] || [ ! -f /app/node_modules/.modules.yaml ]; then
  echo ">>> node_modules no encontrado, ejecutando pnpm install..."
  pnpm install --frozen-lockfile
else
  echo ">>> node_modules ya existe, omitiendo pnpm install."
fi

exec "$@"
