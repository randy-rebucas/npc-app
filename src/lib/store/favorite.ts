import { create } from "zustand";
import { persist } from "zustand/middleware";

export type State = {
  favorites: string[];
};

export type Actions = {
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  reset: () => void;
};

export const INITIAL_FAVORITE_DATA: string[] = [];

export const useFavoriteStore = create<State & Actions>()(
  persist(
    (set) => ({
      favorites: INITIAL_FAVORITE_DATA,
      addFavorite: (id) =>
        set((state) => ({
          favorites: [...state.favorites, id],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((favorite) => favorite !== id),
        })),
      reset: () =>
        set(() => ({
          favorites: INITIAL_FAVORITE_DATA,
        })),
    }),
    { name: "favorites", skipHydration: true }
  )
);

