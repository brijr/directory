"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

export const CategoryFilter = ({ categories }: { categories: Category[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const handleCategoryClick = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (categoryId === null || categoryId === currentCategory) {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="sticky top-4 z-10 mb-4 flex flex-wrap items-center gap-2 border bg-card p-2 shadow-sm">
      <p className="sr-only">Filter by category:</p>
      <Button
        variant={currentCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => handleCategoryClick(null)}
        className="min-w-[60px]"
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={currentCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick(category.id)}
          className={cn(
            "min-w-[60px]",
            currentCategory !== category.id && "hover:border-current"
          )}
          style={{
            '--category-color': category.color || 'currentColor',
            borderColor: currentCategory !== category.id ? category.color : undefined,
            color: currentCategory !== category.id ? category.color : undefined,
          } as React.CSSProperties}
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
  );
};
