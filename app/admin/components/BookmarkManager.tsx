"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  createBookmark,
  updateBookmark,
  deleteBookmark,
  generateContent,
} from "../actions";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Loader2 } from "lucide-react";
import type { Category, Bookmark } from "@/db/schema";

interface BookmarkWithCategory extends Bookmark {
  category: Category | null;
}

interface BookmarkManagerProps {
  categories: Category[];
  bookmarks: BookmarkWithCategory[];
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function BookmarkManager({
  bookmarks,
  categories,
}: BookmarkManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewBookmark, setIsNewBookmark] = useState(true);
  const [selectedBookmark, setSelectedBookmark] =
    useState<BookmarkWithCategory | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state management
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    url: "",
    description: "",
    overview: "",
    search_results: "",
    favicon: "",
    ogImage: "",
    categoryId: "none",
    isFavorite: false,
    isArchived: false,
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);

    const formDataToSubmit = new FormData(e.currentTarget);

    try {
      const response = isNewBookmark
        ? await createBookmark(null, formDataToSubmit)
        : await updateBookmark(null, formDataToSubmit);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(
          isNewBookmark ? "Bookmark created!" : "Bookmark updated!",
        );
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting bookmark:", error);
      toast.error("Failed to save bookmark");
    } finally {
      setIsSaving(false);
    }
  };

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isDialogOpen) {
      if (selectedBookmark) {
        setFormData({
          title: selectedBookmark.title,
          slug: selectedBookmark.slug,
          url: selectedBookmark.url,
          description: selectedBookmark.description || "",
          overview: selectedBookmark.overview || "",
          search_results: selectedBookmark.search_results || "",
          favicon: selectedBookmark.favicon || "",
          ogImage: selectedBookmark.ogImage || "",
          categoryId: selectedBookmark.categoryId?.toString() || "none",
          isFavorite: selectedBookmark.isFavorite,
          isArchived: selectedBookmark.isArchived,
        });
      } else {
        setFormData({
          title: "",
          slug: "",
          url: "",
          description: "",
          overview: "",
          search_results: "",
          favicon: "",
          ogImage: "",
          categoryId: "none",
          isFavorite: false,
          isArchived: false,
        });
      }
    }
  }, [isDialogOpen, selectedBookmark]);

  const onEdit = (bookmark: BookmarkWithCategory) => {
    setSelectedBookmark(bookmark);
    setIsNewBookmark(false);
    setIsDialogOpen(true);
  };

  const onNew = () => {
    setSelectedBookmark(null);
    setIsNewBookmark(true);
    setIsDialogOpen(true);
  };

  const onDelete = async (bookmark: BookmarkWithCategory) => {
    if (window.confirm("Are you sure you want to delete this bookmark?")) {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("id", bookmark.id.toString());

      try {
        await deleteBookmark(null, formData);
        toast.success("Bookmark deleted successfully");
        setIsDialogOpen(false);
        resetForm();
      } catch (err) {
        console.error("Error deleting bookmark:", err);
        toast.error("Failed to delete bookmark");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = generateSlug(title);
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let url = e.target.value.trim();
    if (url && !url.match(/^https?:\/\//)) {
      url = `https://${url}`;
    }
    setFormData((prev) => ({ ...prev, url }));
  };

  const handleGenerateContent = async (formData: FormData) => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      const url = formData.get("url") as string;
      const searchResults = formData.get("search_results") as string;

      if (!url) {
        toast.error("Please enter a URL first");
        return;
      }

      console.log("Generating content for URL:", url);
      const content = await generateContent(url, searchResults);
      console.log("Received content:", content);

      // Update form state with generated content
      setFormData((prev) => ({
        ...prev,
        title: content.title || prev.title,
        slug: content.slug || prev.slug,
        url: content.url || prev.url,
        description: content.description || prev.description,
        overview: content.overview || prev.overview,
        search_results: content.search_results || prev.search_results,
        favicon: content.favicon || prev.favicon,
        ogImage: content.ogImage || prev.ogImage,
      }));

      toast.success("Content generated successfully!");
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      url: "",
      description: "",
      overview: "",
      search_results: "",
      favicon: "",
      ogImage: "",
      categoryId: "none",
      isFavorite: false,
      isArchived: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Bookmarks</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {bookmarks.length} bookmarks
          </div>
          <Button onClick={onNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Bookmark
          </Button>
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
                  <img
                    src={bookmark.favicon || "/favicon.ico"}
                    alt=""
                    width={20}
                    height={20}
                    className="mt-1 h-5 w-5 rounded-sm"
                  />
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
                      backgroundColor: bookmark.category.color || "#666",
                      color: "white",
                    }}
                  >
                    {bookmark.category.icon} {bookmark.category.name}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {bookmark.isFavorite && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-500/10 text-yellow-500"
                    >
                      Favorite
                    </Badge>
                  )}
                  {bookmark.isArchived && (
                    <Badge
                      variant="secondary"
                      className="bg-gray-500/10 text-gray-500"
                    >
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
            <DialogTitle>
              {isNewBookmark ? "New Bookmark" : "Edit Bookmark"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isNewBookmark && selectedBookmark && (
              <input
                type="hidden"
                name="id"
                value={selectedBookmark.id.toString()}
              />
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="url">URL</Label>
                <div className="space-y-2">
                  <Input
                    id="url"
                    name="url"
                    type="url"
                    value={formData.url}
                    onChange={handleUrlChange}
                    placeholder="https://example.com"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isGenerating}
                    onClick={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget.closest("form");
                      if (form) {
                        handleGenerateContent(new FormData(form));
                      }
                    }}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Content"
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                  title="Lowercase letters, numbers, and hyphens only. No spaces."
                  placeholder="Generated from title"
                  readOnly
                />
              </div>

              <div>
                <Label htmlFor="overview">Overview</Label>
                <Textarea
                  id="overview"
                  name="overview"
                  value={formData.overview}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      overview: e.target.value,
                    }))
                  }
                  className="min-h-[100px]"
                />
              </div>

              <Input
                type="hidden"
                name="search_results"
                value={formData.search_results}
              />

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, categoryId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon URL</Label>
                  <div className="flex items-center gap-2">
                    <img
                      src={formData.favicon || "/favicon.ico"}
                      alt=""
                      width={20}
                      height={20}
                      className="h-5 w-5 rounded-sm"
                    />
                    <Input
                      id="favicon"
                      name="favicon"
                      type="url"
                      value={formData.favicon}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          favicon: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ogImage">OG Image URL</Label>
                  <div className="space-y-2">
                    <Input
                      id="ogImage"
                      name="ogImage"
                      type="url"
                      value={formData.ogImage}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          ogImage: e.target.value,
                        }))
                      }
                    />
                    <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                      <img
                        src={formData.ogImage || "/placeholder.jpg"}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isFavorite"
                    name="isFavorite"
                    checked={formData.isFavorite}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        isFavorite: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="isFavorite">Favorite</Label>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isArchived"
                    name="isArchived"
                    checked={formData.isArchived}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        isArchived: checked as boolean,
                      }))
                    }
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
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isNewBookmark ? (
                  "Create Bookmark"
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
