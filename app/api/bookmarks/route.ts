import { NextResponse } from 'next/server';
import { db } from '@/db/client';
import { bookmarks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const allBookmarks = await db.select().from(bookmarks);
    return NextResponse.json(allBookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Insert the new bookmark
    await db.insert(bookmarks).values({
      url: body.url,
      slug: body.slug,
      name: body.name,
      description: body.description || null,
      category: body.category || null,
      use_case: body.use_case || null,
      how_to_use: body.how_to_use || null,
      overview: body.overview || null,
      screenshot_url: body.screenshot_url || null,
    });

    return NextResponse.json({ message: 'Bookmark created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    );
  }
}
