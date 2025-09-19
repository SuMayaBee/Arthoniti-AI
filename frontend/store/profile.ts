import { create } from 'zustand';
import { getProfile, updateProfile, uploadProfileImage, type Profile } from '@/lib/api/auth';

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>;
  uploadImage: (file: File) => Promise<void>;
  clearProfile: () => void;
  setProfile: (profile: Profile) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    try {
      set({ loading: true, error: null });
      const profile = await getProfile();
      set({ profile, loading: false });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
        loading: false 
      });
    }
  },

  updateProfile: async (data) => {
    try {
      set({ loading: true, error: null });
      const updatedProfile = await updateProfile(data);
      set({ profile: updatedProfile, loading: false });
    } catch (error) {
      console.error('Failed to update profile:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update profile',
        loading: false 
      });
      throw error; // Re-throw so components can handle it
    }
  },

  uploadImage: async (file) => {
    try {
      set({ loading: true, error: null });
      const updatedProfile = await uploadProfileImage(file);
      set({ profile: updatedProfile, loading: false });
    } catch (error) {
      console.error('Failed to upload image:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to upload image',
        loading: false 
      });
      throw error;
    }
  },

  clearProfile: () => {
    set({ profile: null, loading: false, error: null });
  },

  setProfile: (profile) => {
    set({ profile });
  },
}));
