
import { PaginatedResponse } from "@/types/home";

export const fetchHomeData = async (page: number, limit?: number): Promise<PaginatedResponse> => {
    try {
        const res = await fetch(`https://back.5eproductions.com/home.json?page=${page}&limit=${limit || 100}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            signal: AbortSignal.timeout(50000),
        });

        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
    } catch (e) {
        console.error('😮‍💨', e);
        return {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            data: [],
            intro_images: [],
            intro_images_mob: [],
        };
    }
};