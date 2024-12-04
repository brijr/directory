"use server";

import { db } from "@/db/client";
import { bookmarks, categories } from "@/db/schema";
import { generateSlug } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Exa from "exa-js";

export interface ActionState {
  success?: boolean;
  error?: string;
  message?: string;
  data?: any;
  progress?: {
    current: number;
    total: number;
    currentUrl?: string;
    lastAdded?: string;
  };
}

interface BookmarkData {
  title: string;
  description: string;
  url: string;
  overview: string;
  search_results: string;
  favicon: string;
  ogImage: string;
  slug: string;
  categoryId: string | null;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface GeneratedContent {
  title: string;
  description: string;
  url: string;
  overview: string;
  search_results: string;
  favicon: string;
  ogImage: string;
  slug: string;
  error?: string;
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
    const urls = formData.get("urls") as string;
    if (!urls) {
      return { error: "No URLs provided" };
    }

    const urlList = urls.split("\n").filter((url) => url.trim());
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < urlList.length; i++) {
      const url = urlList[i].trim();
      if (!url) continue;

      try {
        const content = await generateContent(url, null);
        if (content.error) {
          errorCount++;
          continue;
        }

        // Create bookmark data with proper types
        const bookmarkData: BookmarkData = {
          title: content.title,
          description: content.description,
          url: content.url,
          overview: content.overview,
          search_results: content.search_results,
          favicon: content.favicon,
          ogImage: content.ogImage,
          slug: content.slug,
          categoryId: null,
          isFavorite: false,
          isArchived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await db.insert(bookmarks).values(bookmarkData);

        successCount++;
        revalidatePath("/admin");
        revalidatePath("/[slug]");

        // Return progress update
        return {
          success: true,
          progress: {
            current: i + 1,
            total: urlList.length,
            lastAdded: content.title,
          },
        };
      } catch (error) {
        errorCount++;
        console.error(`Error processing URL ${url}:`, error);
      }
    }

    return {
      success: true,
      message: `Successfully imported ${successCount} bookmarks. ${errorCount > 0 ? `Failed to import ${errorCount} URLs.` : ""}`,
      progress: {
        current: urlList.length,
        total: urlList.length,
      },
    };
  } catch (error) {
    console.error("Error in bulk upload:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to process bulk upload",
    };
  }
}

// URL Scraping Action
export async function scrapeUrl(
  prevState: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    const url = formData.get("url") as string;
    if (!url) return { error: "URL is required" };

    // Get metadata from our API
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "";

    const metadataResponse = await fetch(
      `${baseUrl}/api/metadata?url=${encodeURIComponent(url)}`,
      {
        method: "GET",
      },
    );

    if (!metadataResponse.ok) {
      throw new Error("Failed to fetch metadata");
    }

    const metadata = await metadataResponse.json();

    // Get search results using Exa API
    const exaResponse = await fetch("https://api.exa.ai/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.EXASEARCH_API_KEY}`,
      },
      body: JSON.stringify({
        query: url,
        num_results: 5,
      }),
    });

    if (!exaResponse.ok) {
      throw new Error("Failed to fetch search results from Exa");
    }

    const searchResults = await exaResponse.json();

    return {
      success: true,
      data: {
        title: metadata.title || "",
        description: metadata.description || "",
        favicon: metadata.favicon || "",
        ogImage: metadata.ogImage || "",
        url: metadata.url || url,
        search_results: JSON.stringify(searchResults),
      },
    };
  } catch (error) {
    console.error("Error scraping URL:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to scrape URL",
    };
  }
}

export async function generateContent(
  url: string,
  _: null,
): Promise<GeneratedContent> {
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
      },
    );

    if (!metadataResponse.ok) {
      const errorData = await metadataResponse.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch metadata");
    }

    const metadata = await metadataResponse.json();
    console.log("API metadata:", metadata);

    // Get search results using Exa
    const exa = new Exa(process.env.EXASEARCH_API_KEY as string);
    const searchResults = await exa.getContents([url], {
      text: true,
      livecrawl: "fallback",
    });

    console.log("Exa search results:", searchResults);

    // Generate overview using Claude
    const overviewResponse = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: url,
        searchResults: JSON.stringify(searchResults),
      }),
    });

    if (!overviewResponse.ok) {
      throw new Error("Failed to generate overview");
    }

    const overviewData = await overviewResponse.json();
    console.log("Generated overview:", overviewData);

    // Generate a slug from the title
    const slug = generateSlug(metadata.title || "");

    return {
      title: metadata.title || "",
      description: metadata.description || "",
      url: metadata.url || url,
      overview: overviewData.overview || "",
      search_results: JSON.stringify(searchResults),
      favicon: metadata.favicon || "",
      ogImage: metadata.ogImage || "",
      slug: slug,
    };
  } catch (error) {
    console.error("Error generating content:", error);
    return {
      title: "",
      description: "",
      url: url,
      overview: "",
      search_results: "",
      favicon: "",
      ogImage: "",
      slug: "",
      error:
        error instanceof Error ? error.message : "Failed to generate content",
    };
  }
}
