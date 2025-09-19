import { create } from "zustand";
import { deleteCookie } from "@/lib/utils";

interface User {
  id: number;
  email: string;
  is_active: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (auth: boolean) => void;
  signout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user }),
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  signout: () => {
    deleteCookie("access_token");
    set({ user: null, isAuthenticated: false });
  },
}));
