using KudosApp.API.Auth;
using KudosApp.API.Extensions;
using KudosApp.Application.DTOs;
using KudosApp.Application.Interfaces;
using KudosApp.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KudosApp.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IUserProfileRepository userRepo, IKudosRepository kudosRepo) : ControllerBase
{
    [HttpPost("sync-profile")]
    [Authorize]
    public async Task<IActionResult> SyncProfile()
    {
        var userId = User.GetUserId();
        var email = User.GetEmail();
        if (userId is null || string.IsNullOrEmpty(email))
            return Unauthorized();

        var displayName = DisplayNameResolver.FromClaims(User, email);

        var avatarUrl =
            $"https://api.dicebear.com/7.x/initials/svg?seed={Uri.EscapeDataString(displayName)}";

        var profile = new UserProfile
        {
            Id = userId.Value,
            Email = email,
            DisplayName = displayName,
            AvatarUrl = avatarUrl
        };

        await userRepo.UpsertAsync(profile);
        await EnsureMilestoneBadgesAsync(userId.Value);

        var fresh = await userRepo.GetByIdAsync(userId.Value);
        if (fresh is null)
            return StatusCode(StatusCodes.Status500InternalServerError);

        return Ok(await ToProfileResponseAsync(fresh));
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me()
    {
        var userId = User.GetUserId();
        if (userId is null)
            return Unauthorized();

        await EnsureMilestoneBadgesAsync(userId.Value);

        var profile = await userRepo.GetByIdAsync(userId.Value);
        if (profile is null)
            return NotFound();

        return Ok(await ToProfileResponseAsync(profile));
    }

    [HttpPut("profile")]
    [Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userId = User.GetUserId();
        if (userId is null)
            return Unauthorized();

        var name = request.DisplayName.Trim();
        if (name.Length is < 1 or > 100)
            return BadRequest("Display name must be between 1 and 100 characters.");

        string avatarUrl;
        if (string.IsNullOrWhiteSpace(request.AvatarUrl))
        {
            avatarUrl =
                $"https://api.dicebear.com/7.x/initials/svg?seed={Uri.EscapeDataString(name)}";
        }
        else
        {
            var trimmed = request.AvatarUrl.Trim();
            if (trimmed.Length > 2048)
                return BadRequest("Avatar URL is too long.");
            if (!Uri.TryCreate(trimmed, UriKind.Absolute, out var uri)
                || (uri.Scheme != Uri.UriSchemeHttps && uri.Scheme != Uri.UriSchemeHttp))
                return BadRequest("Avatar URL must be an http(s) URL.");
            avatarUrl = trimmed;
        }

        var updated = await userRepo.UpdateProfileAsync(userId.Value, name, avatarUrl);
        if (updated is null)
            return NotFound();

        await EnsureMilestoneBadgesAsync(userId.Value);
        var fresh = await userRepo.GetByIdAsync(userId.Value);
        if (fresh is null)
            return StatusCode(StatusCodes.Status500InternalServerError);

        return Ok(await ToProfileResponseAsync(fresh));
    }

    /// <summary>
    /// Grants milestone badges when kudos history qualifies but rows were never
    /// created (e.g. activity before this feature or missed awards). Idempotent.
    /// </summary>
    private async Task EnsureMilestoneBadgesAsync(Guid userId)
    {
        var given = await kudosRepo.CountGivenByUserAsync(userId);
        if (given >= 1 && !await userRepo.HasBadgeAsync(userId, BadgeType.FirstKudos))
            await userRepo.AddBadgeAsync(BadgeFactory.CreateFirstKudosGiven(userId));

        var received = await kudosRepo.CountReceivedByUserAsync(userId);
        if (received >= 1 && !await userRepo.HasBadgeAsync(userId, BadgeType.FirstReceived))
            await userRepo.AddBadgeAsync(BadgeFactory.CreateFirstRecognition(userId));
    }

    private async Task<object> ToProfileResponseAsync(UserProfile p)
    {
        var given = await kudosRepo.CountGivenByUserAsync(p.Id);
        var received = await kudosRepo.CountReceivedByUserAsync(p.Id);

        return new
        {
            id = p.Id,
            email = p.Email,
            displayName = p.DisplayName,
            avatarUrl = p.AvatarUrl,
            role = p.Role.ToString(),
            totalPoints = p.TotalPoints,
            kudosGivenCount = given,
            kudosReceivedCount = received,
            badges = p.Badges
                .OrderByDescending(b => b.EarnedAt)
                .Select(b => new
                {
                    id = b.Id,
                    name = b.Name,
                    description = b.Description,
                    icon = b.Icon,
                    type = b.Type.ToString(),
                    earnedAt = b.EarnedAt
                })
                .ToList()
        };
    }
}
