# Solution Desk

Electron desktop app for pre-sales engineers and solutions architects to track cloud opportunities, delivery progress, completed tasks, technology stack, SBOM inputs, and manager-ready reports.

## Stack

- Electron desktop shell
- React + Vite renderer
- Express backend API
- Postgres persistence
- Docker Compose for Postgres and the API service
- Vercel hosting support for the web app and serverless API

## Local Development

1. Copy environment defaults:

   ```bash
   cp .env.example .env
   ```

2. Start Postgres:

   ```bash
   npm run db:up
   ```

3. Run the browser development app and API:

   ```bash
   npm run dev
   ```

4. Run the Electron desktop app:

   ```bash
   npm run electron:dev
   ```

## Containers

Run Postgres and the backend API together:

```bash
npm run docker:up
```

Run a full stack smoke test with disposable Postgres storage, the API, the built web frontend, and a one-shot verifier:

```bash
npm run docker:test
```

The API listens on `http://127.0.0.1:3001` and exposes:

- `GET /api/health`
- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/reset`

## Vercel

This project includes `vercel.json` and an `api/index.mjs` serverless entrypoint. The frontend uses same-origin `/api` requests by default in production, while Vite proxies `/api` to the local Express server during development.

Set a managed Postgres connection string in Vercel before deploying:

```bash
vercel env add DATABASE_URL
```

Vercel Postgres-style `POSTGRES_URL` is also supported. Then deploy with:

```bash
vercel deploy
vercel deploy --prod
```
