import recognizeSrcType from "@/util/recognizeSrcType";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { useGeneralStore } from "@/lib/stores/useGeneralStore";
import { PageData, ProspectionPageData } from "@/lib/fetch/fetchSecretPageData";
import ImageScrollSecret from "./imageScrollSecret";
import { ImageProps } from "@/types/general";
import { BlurHashData } from "../videos/PlayerItem";

interface ImagesScrollProps {
    data: ProspectionPageData;
}

export interface objectsImage {
    type: string;
    heightVh: number;
    image: ImageProps;
    ratio?: BlurHashData;
    position: number;
}

export interface objectsContent {
    height: number;
    photographer: PageData | string | null;
    client: PageData | string | null;
    slug: string | null;
    images: objectsImage[];
}

export default function ImagesScrollSecret({ data }: ImagesScrollProps) {

    const [loadedIndexes, setLoadedIndexes] = useState([0]); // Commence par charger la première image
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [scrollWidth, setScrollWidth] = useState(0);
    const [windowHeight, setWindowHeight] = useState<number | null>(null);
    const [windowWidth, setWindowWidth] = useState<number | null>(null);

    const [contentTraited, setContentTraited] = useState<{ objectsContent: objectsContent[]; totalHeight: number }>({ objectsContent: [], totalHeight: 0 });

    const [clientSelect, setClientSelect] = useState<string | null>(null)
    const [photographerSelect, setPhotographerSelect] = useState<string | null>(null)
    const [linkSelect, setLinkSelect] = useState<string | null>(null)

    const containerRef = useRef<HTMLDivElement>(null);

    const { isMob } = useGeneralStore()

    useEffect(() => {
        if (typeof window !== "undefined") {
            setWindowHeight(window.innerHeight);
            setWindowWidth(window.innerWidth);
        }
    }, []);

    useEffect(() => {
        if (windowWidth) calculateHeights();
    }, [windowHeight, windowWidth])


    const { title, contents } = data;


    const getPlaceholder = useCallback(async (id?: string) => {

        try {
            const res = await fetch(`/api/proxy/mux/checkMuxPlaceholder?id=${id}`);
            const data = await res.json();
            return data
        } catch (error) {
            console.log(error)
        }


    }, []);

    const calculateHeights = async () => {

        const objectsContent = []
        let totalHeight = 50;
        if (isMob) totalHeight = 100
        let position = 0;

        if (windowHeight && windowWidth && contents) {

            let prev = 50
            if (isMob) prev = 100

            for (const contentItem of contents) {

                let imgHeight = 0;
                let vidHeight = 0;
                const objectsImages = []

                for (const image of contentItem.images) {

                    if (recognizeSrcType(image.url) === 'image') {
                        position += prev;
                        objectsImages.push({ type: 'image', heightVh: 100, image, position });
                        imgHeight += 100;
                        prev = 100
                    } else {
                        const ratio = await getPlaceholder(image.mux?.playback_id);
                        let height = 0;
                        if (isMob) {
                            height = ((100 * window.innerWidth / 100) / ratio?.aspectRatio) / window.innerHeight * 100;
                        } else {
                            height = ((100 * window.innerWidth / 100) / ratio?.aspectRatio) / window.innerHeight * 100;
                        }
                        position += prev;
                        objectsImages.push({ type: 'video', heightVh: height, image, ratio, position });
                        vidHeight += height
                        prev = height
                    }

                }

                totalHeight += imgHeight + vidHeight;
                objectsContent.push({ height: imgHeight + vidHeight, images: objectsImages, client: contentItem.client, photographer: contentItem.photographer, slug: contentItem.slug });

            }

            setContentTraited({ objectsContent, totalHeight })

        }

    };

    useEffect(() => {
        const handleScroll = () => {

            let limit
            if (isMob) {
                limit = window.innerHeight / 3 * -1
            } else {
                limit = window.innerHeight / 2
            }
            if (containerRef.current) setIsAtBottom(containerRef.current.getBoundingClientRect().bottom <= limit);

            const scrollTop = window.scrollY;
            const viewportHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;
            setScrollWidth((scrollTop / (fullHeight - viewportHeight)) * 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    let count = 0;

    return (
        <>
            <div className='progression-bar' style={{ width: `${scrollWidth}%` }}></div>
            <div className='title-prospection' style={{ opacity: isAtBottom ? 0 : 1 }}>{title}</div>
            <div dangerouslySetInnerHTML={{ __html: data.intro }} className='intro-prospection type-21' style={{ height: isMob ? '100vh' : 'fit-content' }}></div>
            <div className='hero' style={{ mixBlendMode: 'difference' }}>
                {linkSelect ?
                    <Link href={`/references/${linkSelect}`}>
                        <motion.div className="hero-face-a type-21 hoverblue" initial={{ opacity: 1, y: 0, x: '-50%' }} animate={isAtBottom ? { opacity: 0, y: -10, x: '-50%' } : { opacity: 1, y: 0, x: '-50%' }} transition={{ duration: 0.5, ease: "easeOut" }}>
                            {clientSelect && <h1>{clientSelect}</h1>}
                            {photographerSelect && <h2>{photographerSelect} <span className='grey'>↗</span></h2>}
                        </motion.div>
                    </Link>
                    :
                    <motion.div className="hero-face-a type-21" initial={{ opacity: 1, y: 0, x: '-50%' }} animate={isAtBottom ? { opacity: 0, y: -10, x: '-50%' } : { opacity: 1, y: 0, x: '-50%' }} transition={{ duration: 0.5, ease: "easeOut" }}>
                        {clientSelect && <h1>{clientSelect}</h1>}
                        {photographerSelect && <h2>{photographerSelect}</h2>}
                    </motion.div>
                }
                <motion.div className="hero-face-b"
                    initial={{ opacity: 0, y: 10, x: '-50%' }}
                    animate={isAtBottom ? { opacity: 1, y: isMob ? 3 : 0, x: '-50%' } : { opacity: 0, y: 10, x: '-50%' }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ pointerEvents: isAtBottom ? 'auto' : 'none' }}
                >
                </motion.div>
            </div>
            <div className='images-scroll-container wrapper-prospection' ref={containerRef}>
                <div className={`images-scroll`}>
                    <div className='section'>
                        <ImageScrollSecret
                            key={`image-wrapper-0-transp`}
                            containerRef={containerRef}
                            setClientSelect={setClientSelect}
                            setPhotographerSelect={setPhotographerSelect}
                            setLinkSelect={setLinkSelect}
                            index={0}
                        />
                    </div>
                    {contentTraited.objectsContent.map((contentItem, indexParent) => {
                        return <div key={`inview-wrapper-section-${indexParent}`} className='section'>
                            {contentItem.images.map((image, index) => {
                                count += 1;
                                return <ImageScrollSecret
                                    key={`image-wrapper-${index}-${image.image.url}`}
                                    setClientSelect={setClientSelect}
                                    setPhotographerSelect={setPhotographerSelect}
                                    setLinkSelect={setLinkSelect}
                                    index={count}
                                    imageObject={image}
                                    sectionObject={contentItem}
                                    containerRef={containerRef}
                                    loadedIndexes={loadedIndexes}
                                    setLoadedIndexes={setLoadedIndexes}
                                />
                            })}
                        </div>
                    })}
                </div>
                <div className="placeholder" style={{ height: !isMob ? `calc(${contentTraited.totalHeight}vh)` : `calc(${contentTraited.totalHeight - 100}vh)`, position: 'relative', overflow: 'hidden' }}>
                </div>
            </div>
        </>
    );
}
