import { SearchProps } from "@/pages/search";

export const fetchSearchData = async (search: string): Promise<SearchProps[]> => {

    try {

        const apiBaseUrl = 'https://5e-six.vercel.app';

        const res = await fetch(`${apiBaseUrl}/api/proxy/fetchDataSearch?search=${search}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },

        })

        if (!res.ok) throw new Error("Erreur de chargement")
        return res.json();
    } catch (e) {
        console.log(e)
        return [{
            title: '',
            typem: '',
            slug: '',
            per: '',
        }]

    }
};