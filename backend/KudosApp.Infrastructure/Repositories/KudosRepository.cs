using KudosApp.Application.DTOs.Kudos;
using KudosApp.Application.Interfaces;
using KudosApp.Domain.Entities;
using KudosApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace KudosApp.Infrastructure.Repositories;

public class KudosRepository(KudosDbContext context) : IKudosRepository
{
    public Task<int> GetFeedCountAsync() =>
        context.Kudos.CountAsync();

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

    public Task<int> CountGivenByUserAsync(Guid userId) =>
        context.Kudos.CountAsync(k => k.GiverId == userId);

    public Task<int> CountReceivedByUserAsync(Guid userId) =>
        context.Kudos.CountAsync(k => k.ReceiverId == userId);

    public async Task<IReadOnlyList<LeaderboardEntryDto>> GetTopGiversAsync(int top)
    {
        var rows = await context.Kudos
            .AsNoTracking()
            .GroupBy(k => k.GiverId)
            .Select(g => new
            {
                UserId = g.Key,
                TotalPoints = g.Sum(k => k.Points),
                Cnt = g.Count()
            })
            .OrderByDescending(x => x.TotalPoints)
            .ThenByDescending(x => x.Cnt)
            .ThenBy(x => x.UserId)
            .Take(top)
            .ToListAsync();

        return await MapLeaderboardRowsAsync(
            rows.ConvertAll(x => (x.UserId, x.TotalPoints, x.Cnt)));
    }

    public async Task<IReadOnlyList<LeaderboardEntryDto>> GetTopReceiversAsync(int top)
    {
        var rows = await context.Kudos
            .AsNoTracking()
            .GroupBy(k => k.ReceiverId)
            .Select(g => new
            {
                UserId = g.Key,
                TotalPoints = g.Sum(k => k.Points),
                Cnt = g.Count()
            })
            .OrderByDescending(x => x.TotalPoints)
            .ThenByDescending(x => x.Cnt)
            .ThenBy(x => x.UserId)
            .Take(top)
            .ToListAsync();

        return await MapLeaderboardRowsAsync(
            rows.ConvertAll(x => (x.UserId, x.TotalPoints, x.Cnt)));
    }

    private async Task<IReadOnlyList<LeaderboardEntryDto>> MapLeaderboardRowsAsync(
        List<(Guid UserId, int TotalPoints, int KudosCount)> rows)
    {
        if (rows.Count == 0)
            return [];

        var ids = rows.ConvertAll(r => r.UserId);
        var profiles = await context.UserProfiles
            .AsNoTracking()
            .Where(p => ids.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id);

        return rows
            .Where(r => profiles.ContainsKey(r.UserId))
            .Select(r =>
            {
                var p = profiles[r.UserId];
                return new LeaderboardEntryDto(
                    p.Id,
                    p.DisplayName,
                    p.AvatarUrl,
                    r.TotalPoints,
                    r.KudosCount);
            })
            .ToList();
    }
}
