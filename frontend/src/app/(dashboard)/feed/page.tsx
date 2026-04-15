"use client";

import { KudosFeed } from "@/components/kudos/KudosFeed";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKudosFeed, useLeaderboard } from "@/hooks/useKudos";
import { iconFromStoredName } from "@/lib/uiIcons";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import type { LeaderboardEntry, UserBadge, UserProfile } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Medal, MessageSquareText, Trophy } from "lucide-react";

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tabular-nums text-foreground">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

const BADGE_TYPE_LABEL: Record<string, string> = {
  FirstKudos: "Milestone",
  FirstReceived: "Recognition",
  TopGiver: "Leaderboard",
  TopReceiver: "Leaderboard",
  Streak: "Streak",
  TeamPlayer: "Team",
};

function BadgeCategoryPill({ type }: { type: string }) {
  const label = BADGE_TYPE_LABEL[type] ?? type;
  return (
    <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
      {label}
    </span>
  );
}

function YourBadges({ badges }: { badges: UserBadge[] }) {
  if (badges.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Give and receive kudos to earn your first badges.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {badges.map((b) => {
        const Icon = iconFromStoredName(b.icon);
        return (
          <li
            key={b.id}
            className="flex gap-3 rounded-lg border border-border bg-card/50 p-3"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"
              aria-hidden
            >
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-foreground">{b.name}</span>
                <BadgeCategoryPill type={b.type} />
              </div>
              <p className="text-xs text-muted-foreground">{b.description}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function LeaderboardColumn({
  title,
  entries,
  accentClass,
}: {
  title: string;
  entries: LeaderboardEntry[];
  accentClass: string;
}) {
  if (entries.length === 0) {
    return (
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">No data yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <ol className="space-y-2">
        {entries.map((e, i) => (
          <li
            key={e.userId}
            className="flex items-center gap-2 rounded-md border border-transparent px-1 py-1 hover:border-border"
          >
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                i === 0 && accentClass,
                i > 0 && "bg-muted text-muted-foreground"
              )}
            >
              {i + 1}
            </span>
            <UserAvatar
              user={{ displayName: e.displayName, avatarUrl: e.avatarUrl }}
              size="sm"
            />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
              {e.displayName}
            </span>
            <span className="shrink-0 text-right">
              <span className="tabular-nums text-sm font-semibold text-kudos-teal">
                {e.totalPoints} pts
              </span>
              {e.kudosCount > 1 ? (
                <span className="ml-1.5 tabular-nums text-[10px] text-muted-foreground">
                  · {e.kudosCount} kudos
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function FeedPage() {
  const { data: profile } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await api.get<UserProfile>("/api/auth/me");
      return data;
    },
  });

  const { total: feedTotal } = useKudosFeed();
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard(5);

  return (
    <div className="space-y-8">
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Kudos given"
            value={profile?.kudosGivenCount ?? "—"}
          />
          <StatCard
            label="Kudos received"
            value={profile?.kudosReceivedCount ?? "—"}
          />
          <StatCard
            label="Total points"
            value={profile?.totalPoints ?? "—"}
          />
          <StatCard label="Team kudos" value={feedTotal} />
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquareText
                className="h-5 w-5 text-primary"
                aria-hidden
              />
              Recent kudos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <KudosFeed />
          </CardContent>
        </Card>
        <aside className="min-w-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="h-5 w-5 text-kudos-amber" aria-hidden />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboardLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  <LeaderboardColumn
                    title="Top contributors"
                    entries={leaderboard?.topGivers ?? []}
                    accentClass="bg-kudos-amber/25 text-kudos-amber"
                  />
                  <LeaderboardColumn
                    title="Top receivers"
                    entries={leaderboard?.topReceivers ?? []}
                    accentClass="bg-kudos-teal/25 text-kudos-teal"
                  />
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Medal className="h-5 w-5 text-primary" aria-hidden />
                Your Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <YourBadges badges={profile?.badges ?? []} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
