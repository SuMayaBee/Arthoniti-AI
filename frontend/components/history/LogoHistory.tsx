'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { StarIcon } from '@/components/icons/star-icon';
import HistoryLoader from '@/components/history-loader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  deleteLogo,
  getAllLogosForUser,
  type LogoResponse,
} from '@/lib/api/logo';

function getUserIdFromToken(): number | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/access_token=([^;]+)/);
  if (!match) return null;
  const token = match[1];
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user_id || null;
  } catch {
    return null;
  }
}

export default function LogoHistory() {
  const router = useRouter();
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [userLogos, setUserLogos] = useState<LogoResponse[]>([]);
  const [deletingLogoIds, setDeletingLogoIds] = useState<number[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [logoToDelete, setLogoToDelete] = useState<LogoResponse | null>(null);

  useEffect(() => {
    const loadUserLogos = async () => {
      const userId = getUserIdFromToken();
      if (!userId) return;
      setIsLoadingHistory(true);
      try {
        const logos = await getAllLogosForUser(userId);
        setUserLogos(logos);
      } catch {
        toast.error('Failed to load logo history');
      } finally {
        setIsLoadingHistory(false);
      }
    };
    loadUserLogos();
  }, []);

  const handleDeleteLogo = (logo: LogoResponse) => {
    setLogoToDelete(logo);
    setDeleteModalOpen(true);
  };

  const confirmDeleteLogo = async () => {
    if (!logoToDelete) return;
    setDeletingLogoIds((prev) => [...prev, logoToDelete.id]);
    try {
      await deleteLogo(logoToDelete.id);
      setUserLogos((prev) =>
        prev.filter((logo) => logo.id !== logoToDelete.id)
      );
      toast.success('Logo deleted successfully');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          'Failed to delete logo'
      );
    } finally {
      setDeletingLogoIds((prev) => prev.filter((id) => id !== logoToDelete.id));
      setDeleteModalOpen(false);
      setLogoToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setLogoToDelete(null);
  };

  return (
    <div>
      {isLoadingHistory ? (
        <HistoryLoader />
      ) : userLogos.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-gray-500">No logos generated yet</div>
            {/* Button to switch tabs is handled by parent; show a disabled hint button here */}
            <Button className="bg-primary-500" disabled>
              Generate Your First Logo
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 justify-items-center gap-5 md:grid-cols-2 xl:grid-cols-3">
          {userLogos.map((logo) => (
            <div
              className="flex w-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              key={logo.id}
            >
              <div className="mb-4">
                <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-gray-200">
                  <Image
                    alt={`${logo.logo_title} Logo`}
                    className="object-cover"
                    fill
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-logo.png';
                    }}
                    priority={false}
                    sizes="340px"
                    src={logo.logo_image_url}
                  />
                </div>
              </div>

              <div className="mb-5 flex items-center justify-between px-1">
                <span className="text-gray-600 text-sm">
                  <span className="font-semibold text-gray-700">Generate</span>{' '}
                  <span className="text-primary-600">
                    {new Date(logo.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </span>
                <button
                  aria-label="Favourite"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
                  type="button"
                >
                  <StarIcon size={20} />
                </button>
              </div>

              <div className="mt-auto flex items-center justify-between gap-4 px-1">
                <Button
                  className="flex-1 rounded-full border border-red-500 px-6 py-3 text-red-500 hover:bg-red-50"
                  disabled={deletingLogoIds.includes(logo.id)}
                  onClick={() => handleDeleteLogo(logo)}
                  variant="outline"
                >
                  {deletingLogoIds.includes(logo.id) ? 'Deleting...' : 'Delete'}
                </Button>
                <Button
                  className="flex-1 rounded-full border border-transparent bg-white px-6 py-3 text-primary-600 hover:bg-primary-50"
                  onClick={() =>
                    router.push(`/dashboard/logo-generator/${logo.id}`)
                  }
                  style={{
                    boxShadow:
                      'inset 0 0 0 1.5px #9E32DD, 0 0 0 1px rgba(0,0,0,0)',
                  }}
                  variant="outline"
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog onOpenChange={setDeleteModalOpen} open={deleteModalOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center font-semibold text-gray-900 text-lg">
              Are you sure you want to delete {logoToDelete?.logo_title}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600 text-sm">
              This will remove permanently from your device
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex w-full flex-col gap-3">
            <Button
              className="w-full bg-red-500 text-white hover:bg-red-600"
              disabled={deletingLogoIds.includes(logoToDelete?.id || 0)}
              onClick={confirmDeleteLogo}
            >
              {deletingLogoIds.includes(logoToDelete?.id || 0)
                ? 'Deleting...'
                : 'Yes'}
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
