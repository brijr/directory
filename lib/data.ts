import { db } from "@/db/client";
import { bookmarks, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Bookmark = typeof bookmarks.$inferSelect;
export type Category = typeof categories.$inferSelect;

export async function getAllBookmarks(): Promise<(Bookmark & { category: Category | null })[]> {
  const results = await db
    .select({
      id: bookmarks.id,
      title: bookmarks.title,
      url: bookmarks.url,
      description: bookmarks.description,
      excerpt: bookmarks.excerpt,
      favicon: bookmarks.favicon,
      ogImage: bookmarks.ogImage,
      isFavorite: bookmarks.isFavorite,
      isArchived: bookmarks.isArchived,
      categoryId: bookmarks.categoryId,
      category: categories,
    })
    .from(bookmarks)
    .leftJoin(categories, eq(bookmarks.categoryId, categories.id));
  
  return results.map(row => ({
    ...row.bookmarks,
    category: row.categories,
  }));
}

export async function getAllCategories(): Promise<Category[]> {
  return await db.select().from(categories);
}

export async function getBookmarkById(id: number): Promise<(Bookmark & { category: Category | null }) | null> {
  const results = await db
    .select({
      id: bookmarks.id,
      title: bookmarks.title,
      url: bookmarks.url,
      description: bookmarks.description,
      excerpt: bookmarks.excerpt,
      favicon: bookmarks.favicon,
      ogImage: bookmarks.ogImage,
      isFavorite: bookmarks.isFavorite,
      isArchived: bookmarks.isArchived,
      categoryId: bookmarks.categoryId,
      category: categories,
    })
    .from(bookmarks)
    .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
    .where(eq(bookmarks.id, id))
    .limit(1);
  
  if (results.length === 0) return null;
  
  return {
    ...results[0].bookmarks,
    category: results[0].categories,
  };
}

export async function getBookmarkBySlug(url: string): Promise<(Bookmark & { category: Category | null })[]> {
  // Create a URL-safe slug from the bookmark URL by encoding it
  const encodedUrl = encodeURIComponent(url);
  
  const results = await db
    .select({
      id: bookmarks.id,
      title: bookmarks.title,
      url: bookmarks.url,
      description: bookmarks.description,
      excerpt: bookmarks.excerpt,
      favicon: bookmarks.favicon,
      ogImage: bookmarks.ogImage,
      isFavorite: bookmarks.isFavorite,
      isArchived: bookmarks.isArchived,
      categoryId: bookmarks.categoryId,
      category: categories,
    })
    .from(bookmarks)
    .leftJoin(categories, eq(bookmarks.categoryId, categories.id))
    .where(eq(bookmarks.url, decodeURIComponent(url)));

  return results.map(row => ({
    ...row.bookmarks,
    category: row.categories,
  }));
}
