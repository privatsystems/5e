/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://www.cinq-étoiles.eu',
    generateRobotsTxt: true,
    minimumCacheTTL: 86400,
};