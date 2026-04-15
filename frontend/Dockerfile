# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base
WORKDIR /app
ENV CI=true
ARG NEXT_PUBLIC_API_URL=http://localhost:3002/api
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json tsconfig.base.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY frontend/components.json frontend/components.json
COPY frontend/next.config.mjs frontend/next.config.mjs
COPY frontend/postcss.config.mjs frontend/postcss.config.mjs
COPY frontend/tsconfig.json frontend/tsconfig.json
COPY frontend/eslint.config.mjs frontend/eslint.config.mjs
COPY frontend/app frontend/app
COPY frontend/components frontend/components
COPY frontend/lib frontend/lib

RUN npm ci --workspace frontend

FROM base AS build
COPY . .
RUN npm run build -w frontend

FROM node:22-alpine AS runtime
WORKDIR /app/frontend
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat

COPY --from=build /app/frontend/.next/standalone /app
COPY --from=build /app/frontend/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
