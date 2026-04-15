import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types";

type CategoryBadgeProps = {
  category: Pick<Category, "name" | "color">;
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="shrink-0 border-2 font-medium"
      style={{
        borderColor: category.color,
        color: category.color,
      }}
    >
      {category.name}
    </Badge>
  );
}
