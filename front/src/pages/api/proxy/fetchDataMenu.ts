import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  res.setHeader("Access-Control-Allow-Origin", "*"); // Vérifie les règles CORS
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { type, role, per, nameC, nameT } = req.query;

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Construisez l'URL cible pour l'API externe
    const apiUrl = `https://back.5eproductions.com/menu.json?type=${type}&per=${per}&role=${role}&nameC=${nameC}&nameT=${nameT}`;


    console.log("Requête proxy vers l'API :", apiUrl);
    // console.log("URL de l'API :", apiUrl);
    // Faites la requête côté serveur
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // highlight-next-line
      signal: AbortSignal.timeout(50000), // 30 secondes au lieu de 10
    });

    // Vérifiez le statut de la réponse
    if (!response.ok) {
      throw new Error(`Erreur de l'API: ${response.statusText}`);
    }

    const data = await response.json();

    // Retournez les données à l'utilisateur
    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur lors de la requête proxy :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données." });
  }
}
