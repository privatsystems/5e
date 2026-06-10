import { IndexData, IndexResponse } from "@/lib/fetch/fetchIndexData";
import { useEffect, useState } from "react";
import GridIndexNamedItem from "./gridIndexNamedItem";
// import { AnimatePresence } from "framer-motion";
import { useGeneralStore } from "@/lib/stores/useGeneralStore";
import recognizeSrcType from "@/util/recognizeSrcType";
import { ImageProps } from "@/types/general";

interface GridIndexSmallProps {
    datas: IndexResponse;
    per: string;
    type?: string;
    setType?: (type: string) => void;
    nameTalent?: string;
    nameClient?: string;
}

export default function GridIndexNamed({ datas, per, type, setType, nameTalent, nameClient }: GridIndexSmallProps) {

    const [loadedIndexes, setLoadedIndexes] = useState([0]); // Commence par charger la première image
    const [typeTalent, setTypeTalent] = useState<string | null>(null);

    const handleLoad = (index: number) => {
        setLoadedIndexes((prev) => [...prev, index + 1]);
    };

    const quidMediaOk = (item: ImageProps) => {

        const typeMedia = recognizeSrcType(item.url);

        if (type == 'all') {
            return true;
        } else if (type == 'photography' && typeMedia == 'image') {
            return true;
        } else if (type == 'film' && typeMedia == 'video') {
            return true;
        } else {
            return false;
        }

    }

    const quidSerie = (item: IndexData) => {
        let mediaType: string | null = null;
        item.images.forEach((image) => {
            if (recognizeSrcType(image.url) == 'video') {
                if (!mediaType) {
                    mediaType = 'film';
                } else if (mediaType == 'photography') {
                    mediaType = 'mixte'; // Si on trouve un autre type, on annule
                }
            }
            if (recognizeSrcType(image.url) == 'image') {
                if (!mediaType) {
                    mediaType = 'photography';
                } else if (mediaType == 'film') {
                    mediaType = 'mixte'; // Si on trouve un autre type, on annule
                }
            }
        })
        return mediaType;
    }

    useEffect(() => {

        let totalType: string | null = null;
        // Vérifie si le type de média est film ou photographie
        datas.data.forEach((item) => {
            console.log('item', item);
            if (quidSerie(item) == 'film') {
                if (!totalType) {
                    totalType = 'film';
                } else if (totalType == 'photography') {
                    totalType = 'mixte'; // Si on trouve un autre type, on annule
                }
            }
            if (quidSerie(item) == 'photography') {
                if (!totalType) {
                    totalType = 'photography';
                } else if (totalType == 'film') {
                    totalType = 'mixte'; // Si on trouve un autre type, on annule
                }
            }

            if (quidSerie(item) == 'mixte') {
                totalType = 'mixte'; // Si on trouve un mixte, on annule
            }
        });
        setTypeTalent(totalType);

    }, [datas])

    const { isMob } = useGeneralStore();

    return (
        <div
            className='grid-index gap-7 type-13'
            key={`grid-index-${per}`}
        >
            {(!type || typeTalent == 'mixte' || typeTalent == type || type == 'all') ? datas.data.map((item) => {
                if (!isMob) {
                    if (item.images.length > 0) {
                        if (quidSerie(item) == 'film' && (type !== 'film' && type !== 'all')) { return null }
                        if (quidSerie(item) == 'photography' && type == 'film') { return null }
                        let count = 0;
                        return item.images && item.images.map((itemImage, index) => {
                            if (count < 5 && quidMediaOk(itemImage)) {
                                count++;
                                return <div key={`animatepresence-${index}${item.slug}`}>
                                    <GridIndexNamedItem
                                        key={`item-grid-${index}${item.slug}`}
                                        item={item}
                                        itemImage={itemImage}
                                        per={per}
                                        type={type}
                                        index={count - 1}
                                        loadedIndexes={loadedIndexes}
                                        handleLoad={handleLoad}
                                    />
                                </div>
                            }
                        })
                    }
                }

                if (isMob && item.images.length > 0) {
                    if (quidSerie(item) == 'film' && type !== 'film') { return null }
                    if (quidSerie(item) == 'photography' && type == 'film') { return null }
                    let count = 0;
                    return <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gridGap: '13px',
                            gridRow: '13px',
                            position: 'relative',
                            marginBottom: '35px'
                        }}
                        key={`grid-index-${per}-${item.slug}`}
                    >
                        {item.images && item.images.map((itemImage, index) => {

                            if (count < 3 && quidMediaOk(itemImage)) {
                                count++;
                                return <div key={`animatepresence-${index}${item.slug}`}>
                                    <GridIndexNamedItem
                                        key={`item-grid-${index}${item.slug}`}
                                        item={item}
                                        type={type}
                                        itemImage={itemImage}
                                        per={per}
                                        index={count}
                                        loadedIndexes={loadedIndexes}
                                        handleLoad={handleLoad}
                                    />
                                </div>
                            }
                        })
                        }
                        <div
                            className='grid-index-item-text'
                            style={{
                                position: 'absolute',
                                bottom: '-42px',
                            }}
                        >
                            {item.client && per == 'talents' ? <h2>{item.client.title}</h2> : ''}
                            {item.photographer && per == 'client' ? <h2>{item.photographer.title}</h2> : ''}
                        </div>
                    </div>
                }
            })
                : <p className='message' onClick={() => { if (setType) setType('all') }}>No {type} projects available – View all projects by
                    {nameTalent && per == 'talents' ? <span> {nameTalent} </span> : ''}
                    {nameClient && per == 'client' ? <span> {nameClient} </span> : ''}
                </p>}
        </div>
    )

}