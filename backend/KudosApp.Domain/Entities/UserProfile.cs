namespace KudosApp.Domain.Entities;

public enum UserRole
{
    User,
    Admin
}

public class UserProfile
{
    public Guid Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string DisplayName { get; set; } = string.Empty;

    public string AvatarUrl { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.User;

    public int TotalPoints { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public bool IsActive { get; set; } = true;

    public ICollection<Kudos> KudosSent { get; set; } = [];

    public ICollection<Kudos> KudosReceived { get; set; } = [];

    public ICollection<Badge> Badges { get; set; } = [];
}
