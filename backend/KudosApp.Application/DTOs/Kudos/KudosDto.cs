using KudosApp.Application.DTOs;

namespace KudosApp.Application.DTOs.Kudos;

public record KudosDto(
    Guid Id,
    string Message,
    int Points,
    DateTime CreatedAt,
    UserProfileDto Giver,
    UserProfileDto Receiver,
    CategoryDto Category);

public record CategoryDto(
    Guid Id,
    string Name,
    string Description,
    string Icon,
    int PointValue,
    string Color);

public record CreateKudosRequest(Guid ReceiverId, Guid CategoryId, string Message);
