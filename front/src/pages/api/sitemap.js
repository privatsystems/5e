export default async function handler(req, res) {
    // Base URL de votre site
    const baseUrl = 'https://5eproduction.com';
    const baseBack = 'https://back.5eproduction.com'

    // Pages statiques
    const staticPages = ['', 'index', 'info', 'legal-notice', 'our-commitments', 'privacy-policy', 'search'].map((page) => {
        return `${baseUrl}/${page}`;
    });

    async function safeFetch(url) {
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Failed to fetch ${url}`);
            return await res.json();
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    const referencesData = await safeFetch(`${baseBack}/references`);
    const references = referencesData?.map((actu) => `${baseUrl}/references/${actu.slug}`) || [];

    const allPages = [...staticPages, ...references];


    // Générer le contenu XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
            .map(
                (url) => `
    <url>
      <loc>${url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>0.8</priority>
    </url>`
            )
            .join('')}
</urlset>`;

    // Configuration de la réponse
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(sitemap);
}