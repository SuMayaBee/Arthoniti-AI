"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ArrowTurnRightIcon from "@/components/icons/ArrowTurnRightIcon";
import { StarIcon } from "@/components/icons/star-icon";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getBusinessGenerationHistory,
  deleteBusinessGeneration,
  type BusinessGenerationResponse,
} from '@/lib/api/business-generation';
import HistoryLoader from '@/components/history-loader';

function getUserIdFromToken(): number | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/access_token=([^;]+)/);
  if (!match) return null;
  const token = match[1];
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.user_id || null;
  } catch {
    return null;
}
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BusinessNameHistory() {
  const router = useRouter();

  const [history, setHistory] = useState<BusinessGenerationResponse[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [deletingGenerationIds, setDeletingGenerationIds] = useState<number[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [generationToDelete, setGenerationToDelete] = useState<BusinessGenerationResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }
      setIsLoadingHistory(true);
      try {
        const response = await getBusinessGenerationHistory(userId);
        setHistory(response.generations || []);
      } catch (error: any) {
        console.error("Failed to load history:", error);
        toast.error(error?.response?.data?.message || error.message || "Failed to load history");
      } finally {
        setIsLoadingHistory(false);
      }
    };
    load();
  }, []);

  const toggleFavorite = (id: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) newFavorites.delete(id);
    else newFavorites.add(id);
    setFavorites(newFavorites);
  };

  const handleDeleteGeneration = (generation: BusinessGenerationResponse) => {
    setGenerationToDelete(generation);
    setDeleteModalOpen(true);
  };

  const confirmDeleteGeneration = async () => {
    if (!generationToDelete) return;
    const generationId = generationToDelete.id;
    setDeletingGenerationIds((prev) => [...prev, generationId]);
    try {
      await deleteBusinessGeneration(generationId);
      setHistory((prev) => prev.filter((item) => item.id !== generationId));
      toast.success("Generation deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete generation:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete generation");
    } finally {
      setDeletingGenerationIds((prev) => prev.filter((id) => id !== generationId));
      setDeleteModalOpen(false);
      setGenerationToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setGenerationToDelete(null);
  };

  return (
    <div className="relative">
      {isLoadingHistory ? (
        <HistoryLoader />
      ) : history.length === 0 ? (
        <div className="flex items-center justify-center py-12">
    <HistoryLoader />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-8 min-h-[100vh">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="mb-4">
                {item.generated_names.slice(0, 5).map((name, i) => (
                  <div key={i} className="flex items-center gap-4 mb-3 last:mb-0">
                    <div className="flex-1">
                      <button className="w-full py-2 px-4 rounded-lg border border-gray-200 bg-white text-gray-700 text-left font-medium hover:bg-gray-50">
                        Name {i + 1}
                      </button>
                    </div>
                    <ArrowTurnRightIcon color="#9E32DD" />
                    <div className="flex-1">
                      <button className="w-full py-2 px-4 rounded-lg border border-gray-200 bg-white text-gray-900 text-left font-medium hover:bg-gray-50">
                        {name}
                      </button>
                    </div>
                  </div>
                ))}
                {item.generated_names.length > 5 && (
                  <div className="text-center text-sm text-gray-500 mt-2">
                    +{item.generated_names.length - 5} more names
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-wrap gap-6 text-sm">
                  <span className="text-gray-600">
                    Style:{" "}
                    <span className="text-primary-600 font-medium">
                      {item.name_tone}
                    </span>
                  </span>
                  <span className="text-gray-600">
                    Industry:{" "}
                    <span className="text-primary-600 font-medium">
                      {item.industry}
                    </span>
                  </span>
                  <br />
                  <span className="text-gray-600">
                    Generated{" "}
                    <span className="text-gray-900 font-medium">
                      {formatDate(item.created_at)}
                    </span>
                  </span>
                </div>
                <button
                  className="ml-2 p-2 rounded-full border border-gray-200 hover:bg-gray-50"
                  onClick={() => toggleFavorite(item.id)}
                >
                  <StarIcon className={favorites.has(item.id) ? "text-yellow-500" : ""} />
                </button>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 px-6 py-3 rounded-full border border-red-500 text-red-500 hover:bg-red-50"
                  onClick={() => handleDeleteGeneration(item)}
                  disabled={deletingGenerationIds.includes(item.id)}
                >
                  {deletingGenerationIds.includes(item.id) ? "Deleting..." : "Delete"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 px-6 py-3 rounded-full border border-transparent bg-white text-primary-600 hover:bg-primary-50"
                  style={{
                    boxShadow: "inset 0 0 0 1.5px #9E32DD, 0 0 0 1px rgba(0,0,0,0)",
                  }}
                  onClick={() => router.push(`/dashboard/business-name-generator/${item.id}`)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-lg font-semibold text-gray-900">
              Are you sure you want to delete this generation?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm text-gray-600">
              This will remove permanently from your device
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col gap-3 w-full">
            <Button
              onClick={confirmDeleteGeneration}
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              disabled={deletingGenerationIds.includes(generationToDelete?.id || 0)}
            >
              {deletingGenerationIds.includes(generationToDelete?.id || 0)
                ? "Deleting..."
                : "Yes"}
            </Button>
            <Button
              onClick={cancelDelete}
              variant="outline"
              className="w-full border-gray-300 text-gray-900 hover:bg-gray-50"
            >
              No
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default BusinessNameHistory;
