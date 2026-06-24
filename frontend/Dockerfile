# Levanto una imagen con nodeJS
FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copiamos los manifests necesarios (incluyendo pnpm-workspace.yaml para allowBuilds)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

ENV PNPM_CONFIG_DANGEROUSLY_ALLOW_ALL_BUILDS=true

# Pre-instalamos dependencias en la imagen (quedan en la capa de imagen como cache base)
RUN pnpm install --frozen-lockfile

# Copiamos el entrypoint que evita reinstalar si node_modules ya existe en el volumen
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["pnpm", "run", "dev", "--host"]
