// Next Imports
import { notFound } from "next/navigation";
import Link from "next/link";

// Database Imports
import { GetBookmarkBySlug } from "@/lib/data";

// Component Imports
import { Main, Section, Container, Article } from "@/components/craft";
import { Button } from "@/components/ui/button";

// Markdown Rendering
import ReactMarkdown from "react-markdown";

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await GetBookmarkBySlug(params.slug);

  if (data.length === 0) {
    notFound();
  }

  const bookmark = data[0];

  return (
    <Main>
      <Section>
        <Container>
          <div className="mb-12">
            <h1>{bookmark.title}</h1>
            <p>{bookmark.description}</p>
            <div className="flex gap-2 my-4">
              <Button className="not-prose">
                <Link
                  href={`${bookmark.url}?utm_source=designengineer.fyi`}
                  target="_blank"
                >
                  View More
                </Link>
              </Button>
              <Button variant="outline" className="not-prose">
                <Link href="/">Go Home</Link>
              </Button>
            </div>
          </div>

          <Article>
            <ReactMarkdown>{bookmark.summary}</ReactMarkdown>
          </Article>
        </Container>
      </Section>
    </Main>
  );
}
