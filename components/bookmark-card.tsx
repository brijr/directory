import Link from "next/link";
import Image from "next/image";

import { Bookmark } from "@/lib/data";
import { cn } from "@/lib/utils";

export const BookmarkCard = ({ bookmark }: { bookmark: Bookmark }) => {
  return (
    <Link
      href={bookmark.slug ?? "/"}
      className={cn(
        "not-prose group flex h-full flex-col gap-4",
        "border bg-accent/50 p-4",
        "transition-all hover:bg-accent/70",
      )}
    >
      <Image
        src={bookmark.screenshotUrl ?? ""}
        width={300}
        height={300}
        alt={bookmark.title ?? ""}
      />
      <h3
        className={cn(
          "underline-offset-4 group-hover:underline",
          "decoration-foreground/50 decoration-dotted",
          "text-lg leading-snug",
        )}
      >
        {bookmark.title}
      </h3>
    </Link>
  );
};
