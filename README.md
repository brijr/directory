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
git clone https://github.com/yourusername/9d8-directory.git
cd 9d8-directory
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

- `DATABASE_URL`: Your SQLite database URL
- `ANTHROPIC_API_KEY`: For AI-powered features (optional)

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

Access the admin dashboard at `/admin` to:

- Add and manage bookmarks
- Create and organize categories
- Use AI to generate descriptions
- Preview bookmarks before saving
- Bulk import/export data

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/9d8-directory)

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

- Open an issue in the GitHub repository
- Check out the [documentation](https://directory.9d8.dev/docs)
- Join our [Discord community](https://discord.gg/your-server)
