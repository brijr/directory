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
  DialogTrigger,
  DialogDescription,
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
  bulkUploadBookmarks,
  type ActionState,
} from "../actions";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Upload } from "lucide-react";
import { Trash2 } from "lucide-react";
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

  const [bulkUploadState, setBulkUploadState] = useState<ActionState | null>(
    null,
  );
  const [isUploading, setIsUploading] = useState(false);

  const [bookmarkToDelete, setBookmarkToDelete] =
    useState<BookmarkWithCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (bulkUploadState?.success) {
      if (
        bulkUploadState.progress?.current === bulkUploadState.progress?.total
      ) {
        toast.success(
          bulkUploadState.message || "Bookmarks uploaded successfully",
        );
        setIsUploading(false);
        setIsDialogOpen(false);
        setBulkUploadState(null);
      } else if (bulkUploadState.progress?.lastAdded) {
        toast.success(`Added: ${bulkUploadState.progress.lastAdded}`);
      }
    } else if (bulkUploadState?.error) {
      toast.error(bulkUploadState.error);
      if (
        !bulkUploadState.progress ||
        bulkUploadState.progress.current === bulkUploadState.progress.total
      ) {
        setIsUploading(false);
      }
    }
  }, [bulkUploadState]);

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

  const handleDelete = async (bookmark: BookmarkWithCategory) => {
    try {
      setIsDeleting(true);
      const formData = new FormData();
      formData.append("id", bookmark.id.toString());

      const result = await deleteBookmark(null, formData);

      if (result.success) {
        toast.success("Bookmark deleted successfully");
        setBookmarkToDelete(null);
      } else {
        toast.error(result.error || "Failed to delete bookmark");
      }
    } catch (error) {
      toast.error("Failed to delete bookmark");
    } finally {
      setIsDeleting(false);
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

  const handleBulkUpload = async (formData: FormData) => {
    try {
      setIsUploading(true);
      const result = await bulkUploadBookmarks(null, formData);

      if (result.success) {
        toast.success(result.message);
      } else if (result.error) {
        toast.error(result.error);
      }

      setBulkUploadState(result);
    } catch (error) {
      toast.error("Failed to upload bookmarks");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Bookmarks</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {bookmarks.length} bookmarks
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Bulk Upload Bookmarks</DialogTitle>
                <DialogDescription>
                  Upload a CSV file with a list of URLs to import. Each URL will
                  be processed with a short delay to avoid rate limits.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleBulkUpload(new FormData(e.currentTarget));
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="file">Upload CSV File</Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept=".csv,text/csv"
                    required
                    disabled={isUploading}
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Upload a CSV file with a list of URLs (one per line). The
                    first row can optionally contain a header.
                  </p>
                </div>
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Processing URLs...</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This may take a while. Please keep this window open.
                    </p>
                  </div>
                )}
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload and Process"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <Button onClick={onNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Bookmark
          </Button>
        </div>
      </div>

      <Dialog
        open={!!bookmarkToDelete}
        onOpenChange={(open) => !open && setBookmarkToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Bookmark</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{bookmarkToDelete?.title}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBookmarkToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => bookmarkToDelete && handleDelete(bookmarkToDelete)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                    variant="ghost"
                    size="icon"
                    onClick={() => setBookmarkToDelete(bookmark)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
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
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-+|-+$/g, ""),
                      }))
                    }
                    pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                    title="Lowercase letters, numbers, and hyphens only. No spaces."
                    placeholder="my-custom-slug"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const newSlug = generateSlug(formData.title);
                      setFormData((prev) => ({ ...prev, slug: newSlug }));
                    }}
                    className="shrink-0"
                  >
                    Generate from Title
                  </Button>
                </div>
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
