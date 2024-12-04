# 9d8/directory

A modern, AI-powered Next.js directory template for creating beautiful resource collections and bookmarks. Perfect for creating your own curated list of resources, bookmarks, or link directories. View the live demo at [directory.9d8.dev](https://directory.9d8.dev).

## Features

- 🚀 **Modern Stack**

  - Next.js 14+ with App Router
  - TypeScript for type safety
  - Tailwind CSS for styling
  - shadcn/ui components
  - Drizzle ORM with SQLite
  - Vercel Analytics integration

- 💡 **Smart Features**

  - AI-powered content suggestions using Anthropic
  - Automatic metadata extraction from URLs
  - Rich bookmark previews with favicons
  - Category-based organization with custom colors and icons

- 🎨 **Beautiful UI/UX**

  - Responsive card-based layout
  - Dark/light mode support
  - Custom category colors and icons
  - Clean and modern design
  - Radix UI primitives

- 🛠 **Developer Experience**

  - Database management with Drizzle Studio
  - Type-safe database operations
  - Easy deployment to Vercel
  - Comprehensive API routes
  - Environment variable validation

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── [slug]/            # Dynamic routes for bookmarks
│   ├── admin/             # Admin dashboard components
│   ├── api/               # API routes for CRUD operations
│   └── page.tsx           # Home page with bookmark grid
├── components/            # Reusable React components
│   ├── ui/               # shadcn/ui components
│   └── bookmark-card.tsx # Bookmark display component
├── db/                    # Database configuration
│   ├── client.ts         # Drizzle client setup
│   ├── schema.ts         # SQLite schema with categories & bookmarks
│   └── seed.ts           # Initial data seeding
├── lib/                   # Utility functions
│   ├── data.ts           # Data fetching utilities
│   └── utils.ts          # Helper functions
└── directory.config.ts    # Site configuration
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/9d8dev/directory.git
cd directory
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up your environment variables:

```bash
cp .env.example .env
```

Required environment variables:

### Database Configuration

- `TURSO_DATABASE_URL`: Your Turso SQLite database URL
- `TURSO_AUTH_TOKEN`: Authentication token for Turso database access

### Authentication

- `ADMIN_PASSWORD`: Password for accessing the `/admin` routes
  - Must be at least 8 characters
  - Used for admin dashboard authentication

### AI Features

- `ANTHROPIC_API_KEY`: Anthropic API key for AI features
  - Required for content generation
  - Get one at [Anthropic Console](https://console.anthropic.com)
- `EXASEARCH_API_KEY`: Exa API key for enhanced search capabilities
  - Powers the semantic search feature
  - Get one at [Exa](https://exa.ai)

### Email Features

- `LOOPS_API_KEY`: API key for email subscription functionality
  - Required for newsletter features
  - Get one at [Loops](https://loops.so)

### Site Configuration

- `NEXT_PUBLIC_SITE_URL`: Your site's public URL
  - Format: `https://yourdomain.com`
  - Used for generating OpenGraph images and links

You can copy the example environment file to get started:

```bash
cp .env.example .env
```

Then replace each value with your actual credentials. Make sure to keep your `.env` file secure and never commit it to version control.

4. Initialize the database:

```bash
pnpm db:generate   # Generate migrations
pnpm db:migrate    # Run migrations
pnpm db:seed      # Seed initial data (optional)
```

5. Run the development server:

```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The project uses a SQLite database with Drizzle ORM, featuring two main tables:

### Categories

- `id`: Unique identifier
- `name`: Category name
- `description`: Optional description
- `slug`: URL-friendly identifier
- `color`: Custom UI color
- `icon`: Custom icon name

### Bookmarks

- `id`: Unique identifier
- `url`: Resource URL
- `title`: Bookmark title
- `description`: Resource description
- `slug`: URL-friendly identifier
- `categoryId`: Related category
- `tags`: Comma-separated tags
- `favicon`: Website favicon URL

## Configuration

Edit `directory.config.ts` to customize your site:

```typescript
export const directory = {
  baseUrl: "https://your-domain.com",
  name: "Your Directory Name",
  title: "Your Site Title",
  description: "Your site description",
};
```

## Admin Dashboard

The admin dashboard at `/admin` provides a powerful interface for managing your directory. Here's what you can do:

### Managing Bookmarks

1. **Add Single Bookmark**

   - Navigate to Admin → Add Bookmark
   - Enter the URL and click "Fetch Data"
   - The system will automatically:
     - Extract metadata (title, description, favicon)
     - Generate AI-powered content suggestions
     - Create a URL-friendly slug
   - Review and edit the extracted information
   - Assign a category and set status (favorite, archived)
   - Click "Save" to add the bookmark

2. **Bulk Import**

   - Navigate to Admin → Bulk Import
   - Paste multiple URLs (one per line)
   - The system will process each URL automatically
   - Review the results and confirm the import
   - All bookmarks will inherit default settings

3. **Edit Bookmarks**

   - Navigate to Admin → Manage Bookmarks
   - Use filters to find specific bookmarks
   - Click on a bookmark to edit:
     - Update metadata
     - Change category
     - Toggle favorite/archived status
     - Modify URL or slug

### Managing Categories

1. **Create Categories**

   - Navigate to Admin → Categories
   - Click "New Category"
   - Set required fields:
     - Name
     - Description (optional)
     - Color (for UI customization)
     - Icon (supports any icon name)

2. **Edit Categories**

   - Click on any category to edit
   - Update name, description, color, or icon
   - Changes apply to all bookmarks in the category
   - Delete categories (bookmarks will be uncategorized)

### AI Features

The admin interface includes AI-powered features using Anthropic:

- **Content Generation**

  - Automatic description generation
  - Overview and context extraction
  - Search-optimized content suggestions

- **Metadata Extraction**
  - Smart title parsing
  - Description summarization
  - Favicon and OpenGraph image detection

### Keyboard Shortcuts

- `⌘ + K` - Open command palette
- `⌘ + S` - Save current form
- `⌘ + N` - New bookmark
- `⌘ + E` - Edit mode
- `⌘ + D` - Delete selected item

### API Integration

The admin interface is built on top of Next.js Server Actions, providing:

- Real-time updates
- Optimistic UI
- Error handling
- Progress tracking for bulk operations

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/9d8dev/directory)

The project is optimized for Vercel deployment with:

- Edge runtime support
- Automatic SQLite database setup
- Built-in analytics
- Zero-config deployment

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Some areas we'd love help with:

- Additional bookmark import sources
- Enhanced AI features
- New UI components
- Documentation improvements

## License

MIT License - feel free to use this template for your own projects!

## Support

For support:

- Open an issue in the [GitHub repository](https://github.com/9d8dev/directory)
- Check out the [documentation](https://directory.9d8.dev/docs)
- Join our [Discord community](https://discord.gg/your-server)
