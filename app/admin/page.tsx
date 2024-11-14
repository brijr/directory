import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { getAllCategories } from "@/lib/data";
import { CategoryManager } from "./components/CategoryManager";
import { URLScraper } from "./components/URLScraper";

export default async function AdminPage() {
  const categories = await getAllCategories();

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-4xl font-bold">Admin Dashboard</h1>
      
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="scraper">URL Scraper</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories">
          <Card className="p-6">
            <CategoryManager categories={categories} />
          </Card>
        </TabsContent>
        
        <TabsContent value="scraper">
          <Card className="p-6">
            <URLScraper />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
