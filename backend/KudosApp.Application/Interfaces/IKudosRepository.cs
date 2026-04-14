using KudosApp.Domain.Entities;

namespace KudosApp.Application.Interfaces;

public interface IKudosRepository
{
    Task<IEnumerable<Kudos>> GetFeedAsync(int page, int pageSize);

    Task<Kudos?> GetByIdAsync(Guid id);

    Task<Kudos> CreateAsync(Kudos kudos);

    Task<IEnumerable<Kudos>> GetRecentByUserAsync(Guid userId, int days);
}
