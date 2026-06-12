import { PolicyData } from "./fetchLegalNoticeData";


export const fetchPrivacyPolicyData = async (): Promise<PolicyData> => {
    try {

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://5e-alpha.vercel.app';

        const res = await fetch(`${apiBaseUrl}/api/proxy/fetchDataPrivacyPolicy`, {
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