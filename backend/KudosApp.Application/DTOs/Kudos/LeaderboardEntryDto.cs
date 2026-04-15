namespace KudosApp.Application.DTOs.Kudos;

public record LeaderboardEntryDto(
    Guid UserId,
    string DisplayName,
    string AvatarUrl,
    int KudosCount);
