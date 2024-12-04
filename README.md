# 9d8/directory

![CleanShot 2024-12-04 at 16 52 10@2x](https://github.com/user-attachments/assets/6fcd8458-eb07-411d-b813-212b5b26b67e)


A modern, AI-powered Next.js directory template for creating beautiful resource collections and bookmarks. Perfect for creating your own curated list of resources, bookmarks, or link directories. View the live demo at [directory.9d8.dev](https://directory.9d8.dev).

## Overview

Built with modern web technologies and designed with a focus on user experience, this template provides everything you need to create a professional resource directory:

- **Resource Management**: Organize and share bookmarks with rich metadata
- **AI Integration**: Automatic content generation and smart categorization
- **Newsletter**: Built-in email subscription with Loops integration
- **Beautiful UI**: Responsive design with dark/light mode support
- **Admin Dashboard**: Powerful tools for content management

## Tech Stack

- **Framework**: Next.js 14+ with App Router and Server Actions
- **Database**: Turso (SQLite) with Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui components
- **AI**: Anthropic Claude for content generation
- **Search**: Exa for semantic search capabilities
- **Analytics**: Built-in Vercel Analytics

## Features

### For Users

- **Smart Search**: Search across titles, descriptions, and categories
- **Category Filtering**: Browse resources by custom categories
- **Responsive Design**: Works beautifully on all devices
- **Theme Support**: Automatic dark/light mode
- **Newsletter**: Subscribe for weekly resource updates

### For Admins

- **Secure Admin Panel**: Password-protected admin interface
- **Rich Content Editor**: Full-featured bookmark management
- **AI Assistance**: Automatic metadata extraction and content generation
- **Dashboard**: View statistics and manage content
- **Category Management**: Create and organize categories

## Quick Start

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

4. Initialize the database:

```bash
pnpm db:generate   # Generate migrations
pnpm db:migrate    # Run migrations
pnpm db:seed      # Seed initial data (optional)
```

5. Start the development server:

```bash
pnpm dev
```

## Admin Dashboard

The admin dashboard at `/admin` provides a powerful interface for managing your directory:

### Managing Bookmarks

1. **Add Single Bookmark**

   - Enter URL for automatic metadata extraction
   - AI-powered description and overview generation
   - Customize metadata and categorization
   - Set favorite/archived status

2. **Bulk Import**

   - Paste multiple URLs for batch processing
   - Automatic metadata extraction for all entries
   - Review and edit before final import

3. **Edit Bookmarks**
   - Update metadata and categories
   - Regenerate AI content
   - Manage bookmark status
   - View analytics and engagement

### Managing Categories

- Create custom categories with colors and icons
- Organize bookmarks into categories
- Edit category metadata
- View category statistics

### API Integration

The admin interface uses Next.js Server Actions for:

- Real-time updates
- Optimistic UI
- Error handling
- Progress tracking

## Customization

Edit `directory.config.ts` to customize your site:

```typescript
export const directory = {
  baseUrl: "https://your-domain.com",
  name: "Your Directory Name",
  title: "Your Site Title",
  description: "Your site description",
};
```

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

## Created by

Built at [9d8](https://9d8.dev) by [Bridger](https://bridger.to) and [Cameron](https://cameron.so).
