import { sql } from "drizzle-orm";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const fooTable = sqliteTable("foo", {
  bar: text("bar").notNull().default("Hey!"),
});
