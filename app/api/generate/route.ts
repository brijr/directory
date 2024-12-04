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

    const prompt = `You are a helpful assistant that writes clear, concise summaries of web content. 
    Based on the search results below, write a brief overview of the webpage at ${url}. 
    Format the response in markdown, focusing on the key points and main value of the content.
    Keep it under 200 words and make it engaging.

    Search Results:
    ${searchResults}`;

    const { text } = await generateText({
      model: anthropic("claude-3-haiku-20240307"),
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return NextResponse.json({ overview: text });
  } catch (error) {
    console.error("Error generating overview:", error);
    return NextResponse.json(
      { error: "Failed to generate overview" },
      { status: 500 },
    );
  }
}
