/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
/** biome-ignore-all lint/style/useBlockStatements: <explanation> */
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HistoryLoader from "@/components/history-loader";
import { StarIcon } from "@/components/icons/star-icon";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api/client";

// TODO: Replace with real API once available
// Example shape for a website history item
export type WebsiteItem = {
  deployedUrl: string | undefined;
  id: string;
  title: string; // e.g., "SaaS Landing Page Create"
  prompt?: string; // optional source prompt
  preview_url: string; // image url for website snapshot
  created_at: string; // ISO date
};

// Extracted to top-level to satisfy linter and avoid recreating regex
const ACCESS_TOKEN_COOKIE_RE = /access_token=([^;]+)/;

type ApiProject = {
  id: number | string;
  title?: string;
  name?: string;
  prompt?: string;
  preview_url?: string;
  thumbnail?: string;
  created_at?: string;
  createdAt?: string;
  deployedUrl?: string;
  deployment_url?: string;
};

function getUserIdFromToken(): number | null {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie.match(ACCESS_TOKEN_COOKIE_RE);
  if (!match) {
    return null;
  }
  const token = match[1];
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id || null;
  } catch {
    return null;
  }
}

export default function WebsiteHistory() {
  const router = useRouter();
  const [items, setItems] = useState<WebsiteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [websiteToDelete, setWebsiteToDelete] = useState<WebsiteItem | null>(
    null
  );

  useEffect(() => {
    // Load websites for the current user from backend
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
    const load = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await apiClient.get(
          `/website-builder/projects/user/${userId}`
        );
        // Normalize various potential response shapes
        let list: ApiProject[] = [];
        if (Array.isArray(data)) {
          list = data as ApiProject[];
        } else if (Array.isArray((data as any)?.items)) {
          list = (data as any).items as ApiProject[];
        }
        const mapped: WebsiteItem[] = list.map((p) => ({
          id: String(p.id),
          title: String(p.title ?? p.name ?? "Untitled Website"),
          prompt: p.prompt ?? undefined,
          preview_url: p.preview_url || p.thumbnail || "/placeholder.jpg",
          created_at: p.created_at || p.createdAt || new Date().toISOString(),
          deployedUrl: p.deployedUrl,
        }));
        setItems(mapped);
      } catch (e: unknown) {
        // apiClient already toasts; keep a local error for empty state messaging
        const msg = e instanceof Error ? e.message : "Failed to load websites";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingIds((p) => [...p, id]);
    try {
      await apiClient.delete(`/website-builder/projects/${id}`);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (e: unknown) {
      // apiClient likely surfaces a toast; keep local error for optional display
      const msg = e instanceof Error ? e.message : "Failed to delete website";
      setError(msg);
    } finally {
      setDeletingIds((p) => p.filter((x) => x !== id));
    }
  };

  const confirmDelete = async () => {
    if (!websiteToDelete) return;
    await handleDelete(websiteToDelete.id);
    setDeleteModalOpen(false);
    setWebsiteToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setWebsiteToDelete(null);
  };

  const toggleFavorite = (id: string) => {
    const next = new Set(favorites);
    next.has(id) ? next.delete(id) : next.add(id);
    setFavorites(next);
  };

  if (isLoading) return <HistoryLoader />;

  if (items.length === 0)
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center text-gray-500">
          {error ? `Error: ${error}` : "No websites generated yet"}
        </div>
      </div>
    );

  return (
    <div className="relative">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            className="flex w-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            key={item.id}
          >
            <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              {item.deployedUrl ? (
                <iframe
                  className="h-full w-full p-2"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  src={item.deployedUrl}
                  title={`Preview of ${item.title}`}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <p className="text-gray-500">Site isn't deployed yet.</p>
                </div>
              )}
            </div>

            <div className="mb-2">
              <h3 className="line-clamp-2 font-semibold text-gray-900 text-lg">
                {item.title}
              </h3>
            </div>

            <div className="mb-3 flex w-full items-center justify-between gap-4 text-sm">
              <span className="text-gray-600">
                <span className="font-semibold text-gray-700">Generated</span>{" "}
                <span className="font-medium text-primary-600">
                  {new Date(item.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </span>
              <button
                aria-label="Toggle favorite"
                className="ml-2 rounded-full border border-gray-200 p-2 hover:bg-gray-50"
                onClick={() => toggleFavorite(item.id)}
                type="button"
              >
                <StarIcon
                  className={favorites.has(item.id) ? "text-yellow-500" : ""}
                />
              </button>
            </div>

            <div className="mt-auto flex items-center gap-3">
              <Button
                className="flex-1 rounded-full border-red-600 text-red-600 hover:bg-red-50 hover:text-red-600"
                disabled={deletingIds.includes(item.id)}
                onClick={() => {
                  setWebsiteToDelete(item);
                  setDeleteModalOpen(true);
                }}
                size="sm"
                variant="outline"
              >
                {deletingIds.includes(item.id) ? "Deleting..." : "Delete"}
              </Button>
              <Button
                className="flex-1 rounded-full border-primary-600 text-primary-600 hover:bg-primary-50 hover:text-primary-600"
                onClick={() => router.push(`/website/${item.id}`)}
                size="sm"
                variant="outline"
              >
                View
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog onOpenChange={setDeleteModalOpen} open={deleteModalOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center font-semibold text-gray-900 text-lg">
              Are you sure you want to delete this website?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600 text-sm">
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex w-full flex-col gap-3">
            <Button
              className="w-full bg-red-500 text-white hover:bg-red-600"
              disabled={
                websiteToDelete
                  ? deletingIds.includes(websiteToDelete.id)
                  : false
              }
              onClick={confirmDelete}
            >
              {websiteToDelete && deletingIds.includes(websiteToDelete.id)
                ? "Deleting..."
                : "Yes"}
            </Button>
            <Button
              className="w-full border-gray-300 text-gray-900 hover:bg-gray-50"
              onClick={cancelDelete}
              variant="outline"
            >
              No
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
