export interface ReferencesData {
    references: {
        title: string;
        slug: string;
    }[];
}

export const fetchReferencesList = async (): Promise<ReferencesData> => {
    try {
        const res = await fetch('https://back.5eproductions.com/references.json', {
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