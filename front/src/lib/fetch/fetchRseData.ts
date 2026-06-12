import { ImageProps } from "@/types/general";

export interface RseData {
    title: string;
    color_back: string;
    color_text: string;
    titlep: string;
    text: string;
    files: ImageProps[];
}

export const fetchRseData = async (): Promise<RseData> => {
    try {

        const apiBaseUrl = 'https://5e-six.vercel.app';

        const res = await fetch(`${apiBaseUrl}/api/proxy/fetchDataRse`, {
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