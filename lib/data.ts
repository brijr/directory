import { db } from "@/db/client";
import { bookmarks } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Bookmark = typeof bookmarks.$inferSelect;

export async function getAllBookmarks(): Promise<Bookmark[]> {
  return await db.select().from(bookmarks).all();
}

export async function getBookmarkBySlug(slug: string): Promise<Bookmark[]> {
  return await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.slug, slug))
    .all();
}
