'use client';

import { useState } from 'react';
import { Bookmark, Category } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { createBookmark, updateBookmark, deleteBookmark } from '../actions';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';
import { Plus } from 'lucide-react';
import { useFormState } from 'react-dom';

interface BookmarkManagerProps {
  bookmarks: (Bookmark & { category: Category | null })[];
  categories: Category[];
}

export function BookmarkManager({ bookmarks, categories }: BookmarkManagerProps) {
  const [selectedBookmark, setSelectedBookmark] = useState<(Bookmark & { category: Category | null }) | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewBookmark, setIsNewBookmark] = useState(false);

  const [createState, createAction] = useFormState(createBookmark, null);
  const [updateState, updateAction] = useFormState(updateBookmark, null);

  // Handle form submission results
  if (createState?.success || updateState?.success) {
    toast.success(isNewBookmark ? 'Bookmark created successfully!' : 'Bookmark updated successfully!');
    setIsDialogOpen(false);
    window.location.reload(); // Refresh to show changes
  }

  if (createState?.error || updateState?.error) {
    toast.error(createState?.error || updateState?.error);
  }

  const onEdit = (bookmark: Bookmark & { category: Category | null }) => {
    setSelectedBookmark(bookmark);
    setIsNewBookmark(false);
    setIsDialogOpen(true);
  };

  const onNew = () => {
    setSelectedBookmark(null);
    setIsNewBookmark(true);
    setIsDialogOpen(true);
  };

  const onDelete = async (bookmark: Bookmark) => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      const formData = new FormData();
      formData.append('id', bookmark.id.toString());
      formData.append('url', bookmark.url);
      
      try {
        await deleteBookmark(formData);
        toast.success('Bookmark deleted successfully');
        window.location.reload();
      } catch (error) {
        toast.error('Failed to delete bookmark');
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Bookmarks</h2>
        <div className="flex items-center gap-4">
          <Button onClick={onNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Bookmark
          </Button>
          <div className="text-sm text-muted-foreground">
            {bookmarks.length} bookmarks
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookmarks.map((bookmark) => (
            <TableRow key={bookmark.id}>
              <TableCell>
                <div className="flex items-start gap-2">
                  {bookmark.favicon && (
                    <Image
                      src={bookmark.favicon}
                      alt=""
                      width={16}
                      height={16}
                      className="mt-1"
                    />
                  )}
                  <div>
                    <div className="font-medium">{bookmark.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {bookmark.url}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {bookmark.category && (
                  <Badge
                    style={{
                      backgroundColor: bookmark.category.color || '#666',
                      color: 'white',
                    }}
                  >
                    {bookmark.category.icon} {bookmark.category.name}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {bookmark.isFavorite && (
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
                      Favorite
                    </Badge>
                  )}
                  {bookmark.isArchived && (
                    <Badge variant="secondary" className="bg-gray-500/10 text-gray-500">
                      Archived
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(bookmark)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(bookmark)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isNewBookmark ? 'New Bookmark' : 'Edit Bookmark'}</DialogTitle>
          </DialogHeader>
          <form action={isNewBookmark ? createAction : updateAction} className="space-y-4">
            {!isNewBookmark && selectedBookmark && (
              <input
                type="hidden"
                name="id"
                value={selectedBookmark.id.toString()}
              />
            )}
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={selectedBookmark?.title}
                  required
                />
              </div>

              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  defaultValue={selectedBookmark?.url}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={selectedBookmark?.description || ''}
                />
              </div>

              <div>
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  name="categoryId"
                  defaultValue={selectedBookmark?.categoryId?.toString() || 'none'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  defaultValue={selectedBookmark?.excerpt || ''}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <Input
                    id="favicon"
                    name="favicon"
                    type="url"
                    defaultValue={selectedBookmark?.favicon || ''}
                  />
                </div>

                <div>
                  <Label htmlFor="ogImage">OG Image URL</Label>
                  <Input
                    id="ogImage"
                    name="ogImage"
                    type="url"
                    defaultValue={selectedBookmark?.ogImage || ''}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isFavorite"
                    name="isFavorite"
                    defaultChecked={selectedBookmark?.isFavorite || false}
                  />
                  <Label htmlFor="isFavorite">Favorite</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isArchived"
                    name="isArchived"
                    defaultChecked={selectedBookmark?.isArchived || false}
                  />
                  <Label htmlFor="isArchived">Archived</Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isNewBookmark ? 'Create Bookmark' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
