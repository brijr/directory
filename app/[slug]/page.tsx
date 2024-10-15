// Next Imports
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Database Imports
import { getBookmarkBySlug } from "@/lib/data";

// Component Imports
import { Main, Section, Container, Article } from "@/components/craft";
import { Button } from "@/components/ui/button";

// Markdown Rendering
import ReactMarkdown from "react-markdown";

export default async function Page({ params }: { params: { slug: string } }) {
  const data = await getBookmarkBySlug(params.slug);

  if (data.length === 0) {
    notFound();
  }

  const bookmark = data[0];

  return (
    <main>
      <Section>
        <Container>
          <div className="mb-12">
            <h1>{bookmark.name}</h1>
            <p>{bookmark.description}</p>
            <Image
              src={bookmark.screenshot_url ?? "/placeholder.jpg"}
              width={1920}
              height={1080}
              alt={bookmark.name ?? "Design Engineer Resource"}
              className="rounded-md"
            />
            <div className="my-4 flex gap-2">
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
            <SectionHeader>Overview</SectionHeader>
            <ReactMarkdown>{bookmark.overview}</ReactMarkdown>
            <SectionHeader>Use Case</SectionHeader>
            <ReactMarkdown>{bookmark.use_case}</ReactMarkdown>
            <SectionHeader>How to Use</SectionHeader>
            <ReactMarkdown>{bookmark.how_to_use}</ReactMarkdown>
          </Article>
        </Container>
      </Section>
    </main>
  );
}

const SectionHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mb-6 border-b pb-1">
      <h3 className="!text-xl !font-bold">{children}</h3>
    </div>
  );
};
