import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Star, Archive, ExternalLink, Bookmark } from "lucide-react";
import { Button } from "./ui/button";

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
    overview?: string | null;
    ogImage?: string | null;
    isArchived: boolean;
    isFavorite: boolean;
    slug: string;
  };
}

export const BookmarkCard = ({ bookmark }: BookmarkCardProps) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card",
        "transition-all duration-300 hover:shadow-lg",
        "hover:ring-2 hover:ring-accent hover:ring-offset-2",
        bookmark.isArchived && "opacity-75 hover:opacity-100",
      )}
    >
      {/* Status Indicators */}
      <div className="absolute right-3 top-3 z-10 flex gap-1.5">
        {bookmark.isFavorite && (
          <Badge
            variant="secondary"
            className="bg-yellow-500/10 text-yellow-500 backdrop-blur-sm"
          >
            <Star className="h-3 w-3" aria-label="Favorite bookmark" />
          </Badge>
        )}
        {bookmark.isArchived && (
          <Badge
            variant="secondary"
            className="bg-gray-500/10 text-gray-500 backdrop-blur-sm"
          >
            <Archive className="h-3 w-3" aria-label="Archived bookmark" />
          </Badge>
        )}
      </div>

      {/* Card Content */}
      <Link
        href={`/${bookmark.slug}`}
        className="block space-y-3"
        aria-label={`View details for ${bookmark.title}`}
      >
        {/* Preview Image Container */}
        <div className="relative aspect-video w-full overflow-hidden">
          {bookmark.ogImage ? (
            <img
              src={bookmark.ogImage}
              alt={`Preview of ${bookmark.title}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <Bookmark className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="space-y-3 p-4">
          {/* Title and Favicon */}
          <div className="flex items-start gap-2">
            {bookmark.favicon ? (
              <img
                src={bookmark.favicon}
                alt=""
                className="h-4 w-4 rounded-sm"
                loading="lazy"
              />
            ) : (
              <Bookmark className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            )}
            <div className="space-y-1 flex-1">
              <h2 className="font-semibold leading-tight tracking-tight">
                {bookmark.title}
              </h2>
              {bookmark.description && (
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {bookmark.description}
                </p>
              )}
            </div>
          </div>

          {/* Category Badge */}
          {bookmark.category && (
            <Badge
              style={{
                backgroundColor: bookmark.category.color || 'hsl(var(--primary))',
                color: "white",
              }}
              className="w-fit transition-transform hover:scale-105"
            >
              {bookmark.category.icon} {bookmark.category.name}
            </Badge>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              className="w-full font-medium"
              asChild
            >
              <Link href={`/${bookmark.slug}`}>
                View Details
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full font-medium group/link"
              asChild
            >
              <Link
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                Visit Site
                <ExternalLink className="ml-2 h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};
