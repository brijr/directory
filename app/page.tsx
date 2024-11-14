// React /Next Imports
import React from "react";
import { Suspense } from "react";

// Database Imports
import { getAllBookmarks, getAllCategories } from "@/lib/data";

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
  const [bookmarks, categories] = await Promise.all([
    getAllBookmarks(),
    getAllCategories(),
  ]);

  const filteredBookmarks = bookmarks
    .filter((bookmark) => 
      !searchParams.category || bookmark.category?.id.toString() === searchParams.category
    )
    .filter((bookmark) => {
      if (!searchParams.search) return true;
      const searchTerm = searchParams.search.toLowerCase();
      return (
        bookmark.title.toLowerCase().includes(searchTerm) ||
        bookmark.description?.toLowerCase().includes(searchTerm) ||
        bookmark.category?.name.toLowerCase().includes(searchTerm) ||
        bookmark.notes?.toLowerCase().includes(searchTerm) ||
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
              <CategoryFilter 
                categories={categories.map(cat => ({
                  id: cat.id.toString(),
                  name: cat.name,
                  color: cat.color || undefined,
                  icon: cat.icon || undefined
                }))} 
              />
            </Suspense>

            <BookmarkGrid>
              {filteredBookmarks.map((bookmark) => (
                <BookmarkCard 
                  key={bookmark.id} 
                  bookmark={{
                    id: bookmark.id,
                    url: bookmark.url,
                    title: bookmark.title,
                    description: bookmark.description,
                    category: bookmark.category ? {
                      id: bookmark.category.id.toString(),
                      name: bookmark.category.name,
                      color: bookmark.category.color || undefined,
                      icon: bookmark.category.icon || undefined
                    } : undefined,
                    favicon: bookmark.favicon,
                    overview: bookmark.overview,
                    ogImage: bookmark.ogImage,
                    isArchived: bookmark.isArchived,
                    isFavorite: bookmark.isFavorite,
                    slug: bookmark.slug
                  }} 
                />
              ))}
            </BookmarkGrid>

            {filteredBookmarks.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                No bookmarks found
                {searchParams.search && ` matching "${searchParams.search}"`}
                {searchParams.category && ` in category "${categories.find(c => c.id.toString() === searchParams.category)?.name}"`}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </Main>
  );
}
