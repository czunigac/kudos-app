using KudosApp.Application.Interfaces;
using KudosApp.Domain.Entities;
using KudosApp.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace KudosApp.Infrastructure.Repositories;

public class UserProfileRepository(KudosDbContext context) : IUserProfileRepository
{
    public async Task<UserProfile?> GetByIdAsync(Guid id) =>
        await context.UserProfiles
            .Include(p => p.Badges)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task<UserProfile?> GetByEmailAsync(string email)
    {
        var normalized = email.ToLowerInvariant();
        return await context.UserProfiles
            .FirstOrDefaultAsync(p => p.Email.ToLower() == normalized);
    }

    public async Task<IEnumerable<UserProfile>> GetAllActiveAsync() =>
        await context.UserProfiles
            .Where(p => p.IsActive)
            .OrderBy(p => p.DisplayName)
            .ToListAsync();

    public async Task<IEnumerable<UserProfile>> GetTeammatesAsync(Guid excludeUserId) =>
        await context.UserProfiles
            .Where(p => p.IsActive && p.Id != excludeUserId)
            .OrderBy(p => p.DisplayName)
            .ToListAsync();

    public async Task<IEnumerable<UserProfile>> GetUnderRecognizedAsync(int days)
    {
        var cutoff = DateTime.UtcNow.AddDays(-days);
        return await context.UserProfiles
            .Where(p => p.IsActive
                && !context.Kudos.Any(k => k.ReceiverId == p.Id && k.CreatedAt >= cutoff))
            .OrderBy(p => p.DisplayName)
            .ToListAsync();
    }

    public async Task<UserProfile> UpsertAsync(UserProfile profile)
    {
        var existing = await context.UserProfiles.FindAsync(profile.Id);
        if (existing is null)
        {
            context.UserProfiles.Add(profile);
            await context.SaveChangesAsync();
            return profile;
        }

        existing.Email = profile.Email;
        existing.DisplayName = profile.DisplayName;
        existing.AvatarUrl = profile.AvatarUrl;
        await context.SaveChangesAsync();
        return existing;
    }

    public Task UpdatePointsAsync(Guid userId, int pointsToAdd) =>
        context.UserProfiles
            .Where(p => p.Id == userId)
            .ExecuteUpdateAsync(s => s.SetProperty(p => p.TotalPoints, p => p.TotalPoints + pointsToAdd));

    public Task<bool> HasBadgeAsync(Guid userId, BadgeType type) =>
        context.Badges.AnyAsync(b => b.UserId == userId && b.Type == type);

    public async Task AddBadgeAsync(Badge badge)
    {
        context.Badges.Add(badge);
        await context.SaveChangesAsync();
    }
}
