'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Bookmark {
  url: string;
  slug: string;
  name: string;
  description: string | null;
  category: string | null;
  use_case: string | null;
  how_to_use: string | null;
  overview: string | null;
  screenshot_url: string | null;
}

export default function ManageBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    try {
      const response = await fetch('/api/bookmarks');
      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks');
      }
      const data = await response.json();
      setBookmarks(data);
      setError(null);
    } catch (err) {
      setError('Failed to load bookmarks');
      console.error('Error fetching bookmarks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete bookmark
  const handleDelete = async (url: string) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) {
      return;
    }

    try {
      const response = await fetch(`/api/bookmarks/${encodeURIComponent(url)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete bookmark');
      }

      // Refresh the bookmarks list
      fetchBookmarks();
    } catch (err) {
      console.error('Error deleting bookmark:', err);
      alert('Failed to delete bookmark. Please try again.');
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Bookmarks</h1>
        <Link 
          href="/admin" 
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Add New Bookmark
        </Link>
      </div>

      <div className="grid gap-4">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.url}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{bookmark.name}</h2>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline break-all"
                >
                  {bookmark.url}
                </a>
                {bookmark.description && (
                  <p className="mt-2 text-gray-600">{bookmark.description}</p>
                )}
                {bookmark.category && (
                  <p className="mt-1 text-sm text-gray-500">
                    Category: {bookmark.category}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleDelete(bookmark.url)}
                className="ml-4 text-red-500 hover:text-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {bookmarks.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No bookmarks found. Add some bookmarks to get started!
          </div>
        )}
      </div>
    </div>
  );
}
