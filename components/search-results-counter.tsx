'use client';

import { useSearchParams } from 'next/navigation';

interface SearchResultsCounterProps {
  totalResults: number;
}

export function SearchResultsCounter({ totalResults }: SearchResultsCounterProps) {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search');
  const category = searchParams.get('category');

  return (
    <div className="text-sm text-gray-500 text-center">
      Found {totalResults} bookmark{totalResults !== 1 ? 's' : ''}
      {searchTerm && ` matching "${searchTerm}"`}
      {category && ` in category "${category}"`}
    </div>
  );
}
