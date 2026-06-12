import { Nameprop } from "@/pages/index-page";

export const fetchMenuData = async (type: string, per: string, role: string, nameC: string, nameT: string): Promise<Nameprop[]> => {

    try {

        const apiBaseUrl = 'https://5e-six.vercel.app';


        const res = await fetch(`${apiBaseUrl}/api/proxy/fetchDataMenu?type=${type}&per=${per}&role=${role}&nameC=${nameC}&nameT=${nameT}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },

        })

        console.log("URL de l'API :", `${apiBaseUrl}/api/proxy/fetchDataMenu?type=${type}&per=${per}&role=${role}&nameC=${nameC}&nameT=${nameT}`)

        if (!res.ok) throw new Error("Erreur de chargement")
        return res.json();
    } catch (e) {
        console.error(e);
        throw new Error("Erreur de chargement");

    }
};