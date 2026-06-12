// pages/api/proxy/fetchProjectImages.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { slug } = req.query;

    if (!slug || typeof slug !== "string") {
        return res.status(400).json({ error: "Slug manquant" });
    }

    try {
        const response = await fetch(
            `https://back.5eproductions.com/project-images.json?slug=${slug}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                signal: AbortSignal.timeout(10000),
            }
        );

        if (!response.ok) throw new Error(response.statusText);

        const data = await response.json();
        res.status(200).json(data);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur inconnue";
        console.error("Erreur lors de la requête proxy :", message);
        res.status(500).json({ error: "Erreur lors de la récupération des données." });
    }
}