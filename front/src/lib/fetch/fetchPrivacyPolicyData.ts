import { PolicyData } from "./fetchLegalNoticeData";

export const fetchPrivacyPolicyData = async (): Promise<PolicyData> => {
    try {
        const res = await fetch('https://back.5eproductions.com/privacy-policy.json', {
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