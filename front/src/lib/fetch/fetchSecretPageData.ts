import { ImageProps } from "@/types/general";

export type PageData = {
    type: string;
    title: string;
    slug: string;
    id: string;
} | null;

type MuxData = {
    id: string | null;
    playback_id: string;
    poster: number | null;
};

export type ImageData = {
    url: string;
    alt: string;
    filename: string;
    width: number;
    height: number;
    mux?: MuxData;
};

export type ContentItem = {
    photographer: PageData | string | null;
    client: PageData | string | null;
    slug: string | null;
    images: ImageProps[];
};

export type ProspectionPageData = {
    title: string;
    intro: string;
    footer1: string;
    footer2: string;
    contact: string;
    slug: string;
    id: string;
    password: string | null;
    contents: ContentItem[];
};

export const fetchSecretPageData = async (slug: string | string[] | undefined): Promise<ProspectionPageData> => {
    try {
        const res = await fetch(`https://back.5eproductions.com/${slug}.json`, {
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