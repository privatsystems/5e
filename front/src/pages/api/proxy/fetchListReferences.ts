import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    // Construisez l'URL cible pour l'API externe
    const apiUrl = `https://back.5eproductions.com/references.json`;

    // Faites la requête côté serveur
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // highlight-next-line
      signal: AbortSignal.timeout(50000), // 30 secondes au lieu de 10
    });

    console.log(req)

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
