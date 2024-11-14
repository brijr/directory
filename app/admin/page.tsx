'use client';

import { useState } from 'react';
import AdminHeader from './components/AdminHeader';

export default function AdminPage() {
  const [formData, setFormData] = useState({
    url: '',
    slug: '',
    name: '',
    description: '',
    category: '',
    use_case: '',
    how_to_use: '',
    overview: '',
    screenshot_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add bookmark');
      }

      // Clear form after successful submission
      setFormData({
        url: '',
        slug: '',
        name: '',
        description: '',
        category: '',
        use_case: '',
        how_to_use: '',
        overview: '',
        screenshot_url: '',
      });

      alert('Bookmark added successfully!');
    } catch (error) {
      console.error('Error adding bookmark:', error);
      alert('Failed to add bookmark. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <AdminHeader />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Add New Bookmark</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-1">URL *</label>
            <input
              type="url"
              id="url"
              name="url"
              required
              value={formData.url}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1">Slug *</label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="use_case" className="block text-sm font-medium mb-1">Use Case</label>
            <textarea
              id="use_case"
              name="use_case"
              value={formData.use_case}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="how_to_use" className="block text-sm font-medium mb-1">How to Use</label>
            <textarea
              id="how_to_use"
              name="how_to_use"
              value={formData.how_to_use}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="overview" className="block text-sm font-medium mb-1">Overview</label>
            <textarea
              id="overview"
              name="overview"
              value={formData.overview}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="screenshot_url" className="block text-sm font-medium mb-1">Screenshot URL</label>
            <input
              type="url"
              id="screenshot_url"
              name="screenshot_url"
              value={formData.screenshot_url}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Bookmark
          </button>
        </form>
      </div>
    </>
  );
}
