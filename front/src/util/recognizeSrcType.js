export default function recognizeSrcType(src) {

    if (!src) return 'unknown';

    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.avif'];

    // Convertir la chaîne en minuscule pour éviter les problèmes de casse
    const lowerSrc = src.toLowerCase();

    if (videoExtensions.some(ext => lowerSrc.endsWith(ext))) {
        return 'video';
    } else if (imageExtensions.some(ext => lowerSrc.endsWith(ext))) {
        return 'image';
    } else {
        return 'unknown';
    }
}