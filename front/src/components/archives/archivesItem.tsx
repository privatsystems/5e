import { archivesReference } from "@/lib/fetch/fetchArchivesData";
import { fetchReferenceData } from "@/lib/fetch/fetchReferenceData";
import { ImageProps } from "@/types/general";
import recognizeSrcType from "@/util/recognizeSrcType";
import Image from "next/image";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import PlayerItem from "../videos/PlayerItem";
import { useGeneralStore } from "@/lib/stores/useGeneralStore";

export default function ArchiveItems({ project, refOpen, setRefOpen }: { project: archivesReference, refOpen: string | null, setRefOpen: Dispatch<SetStateAction<string | null>> }) {

    const [isOpen, setIsOpen] = useState(false);
    const [images, setImages] = useState<ImageProps[]>([]);

    const { isMob } = useGeneralStore();

    const fetchImages = useCallback(async () => {

        try {
            const newData = await fetchReferenceData(project.project);
            setImages(newData.images);

        } catch (error) {
            console.error("Erreur de chargement des données", error);
        }

    }, [project.project, setImages]);

    const handleClick = () => {
        if (!isOpen) {
            fetchImages();
            setRefOpen(project.project);
        } else {
            setRefOpen(null);
        }
    }

    useEffect(() => {
        if (refOpen !== project.project) {
            setIsOpen(false);
        } else {
            setIsOpen(true);
        }
    }, [refOpen, setIsOpen, project.project]);

    return (
        <li className='archives-item' onClick={handleClick}>
            <div className='archives-item-title'>
                <div className='first-col'>
                    <p className="type-15">{project.project_title}</p>
                </div>
                <p className="type-15 seg-col">{project.photographer}</p>
            </div>
            {isOpen && <div className='archives-item-images'>
                {images.map((image, index) => {
                    if (recognizeSrcType(image.url) == 'image') {
                        return <div className='grid-index-item-image' key={`${index}-image-${image.url}`}>
                            <Image
                                src={image.url}
                                data-url={image.url}
                                alt={image.alt}
                                width={image.width}
                                height={image.height}
                                sizes={isMob ? `25vw` : '20vw'}
                            />
                        </div>
                    }
                    if (recognizeSrcType(image.url) == 'video') {
                        return <div className='grid-index-item-image' key={`${index}-image-${image.url}`}>
                            <PlayerItem
                                data-url={image.url}
                                mux={image?.mux}
                                noAutoplay={true}
                                index={index}
                                mini={true}
                            />
                        </div>
                    }
                })}
            </div>}
        </li>
    )
}