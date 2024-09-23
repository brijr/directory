import { sql } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").unique().notNull(),
  slug: text("slug").unique().notNull(),
});

export const bookmarks = sqliteTable("bookmarks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  description: text("description"),
  url: text("url").unique().notNull(),
  ogImage: text("og_image"),
  summary: text("summary"),
  screenshotName: text("screenshot_name"),
  screenshotUrl: text("screenshot_url"),
  slug: text("slug"),
  categoryId: integer("category_id").references(() => categories.id),
});
