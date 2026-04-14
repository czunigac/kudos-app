namespace KudosApp.Domain.Entities;

public class Category
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Icon { get; set; } = string.Empty;

    public string Color { get; set; } = string.Empty;

    public int PointValue { get; set; }

    public bool IsActive { get; set; } = true;

    public ICollection<Kudos> Kudos { get; set; } = [];
}
