# KudosApp — Claude Code Operating Manual

## Project overview

Peer-to-peer employee recognition app. Monorepo with .NET 8 Clean Architecture backend
and Next.js 14 App Router frontend. Auth via Supabase (JWKS/ECC P-256). PostgreSQL on
Supabase cloud. AI feature: Kudos Coach with OpenAI streaming (SSE).

```
kudos-app/
├── backend/          → .NET 8: Domain, Application, Infrastructure, API
├── frontend/         → Next.js 14, shadcn/ui, Tailwind, Supabase SSR
├── ai-prompts/       → committed prompt library and AI artifacts
├── .claude/          → Claude Code config (settings, agents, rules, hooks)
├── docker-compose.yml
└── CLAUDE.md
```

Run everything: `docker compose up --build`
API: http://localhost:5235/swagger
Frontend: http://localhost:3000

---

## Workflow Orchestration

### 1. Plan mode default
- Enter plan mode for ANY non-trivial task (3+ steps or touching multiple layers)
- Write the plan as a checklist before writing any code
- If something goes sideways mid-task: STOP, re-plan, then continue
- Use plan mode for verification steps too, not just building
- Architectural decisions always require a plan — never just start coding

### 2. Subagent strategy
- Use subagents to keep the main context window clean
- Offload code review, security audits, and test writing to subagents in `.claude/agents/`
- For complex problems across BE and FE simultaneously: spawn parallel subagents
- One task per subagent — never mix concerns in a single subagent invocation
- Subagents return only a summary to main context, never the full output

### 3. Self-improvement loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write a rule that prevents the same mistake from happening again
- Review `tasks/lessons.md` at session start before touching any code
- If the same mistake happens twice: add it to CLAUDE.md directly

### 4. Verification before done
- Never mark a task complete without proving it works
- For backend: run `dotnet build` — zero warnings is the bar
- For frontend: run `npm run build` — zero TypeScript errors
- For DB changes: verify migration applied in Supabase Table Editor
- Ask: "Would a staff engineer approve this PR?"

### 5. Demand elegance
- For non-trivial changes: pause and ask "is there a more elegant solution?"
- If a fix feels hacky: implement the clean solution, not the quick one
- Skip this for simple, obvious single-line fixes
- Clean Architecture layers must be respected — never skip from API to Infrastructure

### 6. Autonomous bug fixing
- When given a bug report: find the root cause and fix it — no hand-holding needed
- Point at logs, errors, failing tests and resolve them directly
- Zero context switching required from the user
- Never fix a symptom — fix the cause

---

## Task Management

1. **Plan first** — write plan to `tasks/todo.md` with checkable items before any code
2. **Verify plan** — check in with user if plan touches > 3 files or changes an interface
3. **Track progress** — mark items `[x]` as completed during the session
4. **Explain changes** — one-line summary per completed step, no essays
5. **Document results** — add a "## Completed" section to `tasks/todo.md` when done
6. **Capture lessons** — update `tasks/lessons.md` after any user correction

---

## Core Principles

- **Simplicity first** — make every change as simple as possible, minimal code impact
- **No laziness** — find root causes, no temporary fixes, senior developer standards
- **Minimal impact** — only touch what's necessary, no side effects with new bugs
- **Finish the job** — no speculative features, no TODOs left behind in committed code
- **Justify dependencies** — never add a NuGet or npm package without stating why
- **Remove dead code** — if something is unused, delete it

---

## Stack and conventions

### Backend (.NET 8)
- Clean Architecture: Domain → Application → Infrastructure → API (dependency flows inward)
- Primary constructors for services and controllers
- Records for all DTOs — immutable by default
- Repository pattern — never call DbContext directly from controllers
- All endpoints require `[Authorize]` unless explicitly public
- FluentValidation for all request DTOs
- C# 12 features preferred: collection expressions `[]`, pattern matching, `is not null`
- No `.Result` or `.Wait()` — async all the way down

### Frontend (Next.js 14)
- App Router only — no Pages Router patterns
- Server Components by default, `'use client'` only when necessary
- shadcn/ui for all UI components — never build from scratch what shadcn has
- React Query for all server state — no useState + useEffect for data fetching
- Zustand for client state (auth profile only)
- Zod schemas for all form validation
- Tailwind utility classes — no inline styles, no CSS modules

### Database
- EF Core Code-First — schema lives in C# entities, not in SQL files
- Migrations via `dotnet ef migrations add` — never edit migration files manually
- `UserProfile.Id` = Supabase `auth.users.id` — single source of truth for identity
- Soft deletes via `IsActive` flag — never hard delete user data

### Git
- Conventional commits: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`
- Commit messages ≤ 72 characters
- Commit after each logical unit of work — never batch unrelated changes
- Never `--amend` or `--force` on main
- Never commit: `.env`, `appsettings.Development.json`, `*.user`, `node_modules`

---

## Key domain concepts

| Term | Definition |
|---|---|
| UserProfile | App user — Id mirrors Supabase auth.users.id |
| Kudos | A recognition sent from one user to another |
| Giver | The user sending the kudos |
| Receiver | The user receiving the kudos |
| Category | Type of recognition with a point value (Innovation, Teamwork, etc.) |
| Points | Accumulated score on UserProfile.TotalPoints |
| Badge | Achievement unlocked based on kudos patterns |
| KudosCoach | AI feature — streams suggestions while user drafts a kudos message |

---

## Environment

```
Supabase URL:     https://lcauhvseclfhvrwazkxg.supabase.co
JWKS endpoint:    https://lcauhvseclfhvrwazkxg.supabase.co/auth/v1/.well-known/jwks.json
DB host:          db.lcauhvseclfhvrwazkxg.supabase.co
API local:        http://localhost:5235
Frontend local:   http://localhost:3000
```

Secrets live in `.env` (root) and `appsettings.Development.json` — both gitignored.
Never read or print secret values. Never include them in code or comments.

---

## Commands reference

```bash
# Backend
cd backend
dotnet build                          # build all projects
dotnet run --project KudosApp.API     # run API locally
dotnet ef migrations add <Name> \
  --project KudosApp.Infrastructure \
  --startup-project KudosApp.API      # new migration
dotnet ef database update \
  --project KudosApp.Infrastructure \
  --startup-project KudosApp.API      # apply migrations

# Frontend
cd frontend
npm run dev                           # dev server
npm run build                         # production build + type check
npm run lint                          # ESLint

# Docker
docker compose up --build             # full stack
docker compose up postgres -d         # DB only
docker compose logs api -f            # API logs

# MCP — Supabase direct DB access from Claude Code
# "show me all tables in public schema"
# "count rows in user_profiles"
# "verify categories seed data is correct"
# "show me the last 5 kudos created"

```

---

## AI artifacts committed to this repo

```
CLAUDE.md                              ← this file
CLAUDE.local.md                        ← personal overrides (gitignored)
.claude/settings.json                  ← permissions and model config
.claude/agents/code-reviewer.md        ← security + correctness subagent
.claude/agents/debugger.md             ← autonomous bug fixing subagent
.claude/rules/api.md                   ← backend-specific rules (path-scoped)
.claude/rules/frontend.md              ← frontend-specific rules (path-scoped)
.claude/rules/database.md              ← EF Core rules (path-scoped)
.claude/hooks/                         ← pre-commit and auto-format hooks
ai-prompts/prompts/                    ← all prompts used to build features
ai-prompts/prompts/kudos-coach-system.md ← OpenAI system prompt for Kudos Coach
.github/copilot-instructions.md        ← GitHub Copilot context
```
