import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const bookmarks = sqliteTable("bookmarks", {
  url: text("url").primaryKey().notNull(),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  use_case: text("use_case"),
  how_to_use: text("how_to_use"),
  overview: text("overview"),
});
