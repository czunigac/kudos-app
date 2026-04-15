"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { createClient } from "@/lib/supabase/client";
import type { CoachSuggestion } from "@/types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type CoachPanelProps = {
  messageDraft: string;
  selectedRecipientId?: string;
};

export function CoachPanel({
  messageDraft,
  selectedRecipientId,
}: CoachPanelProps) {
  const debouncedDraft = useDebounce(messageDraft, 600);
  const [suggestion, setSuggestion] = useState<CoachSuggestion | null>(null);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    if (debouncedDraft.trim().length < 10) {
      setSuggestion(null);
      setStreaming(false);
      return;
    }

    const ac = new AbortController();
    let cancelled = false;

    void (async () => {
      setStreaming(true);
      setSuggestion(null);

      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;

        const res = await fetch("/api/kudos-coach/suggest", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            messageDraft: debouncedDraft,
            selectedRecipientId: selectedRecipientId ?? null,
          }),
          signal: ac.signal,
        });

        if (!res.ok || !res.body) {
          setStreaming(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (!cancelled) {
          const { done, value } = await reader.read();
          if (value) {
            buffer += decoder.decode(value, { stream: true });
            try {
              const parsed = JSON.parse(buffer) as CoachSuggestion;
              setSuggestion(parsed);
            } catch {
              /* incomplete JSON */
            }
          }
          if (done) {
            buffer += decoder.decode();
            try {
              const parsed = JSON.parse(buffer) as CoachSuggestion;
              setSuggestion(parsed);
            } catch {
              /* ignore */
            }
            break;
          }
        }
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
      } finally {
        if (!cancelled) setStreaming(false);
      }
    })();

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [debouncedDraft, selectedRecipientId]);

  if (debouncedDraft.trim().length < 10) {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-foreground"
      )}
    >
      {streaming && (
        <p className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50 opacity-75"
              aria-hidden
            />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          analyzing…
        </p>
      )}

      {suggestion && (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Suggested category
            </p>
            <p className="font-medium text-foreground">
              {suggestion.suggestedCategory}
            </p>
            <p className="text-muted-foreground">{suggestion.categoryReason}</p>
          </div>

          {suggestion.suggestedRecipient ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Suggested recipient
              </p>
              <p className="font-medium text-foreground">
                {suggestion.suggestedRecipient.name}
              </p>
              {suggestion.recipientReason ? (
                <p className="text-muted-foreground">
                  {suggestion.recipientReason}
                </p>
              ) : null}
            </div>
          ) : null}

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Enhanced message
            </p>
            <blockquote className="mt-1 border-l-2 border-primary/40 pl-3 italic text-foreground">
              {suggestion.enhancedMessage}
            </blockquote>
          </div>

          {suggestion.improvements.length > 0 ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Improvements
              </p>
              <ul className="mt-1 list-inside list-disc text-muted-foreground">
                {suggestion.improvements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      {!streaming && !suggestion ? (
        <p className="text-xs text-muted-foreground">
          Could not load a suggestion. Try again in a moment.
        </p>
      ) : null}
    </div>
  );
}
