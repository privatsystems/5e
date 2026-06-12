import Image from "next/image"
import Link from "next/link"
import PlayerItem from "../videos/PlayerItem"
import recognizeSrcType from "@/util/recognizeSrcType"
import { ImageProps } from "@/types/general"
import { useGeneralStore } from "@/lib/stores/useGeneralStore"
import { PageData } from "@/lib/fetch/fetchSecretPageData"
import { useEffect, useState } from "react"

interface GridIndexSmallProps {
    item: {
        id: string
        title: string
        slug: string
        client: PageData
        photographer: PageData
        thumbnail: ImageProps
        images: ImageProps[]
    }
    type: string
    index: number
}

export default function GridIndexSmallItem({
    item,
    type,
    index,
}: GridIndexSmallProps) {

    const { isMob } = useGeneralStore()

    /**
     * ⚠️ SSR / hydration safe
     * On attend que le composant soit monté côté client
     * avant d'utiliser isMob pour next/image
     */
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleClick = () => {
        window.localStorage.setItem("referenceId", item.slug)
    }

    // Fallbacks SAFE pour next/image
    const sizes = isClient
        ? isMob
            ? "25vw"
            : "8vw"
        : "8vw"

    // Guards
    const hasImageThumbnail =
        item.thumbnail &&
        !item.thumbnail.mux &&
        recognizeSrcType(item.thumbnail.url) === "image"

    const hasVideoThumbnail =
        item.thumbnail &&
        recognizeSrcType(item.thumbnail.url) === "video" &&
        item.thumbnail.mux &&
        item.thumbnail.mux?.playback_id

    return (
        <>
            {/* IMAGE */}
            {type !== "film" && hasImageThumbnail && (
                <div
                    key={`item-gridmotion-${index}-${item.slug}`}
                    id={item.slug}
                >
                    <Link
                        href={`/references/${item.slug}`}
                        className="grid-index-item"
                        onClick={handleClick}
                    >
                        <div className="grid-index-item-image">
                            <Image
                                src={item.thumbnail.url}
                                alt={item.thumbnail.alt || ""}
                                width={item.thumbnail.width}
                                height={item.thumbnail.height}
                                sizes={sizes}
                            />
                        </div>

                        <div className="grid-index-item-text">
                            {item.client && <h2>{item.client.title}</h2>}
                            {item.photographer && <h3>{item.photographer.title}</h3>}
                        </div>
                    </Link>
                </div>
            )}

            {/* VIDEO */}
            {type !== "photography" && hasVideoThumbnail && (
                <div
                    key={`item-gridmotion-${index}-${item.slug}`}
                    id={item.slug}
                >
                    <Link
                        href={`/references/${item.slug}`}
                        className="grid-index-item"
                        onClick={handleClick}
                    >
                        <div className="grid-index-item-image">
                            <PlayerItem
                                data-url={item.thumbnail.url} // <-- url de la miniature
                                mux={item.thumbnail.mux}      // <-- mux de la miniature
                                index={index}
                                mini={true}
                            />
                        </div>

                        <div className="grid-index-item-text">
                            {item.client && <h2>{item.client.title}</h2>}
                            {item.photographer && <h3>{item.photographer.title}</h3>}
                        </div>
                    </Link>
                </div>
            )}
        </>
    )
}
