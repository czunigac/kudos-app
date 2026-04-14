using KudosApp.Domain.Entities;

namespace KudosApp.Application.Interfaces;

public interface ICategoryRepository
{
    Task<IEnumerable<Category>> GetAllActiveAsync();

    Task<Category?> GetByIdAsync(Guid id);
}
