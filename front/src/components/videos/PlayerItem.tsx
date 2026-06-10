import { useCallback, useEffect, useState } from "react";
import SectionInView from "@/util/sectionInView";
import MuxPlayer from "@mux/mux-player-react/lazy";
import { useGeneralStore } from "@/lib/stores/useGeneralStore";

interface PlayerItemData {
    "data-url": string; // obligatoire
    mux?: {
        id: string;
        playback_id: string;
        poster: number | null;
    };
    onChange?: () => void;
    noAutoplay?: boolean;
    handleLoad?: (index: number) => void;
    index: number;
    mini?: boolean;
    width?: string | null;
    height?: string | null;
    ratio?: BlurHashData;
    isOverView?: boolean;
    hovered?: number;
    length?: number;
}

export interface BlurHashData {
    aspectRatio: number;
    blurDataURL: string;
}

const PlayerItem = ({
    mux,
    onChange,
    noAutoplay,
    handleLoad,
    index,
    mini,
    width,
    height,
    ratio,
    isOverView,
    hovered,
    length,
}: PlayerItemData) => {
    const { isMob } = useGeneralStore();

    const [isClient, setIsClient] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [videoStatus, setVideoStatus] = useState<"idle" | "ready" | "not_ready" | "error">("idle");
    const [placeholder, setPlaceholder] = useState<BlurHashData | null>(null);
    const [once, setOnce] = useState(false);

    const playbackId = mux?.playback_id;
    const assetId = mux?.id;

    // ✅ Hydration
    useEffect(() => {
        setIsClient(true);
    }, []);

    // ✅ Handle load (une seule fois)
    useEffect(() => {
        if (!once && handleLoad) {
            handleLoad(index);
            setOnce(true);
        }
    }, [once, handleLoad, index]);

    // ✅ Callback quand prêt
    useEffect(() => {
        if (videoStatus === "ready" && onChange) {
            onChange();
        }
    }, [videoStatus, onChange]);

    // ✅ Fetch placeholder
    const getPlaceholder = useCallback(async () => {
        if (!playbackId) return;

        try {
            const res = await fetch(`/api/proxy/mux/checkMuxPlaceholder?id=${playbackId}`);
            const data = await res.json();

            if (data?.blurDataURL) {
                setPlaceholder(data);
            }
        } catch (e) {
            console.log("Placeholder error:", e);
        }
    }, [playbackId]);

    // ✅ Init vidéo
    useEffect(() => {
        if (!assetId || !playbackId) return;

        // Placeholder
        if (ratio) {
            setPlaceholder(ratio);
        } else {
            getPlaceholder();
        }

        // Status Mux
        const checkVideoStatus = async () => {
            try {
                const res = await fetch(`/api/proxy/mux/checkMuxStatus?id=${assetId}`);
                const data = await res.json();

                if (data?.status === "ready") {
                    setVideoStatus("ready");
                } else {
                    setVideoStatus("not_ready");
                }
            } catch (e) {
                console.log("Status error:", e);
                setVideoStatus("error");
            }
        };

        checkVideoStatus();
    }, [assetId, playbackId, ratio, getPlaceholder]);

    // ✅ Utils
    const timeToSeconds = (time: number) => {
        const minutes = Math.floor(time);
        const seconds = Math.round((time - minutes) * 100);
        return minutes * 60 + seconds;
    };

    if (!isClient) return null;

    const dynamicHeight =
        height && isOverView
            ? `calc(((100 * var(--vh)) / ${length}) * ${hovered})`
            : height || "auto";

    const baseStyle: React.CSSProperties = {
        width: width || "auto",
        height: dynamicHeight,
        maxHeight: window.innerHeight,
        aspectRatio: placeholder?.aspectRatio,
        backgroundImage: placeholder?.blurDataURL ? `url("${placeholder.blurDataURL}")` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
    };

    return (
        <SectionInView
            className="reactPlayer"
            onVisible={() => {
                if (!playing && !noAutoplay) setPlaying(true);
            }}
            noVisible={() => {
                if (playing) setPlaying(false);
            }}
        >
            <div className="playerItem" style={baseStyle}>
                {videoStatus === "error" && <div>Erreur vidéo</div>}
                {videoStatus === "not_ready" && <div>Vidéo non disponible</div>}

                {videoStatus === "ready" && playbackId && (
                    <MuxPlayer
                        playbackId={playbackId}
                        autoPlay={mini && isMob ? false : true}
                        muted
                        loop
                        preload="metadata"
                        loading="viewport"
                        disableTracking
                        disableCookies
                        paused={!playing}
                        placeholder={placeholder?.blurDataURL}
                        thumbnailTime={mux?.poster ? timeToSeconds(mux.poster) : undefined}
                        maxResolution={mini ? "720p" : "1080p"}
                        className={mini ? "mini" : ""}
                        style={{
                            ...baseStyle,
                            width: width || "100%",
                        }}
                    />
                )}
            </div>
        </SectionInView>
    );
};

export default PlayerItem;