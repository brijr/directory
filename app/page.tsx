// Next Imports
import Link from "next/link";

// Database Imports
import { db } from "@/db/client";
import { bookmarks } from "@/db/schema";

// Component Imports
import { Main, Section, Container } from "@/components/craft";

export default async function Home() {
  const data = await db.select().from(bookmarks).all();
  console.log(data);

  return (
    <Main>
      <Section>
        <Container>
          <h1>Welcome to the Directory Template</h1>

          <BookmarkGrid>
            {data.map((bookmark) => (
              <BookmarkCard key={bookmark.slug} bookmark={bookmark} />
            ))}
          </BookmarkGrid>
        </Container>
      </Section>
    </Main>
  );
}

const BookmarkCard = ({
  bookmark,
}: {
  bookmark: typeof bookmarks.$inferSelect;
}) => {
  return (
    <Link href={bookmark.slug ?? "/"} className="hover:underline">
      {bookmark.title}
    </Link>
  );
};

const BookmarkGrid = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {children}
    </div>
  );
};
