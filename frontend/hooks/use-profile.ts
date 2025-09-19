import { useEffect } from 'react';
import { useProfileStore } from '@/store/profile';

/**
 * Custom hook for easy access to profile data and actions
 * Automatically fetches profile on mount if not already loaded
 */
export function useProfile() {
  const { profile, loading, error, fetchProfile, updateProfile, uploadImage, clearProfile } = useProfileStore();

  useEffect(() => {
    // Only run on client side to avoid SSR API calls
    if (typeof window === 'undefined') return;
    
    // Fetch profile if not already loaded
    if (!profile && !loading) {
      fetchProfile();
    }
  }, [profile, loading, fetchProfile]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    uploadImage,
    clearProfile,
    // Convenience getters
    userName: profile?.name || '',
    userEmail: profile?.email || '',
    userImage: profile?.image_url || '',
    isAuthenticated: !!profile,
  };
}
