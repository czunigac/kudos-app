---
paths:
  - "backend/KudosApp.API/**/*.cs"
  - "backend/KudosApp.Application/**/*.cs"
  - "backend/KudosApp.Infrastructure/**/*.cs"
  - "backend/KudosApp.Domain/**/*.cs"
---

# Backend rules — loads only when touching .NET code

## Clean Architecture boundaries (enforce strictly)

```
Domain          → zero external dependencies, pure C# classes
Application     → depends on Domain only, defines interfaces
Infrastructure  → implements interfaces from Application, depends on EF Core / OpenAI
API             → depends on Application and Infrastructure, handles HTTP concerns only
```

Never: Controller → DbContext directly
Never: Domain entity with EF Core attributes (use Fluent API in DbContext)
Never: Business logic in a Controller action — delegate to a service or use case

## Controllers

- Every action must have `[Authorize]` unless explicitly `[AllowAnonymous]`
- Use primary constructor injection: `public KudosController(IKudosRepository repo)`
- Return `IActionResult` — use `Ok()`, `Created()`, `NotFound()`, `BadRequest()`
- Read userId with `User.GetUserId()` from `ClaimsPrincipalExtensions`
- Never return raw entity objects — always map to a DTO
- Catch only specific exceptions — never `catch (Exception e)` swallowing everything

## Application layer

- All request inputs validated with FluentValidation — no manual `if (string.IsNullOrEmpty(...))`
- Services are stateless — no instance fields holding request state
- All DTOs are C# records: `public record KudosDto(Guid Id, string Message, ...)`
- Interfaces defined here, implementations in Infrastructure
- Never reference `DbContext` or any EF Core type in Application layer

## Infrastructure layer

- Repositories implement interfaces from Application — inject `KudosDbContext` via constructor
- Use `async/await` throughout — no `.Result`, `.Wait()`, or `.GetAwaiter().GetResult()`
- Use `ExecuteUpdateAsync` for bulk updates — avoids loading entities just to update one field
- Always use `Include()` for navigation properties needed in the result — no lazy loading
- Filter in SQL via LINQ — never `ToList()` before `Where()`

## Domain entities

- No data annotations (`[Required]`, `[MaxLength]`) — all config via Fluent API in DbContext
- Navigation properties initialized to empty collections: `ICollection<Kudos> Kudos = []`
- `UserProfile.Id` is `ValueGeneratedNever()` — it comes from Supabase, never auto-generated
- Enums stored as strings: `.HasConversion<string>()` in DbContext

## Error responses

Use consistent error shape:
```json
{ "error": "Human readable message" }
```
- `400 BadRequest` → validation failure
- `401 Unauthorized` → missing or invalid JWT
- `403 Forbidden` → authenticated but not authorized (wrong role)
- `404 NotFound` → resource does not exist
- `409 Conflict` → duplicate (e.g. email already in use)

## Migrations

- Run `dotnet ef migrations add <Name>` after any entity change
- Migration name must describe the change: `AddKudosIsPublicFlag`, not `Update1`
- Never edit generated migration files manually
- Always run `dotnet ef database update` after adding a migration and verify in Supabase
