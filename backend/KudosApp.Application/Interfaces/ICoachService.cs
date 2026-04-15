using KudosApp.Application.DTOs.Kudos;

namespace KudosApp.Application.Interfaces;

public interface ICoachService
{
    Task<CoachSuggestionDto> GetSuggestionAsync(
        string messageDraft,
        Guid? selectedRecipientId,
        CancellationToken cancellationToken = default);
}
