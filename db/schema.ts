import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";

// Categories table
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull().unique(),
  color: text("color"), // For UI customization
  icon: text("icon"), // For UI customization
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

// Bookmarks table
export const bookmarks = sqliteTable("bookmarks", {
  // Core fields
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url").notNull().unique(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),

  // Organization
  categoryId: text("category_id").references(() => categories.id),
  tags: text("tags"), // Comma-separated tags

  // Metadata
  favicon: text("favicon"), // URL to the site's favicon
  screenshot: text("screenshot"), // URL to a screenshot of the page
  overview: text("overview"), // Short preview of the content

  // SEO and sharing
  ogImage: text("og_image"), // Open Graph image URL
  ogTitle: text("og_title"), // Open Graph title
  ogDescription: text("og_description"), // Open Graph description

  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  lastVisited: integer("last_visited", { mode: "timestamp" }),

  // User data
  notes: text("notes"), // Personal notes about the bookmark
  isArchived: integer("is_archived", { mode: "boolean" })
    .notNull()
    .default(false),
  isFavorite: integer("is_favorite", { mode: "boolean" })
    .notNull()
    .default(false),
  search_results: text("search_results"),
});

// Relations
export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  category: one(categories, {
    fields: [bookmarks.categoryId],
    references: [categories.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  bookmarks: many(bookmarks),
}));

// Type definitions
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;
