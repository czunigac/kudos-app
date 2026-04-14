using KudosApp.API.Extensions;
using KudosApp.Application.DTOs;
using KudosApp.Application.DTOs.Kudos;
using KudosApp.Application.Interfaces;
using KudosApp.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KudosApp.API.Controllers;

[ApiController]
[Route("api/kudos")]
public class KudosController(
    IKudosRepository kudosRepo,
    IUserProfileRepository userRepo,
    ICategoryRepository categoryRepo) : ControllerBase
{
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetFeed([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        page = page < 1 ? 1 : page;
        pageSize = Math.Clamp(pageSize, 1, 50);

        var items = await kudosRepo.GetFeedAsync(page, pageSize);
        var total = await kudosRepo.GetFeedCountAsync();
        var data = items.Select(MapToDto).ToArray();

        return Ok(new { data, page, pageSize, total });
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateKudosRequest request)
    {
        var giverId = User.GetUserId();
        if (giverId is null)
            return Unauthorized();

        if (giverId.Value == request.ReceiverId)
            return BadRequest("You cannot send kudos to yourself.");

        var receiver = await userRepo.GetByIdAsync(request.ReceiverId);
        if (receiver is null)
            return NotFound("Receiver not found.");

        var category = await categoryRepo.GetByIdAsync(request.CategoryId);
        if (category is null)
            return NotFound("Category not found.");

        var kudos = new Kudos
        {
            GiverId = giverId.Value,
            ReceiverId = request.ReceiverId,
            CategoryId = request.CategoryId,
            Message = request.Message,
            Points = category.PointValue
        };

        var created = await kudosRepo.CreateAsync(kudos);
        await userRepo.UpdatePointsAsync(request.ReceiverId, category.PointValue);

        var withNavigations = await kudosRepo.GetByIdAsync(created.Id);
        if (withNavigations is null)
            return StatusCode(StatusCodes.Status500InternalServerError);

        return StatusCode(StatusCodes.Status201Created, MapToDto(withNavigations));
    }

    [HttpGet("categories")]
    [Authorize]
    public async Task<IActionResult> GetCategories()
    {
        var categories = await categoryRepo.GetAllActiveAsync();
        var list = categories
            .Select(c => new CategoryDto(c.Id, c.Name, c.Icon, c.PointValue, c.Color))
            .ToList();

        return Ok(list);
    }

    private static KudosDto MapToDto(Kudos k) =>
        new(
            k.Id,
            k.Message,
            k.Points,
            k.CreatedAt,
            new UserProfileDto(
                k.Giver.Id,
                k.Giver.Email,
                k.Giver.DisplayName,
                k.Giver.AvatarUrl,
                k.Giver.Role.ToString(),
                k.Giver.TotalPoints),
            new UserProfileDto(
                k.Receiver.Id,
                k.Receiver.Email,
                k.Receiver.DisplayName,
                k.Receiver.AvatarUrl,
                k.Receiver.Role.ToString(),
                k.Receiver.TotalPoints),
            new CategoryDto(
                k.Category.Id,
                k.Category.Name,
                k.Category.Icon,
                k.Category.PointValue,
                k.Category.Color));
}
