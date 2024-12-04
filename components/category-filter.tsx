"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { useTransition } from "react";

export interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

interface CategoryFilterProps {
  categories: Category[];
}

const SEARCH_DEBOUNCE_MS = 300;

const SearchInput = ({
  defaultValue,
  onChange,
  isPending,
}: {
  defaultValue: string;
  onChange: (value: string) => void;
  isPending: boolean;
}) => (
  <div className="relative max-w-xs flex-1">
    <Search
      className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      aria-hidden="true"
    />
    <Input
      type="text"
      defaultValue={defaultValue}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search..."
      className="h-8 pl-8"
      aria-label="Search items"
    />
    {isPending && (
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <div
          className="h-3 w-3 animate-spin rounded-full border-b-2 border-foreground"
          aria-hidden="true"
        />
      </div>
    )}
  </div>
);

export const CategoryFilter = ({ categories }: CategoryFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const [isPending, startTransition] = useTransition();

  const handleCategoryClick = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId === null || categoryId === currentCategory) {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
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
  }, SEARCH_DEBOUNCE_MS);

  return (
    <div className="my-12 flex items-center justify-between space-y-2">
      <div className="flex items-center gap-2">
        <SearchInput
          defaultValue={searchParams.get("search") ?? ""}
          onChange={handleSearch}
          isPending={isPending}
        />
        <Button
          variant={currentCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick(null)}
          className="min-w-[60px]"
          aria-pressed={currentCategory === null}
        >
          All
        </Button>
      </div>
      <div
        className="!mt-0 flex flex-wrap gap-2"
        role="group"
        aria-label="Category filters"
      >
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={currentCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryClick(category.id)}
            aria-pressed={currentCategory === category.id}
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
