using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using KudosApp.Application.DTOs.Kudos;
using KudosApp.Application.Interfaces;
using KudosApp.Domain.Entities;
using Microsoft.Extensions.Configuration;

namespace KudosApp.Infrastructure.Services;

public class KudosCoachService(
    HttpClient httpClient,
    IConfiguration configuration,
    ICategoryRepository categoryRepository) : ICoachService
{
    private static readonly JsonSerializerOptions JsonReadOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public async Task<CoachSuggestionDto> GetSuggestionAsync(
        string messageDraft,
        Guid? selectedRecipientId,
        CancellationToken cancellationToken = default)
    {
        var categories = (await categoryRepository.GetAllActiveAsync()).ToList();
        var apiKey = configuration["OpenAI:ApiKey"];

        if (string.IsNullOrWhiteSpace(apiKey))
            return BuildFallback(messageDraft, categories);

        var categoryLines = string.Join('\n',
            categories.Select(c => $"- {c.Name} (id: {c.Id}): {c.Description}"));

        var systemPrompt =
            """
            You are Kudos Coach, helping employees write peer recognition at work.
            Respond with ONLY valid JSON (no markdown) matching this shape:
            {
              "suggestedCategory": "string (one of the category names listed)",
              "categoryReason": "string, one short sentence",
              "suggestedRecipient": { "id": "guid string or empty", "name": "string" } | null,
              "recipientReason": "string or null",
              "enhancedMessage": "string, polished version of their draft",
              "improvements": ["string", "..."],
              "needsMoreContext": false
            }
            If a recipient is already selected, set suggestedRecipient to null.
            Use only category names from the user message list.
            """;

        var userContent =
            $"""
            Categories:
            {categoryLines}

            User draft: {messageDraft}
            Selected recipient id (may be empty): {selectedRecipientId?.ToString() ?? "none"}
            """;

        var payload = new Dictionary<string, object?>
        {
            ["model"] = "gpt-4o-mini",
            ["temperature"] = 0.4,
            ["response_format"] = new Dictionary<string, string> { ["type"] = "json_object" },
            ["messages"] = new object[]
            {
                new Dictionary<string, string>
                {
                    ["role"] = "system",
                    ["content"] = systemPrompt
                },
                new Dictionary<string, string>
                {
                    ["role"] = "user",
                    ["content"] = userContent
                }
            }
        };

        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            "https://api.openai.com/v1/chat/completions");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey.Trim());
        request.Content = new StringContent(
            JsonSerializer.Serialize(payload),
            Encoding.UTF8,
            "application/json");

        using var response = await httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
            return BuildFallback(messageDraft, categories);

        await using var responseStream = await response.Content.ReadAsStreamAsync(cancellationToken);
        var completion =
            await JsonSerializer.DeserializeAsync<OpenAiCompletionResponse>(
                responseStream,
                JsonReadOptions,
                cancellationToken);

        var rawJson = completion?.Choices?.FirstOrDefault()?.Message?.Content;
        if (string.IsNullOrWhiteSpace(rawJson))
            return BuildFallback(messageDraft, categories);

        try
        {
            var parsed = JsonSerializer.Deserialize<CoachSuggestionDto>(rawJson, JsonReadOptions);
            return parsed ?? BuildFallback(messageDraft, categories);
        }
        catch (JsonException)
        {
            return BuildFallback(messageDraft, categories);
        }
    }

    private static CoachSuggestionDto BuildFallback(
        string messageDraft,
        IReadOnlyList<Category> categories)
    {
        var pick = categories.FirstOrDefault(c =>
            c.Name.Equals("Teamwork", StringComparison.OrdinalIgnoreCase))
            ?? categories.FirstOrDefault();

        return new CoachSuggestionDto
        {
            SuggestedCategory = pick?.Name ?? "Teamwork",
            CategoryReason = "Offline coach — enable OpenAI:ApiKey for AI suggestions.",
            SuggestedRecipient = null,
            RecipientReason = null,
            EnhancedMessage = string.IsNullOrWhiteSpace(messageDraft)
                ? "Start by thanking them for something specific they did."
                : messageDraft.Trim(),
            Improvements =
            [
                "Mention the impact on the team.",
                "Keep the tone warm and specific."
            ],
            NeedsMoreContext = true
        };
    }

    private sealed class OpenAiCompletionResponse
    {
        public List<OpenAiChoice>? Choices { get; set; }
    }

    private sealed class OpenAiChoice
    {
        public OpenAiMessage? Message { get; set; }
    }

    private sealed class OpenAiMessage
    {
        public string? Content { get; set; }
    }
}
