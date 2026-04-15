import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types";

type UserAvatarProps = {
  user: Pick<UserProfile, "displayName" | "avatarUrl">;
  size?: "sm" | "md" | "lg";
};

function initialsFromDisplayName(displayName: string) {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  }
  return displayName.slice(0, 2).toUpperCase() || "?";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
} as const;

export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  const initials = initialsFromDisplayName(user.displayName);

  return (
    <Avatar className={cn(sizeClasses[size])}>
      <AvatarImage src={user.avatarUrl} alt="" />
      <AvatarFallback className="bg-primary/10 font-medium text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
