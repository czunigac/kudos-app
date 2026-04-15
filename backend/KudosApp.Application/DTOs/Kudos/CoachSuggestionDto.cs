namespace KudosApp.Application.DTOs.Kudos;

public class CoachSuggestionDto
{
    public string SuggestedCategory { get; init; } = string.Empty;

    public string CategoryReason { get; init; } = string.Empty;

    public CoachSuggestedRecipientDto? SuggestedRecipient { get; init; }

    public string? RecipientReason { get; init; }

    public string EnhancedMessage { get; init; } = string.Empty;

    public List<string> Improvements { get; init; } = [];

    public bool? NeedsMoreContext { get; init; }
}

public class CoachSuggestedRecipientDto
{
    public string Id { get; init; } = string.Empty;

    public string Name { get; init; } = string.Empty;
}
