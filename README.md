# Blog SaaS

This repository is the dedicated multi-tenant Shopify blog SaaS foundation. It is intentionally separate from any single-store production automation repo.

## Workspace layout

- `apps/web`: Next.js app with merchant routes, Shopify install flow, webhook entrypoints, and queued API endpoints.
- `apps/worker`: BullMQ worker process and provider contracts for topic generation, drafting, image generation, publishing, and optional exports.
- `packages/domain`: shared domain models, API contracts, and queue payload schemas.
- `packages/prompt-library`: versioned prompt and content-type seeds, plus tenant override helpers.
- `packages/db`: Prisma schema and database client.
- `scripts/export-airtable-seed.ts`: one-off/export helper to freeze the current baseline Airtable prompt library into seed data.

## Commands

- `npm install`
- `npm run prompt:export`
- `npm run db:validate`
- `npm run typecheck`
- `npm run test`
- `npm run dev:web`
- `npm run dev:worker`

## Environment

The new stack expects these variables at minimum:

- `DATABASE_URL`
- `REDIS_URL`
- `SHOPIFY_API_KEY`
- `SHOPIFY_API_SECRET`
- `SHOPIFY_SCOPES`
- `SHOPIFY_APP_URL`
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`

Optional export/integration variables:

- `AIRTABLE_TOKEN`
- `AIRTABLE_PROMPT_LIBRARY_BASE_ID`
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`

## Current default

This foundation is optimized for:

- agency-led onboarding
- limited-visibility public Shopify distribution
- manual approval before publish
- server-owned AI credentials
- Postgres as system of record
- Redis/BullMQ for orchestration
- optional Google Docs and Airtable export layers, not runtime dependencies
