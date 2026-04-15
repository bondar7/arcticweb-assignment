# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base
WORKDIR /app
ENV CI=true
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json tsconfig.base.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY backend/prisma backend/prisma

RUN npm ci --workspace backend

FROM base AS build
COPY . .
WORKDIR /app/backend
RUN npm run prisma:generate && npx tsc --build tsconfig.build.json --force

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3002
ENV FRONTEND_URL=http://localhost:3000
RUN apk add --no-cache libc6-compat

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json
COPY --from=build /app/backend/package.json ./backend/package.json
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/prisma ./backend/prisma
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3002

CMD ["node", "backend/dist/main.js"]
