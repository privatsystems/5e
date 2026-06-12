export interface PolicyData {
    policy: string;
}

export const fetchLegalNoticeData = async (): Promise<PolicyData> => {
    try {
        const res = await fetch('https://back.5eproductions.com/legal-notice.json', {
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