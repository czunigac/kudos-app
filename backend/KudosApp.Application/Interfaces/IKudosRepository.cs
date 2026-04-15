using KudosApp.Application.DTOs.Kudos;
using KudosApp.Domain.Entities;

namespace KudosApp.Application.Interfaces;

public interface IKudosRepository
{
    Task<int> GetFeedCountAsync();

    Task<IEnumerable<Kudos>> GetFeedAsync(int page, int pageSize);

    Task<Kudos?> GetByIdAsync(Guid id);

    Task<Kudos> CreateAsync(Kudos kudos);

    Task<IEnumerable<Kudos>> GetRecentByUserAsync(Guid userId, int days);

    Task<int> CountGivenByUserAsync(Guid userId);

    Task<int> CountReceivedByUserAsync(Guid userId);

    Task<IReadOnlyList<LeaderboardEntryDto>> GetTopGiversAsync(int top);

    Task<IReadOnlyList<LeaderboardEntryDto>> GetTopReceiversAsync(int top);
}
