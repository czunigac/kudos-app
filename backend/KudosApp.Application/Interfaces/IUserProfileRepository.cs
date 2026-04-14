using KudosApp.Domain.Entities;

namespace KudosApp.Application.Interfaces;

public interface IUserProfileRepository
{
    Task<UserProfile?> GetByIdAsync(Guid id);

    Task<UserProfile?> GetByEmailAsync(string email);

    Task<IEnumerable<UserProfile>> GetAllActiveAsync();

    Task<IEnumerable<UserProfile>> GetTeammatesAsync(Guid excludeUserId);

    Task<IEnumerable<UserProfile>> GetUnderRecognizedAsync(int days);

    Task<UserProfile> UpsertAsync(UserProfile profile);

    Task UpdatePointsAsync(Guid userId, int pointsToAdd);
}
