# Mini Lead Tracker

## Demo

- Web: http://arcticweb-assignment-client.135.125.53.185.sslip.io
- API: http://arcticweb-assignment-api.135.125.53.185.sslip.io/api
- Swagger: http://arcticweb-assignment-api.135.125.53.185.sslip.io/api/docs

## Що використано

- Next.js App Router + TypeScript
- NestJS + Swagger
- PostgreSQL + Prisma
- Docker Compose
- Tailwind CSS, shadcn-style components
- Axios, React Hook Form, Zod

## 1. Як запустити

```bash
docker compose up --build
```

Docker піднімає PostgreSQL, backend і frontend. Міграції Prisma застосовуються автоматично під час старту backend container.

Локальні адреси:

- frontend: http://localhost:3000
- backend: http://localhost:3002/api
- Swagger: http://localhost:3002/api/docs

Docker файли:

- `backend/Dockerfile`
- `frontend/Dockerfile`
- `docker-compose.yml`

## 2. Змінні оточення

`backend/.env.example`

```env
PORT=3002
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lead_tracker?schema=public
FRONTEND_URL=http://localhost:3000
```

`frontend/.env.example`

```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

У Docker Compose ці значення вже прописані.

## 3. Як перевірити API

Список лідів:

```bash
curl http://localhost:3002/api/leads
```

Створити лід:

```bash
curl -X POST http://localhost:3002/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Arctic-web Ltd.",
    "email": "sales@arctic-web.com",
    "company": "Arctic-web",
    "status": "NEW",
    "value": 12500,
    "notes": "Call back after the budget review."
  }'
```

Додати коментар:

```bash
curl -X POST http://localhost:3002/api/leads/<lead-id>/comments \
  -H "Content-Type: application/json" \
  -d '{ "text": "Interested in a demo next week." }'
```

Swagger: http://localhost:3002/api/docs

## 4. Build і prod-режим

Production build описаний у Dockerfile'ах для backend і frontend. Для збірки та запуску достатньо:

```bash
docker compose up --build
```
