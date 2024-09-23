import { db } from "@/db/client";
import { bookmarks } from "@/db/schema";
import { eq } from "drizzle-orm";

export const GetAllBookmarks = async () => {
  const data = await db.select().from(bookmarks).all();

  return data;
};

export const GetBookmarkBySlug = async (slug: string) => {
  const data = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.slug, slug))
    .all();

  return data;
};
