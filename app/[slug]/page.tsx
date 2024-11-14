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

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const data = await getBookmarkBySlug(decodeURIComponent(params.slug));

  if (data.length === 0) {
    notFound();
  }

  const bookmark = data[0];
  
  // Get parent metadata (e.g., from layout.tsx)
  const previousImages = (await parent).openGraph?.images || [];
  
  // Format category for metadata
  const categoryText = bookmark.category 
    ? `${bookmark.category.icon} ${bookmark.category.name}` 
    : undefined;

  return {
    title: `${bookmark.title} | Directory`,
    description: bookmark.description || bookmark.excerpt || `A curated bookmark from Directory`,
    
    // OpenGraph metadata for social sharing
    openGraph: {
      title: bookmark.title,
      description: bookmark.description || bookmark.excerpt || undefined,
      url: bookmark.url,
      siteName: 'Directory',
      images: [
        bookmark.ogImage ? {
          url: bookmark.ogImage,
          width: 1200,
          height: 630,
          alt: bookmark.title,
        } : null,
        ...previousImages,
      ].filter(Boolean),
      type: 'website',
      locale: 'en_US',
    },
    
    // Twitter metadata
    twitter: {
      card: 'summary_large_image',
      title: bookmark.title,
      description: bookmark.description || bookmark.excerpt || undefined,
      images: bookmark.ogImage ? [bookmark.ogImage] : [],
    },
    
    // Additional metadata
    keywords: [
      'bookmark',
      'directory',
      bookmark.category?.name,
      'resource',
      'link',
    ].filter(Boolean),
    
    // Robots metadata
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Alternative languages and canonical URL
    alternates: {
      canonical: `/${encodeURIComponent(bookmark.url)}`,
    },
    
    // Additional metadata for rich results
    other: {
      'og:type': 'website',
      'og:site_name': 'Directory',
      'twitter:site': '@directory',
      'application-name': 'Directory',
      'apple-mobile-web-app-title': 'Directory',
      'theme-color': bookmark.category?.color || '#000000',
      ...(bookmark.favicon && { 'msapplication-TileImage': bookmark.favicon }),
    },
  };
}

export default async function Page({ params }: Props) {
  const data = await getBookmarkBySlug(decodeURIComponent(params.slug));

  if (data.length === 0) {
    notFound();
  }

  const bookmark = data[0];

  return (
    <main className="container mx-auto py-8">
      <Section>
        <div className="mb-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold">{bookmark.title}</h1>
                <p className="text-lg text-muted-foreground">
                  <Balancer>{bookmark.description}</Balancer>
                </p>
              </div>
              {bookmark.category && (
                <Badge
                  style={{
                    backgroundColor: bookmark.category.color,
                    color: 'white'
                  }}
                >
                  {bookmark.category.icon} {bookmark.category.name}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Site
                </Link>
              </Button>
              <BackButton />
            </div>
          </div>

          {bookmark.ogImage && (
            <Link
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block"
            >
              <Image
                src={bookmark.ogImage}
                width={1200}
                height={630}
                alt={bookmark.title}
                className="rounded-lg border shadow-sm transition-all hover:shadow-md"
              />
            </Link>
          )}
        </div>

        <div className="prose prose-slate max-w-none dark:prose-invert">
          {bookmark.excerpt && (
            <>
              <h2>About</h2>
              <p>{bookmark.excerpt}</p>
            </>
          )}
        </div>
      </Section>
    </main>
  );
}
