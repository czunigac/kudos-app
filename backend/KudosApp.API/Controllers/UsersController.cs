using KudosApp.API.Extensions;
using KudosApp.Application.DTOs;
using KudosApp.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KudosApp.API.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController(IUserProfileRepository userRepo) : ControllerBase
{
    [HttpGet("teammates")]
    [Authorize]
    public async Task<IActionResult> GetTeammates()
    {
        var userId = User.GetUserId();
        if (userId is null)
            return Unauthorized();

        var teammates = await userRepo.GetTeammatesAsync(userId.Value);
        var data = teammates
            .Select(p => new UserProfileDto(
                p.Id,
                p.Email,
                p.DisplayName,
                p.AvatarUrl,
                p.Role.ToString(),
                p.TotalPoints))
            .ToList();

        return Ok(data);
    }
}
