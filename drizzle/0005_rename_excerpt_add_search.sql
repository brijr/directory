CREATE TABLE _temp_bookmarks AS SELECT * FROM bookmarks;
DROP TABLE bookmarks;

CREATE TABLE bookmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    description TEXT,
    category_id TEXT REFERENCES categories(id),
    overview TEXT,
    search_results TEXT,
    favicon TEXT,
    og_image TEXT,
    is_favorite INTEGER NOT NULL DEFAULT 0,
    is_archived INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

INSERT INTO bookmarks (
    id, title, slug, url, description, category_id,
    overview, favicon, og_image, is_favorite, is_archived,
    created_at, updated_at
)
SELECT 
    id, title, slug, url, description, category_id,
    excerpt, favicon, og_image, is_favorite, is_archived,
    created_at, updated_at
FROM _temp_bookmarks;

DROP TABLE _temp_bookmarks;
