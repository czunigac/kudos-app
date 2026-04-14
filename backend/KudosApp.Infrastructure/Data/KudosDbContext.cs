using KudosApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace KudosApp.Infrastructure.Data;

public class KudosDbContext(DbContextOptions<KudosDbContext> options) : DbContext(options)
{
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();

    public DbSet<Kudos> Kudos => Set<Kudos>();

    public DbSet<Category> Categories => Set<Category>();

    public DbSet<Badge> Badges => Set<Badge>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.ToTable("user_profiles");

            entity.Property(e => e.Id).ValueGeneratedNever();

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(256);

            entity.HasIndex(e => e.Email).IsUnique();

            entity.Property(e => e.DisplayName)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Role).HasConversion<string>();
        });

        modelBuilder.Entity<Kudos>(entity =>
        {
            entity.ToTable("kudos");

            entity.HasOne(e => e.Giver)
                .WithMany(p => p.KudosSent)
                .HasForeignKey(e => e.GiverId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Receiver)
                .WithMany(p => p.KudosReceived)
                .HasForeignKey(e => e.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Category)
                .WithMany(c => c.Kudos)
                .HasForeignKey(e => e.CategoryId);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.ToTable("categories");

            entity.HasData(
            new Category
            {
                Id = Guid.Parse("11111111-0000-0000-0000-000000000001"),
                Name = "Innovation",
                Description = string.Empty,
                Icon = "Lightbulb",
                Color = "#7F77DD",
                PointValue = 50,
                IsActive = true
            },
            new Category
            {
                Id = Guid.Parse("11111111-0000-0000-0000-000000000002"),
                Name = "Teamwork",
                Description = string.Empty,
                Icon = "Users",
                Color = "#1D9E75",
                PointValue = 30,
                IsActive = true
            },
            new Category
            {
                Id = Guid.Parse("11111111-0000-0000-0000-000000000003"),
                Name = "Leadership",
                Description = string.Empty,
                Icon = "Star",
                Color = "#D85A30",
                PointValue = 60,
                IsActive = true
            },
            new Category
            {
                Id = Guid.Parse("11111111-0000-0000-0000-000000000004"),
                Name = "Excellence",
                Description = string.Empty,
                Icon = "Award",
                Color = "#BA7517",
                PointValue = 40,
                IsActive = true
            },
            new Category
            {
                Id = Guid.Parse("11111111-0000-0000-0000-000000000005"),
                Name = "Support",
                Description = string.Empty,
                Icon = "Heart",
                Color = "#D4537E",
                PointValue = 25,
                IsActive = true
            });
        });

        modelBuilder.Entity<Badge>(entity =>
        {
            entity.ToTable("badges");

            entity.Property(e => e.Type).HasConversion<string>();

            entity.HasOne(e => e.User)
                .WithMany(p => p.Badges)
                .HasForeignKey(e => e.UserId);
        });
    }
}
