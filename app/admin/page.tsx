import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { getAllCategories, getAllBookmarks } from "@/lib/data";
import { CategoryManager } from "./components/CategoryManager";
import { URLScraper } from "./components/URLScraper";
import { BookmarkManager } from "./components/BookmarkManager";
import { Section, Container } from "@/components/craft";

export default async function AdminPage() {
  const categories = await getAllCategories();
  const bookmarks = await getAllBookmarks();

  return (
    <Section>
      <Container>
        <h1 className="mb-8 text-4xl font-bold">Admin Dashboard</h1>
        
        <Tabs defaultValue="bookmarks">
          <TabsList>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
        
          <TabsContent value="bookmarks">
            <Card className="p-6">
              <BookmarkManager bookmarks={bookmarks} categories={categories} />
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card className="p-6">
              <CategoryManager categories={categories} />
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </Section>
  );
}
