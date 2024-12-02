"use server";

import { db } from "@/db/client";
import { bookmarks, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Exa from "exa-js";

interface ActionState {
  success?: boolean;
  error?: string;
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
) {
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
) {
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
) {
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
) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const url = formData.get("url") as string;
    let slug = formData.get("slug") as string;
    const overview = formData.get("overview") as string;
    const favicon = formData.get("favicon") as string;
    const ogImage = formData.get("ogImage") as string;

    // Generate slug if not provided
    if (!slug) {
      slug = generateSlug(title);
    }

    const categoryId = formData.get("categoryId") as string;
    const search_results = formData.get("search_results") as string;
    const isFavorite = formData.get("isFavorite") === "true";
    const isArchived = formData.get("isArchived") === "true";

    await db.insert(bookmarks).values({
      title,
      slug,
      url,
      description,
      categoryId: categoryId || null,
      search_results: search_results || null,
      isFavorite,
      isArchived,
      overview,
      favicon,
      ogImage,
    });

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/${encodeURIComponent(url)}`);

    return { success: true };
  } catch (err) {
    console.error("Error creating bookmark:", err);
    return { error: "Failed to create bookmark" };
  }
}

export async function updateBookmark(
  prevState: ActionState | null,
  formData: FormData,
) {
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

    // Generate slug if not provided
    if (!slug) {
      slug = generateSlug(title);
    }

    const categoryId = formData.get("categoryId") as string;
    const search_results = formData.get("search_results") as string;

    await db
      .update(bookmarks)
      .set({
        title,
        slug,
        url,
        description,
        categoryId: categoryId || null,
        search_results: search_results || null,
        overview,
        favicon,
        ogImage,
      })
      .where(eq(bookmarks.id, Number(id)));

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/${encodeURIComponent(url)}`);

    return { success: true };
  } catch (err) {
    console.error("Error updating bookmark:", err);
    return { error: "Failed to update bookmark" };
  }
}

export async function deleteBookmark(
  prevState: ActionState | null,
  formData: FormData,
) {
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
      summary: true,
      text: true,
      livecrawl: "fallback",
    });

    console.log("Scraped metadata:", result); // Debug log

    // Extract metadata from the first result
    const metadata = Array.isArray(result) && result.length > 0 ? result[0] : {};

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

export async function generateContent(
  url: string,
  searchResults: string | null,
) {
  try {
    // Step 1: Get metadata from our API
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const metadataResponse = await fetch(
      `${baseUrl}/api/metadata?url=${encodeURIComponent(url)}`,
    );
    if (!metadataResponse.ok) {
      throw new Error("Failed to fetch metadata");
    }
    const metadata = await metadataResponse.json();
    console.log("API metadata:", metadata); // Debug log

    // Step 2: Get search results from Exa if not provided
    let finalSearchResults = searchResults;
    let exaSummary = "";
    if (!finalSearchResults) {
      try {
        const exa = new Exa(process.env.EXASEARCH_API_KEY as string);
        const results = await exa.search(url);
        console.log("Exa search results:", results); // Debug log

        // @ts-expect-error Search results type mismatch
        if (results?.results?.[0]?.summary) {
          // @ts-expect-error Summary type mismatch
          exaSummary = results.results[0].summary;
        }
        finalSearchResults = JSON.stringify(results);
      } catch (error) {
        console.error("Error fetching Exa search results:", error);
        throw new Error("Failed to fetch search results");
      }
    }

    // Step 3: Generate overview using Claude
    const response = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        searchResults: finalSearchResults,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate overview");
    }

    const data = await response.json();

    // Log the final data being returned
    const returnData = {
      title: metadata.title || "",
      description: exaSummary || metadata.description || "",
      url: url,
      overview: data.overview || "",
      search_results: finalSearchResults,
      favicon: metadata.favicon || "",
      ogImage: metadata.ogImage || "",
      slug: metadata.title ? generateSlug(metadata.title) : "",
    };
    console.log("Generated content:", returnData); // Debug log

    return returnData;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}
