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
  const bookmark = await getBookmarkBySlug(params.slug);

  if (!bookmark) {
    notFound();
  }
  
  // Get parent metadata (e.g., from layout.tsx)
  const previousImages = (await parent).openGraph?.images || [];
  
  // Format category for metadata
  const categoryText = bookmark.category 
    ? `${bookmark.category.icon} ${bookmark.category.name}` 
    : undefined;

  return {
    title: `${bookmark.title} | Directory`,
    description: bookmark.description || bookmark.overview || `A curated bookmark from Directory`,
    
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

  // Redirect to the actual URL
  return (
    <meta
      httpEquiv="refresh"
      content={`0;url=${bookmark.url}`}
    />
  );
}
