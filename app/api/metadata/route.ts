import { NextResponse } from 'next/server';
import { load } from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);

    // Get favicon
    let favicon = $('link[rel="icon"]').attr('href') ||
                 $('link[rel="shortcut icon"]').attr('href') ||
                 $('link[rel="apple-touch-icon"]').attr('href');

    // If favicon is relative, make it absolute
    if (favicon && !favicon.startsWith('http')) {
      const baseUrl = new URL(url);
      favicon = new URL(favicon, baseUrl.origin).toString();
    }

    // Get Open Graph image
    let ogImage = $('meta[property="og:image"]').attr('content');

    // Get title and description
    const title = $('meta[property="og:title"]').attr('content') || $('title').text();
    const description = $('meta[property="og:description"]').attr('content') || 
                       $('meta[name="description"]').attr('content');

    return NextResponse.json({
      favicon,
      ogImage,
      title,
      description
    });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}
