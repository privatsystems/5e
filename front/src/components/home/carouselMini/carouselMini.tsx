import PlayerItem from "@/components/videos/PlayerItem";
import { useGeneralStore } from "@/lib/stores/useGeneralStore";
import { ImageProps } from "@/types/general";
import recognizeSrcType from "@/util/recognizeSrcType";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

type CarouselMiniProps = {
    images?: ImageProps[];
    title: string;
};

export default function CarouselMini({ images = [], title }: CarouselMiniProps) {
    const { isMob } = useGeneralStore();
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // ✅ Optimisation avec useCallback pour éviter de recréer la fonction à chaque rendu
    const updateScrollProgress = useCallback(() => {
        const ref = containerRef.current;
        if (!ref) return;

        const { scrollLeft, scrollWidth, clientWidth } = ref;
        const maxScroll = scrollWidth - clientWidth;
        setScrollPercentage(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
    }, []);

    useEffect(() => {
        const ref = containerRef.current;
        if (!ref) return;

        ref.addEventListener("scroll", updateScrollProgress);

        // ✅ Observer pour recalculer la barre si le conteneur change de taille
        const resizeObserver = new ResizeObserver(updateScrollProgress);
        resizeObserver.observe(ref);

        return () => {
            ref.removeEventListener("scroll", updateScrollProgress);
            resizeObserver.disconnect();
        };
    }, [updateScrollProgress]); // ✅ Ajout de dépendances correctes

    // ✅ useMemo pour éviter de recalculer les éléments si `images` ne change pas
    const filteredImages = useMemo(() => images.filter(img => img.url), [images]);

    return (
        <>
            <div className="carousel-mini" ref={containerRef}>
                {filteredImages.map((img, i) => (
                    <div className="carousel-mini-item" key={`mini-image-${i}-${img.url}`}>
                        {recognizeSrcType(img.url) === "image" && (
                            <Image
                                src={img.url}
                                alt={title}
                                width={img.width}
                                height={img.height}
                                sizes={isMob ? "10vw" : "5vw"}
                                priority={i < 2} // ✅ Priorité aux premières images pour le chargement
                            />
                        )}
                        {recognizeSrcType(img.url) === "video" && (
                            <PlayerItem data-url={img.url} mux={img?.mux} index={i} mini={true} />
                        )}
                    </div>
                ))}
            </div>

            {/* ✅ Ajout de role pour l'accessibilité */}
            <div
                className="scroll-bar"
                style={{ width: `${scrollPercentage}%` }}
                role="progressbar"
                aria-valuenow={scrollPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
            />
        </>
    );
}
