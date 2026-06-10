import { fetchReferenceSearchedData } from "@/lib/fetch/fetchReferenceSearchedData";
import { SearchProps } from "@/pages/search";
import { useCallback } from "react";
import { IndexResponse } from "@/lib/fetch/fetchIndexData";
import slugify from "@/util/slugify";

interface ResultItemProps {
    result: SearchProps;
    setReferences: (data: IndexResponse) => void;
    setSearchSelect: (data: SearchProps | null) => void;
}

export default function ResultItem({ result, setReferences, setSearchSelect }: ResultItemProps) {

    const fetchReferencesAttached = useCallback(async (prop?: string) => {

        try {
            const newData = await fetchReferenceSearchedData(slugify(prop || result.title), 1);

            setReferences(newData)
            // console.log(result.slug, newData)

        } catch (error) {
            console.error("Erreur de chargement des données", error);
        } finally { }

    }, [setReferences, result.title]);

    const handleClick = () => {

        setSearchSelect(result)
        fetchReferencesAttached()

    }

    return (
        <h3 onClick={handleClick}>{result.title}</h3>
    )

}