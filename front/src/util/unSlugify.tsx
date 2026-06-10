export default function unslugify(str: string) {
    return str
        .replaceAll('_', " ") // Supprime les accents
}