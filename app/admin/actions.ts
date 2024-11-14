'use server';

import { db } from "@/db/client";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import Exa from "exa-js";

// Category Actions
export async function createCategory(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const color = formData.get('color') as string;
  const icon = formData.get('icon') as string;
  
  if (!name) return { error: 'Name is required' };
  
  // Create URL-friendly slug
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  try {
    await db.insert(categories).values({
      name,
      description,
      color,
      icon,
      slug,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error creating category:', error);
    return { error: 'Failed to create category' };
  }
}

export async function updateCategory(prevState: any, formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const color = formData.get('color') as string;
  const icon = formData.get('icon') as string;
  
  if (!id || !name) return { error: 'ID and name are required' };
  
  try {
    await db.update(categories)
      .set({
        name,
        description,
        color,
        icon,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id));
    
    return { success: true };
  } catch (error) {
    console.error('Error updating category:', error);
    return { error: 'Failed to update category' };
  }
}

export async function deleteCategory(prevState: any, formData: FormData) {
  const id = parseInt(formData.get('id') as string);
  
  if (!id) return { error: 'ID is required' };
  
  try {
    await db.delete(categories).where(eq(categories.id, id));
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { error: 'Failed to delete category' };
  }
}

// URL Scraping Action
export async function scrapeUrl(prevState: any, formData: FormData) {
  const url = formData.get('url') as string;
  if (!url) return { data: null, error: 'URL is required' };
  
  const exa = new Exa("8e22846c-616f-4a1f-a677-db54533d1065");
  
  try {
    const result = await exa.getContents(
      [url],
      {
        subpages: 6,
        summary: true,
        text: true,
        livecrawl: "fallback"
      }
    );
    
    console.log(result);
    return { data: result, error: null };
  } catch (error) {
    console.error('Error scraping URL:', error);
    return { data: null, error: 'Failed to scrape URL' };
  }
}
