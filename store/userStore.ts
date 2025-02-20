import { create } from 'zustand';

type UserStore = {
  user: string;
  setUser: (email: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: '',
  setUser: (email) => set({ user: email }),
}));
