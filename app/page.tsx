// React /Next Imports
import React from "react";
import { Suspense } from "react";

// Database Imports
import { getAllBookmarks } from "@/lib/data";

// Component Imports
import { Main, Section, Container } from "@/components/craft";
import { BookmarkCard } from "@/components/bookmark-card";
import { BookmarkGrid } from "@/components/bookmark-grid";
import { CategoryFilter } from "@/components/category-filter";

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const bookmarks = await getAllBookmarks();
  const categories = Array.from(
    new Set(bookmarks.map((bookmark) => bookmark.category)),
  ).filter((category): category is string => category !== null);

  const filteredBookmarks = searchParams.category
    ? bookmarks.filter(
        (bookmark) => bookmark.category === searchParams.category,
      )
    : bookmarks;

  return (
    <Main>
      <Section>
        <Container>
          <h1 className="sr-only">
            Resources and Tools for Design Engineers / designengineer.fyi
          </h1>

          <Suspense fallback={<div>Loading categories...</div>}>
            <CategoryFilter categories={categories} />
          </Suspense>

          <BookmarkGrid>
            {filteredBookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.slug} bookmark={bookmark} />
            ))}
          </BookmarkGrid>
        </Container>
      </Section>
    </Main>
  );
}
