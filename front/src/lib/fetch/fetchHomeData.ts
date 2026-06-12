import { PaginatedResponse } from "@/types/home";

export const fetchHomeData = async (page: number, limit?: number): Promise<PaginatedResponse> => {
    try {

        const apiBaseUrl = 'https://5e-six.vercel.app';

        const res = await fetch(`${apiBaseUrl}/api/proxy/fetchDataHome?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },

        })

        console.log('fetchHomeData', `${apiBaseUrl}/api/proxy/fetchDataHome?page=${page}&limit=${limit}`, res.status);

        if (!res.ok) throw new Error("Erreur de chargement")
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