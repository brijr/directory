// Next Imports
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Balancer from "react-wrap-balancer";
// Database Imports
import { getBookmarkBySlug } from "@/lib/data";

// Component Imports
import { Main, Section, Container, Article } from "@/components/craft";
import { Button } from "@/components/ui/button";

// Markdown Rendering
import ReactMarkdown from "react-markdown";
import { BackButton } from "@/components/back-button";

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
            <div className="grid grid-cols-[2fr_1fr] items-start justify-between gap-2">
              <div className="space-y-2">
                <h1 className="text-xl font-medium">{bookmark.name}</h1>
                <p className="text-sm text-muted-foreground">
                  <Balancer>{bookmark.description}</Balancer>
                </p>
              </div>
              <div className="my-4 flex gap-2 justify-self-end">
                <Button className="not-prose">
                  <Link
                    href={`${bookmark.url}?utm_source=designengineer.fyi`}
                    target="_blank"
                  >
                    Visit Resource
                  </Link>
                </Button>
                <BackButton />
              </div>
            </div>
            <Link
              href={`${bookmark.url}?utm_source=designengineer.fyi`}
              target="_blank"
            >
              <Image
                src={bookmark.screenshot_url ?? "/placeholder.jpg"}
                width={1920}
                height={1080}
                alt={bookmark.name ?? "Design Engineer Resource"}
                className="my-8 rounded-md border shadow-sm"
              />
            </Link>
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
