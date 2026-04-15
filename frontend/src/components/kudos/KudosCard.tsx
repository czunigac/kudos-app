"use client";

import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Card, CardContent } from "@/components/ui/card";
import { formatTimeAgo } from "@/lib/formatTimeAgo";
import type { Kudos } from "@/types";
import { ArrowRight } from "lucide-react";

type KudosCardProps = {
  kudos: Kudos;
};

export function KudosCard({ kudos }: KudosCardProps) {
  return (
    <Card className="transition-shadow hover:border-primary/30 hover:shadow-md">
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <UserAvatar
              user={{
                displayName: kudos.giver.displayName,
                avatarUrl: kudos.giver.avatarUrl,
              }}
              size="sm"
            />
            <span className="truncate font-medium text-foreground">
              {kudos.giver.displayName}
            </span>
          </div>
          <ArrowRight
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <UserAvatar
              user={{
                displayName: kudos.receiver.displayName,
                avatarUrl: kudos.receiver.avatarUrl,
              }}
              size="sm"
            />
            <span className="truncate font-medium text-foreground">
              {kudos.receiver.displayName}
            </span>
            <CategoryBadge
              category={{
                name: kudos.category.name,
                color: kudos.category.color,
              }}
            />
          </div>
        </div>
        <p className="text-sm italic text-muted-foreground">{kudos.message}</p>
        <div className="flex items-center justify-between gap-2">
          <time
            className="text-xs text-muted-foreground"
            dateTime={kudos.createdAt}
          >
            {formatTimeAgo(kudos.createdAt)}
          </time>
          <span className="rounded-full bg-kudos-teal px-2.5 py-0.5 text-xs font-semibold text-kudos-bg">
            +{kudos.points} pts
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
