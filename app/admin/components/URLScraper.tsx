"use client";

import { ResultDisplay } from "./ResultDisplay";
import { scrapeUrl } from '../actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";

export function URLScraper() {
  const [state, formAction] = useFormState(scrapeUrl, null);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">URL Scraper</h2>
        <p className="text-muted-foreground">
          Enter a URL to scrape its content and metadata.
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="url">URL to scrape</Label>
          <Input
            type="url"
            name="url"
            id="url"
            required
            placeholder="https://example.com"
          />
        </div>
        
        <Button type="submit" className="w-full">
          Scrape URL
        </Button>

        <ResultDisplay />
      </form>
    </div>
  );
}
