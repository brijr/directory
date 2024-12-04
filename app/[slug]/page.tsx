// Next Imports
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Balancer from "react-wrap-balancer";

// Database Imports
import { getBookmarkBySlug } from "@/lib/data";

// Component Imports
import { Section } from "@/components/craft";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/back-button";
import { Badge } from "@/components/ui/badge";

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

  // Get parent metadata (e.g., from layout.tsx)
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${bookmark.title} | Directory`,
    description:
      bookmark.description ||
      bookmark.overview ||
      `A curated bookmark from Directory`,

    // OpenGraph metadata for social sharing
    openGraph: {
      title: bookmark.title,
      description: bookmark.description || bookmark.overview || undefined,
      url: bookmark.url,
      images: [
        ...(bookmark.ogImage ? [bookmark.ogImage] : []),
        ...previousImages,
      ],
    },

    // Twitter metadata
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
        {/* Back Button */}
        <BackButton />

        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {bookmark.favicon && (
              <img
                src={bookmark.favicon || "/favicon.ico"}
                alt="Favicon"
                width={24}
                height={24}
                className="h-6 w-6 rounded-sm"
              />
            )}
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">
                <Balancer>{bookmark.title}</Balancer>
              </h1>
              {bookmark.category && (
                <Badge
                  style={{
                    backgroundColor: bookmark.category.color!,
                    color: "white",
                  }}
                  className="w-fit"
                >
                  {bookmark.category.icon} {bookmark.category.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          {bookmark.description && (
            <p className="text-lg text-muted-foreground">
              <Balancer>{bookmark.description}</Balancer>
            </p>
          )}
        </div>

        {/* Overview */}
        {bookmark.overview && (
          <div className="prose prose-gray max-w-none dark:prose-invert">
            <div className="rounded-lg bg-accent/50 p-6">
              <h2 className="mt-0 text-xl font-semibold">Overview</h2>
              <Markdown>{bookmark.overview}</Markdown>
            </div>
          </div>
        )}

        {/* Preview Image */}
        {bookmark.ogImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <img
              src={bookmark.ogImage || "/placeholder.jpg"}
              alt="OG Image"
              className="object-cover"
            />
          </div>
        )}

        {/* Visit Button */}
        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link href={bookmark.url} target="_blank" rel="noopener noreferrer">
              Visit Website
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
