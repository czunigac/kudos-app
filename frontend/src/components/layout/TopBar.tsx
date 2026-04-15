"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

function titleForPathname(pathname: string) {
  if (pathname.startsWith("/profile")) return "Profile";
  if (pathname === "/feed" || pathname.startsWith("/feed/")) return "Feed";
  if (pathname === "/give-kudos" || pathname.startsWith("/give-kudos/"))
    return "Give Kudos";
  return "KudosApp";
}

export function TopBar() {
  const pathname = usePathname();
  const title = titleForPathname(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <Button asChild size="sm">
        <Link href="/give-kudos">Give Kudos</Link>
      </Button>
    </header>
  );
}
