import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.svg";
import "./globals.css";
import { Manrope as Font } from "next/font/google";

import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/craft";
import { EmailForm } from "@/components/email-form";

import { directory } from "@/directory.config";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Mail } from "lucide-react";

const font = Font({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: directory.title,
  description: directory.description,
  metadataBase: new URL(directory.baseUrl),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
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
        <Analytics />
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
            alt="Design Engineer Logo"
            width={96}
            height={39.68}
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
        <div className="grid gap-1 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {directory.name}.
          </p>
          <p>
            Created at{" "}
            <a
              className="underline transition-all hover:text-foreground"
              href="https://9d8.dev"
            >
              9d8
            </a>{" "}
            by{" "}
            <a
              className="underline transition-all hover:text-foreground"
              href="https://bridger.to"
            >
              Bridger
            </a>{" "}
            and{" "}
            <a
              className="underline transition-all hover:text-foreground"
              href="https://cameron.so"
            >
              Cameron
            </a>
            .
          </p>
        </div>
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
