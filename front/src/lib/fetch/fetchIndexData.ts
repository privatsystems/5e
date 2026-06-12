import { ImageProps } from "@/types/general";
import { PageData } from "./fetchReferenceData";

export interface IndexData {
    id: string;
    title: string;
    slug: string;
    client: PageData;
    photographer: PageData;
    thumbnail: ImageProps;
    images: ImageProps[];
}

export interface IndexResponse {

    data: IndexData[],
    pagination: {
        current_page: number;
        total_pages: number;
        total_items: number;
        items_per_page: number;
    }

}

export const fetchIndexData = async (page: number, limit: number, type: string, per: string, nameC: string, nameT: string, images: boolean, job: string): Promise<IndexResponse> => {
    try {


        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://5e-alpha.vercel.app';

        const res = await fetch(`${apiBaseUrl}/api/proxy/fetchDataIndex?page=${page}&limit=${limit}&type=${type}&per=${per}&nameT=${nameT}&nameC=${nameC}&images=${images}&job=${job}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },

        })


        if (!res.ok) throw new Error("Erreur de chargement")
        return res.json();
    } catch (e) {
        console.error(e);
        throw new Error("Erreur de chargement");
    }
};