namespace KudosApp.Application.DTOs;

public record UserProfileDto(
    Guid Id,
    string Email,
    string DisplayName,
    string AvatarUrl,
    string Role,
    int TotalPoints);
