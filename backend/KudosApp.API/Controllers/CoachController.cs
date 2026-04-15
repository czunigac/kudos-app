using KudosApp.Application.DTOs.Kudos;
using KudosApp.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KudosApp.API.Controllers;

[ApiController]
[Route("api/kudos-coach")]
public class CoachController(ICoachService coachService) : ControllerBase
{
    [HttpPost("suggest")]
    [Authorize]
    public async Task<ActionResult<CoachSuggestionDto>> Suggest(
        [FromBody] CoachRequest request,
        CancellationToken cancellationToken)
    {
        var result = await coachService.GetSuggestionAsync(
            request.MessageDraft,
            request.SelectedRecipientId,
            cancellationToken);

        return Ok(result);
    }
}
