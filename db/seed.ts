import { db } from "./client";
import { bookmarks, categories } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create categories
  console.log("Creating categories...");
  const categoryData = [
    {
      id: "development",
      name: "Development",
      description: "Programming and development resources",
      slug: "development",
      color: "#0ea5e9",
      icon: "💻"
    },
    {
      id: "design",
      name: "Design",
      description: "Design tools and inspiration",
      slug: "design",
      color: "#f43f5e",
      icon: "🎨"
    },
    {
      id: "productivity",
      name: "Productivity",
      description: "Tools and resources for getting things done",
      slug: "productivity",
      color: "#22c55e",
      icon: "⚡"
    },
    {
      id: "learning",
      name: "Learning",
      description: "Educational resources and tutorials",
      slug: "learning",
      color: "#8b5cf6",
      icon: "📚"
    }
  ];

  const createdCategories = await Promise.all(
    categoryData.map(async (category) => {
      const [result] = await db.insert(categories).values(category).returning();
      return result;
    })
  );

  console.log(`Created ${createdCategories.length} categories`);

  // Create bookmarks
  console.log("Creating bookmarks...");
  const bookmarkData = [
    {
      url: "https://github.com",
      title: "GitHub",
      slug: "github",
      description: "Where the world builds software",
      categoryId: createdCategories[0].id,
      favicon: "https://github.githubassets.com/favicons/favicon.svg",
      ogImage: "https://github.githubassets.com/images/modules/site/social-cards/homepage.png",
      overview: "GitHub is where over 100 million developers shape the future of software, together. Contribute to the open source community, manage your Git repositories...",
      isFavorite: true
    },
    {
      url: "https://figma.com",
      title: "Figma",
      slug: "figma",
      description: "The collaborative interface design tool",
      categoryId: createdCategories[1].id,
      favicon: "https://static.figma.com/app/icon/1/favicon.svg",
      ogImage: "https://cdn.sanity.io/images/599r6htc/localized/a279334dfd43febf8fec669011443159e9089cda-2400x1260.png?w=1200&q=70&fit=max&auto=format",
      overview: "Figma is the leading collaborative design tool for building meaningful products. Seamlessly design, prototype, develop, and collect feedback in a single platform.",
      isFavorite: true
    },
    {
      url: "https://notion.so",
      title: "Notion",
      slug: "notion",
      description: "All-in-one workspace",
      categoryId: createdCategories[2].id,
      favicon: "https://www.notion.so/images/favicon.ico",
      ogImage: "https://www.notion.so/cdn-cgi/image/format=auto,width=640,quality=100/front-static/shared/icons/notion-app-icon-3d.png",
      overview: "A new tool that blends your everyday work apps into one. It's the all-in-one workspace for you and your team.",
      isFavorite: true
    },
    {
      url: "https://www.coursera.org",
      title: "Coursera",
      slug: "coursera",
      description: "Learn without limits",
      categoryId: createdCategories[3].id,
      favicon: "https://d3njjcbhbojbot.cloudfront.net/web/images/favicons/favicon-v2-96x96.png",
      ogImage: "https://about.coursera.org/images/social/coursera-social.png",
      overview: "Join Coursera for free and learn online. Build skills with courses from top universities like Yale, Michigan, Stanford, and leading companies like Google and IBM.",
      isFavorite: false
    },
    {
      url: "https://react.dev",
      title: "React",
      slug: "react",
      description: "The library for web and native user interfaces",
      categoryId: createdCategories[0].id,
      favicon: "https://react.dev/favicon.ico",
      ogImage: "https://react.dev/images/og-home.png",
      overview: "React is the library for web and native user interfaces",
      isFavorite: true
    },
    {
      url: "https://dribbble.com",
      title: "Dribbble",
      slug: "dribbble",
      description: "Discover the world's top designers & creatives",
      categoryId: createdCategories[1].id,
      favicon: "https://cdn.dribbble.com/assets/favicon-b38525134603b9513174ec887944bde1a869eb6cd414f4d640ee48ab2a15a26b.ico",
      ogImage: "https://cdn.dribbble.com/assets/art-banners/manifest-banner-1-a9f45a6adc987f0f59d08a818ffe1832447d7d4fef78fefdda4f085f6dac6660.png",
      overview: "Dribbble is the leading destination to find & showcase creative work and home to the world's best design professionals.",
      isFavorite: false
    }
  ];

  const createdBookmarks = await Promise.all(
    bookmarkData.map(async (bookmark) => {
      const [result] = await db.insert(bookmarks).values(bookmark).returning();
      return result;
    })
  );

  console.log(`Created ${createdBookmarks.length} bookmarks`);
  console.log("✅ Seeding complete!");
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
