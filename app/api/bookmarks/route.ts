import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { bookmarks } from "@/db/schema";

export async function GET() {
  try {
    const allBookmarks = await db.select().from(bookmarks);
    return NextResponse.json(allBookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Insert the new bookmark
    await db.insert(bookmarks).values({
      url: body.url,
      title: body.title,
      slug: body.slug,
      description: body.description || null,
      categoryId: body.categoryId || null,
      overview: body.overview || null,
      favicon: body.favicon || null,
      screenshot: body.screenshot || null,
      ogImage: body.ogImage || null,
      ogTitle: body.ogTitle || null,
      ogDescription: body.ogDescription || null,
      notes: body.notes || null,
      tags: body.tags || null,
      isArchived: body.isArchived || false,
      isFavorite: body.isFavorite || false,
      search_results: body.search_results || null,
    });

    return NextResponse.json(
      { message: "Bookmark created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating bookmark:", error);
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 },
    );
  }
}
