import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CategoryState {
  category: string;
  isLoading: boolean;
  setCategory: (category: string) => void;
}

export const useCategoryStore = create<CategoryState>()(
  devtools(
    set => ({
      category: null,
      isLoading: false,
      setCategory: category => set({ category }),
    }),
    { name: 'CategoryStore' },
  ),
);
