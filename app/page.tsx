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
import { SearchBar } from "@/components/search-bar";
import { SearchResultsCounter } from "@/components/search-results-counter";

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const bookmarks = await getAllBookmarks();
  const categories = Array.from(
    new Set(bookmarks.map((bookmark) => bookmark.category)),
  ).filter((category): category is string => category !== null);

  const filteredBookmarks = bookmarks
    .filter((bookmark) => 
      !searchParams.category || bookmark.category === searchParams.category
    )
    .filter((bookmark) => {
      if (!searchParams.search) return true;
      const searchTerm = searchParams.search.toLowerCase();
      return (
        bookmark.name.toLowerCase().includes(searchTerm) ||
        bookmark.description?.toLowerCase().includes(searchTerm) ||
        bookmark.category?.toLowerCase().includes(searchTerm) ||
        bookmark.use_case?.toLowerCase().includes(searchTerm) ||
        bookmark.overview?.toLowerCase().includes(searchTerm)
      );
    });

  return (
    <Main>
      <Section>
        <Container>
          <h1 className="sr-only">
            Resources and Tools for Design Engineers / designengineer.fyi
          </h1>

          <div className="space-y-6">
            <SearchBar />
            <SearchResultsCounter totalResults={filteredBookmarks.length} />

            <Suspense fallback={<div>Loading categories...</div>}>
              <CategoryFilter categories={categories} />
            </Suspense>

            <BookmarkGrid>
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard key={bookmark.slug} bookmark={bookmark} />
              ))}
            </BookmarkGrid>

            {filteredBookmarks.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No bookmarks found
                {searchParams.search && ` matching "${searchParams.search}"`}
                {searchParams.category && ` in category "${searchParams.category}"`}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </Main>
  );
}
