'use server';

import { db } from "@/db/client";
import { bookmarks, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import Exa from "exa-js";
import { revalidatePath } from "next/cache";

// Category Actions
export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const slug = formData.get("slug") as string;
  const color = formData.get("color") as string;
  const icon = formData.get("icon") as string;

  await db.insert(categories).values({
    name,
    description,
    slug,
    color,
    icon,
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateCategory(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const slug = formData.get("slug") as string;
  const color = formData.get("color") as string;
  const icon = formData.get("icon") as string;

  await db
    .update(categories)
    .set({
      name,
      description,
      slug,
      color,
      icon,
    })
    .where(eq(categories.id, id));

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteCategory(formData: FormData) {
  const id = formData.get("id") as string;

  await db.delete(categories).where(eq(categories.id, id));

  revalidatePath("/admin");
  revalidatePath("/");
}

// Bookmark Actions
export async function updateBookmark(formData: FormData) {
  const id = Number(formData.get("id"));
  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") ? Number(formData.get("categoryId")) : null;
  const excerpt = formData.get("excerpt") as string;
  const favicon = formData.get("favicon") as string;
  const ogImage = formData.get("ogImage") as string;
  const isFavorite = formData.get("isFavorite") === "true";
  const isArchived = formData.get("isArchived") === "true";

  await db
    .update(bookmarks)
    .set({
      title,
      url,
      description,
      categoryId,
      excerpt,
      favicon,
      ogImage,
      isFavorite,
      isArchived,
      updatedAt: new Date(),
    })
    .where(eq(bookmarks.id, id));

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/${encodeURIComponent(url)}`);
}

export async function deleteBookmark(formData: FormData) {
  const id = Number(formData.get("id"));
  const url = formData.get("url") as string;

  await db.delete(bookmarks).where(eq(bookmarks.id, id));

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/${encodeURIComponent(url)}`);
}

// URL Scraping Action
export async function scrapeUrl(prevState: any, formData: FormData) {
  const url = formData.get('url') as string;
  if (!url) return { data: null, error: 'URL is required' };
  
  const exa = new Exa("8e22846c-616f-4a1f-a677-db54533d1065");
  
  try {
    const result = await exa.getContents(
      [url],
      {
        subpages: 6,
        summary: true,
        text: true,
        livecrawl: "fallback"
      }
    );
    
    console.log(result);
    return { data: result, error: null };
  } catch (error) {
    console.error('Error scraping URL:', error);
    return { data: null, error: 'Failed to scrape URL' };
  }
}
