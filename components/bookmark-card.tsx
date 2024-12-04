"use client";

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
  const detailsUrl = `/${bookmark.slug}`;
  const externalUrl = bookmark.url;

  return (
    <div
      className={cn(
        "not-prose",
        "group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card",
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

      {/* Preview Image Container */}
      <Link
        href={detailsUrl}
        className="relative aspect-video w-full overflow-hidden border-b focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        aria-label={`View details for ${bookmark.title}`}
      >
        {bookmark.ogImage ? (
          <img
            src={bookmark.ogImage}
            alt="Open Graph preview"
            width={300}
            height={200}
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <Bookmark
              className="h-8 w-8 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        )}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title and Description */}
        <div className="flex-1 space-y-1">
          <h2 className="font-semibold leading-tight tracking-tight">
            {bookmark.title}
          </h2>
          {bookmark.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {bookmark.description}
            </p>
          )}
        </div>

        {/* Bottom Section */}
        <div className="space-y-3 pt-4">
          {/* Category and Site Info */}
          <div className="flex items-center gap-2">
            {bookmark.favicon ? (
              <img
                src={bookmark.favicon}
                alt="Site favicon"
                width={16}
                height={16}
                className="h-4 w-4"
              />
            ) : (
              <Bookmark
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            )}
            {bookmark.category && (
              <Badge
                style={{
                  backgroundColor:
                    bookmark.category.color || "hsl(var(--primary))",
                  color: "white",
                }}
                className="w-fit transition-transform hover:scale-105"
              >
                {bookmark.category.icon} {bookmark.category.name}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="w-full font-medium"
              asChild
            >
              <Link href={detailsUrl}>View Details</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="group/link w-full font-medium"
              asChild
            >
              <Link
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center"
              >
                Visit Site
                <ExternalLink className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
