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
        "border bg-accent/50 p-3",
        "transition-all hover:bg-accent/70",
      )}
    >
      <Image
        src={bookmark.screenshot_url ?? "/placeholder.jpg"}
        width={300}
        height={300}
        alt={bookmark.name ?? "Design Engineer Resource"}
      />
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
        <Badge variant="outline" className="text-xs">
          {bookmark.category}
        </Badge>
      </div>
      <p className="line-clamp-2 max-w-full text-xs text-muted-foreground">
        {bookmark.description}
      </p>
    </Link>
  );
};
