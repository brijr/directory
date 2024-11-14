'use client';

import { ResultDisplay } from "./components/ResultDisplay";
import AdminHeader from './components/AdminHeader';
import { scrapeUrl } from './actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";

export default function AdminPage() {
  const [state, formAction] = useFormState(scrapeUrl, null);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>URL Scraper</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="url">Enter URL to scrape</Label>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

