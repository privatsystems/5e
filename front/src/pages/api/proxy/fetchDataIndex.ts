import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Access-Control-Allow-Origin", "https://5e-alpha.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    const { page, limit, type, per, nameT, nameC, images, job } = req.query;

    try {
        const apiUrl = `https://back.5eproductions.com/list.json?page=${page}&limit=${limit}&type=${type}&per=${per}&nameT=${nameT}&nameC=${nameC}&images=${images}&job=${job}`;

        console.log("Requête vers l'API :", apiUrl);
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            // highlight-next-line
            signal: AbortSignal.timeout(50000), // 30 secondes au lieu de 10
        });

        if (!response.ok) {
            throw new Error(`Erreur de l'API: ${response.statusText}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Erreur lors de la requête proxy :", error);
        res.status(500).json({ error: "Erreur lors de la récupération des données." });
    }
}
