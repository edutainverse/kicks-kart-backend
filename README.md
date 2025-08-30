# Kicks Kart Backend (Express + MongoDB)

Single backend for Customer and Admin frontends. ESM, Node 20, JWT auth with refresh cookies, Joi validation, and a fake payments webhook.

## Quickstart

1. Start MongoDB using Docker

```powershell
# From backend folder
docker compose up -d
```

2. Copy env and set secrets

```powershell
Copy-Item .env.example .env
```

3. Install deps

```powershell
npm i
```

4. Run dev server

```powershell
npm run dev
```

5. Seed demo data

```powershell
npm run seed
```

API base: http://localhost:4000/api

OpenAPI: `kickskart-openapi.yaml` (root of repo)
Postman: `kickskart-postman-collection.json`

## Scripts
- dev: nodemon
- start: node
- test: jest + supertest
- seed: seed demo users/products/inventory

## Notes
- Access tokens are short-lived; refresh via cookie on /api/auth/refresh
- Admin routes require role `admin`
- Webhook is HMAC-SHA256 verified via `x-fp-signature`

## Acceptance
- Auth (signup/login/refresh/me/logout)
- Catalog with filters; product detail by id/slug
- Cart and checkout produce order + clientSecret
- Webhook success marks paid, decrements inventory, clears cart; idempotent
- Admin CRUD for products, inventory, orders, users