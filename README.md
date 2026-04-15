# KudosApp

**KudosApp** is a peer-to-peer **employee recognition** web application. Teammates send public **kudos** with a category and message, earn **points** and **badges**, and follow activity on a shared **feed**. An optional **Kudos Coach** (AI) helps authors refine drafts, pick categories, and surface recipient ideas.

---

## Overview

The product is a **monorepo** with two main applications:

| Part | Stack | Role |
|------|--------|------|
| **Frontend** | Next.js 16, React 19, Tailwind, Supabase Auth | Marketing site, dashboard, give-kudos flow, coach UI |
| **Backend** | .NET 8, EF Core, PostgreSQL | REST API, JWT validation (Supabase), OpenAI coach integration |

**Identity** is owned by **Supabase Auth**; the API treats `UserProfile.Id` as the same UUID as `auth.users.id`. **PostgreSQL** stores profiles, kudos, categories, and badges (hosted DB such as Supabase is typical).

Deeper technical notes, diagrams, and setup steps:

- [`frontend/README.md`](frontend/README.md)
- [`backend/README.md`](backend/README.md)

---

## Features (detailed)

### Recognition & feed

- **Give kudos** — Choose a teammate (searchable list), one of five **categories** (Innovation, Teamwork, Leadership, Excellence, Support) with points per category, and a personal message.
- **Activity feed** — Chronological kudos with giver/receiver, category badge, message, relative time, and points awarded.
- **Stats** — For the signed-in user: kudos given, kudos received, total points, and team-wide kudos count on the feed.

### Leaderboard & badges

- **Leaderboard (on feed)** — **Top contributors** and **top receivers** ranked by **total points** from kudos (with kudos count as a tiebreaker), not only transaction count.
- **Your badges** — Milestone badges (e.g. first kudos given, first recognition received) with icons and short descriptions; **backfill** ensures users with existing history still earn eligible badges when loading their profile.

### Kudos Coach (AI)

- **Debounced suggestions** — After the draft reaches a minimum length, the client requests coach suggestions (streaming JSON body where applicable).
- **Suggestions** — Suggested category (with reason), optional recipient hint, polished message, and bullet-point improvements.
- **Implementation** — Next.js can proxy to the .NET API; the API calls **OpenAI** with structured JSON output when `OpenAI:ApiKey` is configured; otherwise a **fallback** response is returned.

Prompt and product notes also live under [`ai-prompts/`](ai-prompts/).

### Profile & account

- **Profile page** — View stats; **edit display name** and optional **avatar image URL** (or reset to generated initials avatar). Email is read-only (sourced from auth).
- **Auth** — Register and sign in via Supabase; profile sync with the API; **“Back to home”** on sign-in and sign-up for the marketing page.

### Marketing

- **Landing page** (`/`) — Product positioning, stats strip, how-it-works, Kudos Coach highlight, and CTAs to register — dark theme with purple accent.

### API surface (summary)

- Auth: sync profile, current user (`/me`), update profile  
- Kudos: feed, create, categories, leaderboard  
- Users: teammates for recipient picker  
- Coach: suggest  

See Swagger on the API host (e.g. `/swagger` in development).

---

## Repository layout

```
kudos-app/
├── backend/          # .NET 8 Clean Architecture API
├── frontend/         # Next.js 16 App Router client
├── ai-prompts/       # Coach and other AI prompt artifacts
├── README.md         # This file
├── CLAUDE.md         # Maintainer / AI agent operating notes
└── ...
```

---

## Quick start

### Prerequisites

- **Node.js 20+** and npm (frontend)
- **.NET 8 SDK** (backend)
- **Supabase** project (auth + optional hosted Postgres)
- Optional: **OpenAI API key** for live Kudos Coach

### 1. Backend

Configure `ConnectionStrings:DefaultConnection`, `Supabase:Url`, and optionally `OpenAI:ApiKey` in user secrets or `appsettings.Development.json` (see [`backend/README.md`](backend/README.md)).

```bash
cd backend
dotnet ef database update --project KudosApp.Infrastructure --startup-project KudosApp.API
dotnet run --project KudosApp.API
```

Default dev URL is often **http://localhost:5235**.

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local   # set Supabase + API URL
npm install
npm run dev
```

App: **http://localhost:3000**

---

## License / assessment

This repository is suitable for **portfolio** or **technical assessment** use (e.g. Applaudo). Adjust licensing and deployment targets for your organization as needed.
