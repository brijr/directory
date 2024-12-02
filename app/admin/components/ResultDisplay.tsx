'use client';

import { useFormStatus } from 'react-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

interface ScrapeResult {
  error: string | null;
  data?: {
    title: string;
    description: string;
    favicon: string;
    ogImage: string;
  };
}

interface ResultDisplayProps {
  metadata: ScrapeResult | null;
}

export function ResultDisplay({ metadata }: ResultDisplayProps) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    );
  }

  if (!metadata) return null;

  if (metadata.error) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertDescription>
          {metadata.error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Scraping Results</h2>
          <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[600px] text-sm">
            {JSON.stringify(metadata.data, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
