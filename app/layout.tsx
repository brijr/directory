import type { Metadata } from "next";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";
import "./globals.css";

import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/craft";
import { EmailForm } from "@/components/email-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Mail } from "lucide-react";

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
        <Subscribe />
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

const Subscribe = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center">
          <Mail className="mr-2 h-3 w-3" /> Subscribe
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Subscribe for more resources</DialogTitle>
          <DialogDescription>
            Get notified when new resources are added.
          </DialogDescription>
        </DialogHeader>
        <EmailForm />
        <div className="h-px" />
      </DialogContent>
    </Dialog>
  );
};
