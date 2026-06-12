import { ImageProps } from "@/types/general";

export interface PageData {
    type: string;
    title: string;
    slug: string;
    id: string;
}

export interface CreditData {

    label: string;
    text: string;
    tags: PageData[];

}

interface imageData {
    url: string;
    width: number;
    height: number;
    filname?: string;
    alt: string;
    mux?: {
        id: string;
        playback_id: string;
        poster: number | null;
    }
}

export interface nextData {
    client: string;
    slug: string;
    thumbnail: imageData;
}

export interface ReferenceData {
    title: string;
    slug: string;
    id: string;
    client: PageData | null;
    projet: PageData | null;
    photographer: PageData | null;
    images: ImageProps[];
    credits: CreditData[];
    description: string;
    next_reference: nextData | null;
    prev_reference: nextData | null;
}


export const fetchReferenceData = async (reference: string | string[] | undefined): Promise<ReferenceData> => {
    try {

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://5e-alpha.vercel.app';

        const res = await fetch(`${apiBaseUrl}/api/proxy/fetchDataReference?reference=${reference}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },

        })
        console.log("🏞️", `${apiBaseUrl}/api/proxy/fetchDataReference?reference=${reference}`)

        if (!res.ok) throw new Error("Erreur de chargement")
        return res.json();
    } catch (e) {
        console.error(e);
        throw new Error("Erreur de chargement");
    }
};