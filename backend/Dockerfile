FROM node:22-alpine AS builder

ARG SERVICE_NAME
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json .npmrc ./
COPY backend/identity-service/package.json ./backend/identity-service/package.json
COPY backend/supply-service/package.json ./backend/supply-service/package.json
COPY backend/booking-service/package.json ./backend/booking-service/package.json
RUN pnpm install --frozen-lockfile --filter @pqlc/${SERVICE_NAME}...

COPY backend ./backend
RUN pnpm --filter @pqlc/${SERVICE_NAME} build
RUN pnpm --filter @pqlc/${SERVICE_NAME} deploy --prod /app/deploy

FROM node:22-alpine AS runner

ARG SERVICE_NAME
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /app/deploy ./

USER app
CMD ["node", "dist/main.js"]
