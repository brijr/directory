import { NextResponse } from "next/server";
import { load } from "cheerio";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate and normalize URL
    let validUrl: URL;
    try {
      validUrl = new URL(url);
      // Add https if no protocol is specified
      if (!validUrl.protocol || validUrl.protocol === ":") {
        validUrl = new URL(`https://${url}`);
      }
    } catch (error) {
      console.error("Invalid URL format:", error);
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    console.log("Fetching metadata for URL:", validUrl.toString());

    const response = await fetch(validUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DirectoryBot/1.0; +http://localhost)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.statusText}` },
        { status: response.status },
      );
    }

    const html = await response.text();
    const $ = load(html);

    // Get favicon
    let faviconUrl =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      $('link[rel="apple-touch-icon"]').attr("href") ||
      "/favicon.ico"; // Default fallback

    // If favicon is relative, make it absolute
    if (faviconUrl && !faviconUrl.startsWith("http")) {
      try {
        faviconUrl = new URL(faviconUrl, validUrl.origin).toString();
      } catch (e) {
        console.warn("Failed to parse favicon URL:", e);
        faviconUrl = "/favicon.ico";
      }
    }

    // Get Open Graph image
    let ogImage =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content");

    // Make ogImage URL absolute if it's relative
    if (ogImage && !ogImage.startsWith("http")) {
      try {
        ogImage = new URL(ogImage, validUrl.origin).toString();
      } catch (e) {
        console.warn("Failed to parse ogImage URL:", e);
        ogImage = "";
      }
    }

    // Get title and description
    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").text().trim() ||
      validUrl.hostname;

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";

    const metadata = {
      favicon: faviconUrl,
      ogImage,
      title,
      description,
      url: validUrl.toString(),
    };

    console.log("Generated metadata:", metadata);

    return NextResponse.json(metadata);
  } catch (error) {
    const statusCode = error instanceof Error ? 500 : (error as { statusCode?: number }).statusCode || 500;
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error fetching metadata:", errorMessage);
    return NextResponse.json(
      { error: `Failed to fetch or parse metadata: ${errorMessage}` },
      { status: statusCode },
    );
  }
}
