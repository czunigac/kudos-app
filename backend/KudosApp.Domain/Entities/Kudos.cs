namespace KudosApp.Domain.Entities;

public class Kudos
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Message { get; set; } = string.Empty;

    public int Points { get; set; }

    public bool IsPublic { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid GiverId { get; set; }

    public Guid ReceiverId { get; set; }

    public Guid CategoryId { get; set; }

    public UserProfile Giver { get; set; } = null!;

    public UserProfile Receiver { get; set; } = null!;

    public Category Category { get; set; } = null!;
}
