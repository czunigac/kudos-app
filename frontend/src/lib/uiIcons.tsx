import {
  Award,
  Flame,
  Heart,
  Lightbulb,
  Medal,
  Sparkles,
  Star,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

const byName: Record<string, LucideIcon> = {
  Lightbulb,
  Users,
  Star,
  Award,
  Heart,
  Sparkles,
  Trophy,
  Medal,
  Flame,
};

export function iconFromStoredName(name: string): LucideIcon {
  return byName[name] ?? Sparkles;
}
