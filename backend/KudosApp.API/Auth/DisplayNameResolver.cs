using System.Security.Claims;
using System.Text.Json;

namespace KudosApp.API.Auth;

public static class DisplayNameResolver
{
    public static string FromClaims(ClaimsPrincipal user, string email)
    {
        var fromClaim = user.FindFirst("name")?.Value;
        if (!string.IsNullOrWhiteSpace(fromClaim))
            return fromClaim.Trim();

        var givenName = user.FindFirst("given_name")?.Value;
        if (!string.IsNullOrWhiteSpace(givenName))
            return givenName.Trim();

        var metaJson = user.FindFirst("user_metadata")?.Value;
        if (!string.IsNullOrWhiteSpace(metaJson))
        {
            try
            {
                using var doc = JsonDocument.Parse(metaJson);
                var root = doc.RootElement;
                foreach (var key in new[]
                         {
                             "name", "full_name", "display_name", "nickname",
                             "preferred_username"
                         })
                {
                    if (root.TryGetProperty(key, out var el)
                        && el.ValueKind == JsonValueKind.String)
                    {
                        var s = el.GetString();
                        if (!string.IsNullOrWhiteSpace(s))
                            return s.Trim();
                    }
                }
            }
            catch (JsonException)
            {
                // ignore malformed metadata
            }
        }

        var at = email.IndexOf('@');
        return at > 0 ? email[..at] : email;
    }
}
