"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const CategoryFilter = ({ categories }: { categories: string[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  const handleCategoryClick = (category: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (category === null || category === currentCategory) {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="sticky top-4 z-10 mb-4 flex flex-wrap items-center gap-2 border bg-accent p-2 shadow-sm">
      <p className="sr-only">Filter by category:</p>
      <Button
        variant={currentCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => handleCategoryClick(null)}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={currentCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};