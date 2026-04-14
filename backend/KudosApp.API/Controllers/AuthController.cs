using KudosApp.API.Extensions;
using KudosApp.Application.Interfaces;
using KudosApp.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KudosApp.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IUserProfileRepository userRepo) : ControllerBase
{
    [HttpPost("sync-profile")]
    [Authorize]
    public async Task<IActionResult> SyncProfile()
    {
        var userId = User.GetUserId();
        var email = User.GetEmail();
        if (userId is null || string.IsNullOrEmpty(email))
            return Unauthorized();

        var displayName = User.FindFirst("name")?.Value;
        if (string.IsNullOrWhiteSpace(displayName))
        {
            var at = email.IndexOf('@');
            displayName = at > 0 ? email[..at] : email;
        }

        var avatarUrl =
            $"https://api.dicebear.com/7.x/initials/svg?seed={Uri.EscapeDataString(displayName)}";

        var profile = new UserProfile
        {
            Id = userId.Value,
            Email = email,
            DisplayName = displayName,
            AvatarUrl = avatarUrl
        };

        var saved = await userRepo.UpsertAsync(profile);
        return Ok(ProfileResponse(saved));
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

        return Ok(ProfileResponse(profile));
    }

    private static object ProfileResponse(UserProfile p) =>
        new
        {
            id = p.Id,
            email = p.Email,
            displayName = p.DisplayName,
            avatarUrl = p.AvatarUrl,
            role = p.Role.ToString(),
            totalPoints = p.TotalPoints
        };
}
