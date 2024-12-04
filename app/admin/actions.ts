"use server";

import { db } from "@/db/client";
import { bookmarks, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Exa from "exa-js";

export interface ActionState {
  success?: boolean;
  error?: string;
  message?: string;
  progress?: {
    current: number;
    total: number;
    currentUrl?: string;
    lastAdded?: string;
  };
}

interface ScrapeResult {
  error: string | null;
  data?: {
    title: string;
    description: string;
    favicon: string;
    ogImage: string;
  };
}

// Category Actions
export async function createCategory(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const slug = formData.get("slug") as string;
    const color = formData.get("color") as string;
    const icon = formData.get("icon") as string;
    const id = slug; // Using slug as the ID since it's unique

    await db.insert(categories).values({
      id,
      name,
      description,
      slug,
      color,
      icon,
    });

    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Error creating category:", err);
    return { error: "Failed to create category" };
  }
}

export async function updateCategory(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    if (!formData) {
      return { error: "No form data provided" };
    }

    const id = formData.get("id") as string;
    if (!id) {
      return { error: "No category ID provided" };
    }

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

    return { success: true };
  } catch (err) {
    console.error("Error updating category:", err);
    return { error: "Failed to update category" };
  }
}

export async function deleteCategory(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    if (!formData) {
      return { error: "No form data provided" };
    }

    const id = formData.get("id");
    if (!id) {
      return { error: "No category ID provided" };
    }

    // @ts-expect-error Database schema type mismatch
    await db.delete(categories).where(eq(categories.id, id));

    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("Error deleting category:", err);
    return { error: "Failed to delete category" };
  }
}

// Bookmark Actions
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createBookmark(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const url = formData.get("url") as string;
    let slug = formData.get("slug") as string;
    const overview = formData.get("overview") as string;
    const favicon = formData.get("favicon") as string;
    const ogImage = formData.get("ogImage") as string;
    const search_results = formData.get("search_results") as string;
    const categoryId = formData.get("categoryId") as string;
    const isFavorite = formData.get("isFavorite") === "true";
    const isArchived = formData.get("isArchived") === "true";

    // Generate slug if not provided
    if (!slug) {
      slug = generateSlug(title);
    }

    await db.insert(bookmarks).values({
      title,
      slug,
      url,
      description,
      categoryId: categoryId === "none" ? null : categoryId,
      search_results: search_results || null,
      isFavorite,
      isArchived,
      overview,
      favicon,
      ogImage,
    });

    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("Error creating bookmark:", err);
    return { error: "Failed to create bookmark" };
  }
}

