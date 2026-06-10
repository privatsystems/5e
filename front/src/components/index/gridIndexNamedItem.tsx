import Image from "next/image"
import Link from "next/link"
import PlayerItem from "../videos/PlayerItem"
import recognizeSrcType from "@/util/recognizeSrcType"
import { useGeneralStore } from "@/lib/stores/useGeneralStore";
import { PageData } from "@/lib/fetch/fetchSecretPageData";
import { ImageProps } from "@/types/general";
// import { motion } from "framer-motion";

interface GridIndexSmallProps {
    item: {
        id: string;
        title: string;
        slug: string;
        client: PageData;
        photographer: PageData;
        thumbnail: ImageProps;
        images: ImageProps[];
    },
    itemImage: ImageProps;
    per: string;
    index: number;
    handleLoad: (index: number) => void;
    loadedIndexes: number[];
    type?: string;
}

export default function GridIndexNamedItem({ item, itemImage, per, index, loadedIndexes, handleLoad, type }: GridIndexSmallProps) {

    const { isMob } = useGeneralStore()

    const handleClick = () => {
        window.localStorage.setItem('referenceId', item.slug)
    }

    return (
        <div
            key={`item-gridmotion-${index}${item.slug}`}
            id={item.slug}
        >
            <Link
                href={`/references/${item.slug}`}
                className='grid-index-item'
                onClick={handleClick}
            >
                {(type !== 'film' && itemImage && recognizeSrcType(itemImage.url) == 'image') &&
                    <div className='grid-index-item-image' key={`image_grid-${index}${itemImage.url}`}>
                        <Image
                            src={itemImage.url}
                            alt={itemImage.alt || item.title}
                            width={itemImage.width}
                            height={itemImage.height}
                            sizes={isMob ? `25vw` : '8vw'}
                            priority={loadedIndexes.includes(index - 1) ? true : false}
                            onLoad={() => handleLoad(index)}
                        />
                    </div>
                }
                {(type !== 'photography' && itemImage && recognizeSrcType(itemImage.url) == 'video') &&
                    <div className='grid-index-item-image' key={`image_grid-${index}${itemImage.url}`}>
                        <PlayerItem data-url={itemImage.url} mux={itemImage?.mux} handleLoad={handleLoad} index={index} mini={true} />
                    </div>
                }
                {!isMob &&
                    <div className='grid-index-item-text'>
                        {item.client && per == 'talents' ? <h2 style={{ color: index == 0 ? '#000' : '#fff' }}>{item.client.title}</h2> : ''}
                        {item.photographer && per == 'client' ? <h2 style={{ color: index == 0 ? '#000' : '#fff' }}>{item.photographer.title}</h2> : ''}
                    </div>
                }
            </Link>
        </div>
    )

}