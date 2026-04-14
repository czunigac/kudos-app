using KudosApp.Application.Interfaces;
using KudosApp.Domain.Entities;
using KudosApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace KudosApp.Infrastructure.Repositories;

public class KudosRepository(KudosDbContext context) : IKudosRepository
{
    public async Task<IEnumerable<Kudos>> GetFeedAsync(int page, int pageSize)
    {
        var skip = page < 1 ? 0 : (page - 1) * pageSize;
        return await context.Kudos
            .Include(k => k.Giver)
            .Include(k => k.Receiver)
            .Include(k => k.Category)
            .OrderByDescending(k => k.CreatedAt)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<Kudos?> GetByIdAsync(Guid id) =>
        await context.Kudos
            .Include(k => k.Giver)
            .Include(k => k.Receiver)
            .Include(k => k.Category)
            .FirstOrDefaultAsync(k => k.Id == id);

    public async Task<Kudos> CreateAsync(Kudos kudos)
    {
        context.Kudos.Add(kudos);
        await context.SaveChangesAsync();
        return kudos;
    }

    public async Task<IEnumerable<Kudos>> GetRecentByUserAsync(Guid userId, int days)
    {
        var cutoff = DateTime.UtcNow.AddDays(-days);
        return await context.Kudos
            .Where(k => k.GiverId == userId && k.CreatedAt >= cutoff)
            .OrderByDescending(k => k.CreatedAt)
            .ToListAsync();
    }
}
