ALTER TABLE `bookmarks` ADD `slug` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `bookmarks_slug_unique` ON `bookmarks` (`slug`);