FROM node:22-alpine AS builder

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json .npmrc ./
COPY frontend/public-web/package.json frontend/public-web/package.json
RUN pnpm install --frozen-lockfile --filter @pqlc/public-web...

COPY frontend/public-web ./frontend/public-web
RUN BUILD_STANDALONE=true pnpm --filter @pqlc/public-web build

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S app && adduser -S app -G app

COPY --from=builder --chown=app:app /app/frontend/public-web/.next/standalone ./
COPY --from=builder --chown=app:app /app/frontend/public-web/.next/static ./frontend/public-web/.next/static

USER app
EXPOSE 3000
CMD ["node", "frontend/public-web/server.js"]
