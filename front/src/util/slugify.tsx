export default function slugify(str: string) {
    return str
        .toLowerCase() // Met en minuscules
        .normalize("NFD") // Décompose les accents
        .replace(/[\u0300-\u036f]/g, "") // Supprime les accents
        .replace(/[^a-z0-9 -]/g, "") // Supprime les caractères spéciaux
        .replace(/\s+/g, "-") // Remplace les espaces par des tirets
        .replace(/-+/g, "-") // Évite les tirets multiples
        .trim(); // Supprime les espaces en début/fin
}