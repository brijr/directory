import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url, searchResults } = await request.json();

    if (!url || !searchResults) {
      return NextResponse.json(
        { error: "URL and search results are required" },
        { status: 400 },
      );
    }

    // Parse and format search results for better context
    let parsedResults;
    try {
      parsedResults = JSON.parse(searchResults);
    } catch (error) {
      console.warn("Failed to parse search results:", error);
      parsedResults = searchResults; // Use as is if already parsed
    }

    const prompt = `You are a helpful assistant that writes clear, concise summaries of web content.
    Based on the search results and content from ${url}, write a brief but comprehensive overview.

    Focus on:
    - The main purpose or value proposition
    - Key features or main points
    - Target audience or use cases
    - What makes it unique or noteworthy

    Format the response in markdown and keep it under 200 words. Make it engaging and informative.

    Context from the webpage:
    ${JSON.stringify(parsedResults, null, 2)}`;

    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    return NextResponse.json({ overview: text });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error generating overview:", errorMessage);
    return NextResponse.json(
      { error: `Failed to generate overview: ${errorMessage}` },
      { status: 500 },
    );
  }
}
