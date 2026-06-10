import CarouselMini from "./carouselMini";
import { useState, useCallback, useRef } from "react";
import { ImageProps } from "@/types/general";
import Link from "next/link";
import { useGeneralStore } from "@/lib/stores/useGeneralStore";

type CarouselMiniWrapperProps = {
    count: number;        // juste pour afficher le [N]
    title: string;
    slug: string;
};

export default function CarouselMiniWrapper({ count, title, slug }: CarouselMiniWrapperProps) {
    const [viewPreview, setViewPreview] = useState(false);
    const [images, setImages] = useState<ImageProps[]>([]);
    const [loading, setLoading] = useState(false);
    const fetchedRef = useRef(false); // évite de re-fetcher à chaque hover

    const { isMob } = useGeneralStore();

    const fetchImages = useCallback(async () => {
        if (fetchedRef.current) return; // déjà fetchées
        fetchedRef.current = true;
        setLoading(true);
        try {
            const res = await fetch(
                `/api/proxy/fetchProjectImages?slug=${slug}`
            );
            if (!res.ok) throw new Error("Erreur fetch images");
            const data: ImageProps[] = await res.json();
            setImages(data);
        } catch (e) {
            console.error("CarouselMiniWrapper fetch error:", e);
            fetchedRef.current = false; // permettre un retry si erreur
        } finally {
            setLoading(false);
        }
    }, [slug]);

    const handleOpen = useCallback(() => {
        fetchImages();
        setViewPreview(true);
    }, [fetchImages]);

    return (
        <div
            className="carousel-mini-wrapper"
            onMouseEnter={() => !isMob && handleOpen()}
            onMouseLeave={() => !isMob && setViewPreview(false)}
            onClick={() => {
                if (!viewPreview) handleOpen();
                else setViewPreview(false);
            }}
        >
            <div className="count type-13 grey hoverblue">
                [{count}]
            </div>
            {viewPreview && (
                <Link href={`references/${slug}`}>
                    {loading
                        ? <div className="carousel-mini-loading" />
                        : <CarouselMini images={images} title={title} />
                    }
                </Link>
            )}
        </div>
    );
}