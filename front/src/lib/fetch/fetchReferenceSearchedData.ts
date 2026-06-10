import { IndexResponse } from "./fetchIndexData";


export const fetchReferenceSearchedData = async (name: string, newPage: number): Promise<IndexResponse> => {
    try {

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.5eproductions.com';
        const res = await fetch(`${apiBaseUrl}/api/proxy/fetchDataReferenceSearched?name=${name}&page=${newPage}`, {
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