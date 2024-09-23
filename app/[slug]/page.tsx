// Next Imports
import { notFound } from "next/navigation";

// Database Imports
import { db } from "@/db/client";
import { bookmarks } from "@/db/schema";
import { eq } from "drizzle-orm";

// Component Imports
import { Main, Section, Container, Article } from "@/components/craft";

// Markdown Rendering
import ReactMarkdown from "react-markdown";

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.slug, params.slug))
    .all();

  if (data.length === 0) {
    notFound();
  }

  const bookmark = data[0];

  return (
    <Main>
      <Section>
        <Container>
          <h1>{bookmark.title}</h1>
          <p>{bookmark.description}</p>
          <Article>
            <ReactMarkdown>{bookmark.summary}</ReactMarkdown>
          </Article>
        </Container>
      </Section>
    </Main>
  );
}
