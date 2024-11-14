-- Add slug column to bookmarks table
ALTER TABLE bookmarks ADD COLUMN slug TEXT NOT NULL DEFAULT '';

-- Update existing bookmarks with slugs based on titles
UPDATE bookmarks 
SET slug = LOWER(
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(title, ' ', '-'),
        '.', ''
      ),
      ',', ''
    ),
    "'", ''
  )
);

-- Make slug column unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookmarks_slug ON bookmarks(slug);

-- Remove the default value
ALTER TABLE bookmarks ALTER COLUMN slug DROP DEFAULT;
