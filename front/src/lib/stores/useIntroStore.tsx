import { create } from "zustand";

interface Store {
    showLogo: boolean;
    setShowLogo: (value: boolean) => void;
    once: boolean;
    setOnce: (value: boolean) => void;
    showNav: boolean;
    setShowNav: (value: boolean) => void;
}

export const useIntroStore = create<Store>((set) => ({
    showLogo: false,
    setShowLogo: (value) => set({ showLogo: value }),
    once: false,
    setOnce: (value) => set({ once: value }),
    showNav: false,
    setShowNav: (value) => set({ showNav: value })
}));