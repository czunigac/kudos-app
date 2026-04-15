namespace KudosApp.Domain.Entities;

public enum BadgeType
{
    FirstKudos,
    FirstReceived,
    TopGiver,
    TopReceiver,
    Streak,
    TeamPlayer
}

public class Badge
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Icon { get; set; } = string.Empty;

    public BadgeType Type { get; set; }

    public DateTime EarnedAt { get; set; } = DateTime.UtcNow;

    public Guid UserId { get; set; }

    public UserProfile User { get; set; } = null!;
}
