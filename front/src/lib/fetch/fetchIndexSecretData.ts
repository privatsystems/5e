export const fetchIndexSecretData = async (): Promise<string[]> => {
    try {

        const apiBaseUrl = 'https://5e-six.vercel.app';

        const res = await fetch(`${apiBaseUrl}/api/proxy/fetchDataIndexSecret`, {
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