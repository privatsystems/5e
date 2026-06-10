export default function handler(req, res) {
  // Base URL (ajustez selon votre environnement)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://5eproduction.com';

  // Contenu du fichier robots.txt
  const robotsContent = `
      User-agent: *
      Disallow: /private/
      Allow: /
      Sitemap: ${baseUrl}/sitemap.xml
    `;

  // Retourner le contenu avec le bon header
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(robotsContent);
}