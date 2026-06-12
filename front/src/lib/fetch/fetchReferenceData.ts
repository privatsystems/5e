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
        const res = await fetch(`https://back.5eproductions.com/references/${reference}.json`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
    } catch (e) {
        console.error(e);
        throw new Error("Erreur de chargement");
    }
};