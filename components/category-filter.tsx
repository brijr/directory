"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";
import { useTransition } from "react";

interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

interface CategoryFilterProps {
  categories: Category[];
  totalResults: number;
}

export const CategoryFilter = ({
  categories,
  totalResults,
}: CategoryFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const searchTerm = searchParams.get("search");
  const [isPending, startTransition] = useTransition();

  const handleCategoryClick = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId === null || categoryId === currentCategory) {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    router.push(`/?${params.toString()}`);
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  }, 300);

  return (
    <div className="sticky top-4 z-10 mb-4 flex items-center justify-between space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            defaultValue={searchParams.get("search") ?? ""}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
            className="h-8 pl-8"
          />
          {isPending && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-foreground"></div>
            </div>
          )}
        </div>
        <Button
          variant={currentCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick(null)}
          className="min-w-[60px]"
        >
          All
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            size="sm"
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.icon && (
              <span className="mr-1" role="img" aria-label={category.name}>
                {category.icon}
              </span>
            )}
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
