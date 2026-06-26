import { create } from "zustand";

export interface User {
  name: string;
  username: string;
  email: string;
  mobile: string;
}

interface StoreState {
  user: User | null;
  categories: string[];
  notes: string;
  setUser: (user: User) => void;
  setCategories: (categories: string[]) => void;
  setNotes: (notes: string) => void;
  resetStore: () => void;
}

const getInitialNotes = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("super_app_notes") || "";
  }
  return "";
}

export const useStore = create<StoreState>((set) => ({
  user: null,
  categories: [],
  notes: getInitialNotes(),
  setUser: (user) => set({ user }),
  setCategories: (categories) => set({ categories }),
  setNotes: (notes) => {
    localStorage.setItem("super_app_notes", notes);
    set({ notes });
  },
  resetStore: () => set({ user: null, categories: [], notes: "" })
}));
