import { create } from 'zustand';

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthStore {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: AuthUser) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setUser: (user) => set({ user }),
  setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
  logout: () => set({ user: null, accessToken: null, refreshToken: null }),
}));
