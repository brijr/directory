import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container, Section } from "@/components/craft";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "designengineer.fyi | Resources for Design Engineers",
  description:
    "A collection of resources for design engineers. Categories include: animation libraries, component libraries, learning resources, inpiration, people, fonts, icons, and some other tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

const Header = () => {
  return (
    <header>
      <Container className="flex items-start justify-between gap-3">
        <Link href="/" className="transition-all hover:opacity-80">
          <Image
            src={Logo}
            className="dark:invert"
            alt="Design Engineer Logo"
            width={48}
            height={41.06}
          />
        </Link>
        <h1 className="text-sm text-muted-foreground">designengineer.fyi</h1>
      </Container>
    </header>
  );
};

const Footer = () => {
  return (
    <footer>
      <Container className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Created at{" "}
          <a
            className="underline transition-all hover:text-foreground"
            href="https://wip-design.com"
          >
            WIP
          </a>{" "}
          by{" "}
          <a
            className="underline transition-all hover:text-foreground"
            href="https://bridger.to"
          >
            Bridger
          </a>
          .
        </p>
        <ThemeToggle />
      </Container>
    </footer>
  );
};
