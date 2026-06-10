import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    // Construisez l'URL cible pour l'API externe
    const apiUrl = `https://back.5eproductions.com/${req.query.slug}.json`;

    // Faites la requête côté serveur
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Vérifiez le statut de la réponse
    if (!response.ok) {
      throw new Error(`${req.query.reference}!! Erreur de l'API: ${response.statusText}`);
    }

    const data = await response.json();

    // Retournez les données à l'utilisateur
    res.status(200).json(data);
  } catch (error) {
    console.error("Erreur lors de la requête proxy :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données." });
  }
}
