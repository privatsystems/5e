import { useIntroStore } from "@/lib/stores/useIntroStore";
import { ImageProps } from "@/types/general";
import { useState, useRef, useEffect, useCallback } from "react";
import Transition from "../transition";

interface IntroSequenceProps {
    onComplete: () => void;
    images: ImageProps[];
}

export default function IntroSequence({ onComplete, images }: IntroSequenceProps) {
    const { setShowLogo, setOnce, setShowNav } = useIntroStore();
    const [showSite, setShowSite] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleVideoEnd = () => {
        setShowSite(true);
        setShowLogo(true);
        setTimeout(() => { setShowNav(true) }, 1000);
        localStorage.setItem("introTimestamp", Date.now().toString());
        onComplete();
        setOnce(true);
    };

    const handleScroll = useCallback(() => {
        handleVideoEnd();
    }, [handleVideoEnd])

    useEffect(() => {

        if (containerRef.current) containerRef.current.addEventListener("scroll", handleScroll);
        return () => {
            if (containerRef.current) containerRef.current.removeEventListener("scroll", handleScroll);
        };
    }, [handleVideoEnd]);

    if (showSite) return null;

    return (
        <Transition>
            <div ref={containerRef} className="relative intror"
                style={{
                    height: '100vh',
                    width: '100vw',
                    overflow: 'scroll',
                }}
                onClick={handleVideoEnd}
            >
                {/* Placeholder scrollable en arrière-plan */}
                <div
                    className="placeholder-intro"
                    style={{
                        height: '500vh',
                        width: '100vw',
                        zIndex: '100000',
                        position: 'relative'
                    }}
                ></div>

                {/* Vidéo en superposition */}
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="absolute"
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: 'fixed', top: 0, left: 0, }}
                    onEnded={handleVideoEnd}
                >
                    <source src={images[0].url} type="video/mp4" />
                </video>
            </div>
        </Transition >
    );
}
