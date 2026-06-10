import { useIntroStore } from "@/lib/stores/useIntroStore";
import { ImageProps } from "@/types/general";
import { useState, useEffect, useRef } from "react";

interface IntroSequenceProps {
    onComplete: () => void;
    images: ImageProps[];
}

export default function IntroSequenceMob({ onComplete, images }: IntroSequenceProps) {

    const { setShowLogo, setShowNav } = useIntroStore();
    const [showSite, setShowSite] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Gérer la séquence d'introduction avec transition d'opacité
    useEffect(() => {

        timeoutRef.current = setTimeout(() => {
            setShowSite(true);
            setShowLogo(true);
            setTimeout(() => { setShowNav(true) }, 10000); // Delay to ensure the video has ended before showing the site
            localStorage.setItem("introTimestamp", Date.now().toString());
            onComplete();
        }, 4500);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [images.length, setShowLogo, onComplete, setShowNav]);

    if (showSite) return null;

    return (
        <div className="relative">
            <video autoPlay muted loop playsInline className="absolute">
                <source src={images[0].url} type="video/mp4" />
            </video>
        </div>
    );
}
