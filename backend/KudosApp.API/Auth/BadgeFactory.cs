using KudosApp.Domain.Entities;

namespace KudosApp.API.Auth;

public static class BadgeFactory
{
    public static Badge CreateFirstKudosGiven(Guid userId) =>
        new()
        {
            UserId = userId,
            Type = BadgeType.FirstKudos,
            Name = "First kudos given",
            Description = "You recognized a teammate for the first time.",
            Icon = "Sparkles"
        };

    public static Badge CreateFirstRecognition(Guid userId) =>
        new()
        {
            UserId = userId,
            Type = BadgeType.FirstReceived,
            Name = "First recognition",
            Description = "You received your first kudos from the team.",
            Icon = "Heart"
        };
}
