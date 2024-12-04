"use client";

import { useState } from "react";
import { ResultDisplay } from "./ResultDisplay";
import { scrapeUrl } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Assuming toast is imported from here

interface ScrapeResult {
  error: string | null;
  data?: {
    title: string;
    description: string;
    favicon: string;
    ogImage: string;
  };
}

export function URLScraper() {
  const [url, setUrl] = useState(""); // New state variable for URL
  const [metadata, setMetadata] = useState<ScrapeResult | null>(null); // New state variable for metadata
  const onMetadataReceived = (data: ScrapeResult) => {
    setMetadata(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("url", url);

      const response = await scrapeUrl(null, formData);
      if (response?.data) {
        onMetadataReceived(response);
      } else {
        toast.error("Failed to fetch metadata");
      }
    } catch (error) {
      console.error("Error scraping URL:", error);
      toast.error("Failed to scrape URL");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">URL Scraper</h2>
        <p className="text-muted-foreground">
          Enter a URL to scrape its content and metadata.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="url">URL to scrape</Label>
          <Input
            type="url"
            name="url"
            id="url"
            required
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full">
          Scrape URL
        </Button>

        <ResultDisplay metadata={metadata} />
      </form>
    </div>
  );
}