export async function updateBookmark(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    if (!formData) {
      return { error: "No form data provided" };
    }

    const id = formData.get("id");
    if (!id) {
      return { error: "No bookmark ID provided" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const url = formData.get("url") as string;
    let slug = formData.get("slug") as string;
    const overview = formData.get("overview") as string;
    const favicon = formData.get("favicon") as string;
    const ogImage = formData.get("ogImage") as string;
    const search_results = formData.get("search_results") as string;
    const categoryId = formData.get("categoryId") as string;
    const isFavorite = formData.get("isFavorite") === "true";
    const isArchived = formData.get("isArchived") === "true";

    // Generate slug if not provided
    if (!slug) {
      slug = generateSlug(title);
    }

    await db
      .update(bookmarks)
      .set({
        title,
        slug,
        url,
        description,
        categoryId: categoryId === "none" ? null : categoryId,
        search_results: search_results || null,
        overview,
        favicon,
        ogImage,
        isFavorite,
        isArchived,
      })
      .where(eq(bookmarks.id, Number(id)));

    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("Error updating bookmark:", err);
    return { error: "Failed to update bookmark" };
  }
}

export async function deleteBookmark(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    if (!formData) {
      return { error: "No form data provided" };
    }

    const id = formData.get("id");
    if (!id) {
      return { error: "No bookmark ID provided" };
    }

    const url = formData.get("url") as string;

    await db.delete(bookmarks).where(eq(bookmarks.id, Number(id)));

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/${encodeURIComponent(url)}`);

    return { success: true };
  } catch (err) {
    console.error("Error deleting bookmark:", err);
    return { error: "Failed to delete bookmark" };
  }
}

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function bulkUploadBookmarks(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file provided" };
    }

    const text = await file.text();
    const rows = text
      .split("\n")
      .map((row) => row.trim())
      .filter((row) => row);

    // Skip header row if it exists
    const urls = rows[0].toLowerCase().includes("url") ? rows.slice(1) : rows;

    let successCount = 0;
    let errorCount = 0;
    let lastAddedTitle = "";

    // Process URLs sequentially with delay
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i].trim();
      if (!url) continue;

      try {
        // Add a 2-second delay between each request to avoid rate limits
        if (i > 0) {
          await delay(2000);
        }

        // Generate content for the URL
        const content = await generateContent(url, null);

        // Create the bookmark
        await db.insert(bookmarks).values({
          title: content.title,
          slug: content.slug,
          url: url,
          description: content.description,
          overview: content.overview,
          favicon: content.favicon,
          ogImage: content.ogImage,
          search_results: content.search_results,
          categoryId: null,
          isFavorite: false,
          isArchived: false,
        });

        successCount++;
        lastAddedTitle = content.title;

        // Revalidate after each successful addition
        revalidatePath("/admin");
        revalidatePath("/");
      } catch (err) {
        console.error(`Error processing URL: ${url}`, err);

        // Check if it's a rate limit error
        if (err instanceof Error && err.message.includes("rate limit")) {
          // Wait for 10 seconds before retrying
          await delay(10000);
          i--; // Retry the same URL
          continue;
        }

        errorCount++;
      }
    }

    return {
      success: true,
      message: `Successfully imported ${successCount} bookmarks. ${errorCount > 0 ? `Failed to import ${errorCount} URLs.` : ""}`,
      progress: {
        current: urls.length,
        total: urls.length,
        lastAdded: lastAddedTitle,
      },
    };
  } catch (err) {
    console.error("Error bulk uploading bookmarks:", err);
    return { error: "Failed to process bulk upload" };
  }
}

// URL Scraping Action
export async function scrapeUrl(
  prevState: ScrapeResult | null,
  formData: FormData,
): Promise<ScrapeResult> {
  try {
    const url = formData.get("url") as string;
    if (!url) return { error: "URL is required", data: undefined };

    const exa = new Exa(process.env.EXASEARCH_API_KEY as string);

    const result = await exa.getContents([url], {
      text: true,
      livecrawl: "fallback",
    });

    console.log("Scraped metadata:", result); // Debug log

    // Extract metadata from the first result
    const metadata =
      Array.isArray(result) && result.length > 0 ? result[0] : {};

    return {
      error: null,
      data: {
        title: metadata.title || "",
        description: metadata.description || "",
        favicon: metadata.favicon || "",
        ogImage: metadata.ogImage || metadata.image || "",
      },
    };
  } catch (err) {
    console.error("Error scraping URL:", err);
    return { error: "Failed to scrape URL", data: undefined };
  }
}

export async function generateContent(url: string, _: null) {
  try {
    if (!url) {
      throw new Error("URL is required");
    }

    // Get the base URL for the API
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "";

    // First, fetch metadata from our API
    const metadataResponse = await fetch(
      `${baseUrl}/api/metadata?url=${encodeURIComponent(url)}`,
      {
        method: "GET",
      }
    );

    if (!metadataResponse.ok) {
      const errorData = await metadataResponse.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch metadata");
    }

    const metadata = await metadataResponse.json();
    console.log("API metadata:", metadata); // Debug log

    // Generate a slug from the title
    const slug = generateSlug(metadata.title || "");

    return {
      title: metadata.title || "",
      description: metadata.description || "",
      url: url,
      overview: metadata.overview || "",
      search_results: null,
      favicon: metadata.favicon || "",
      ogImage: metadata.ogImage || "",
      slug: slug,
    };
  } catch (error) {
    console.error("Error generating content:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to generate content",
    };
  }
}
