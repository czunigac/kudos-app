using System.Security.Claims;

namespace KudosApp.API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid? GetUserId(this ClaimsPrincipal principal)
    {
        var value =
            principal.FindFirst("sub")?.Value
            ?? principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(value) || !Guid.TryParse(value, out var id))
            return null;

        return id;
    }

    public static string? GetEmail(this ClaimsPrincipal principal) =>
        principal.FindFirst("email")?.Value
        ?? principal.FindFirst(ClaimTypes.Email)?.Value;

    public static string? GetRole(this ClaimsPrincipal principal) =>
        principal.FindFirst("user_role")?.Value;
}
