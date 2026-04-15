"use client";

import { KudosFeed } from "@/components/kudos/KudosFeed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKudosFeed } from "@/hooks/useKudos";
import api from "@/lib/api";
import type { UserProfile } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";

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

export default function FeedPage() {
  const { data: profile } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await api.get<UserProfile>("/api/auth/me");
      return data;
    },
  });

  const { total: feedTotal } = useKudosFeed();

  return (
    <div className="space-y-8">
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Kudos given" value={0} />
          <StatCard label="Kudos received" value={0} />
          <StatCard
            label="Total points"
            value={profile?.totalPoints ?? "—"}
          />
          <StatCard label="Team kudos" value={feedTotal} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Recent kudos</h2>
          <KudosFeed />
        </div>
        <aside className="min-w-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="h-5 w-5 text-kudos-amber" aria-hidden />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Top contributors and receivers will show here.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your achievements and streaks will appear here.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
