import { create } from "zustand";

interface Store {
    isMob: boolean;
    setIsMob: (value: boolean) => void;
    isTablet: boolean;
    setIsTablet: (value: boolean) => void;
}

export const useGeneralStore = create<Store>((set) => ({
    isMob: false,
    setIsMob: (value) => set({ isMob: value }),
    isTablet: false,
    setIsTablet: (value) => set({ isTablet: value }),
}));