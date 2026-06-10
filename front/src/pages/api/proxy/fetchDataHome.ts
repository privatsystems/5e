import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    responseLimit: false,
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1, limit = 100 } = req.query;

  try {
    const apiUrl = `https://back.5eproductions.com/home.json?page=${page}&limit=${limit}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // highlight-next-line
      signal: AbortSignal.timeout(50000), // 30 secondes au lieu de 10
    });

    if (!response.ok) {
      throw new Error(`Erreur de l'API: ${response.statusText}`);
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error: any) {
    console.error("Erreur lors de la requête proxy :", error?.message);
    res.status(500).json({ error: "Erreur lors de la récupération des données." });
  }
}