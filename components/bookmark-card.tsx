import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Bookmark } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Star, Archive } from "lucide-react";

interface BookmarkCardProps {
  bookmark: {
    id: number;
    url: string;
    title: string;
    description?: string | null;
    category?: {
      id: string;
      name: string;
      color?: string;
      icon?: string;
    };
    favicon?: string | null;
    excerpt?: string | null;
    ogImage?: string | null;
    isArchived: boolean;
    isFavorite: boolean;
  };
}

export const BookmarkCard = ({ bookmark }: BookmarkCardProps) => {
  return (
    <Link
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "not-prose group relative grid gap-2",
        "border bg-accent/50 p-1.5",
        "transition-all hover:bg-accent",
        bookmark.isArchived && "opacity-60",
      )}
    >
      {/* Status Icons */}
      <div className="absolute right-2 top-2 flex gap-1">
        {bookmark.isFavorite && (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
            <Star className="h-3 w-3" />
          </Badge>
        )}
        {bookmark.isArchived && (
          <Badge variant="secondary" className="bg-gray-500/10 text-gray-500">
            <Archive className="h-3 w-3" />
          </Badge>
        )}
      </div>

      {/* Bookmark Image */}
      <div className="relative aspect-video w-full overflow-hidden border">
        <Image
          src={bookmark.ogImage ?? "/placeholder.jpg"}
          fill
          className="object-cover"
          alt={bookmark.title}
        />
        {bookmark.favicon && (
          <div className="absolute bottom-2 left-2">
            <div className="h-6 w-6 overflow-hidden rounded-full border bg-white p-1">
              <Image
                src={bookmark.favicon}
                width={16}
                height={16}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
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
            {bookmark.title}
          </h3>
          {bookmark.category && (
            <Badge 
              variant="outline" 
              className="bg-background"
              style={{
                borderColor: bookmark.category.color || undefined,
                color: bookmark.category.color || undefined,
              }}
            >
              {bookmark.category.name}
            </Badge>
          )}
        </div>
        
        {/* Description or Excerpt */}
        <p className="line-clamp-2 max-w-full text-xs text-muted-foreground">
          {bookmark.description || bookmark.excerpt}
        </p>
      </div>
    </Link>
  );
};
