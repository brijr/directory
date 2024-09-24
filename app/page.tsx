// React /Next Imports
import React from "react";

// Database Imports
import { getAllBookmarks } from "@/lib/data";

// Component Imports
import { Main, Section, Container } from "@/components/craft";
import { BookmarkCard } from "@/components/bookmark-card";
import { BookmarkGrid } from "@/components/bookmark-grid";

export default async function Home() {
  const data = await getAllBookmarks();

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
