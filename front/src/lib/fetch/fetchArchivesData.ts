export type archivesReference = {
    project: string;
    project_title: string;
    client: string;
    photographer: string;
};

export type yearReference = {
    year: string;
    references: archivesReference[];
};

export const fetchArchivesData = async (): Promise<yearReference[]> => {
    try {
        const res = await fetch('https://back.5eproductions.com/archives.json', {
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