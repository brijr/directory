import { db } from "@/db/client";
import { bookmarks } from "@/db/schema";
import { Main, Section, Container } from "@/components/craft";

export default async function Home() {
  const data = await db.select().from(bookmarks).all();
  console.log(data);

  return (
    <Main>
      <Section>
        <Container>
          <h1>Welcome to the Directory Template</h1>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </Container>
      </Section>
    </Main>
  );
}
