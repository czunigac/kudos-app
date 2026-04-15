"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useKudosFeed } from "@/hooks/useKudos";
import { motion } from "framer-motion";
import { KudosCard } from "./KudosCard";

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="space-y-4 p-4">
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="h-4 flex-1 rounded bg-muted" />
            </div>
            <div className="h-12 rounded bg-muted" />
            <div className="flex justify-between">
              <div className="h-3 w-24 rounded bg-muted" />
              <div className="h-6 w-16 rounded-full bg-muted" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function KudosFeed() {
  const { kudos, isLoading, error } = useKudosFeed();

  if (isLoading) {
    return <FeedSkeleton />;
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        Could not load kudos. Please try again.
      </p>
    );
  }

  if (kudos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No kudos yet. Be the first to recognize someone!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {kudos.map((k, index) => (
        <motion.div
          key={k.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.05 }}
        >
          <KudosCard kudos={k} />
        </motion.div>
      ))}
    </div>
  );
}
