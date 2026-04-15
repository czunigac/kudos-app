"use client";

import { CoachPanel } from "@/components/kudos/CoachPanel";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useToast from "@/components/ui/use-toast";
import { useCategories, useCreateKudos } from "@/hooks/useKudos";
import { useTeammates } from "@/hooks/useUsers";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import {
  Award,
  ChevronDown,
  Heart,
  Lightbulb,
  Sparkles,
  Star,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const categoryIcons: Record<string, LucideIcon> = {
  Lightbulb,
  Users,
  Star,
  Award,
  Heart,
};

function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = categoryIcons[name] ?? Sparkles;
  return <Icon className={className} aria-hidden />;
}

function pickCategories(categories: Category[] | undefined): Category[] {
  if (!categories?.length) return [];
  return categories.slice(0, 5);
}

export function GiveKudosForm() {
  const { toast } = useToast();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const {
    data: teammates,
    isLoading: teammatesLoading,
    isError: teammatesError,
    refetch: refetchTeammates,
  } = useTeammates();
  const createKudos = useCreateKudos();

  const recipientBoxRef = useRef<HTMLDivElement>(null);
  const listId = "give-kudos-teammates-list";

  const [recipientSearch, setRecipientSearch] = useState("");
  const [selectedRecipientId, setSelectedRecipientId] = useState<
    string | null
  >(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [messageDraft, setMessageDraft] = useState("");
  const [recipientOpen, setRecipientOpen] = useState(false);

  const displayCategories = useMemo(
    () => pickCategories(categories),
    [categories]
  );

  const filteredTeammates = useMemo(() => {
    if (!teammates) return [];
    const q = recipientSearch.trim().toLowerCase();
    if (!q) return teammates;
    return teammates.filter(
      (t) =>
        t.displayName.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q)
    );
  }, [teammates, recipientSearch]);

  const selectedTeammate = teammates?.find((t) => t.id === selectedRecipientId);

  function openRecipientDropdown() {
    setRecipientOpen(true);
    if (selectedTeammate && recipientSearch === "") {
      setRecipientSearch(selectedTeammate.displayName);
    }
  }

  function toggleRecipientDropdown() {
    setRecipientOpen((open) => {
      if (!open) {
        if (selectedTeammate && recipientSearch === "") {
          setRecipientSearch(selectedTeammate.displayName);
        }
        return true;
      }
      return false;
    });
  }

  function clearRecipient() {
    setSelectedRecipientId(null);
    setRecipientSearch("");
  }

  useEffect(() => {
    if (!recipientOpen) return;

    function onPointerDown(e: PointerEvent) {
      const el = recipientBoxRef.current;
      if (el && !el.contains(e.target as Node)) {
        setRecipientOpen(false);
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setRecipientOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [recipientOpen]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedRecipientId) {
      toast({
        title: "Choose a teammate",
        description: "Select who should receive this kudos.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedCategoryId) {
      toast({
        title: "Choose a category",
        description: "Pick the recognition type that fits best.",
        variant: "destructive",
      });
      return;
    }
    const message = messageDraft.trim();
    if (message.length < 3) {
      toast({
        title: "Add a message",
        description: "Write a short note (at least a few characters).",
        variant: "destructive",
      });
      return;
    }

    try {
      await createKudos.mutateAsync({
        receiverId: selectedRecipientId,
        categoryId: selectedCategoryId,
        message,
      });
      toast({
        title: "Kudos sent",
        description: "Your recognition was posted to the feed.",
      });
      setRecipientSearch("");
      setSelectedRecipientId(null);
      setSelectedCategoryId(null);
      setMessageDraft("");
      setRecipientOpen(false);
    } catch {
      toast({
        title: "Could not send kudos",
        description: "Check your connection and try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-6">
      <div ref={recipientBoxRef} className="space-y-2">
        <Label htmlFor="recipient">Teammate</Label>
        <p className="text-xs text-muted-foreground">
          Search or open the list to choose who receives this kudos.
        </p>
        <div className="relative">
          <Input
            id="recipient"
            role="combobox"
            aria-expanded={recipientOpen}
            aria-controls={recipientOpen ? listId : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            placeholder={
              teammatesLoading
                ? "Loading teammates…"
                : "Search by name or email…"
            }
            value={
              recipientOpen
                ? recipientSearch
                : (selectedTeammate?.displayName ?? recipientSearch)
            }
            onChange={(e) => {
              if (selectedRecipientId) setSelectedRecipientId(null);
              setRecipientSearch(e.target.value);
              setRecipientOpen(true);
            }}
            onFocus={() => openRecipientDropdown()}
            disabled={teammatesLoading || teammatesError}
            className="pr-20"
          />
          <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
            {selectedRecipientId ? (
              <button
                type="button"
                className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Clear teammate"
                onClick={() => {
                  clearRecipient();
                  setRecipientOpen(false);
                }}
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            ) : null}
            <button
              type="button"
              className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label={recipientOpen ? "Close teammate list" : "Open teammate list"}
              onClick={() => toggleRecipientDropdown()}
              disabled={teammatesLoading || teammatesError}
            >
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  recipientOpen && "rotate-180"
                )}
                aria-hidden
              />
            </button>
          </div>
          {recipientOpen && !teammatesLoading && !teammatesError ? (
            <ul
              id={listId}
              className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-auto rounded-md border border-border bg-card py-1 text-sm shadow-lg"
              role="listbox"
              aria-label="Teammates"
            >
              {filteredTeammates.length === 0 ? (
                <li className="px-3 py-2 text-muted-foreground">
                  {teammates?.length === 0
                    ? "No teammates to show."
                    : "No matches — try another name or email."}
                </li>
              ) : (
                filteredTeammates.map((t) => {
                  const isActive = t.id === selectedRecipientId;
                  return (
                    <li key={t.id} role="option" aria-selected={isActive}>
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                          isActive
                            ? "bg-primary/15 text-primary"
                            : "hover:bg-accent"
                        )}
                        onClick={() => {
                          setSelectedRecipientId(t.id);
                          setRecipientSearch("");
                          setRecipientOpen(false);
                        }}
                      >
                        <UserAvatar
                          user={{
                            displayName: t.displayName,
                            avatarUrl: t.avatarUrl,
                          }}
                          size="sm"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium text-foreground">
                            {t.displayName}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {t.email}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          ) : null}
        </div>
        {teammatesError ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <p>Could not load teammates.</p>
            <button
              type="button"
              className="mt-1 font-medium underline underline-offset-2 hover:no-underline"
              onClick={() => void refetchTeammates()}
            >
              Try again
            </button>
          </div>
        ) : null}
        {!teammatesLoading &&
        !teammatesError &&
        teammates &&
        teammates.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No other teammates yet. Once more people join, they will appear
            here.
          </p>
        ) : null}
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-foreground">Category</legend>
        {categoriesLoading ? (
          <p className="text-sm text-muted-foreground">Loading categories…</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {displayCategories.map((cat) => {
              const selected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border px-2 py-3 text-center text-xs font-medium transition-colors",
                    selected
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-card text-foreground hover:border-primary/40"
                  )}
                >
                  <CategoryIcon name={cat.icon} className="h-5 w-5" />
                  <span className="leading-tight">{cat.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          rows={5}
          value={messageDraft}
          onChange={(e) => setMessageDraft(e.target.value)}
          placeholder="Share what they did and why it mattered…"
          className={cn(
            "flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
        <CoachPanel
          messageDraft={messageDraft}
          selectedRecipientId={selectedRecipientId ?? undefined}
        />
      </div>

      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={createKudos.isPending}
      >
        {createKudos.isPending ? "Sending…" : "Send kudos"}
      </Button>
    </form>
  );
}
