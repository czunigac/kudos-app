"use client";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { Award, Home, LogOut, Trophy, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/give-kudos", label: "Give Kudos", icon: Award },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
] as const;

function isNavActive(pathname: string, href: string, label: string) {
  if (label === "Profile") {
    return pathname.startsWith("/profile");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const profile = useAuthStore((s) => s.profile);
  const { logout } = useAuth();

  const profileHref = profile ? `/profile/${profile.id}` : "/feed";

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card">
      <div className="border-b border-border px-4 py-4">
        <Link href="/feed" className="flex items-center gap-2 font-semibold">
          <span className="rounded-lg bg-primary/15 px-2 py-1 text-sm text-primary">
            KudosApp
          </span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isNavActive(pathname, href, label);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
        <Link
          href={profileHref}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            isNavActive(pathname, profileHref, "Profile")
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          <User className="h-4 w-4 shrink-0" aria-hidden />
          Profile
        </Link>
      </nav>
      <div className="border-t border-border p-3">
        {profile ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <UserAvatar
                user={{
                  displayName: profile.displayName,
                  avatarUrl: profile.avatarUrl,
                }}
                size="sm"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {profile.displayName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profile.totalPoints} pts
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full justify-center gap-2"
              onClick={() => void logout()}
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Log out
            </Button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Loading profile…</p>
        )}
      </div>
    </aside>
  );
}
