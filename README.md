# Om Tatva Admin

Standalone content admin for the [Om Tatva](https://github.com) public site. This repo has **no shared source code** with the frontend — it talks to the main site only via HTTP API.

## Prerequisites

The public site (`omtatva`) must be running with:

- `data/cms.json` on the server
- `ADMIN_API_KEY` set in `.env.local`
- API routes: `GET/PUT /api/admin/content`

## Setup

```bash
npm install
cp .env.example .env.local
```

`.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Run

```bash
npm run dev
```

Open http://localhost:3001 → sign in with the same `ADMIN_API_KEY` as the main site.

## Sections (match frontend homepage)

| Group | Sections |
|-------|----------|
| Homepage | Hero, Featured Films, Trending, Creative Studios, Process, BTS, News, Careers, Newsletter |
| Content | Films, News, Studios, Careers, Process Steps, BTS |
| Site | Site Settings, Navigation, About |

## API (on main site, not this repo)

```http
GET  {API_URL}/api/admin/content
PUT  {API_URL}/api/admin/content
Authorization: Bearer <ADMIN_API_KEY>
```

Public read (no auth):

```http
GET {API_URL}/api/content
```

## Deploy

Deploy this app separately (e.g. Vercel). Set `NEXT_PUBLIC_API_URL` to your production site URL and add that admin origin to `ADMIN_ORIGIN` on the main site for CORS.

## Type sync

CMS shapes live in `src/types/cms.ts`. When you add fields on the main site (`omtatva/src/lib/cms/types.ts`), update this file to match.
