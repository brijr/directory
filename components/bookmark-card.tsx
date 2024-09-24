import Link from "next/link";
import Image from "next/image";

import { Bookmark } from "@/lib/data";
import { cn } from "@/lib/utils";

export const BookmarkCard = ({ bookmark }: { bookmark: Bookmark }) => {
  return (
    <Link
      href={bookmark.slug ?? "/"}
      className={cn(
        "group not-prose flex flex-col h-full gap-4",
        "border p-4 bg-accent/50",
        "hover:bg-accent/70 transition-all"
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
          "group-hover:underline underline-offset-4",
          "decoration-foreground/50 decoration-dotted",
          "text-lg leading-snug"
        )}
      >
        {bookmark.title}
      </h3>
    </Link>
  );
};
