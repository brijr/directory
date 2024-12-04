// Next Imports
import { notFound } from "next/navigation";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

// Database Imports
import { getBookmarkBySlug } from "@/lib/data";

// Component Imports
import { Section } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/back-button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Bookmark } from "lucide-react";

// Metadata
import { Metadata, ResolvingMetadata } from "next";
import Markdown from "react-markdown";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const bookmark = await getBookmarkBySlug(params.slug);

  if (!bookmark) {
    notFound();
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${bookmark.title} | Directory`,
    description:
      bookmark.description ||
      bookmark.overview ||
      `A curated bookmark from Directory`,
    openGraph: {
      title: bookmark.title,
      description: bookmark.description || bookmark.overview || undefined,
      url: bookmark.url,
      images: [
        ...(bookmark.ogImage ? [bookmark.ogImage] : []),
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: bookmark.title,
      description: bookmark.description || bookmark.overview || undefined,
      images: bookmark.ogImage ? [bookmark.ogImage] : [],
    },
  };
}

export default async function Page({ params }: Props) {
  const bookmark = await getBookmarkBySlug(params.slug);

  if (!bookmark) {
    notFound();
  }

  return (
    <Section>
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <BackButton />
          <Button variant="outline" size="sm" asChild>
            <Link
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group gap-2"
            >
              <span>Visit Website</span>
              <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        {/* Preview Image or Fallback */}
        <div className="overflow-hidden rounded-xl border bg-muted">
          <div className="relative aspect-[21/9]">
            {bookmark.ogImage ? (
              <img
                src={bookmark.ogImage}
                alt="Open Graph preview"
                width={300}
                height={200}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Bookmark
                  className="h-16 w-16 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        </div>

        {/* Header Content */}
        <div className="space-y-6">
          <div className="space-y-4">
            {/* Title and Favicon */}
            <div className="flex items-center gap-3">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  <Balancer>{bookmark.title}</Balancer>
                </h1>
                {bookmark.description && (
                  <p className="text-lg text-muted-foreground">
                    <Balancer>{bookmark.description}</Balancer>
                  </p>
                )}
              </div>
              {bookmark.favicon ? (
                <img
                  src={bookmark.favicon}
                  alt="Site favicon"
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-background p-1">
                  <Bookmark
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3">
              {bookmark.category && (
                <Badge
                  style={{
                    backgroundColor:
                      bookmark.category.color || "hsl(var(--primary))",
                    color: "white",
                  }}
                  className="h-6 gap-1 px-2 text-sm"
                >
                  {bookmark.category.icon} {bookmark.category.name}
                </Badge>
              )}
              {bookmark.createdAt && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={new Date(bookmark.createdAt).toISOString()}>
                    {new Date(bookmark.createdAt).toLocaleDateString()}
                  </time>
                </div>
              )}
            </div>
          </div>

          {/* Overview Section */}
          {bookmark.overview && (
            <div className="prose prose-gray max-w-none dark:prose-invert">
              <div className="rounded-xl bg-accent/50 p-6">
                <h2 className="mt-0 flex items-center gap-2 text-xl font-semibold">
                  Overview
                </h2>
                <Markdown
                  components={{
                    p: ({ children }) => (
                      <p className="my-4 leading-relaxed">{children}</p>
                    ),
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline decoration-accent decoration-2 underline-offset-2"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {bookmark.overview}
                </Markdown>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-center gap-4 pt-4">
          <Button asChild size="lg" variant="secondary">
            <Link href="/">Browse More</Link>
          </Button>
          <Button asChild size="lg">
            <Link
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group gap-2"
            >
              Visit Website
              <ExternalLink className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
