using KudosApp.Application.Interfaces;
using KudosApp.Domain.Entities;
using KudosApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace KudosApp.Infrastructure.Repositories;

public class CategoryRepository(KudosDbContext context) : ICategoryRepository
{
    public async Task<IEnumerable<Category>> GetAllActiveAsync() =>
        await context.Categories
            .Where(c => c.IsActive)
            .OrderBy(c => c.Name)
            .ToListAsync();

    public async Task<Category?> GetByIdAsync(Guid id) =>
        await context.Categories.FindAsync(id);
}
