import { IndexResponse } from "@/lib/fetch/fetchIndexData";
import { useState } from "react";
import GridIndexNamedItem from "./gridIndexNamedItem";
import { AnimatePresence } from "framer-motion";
import { useGeneralStore } from "@/lib/stores/useGeneralStore";

interface GridIndexSmallProps {
    datas: IndexResponse;
    per: string;
    type?: string;
}

export default function GridIndexNamedSearch({ datas, per, type }: GridIndexSmallProps) {

    const [loadedIndexes, setLoadedIndexes] = useState([0]); // Commence par charger la première image

    const handleLoad = (index: number) => {
        setLoadedIndexes((prev) => [...prev, index + 1]);
    };


    const { isMob } = useGeneralStore();

    return (
        <div
            className='grid-index gap-7 type-13'
            key={`grid-index-${per}`}
        >
            {datas.data.map((item) => {
                if (!isMob) {
                    if (item.images.length > 0) {
                        return item.images && item.images.map((itemImage, index) => {
                            if (index < 5) {
                                return <AnimatePresence key={`animatepresence-${index}${item.slug}`}>
                                    <GridIndexNamedItem
                                        key={`item-grid-${index}${item.slug}`}
                                        item={item}
                                        itemImage={itemImage}
                                        per={per}
                                        type={type}
                                        index={index}
                                        loadedIndexes={loadedIndexes}
                                        handleLoad={handleLoad}
                                    />
                                </AnimatePresence>
                            }
                        })
                    }
                }

                if (isMob && item.images.length > 0) {
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
                            if (index < 3) {
                                return <AnimatePresence key={`animatepresence-${index}${item.slug}`}>
                                    <GridIndexNamedItem
                                        key={`item-grid-${index}${item.slug}`}
                                        item={item}
                                        type={type}
                                        itemImage={itemImage}
                                        per={per}
                                        index={index}
                                        loadedIndexes={loadedIndexes}
                                        handleLoad={handleLoad}
                                    />
                                </AnimatePresence>
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
            }
        </div>
    )

}