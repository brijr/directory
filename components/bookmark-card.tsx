import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Bookmark } from "@/lib/data";
import { cn } from "@/lib/utils";

export const BookmarkCard = ({ bookmark }: { bookmark: Bookmark }) => {
  return (
    <Link
      href={bookmark.slug ?? "/"}
      className={cn(
        "not-prose group grid gap-2",
        "border bg-accent/50 p-1.5",
        "transition-all hover:bg-accent",
      )}
    >
      <Image
        src={bookmark.screenshot_url ?? "/placeholder.jpg"}
        width={295.33}
        height={166.99}
        alt={bookmark.name ?? "Design Engineer Resource"}
        className="border"
      />
      <div className="flex flex-col gap-3 px-1 pb-1 pt-1">
        <div className="grid grid-cols-[1fr_auto] items-start justify-between gap-2">
          <h3
            className={cn(
              "underline-offset-4 group-hover:underline",
              "decoration-foreground/50 decoration-dotted",
              "text-base leading-snug",
              "min-w-0 flex-1 overflow-hidden truncate",
            )}
          >
            {bookmark.name}
          </h3>
          <Badge variant="outline" className="bg-background">
            {bookmark.category}
          </Badge>
        </div>
        <p className="line-clamp-2 max-w-full text-xs text-muted-foreground">
          {bookmark.description}
        </p>
      </div>
    </Link>
  );
};
