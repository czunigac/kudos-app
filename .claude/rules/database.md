---
paths:
  - "backend/KudosApp.Infrastructure/Data/**/*.cs"
  - "backend/KudosApp.Infrastructure/Repositories/**/*.cs"
---

# Database rules — loads only when touching EF Core and Infrastructure code

## DbContext configuration

- All entity configuration via Fluent API in `OnModelCreating` — zero data annotations on entities
- Table names explicitly set with `e.ToTable("snake_case_name")` to match Supabase conventions
- `UserProfile.Id` must have `ValueGeneratedNever()` — Supabase provides the Guid
- Enums stored as strings: `.HasConversion<string>()` — readable in Supabase dashboard
- Foreign key delete behavior: use `DeleteBehavior.Restrict` for user-related entities — never cascade delete user data
- Unique indexes defined explicitly: `e.HasIndex(u => u.Email).IsUnique()`

## Queries

- Always async — `FirstOrDefaultAsync`, `ToListAsync`, `AnyAsync` — never sync equivalents
- Filter in SQL — `Where()` before `ToList()`, never the reverse
- Eager load navigation properties with `Include()` when they are needed in the result
- Use `Select()` to project to DTOs when you don't need the full entity
- Use `ExecuteUpdateAsync()` for single-field bulk updates — avoids loading entities unnecessarily
- Use `ExecuteDeleteAsync()` only for soft-delete cleanup jobs — never for user-visible data
- Pagination with `Skip((page - 1) * pageSize).Take(pageSize)` — always paginate feed queries

## Migrations

- Name must describe the schema change clearly: `AddKudosCategoryIndex`, `AddUserProfileAvatarUrl`
- Never edit migration files after `dotnet ef database update` has been run against any environment
- If a migration needs a fix: add a new migration with the correction, never modify the existing one
- Seed data uses fixed, deterministic Guids — never `Guid.NewGuid()` in seed data
- After adding a migration: verify in Supabase Table Editor that the schema matches expectations

## Repository pattern

- Repositories implement interfaces defined in `KudosApp.Application/Interfaces/`
- Constructor injection only — `public UserProfileRepository(KudosDbContext db)`
- Never expose `IQueryable` from a repository — always materialize with `ToListAsync()` or `FirstOrDefaultAsync()`
- `UpsertAsync` pattern: check `FindAsync` first, then add or update — do not rely on EF change tracking magic
- `UpdatePointsAsync`: use `ExecuteUpdateAsync` — loading the entity just to increment a counter is wasteful

## Supabase-specific

- `UserProfile` table mirrors `auth.users` — the `Id` column IS the Supabase user Guid
- Schema: `public` (default Supabase schema) — EF Core connects to `public` by default with Npgsql
- SSL required: connection string must include `SSL Mode=Require;Trust Server Certificate=true`
- Supabase enforces Row Level Security (RLS) by default — our API bypasses RLS using the service role key, which is intentional since auth is handled at the API layer via JWT
- Never use the `anon` key in the backend — always use the `secret` key for server-to-server calls
