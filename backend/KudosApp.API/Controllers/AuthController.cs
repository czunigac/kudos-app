using KudosApp.API.Auth;
using KudosApp.API.Extensions;
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

        var profile = await userRepo.GetByIdAsync(userId.Value);
        if (profile is null)
            return NotFound();

        return Ok(await ToProfileResponseAsync(profile));
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
