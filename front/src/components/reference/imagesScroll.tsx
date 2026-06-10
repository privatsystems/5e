import recognizeSrcType from "@/util/recognizeSrcType";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { ReferenceData } from "@/lib/fetch/fetchReferenceData";
import ImageScroll from "./imageScroll";
import ButtonPreview from "./buttonPreview";
import unslugify from "@/util/unSlugify";
import PlayerItem, { BlurHashData } from "../videos/PlayerItem";
import ButtonMosaique from "./buttonMosaique";
import { useGeneralStore } from "@/lib/stores/useGeneralStore";
import { ImageProps } from "@/types/general";
import { useRouter } from "next/router";
import slugify from "@/util/slugify";
import MarginScroll from "./marginScroll";

export interface objectsImageSimple {
    type: string;
    heightVh: number;
    image: ImageProps;
    ratio?: BlurHashData;
    position: number;
}

interface ImagesScrollProps {
    data: ReferenceData;
    isOverView: boolean;
    setIsOverView: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ImagesScroll({ data, isOverView, setIsOverView }: ImagesScrollProps) {

    const [loadedIndexes, setLoadedIndexes] = useState([0]); // Commence par charger la première image

    const [isAtBottom, setIsAtBottom] = useState(false);
    const [scrollWidth, setScrollWidth] = useState(0);
    const [windowHeight, setWindowHeight] = useState<number | null>(null);
    const [windowWidth, setWindowWidth] = useState<number | null>(null);

    const [contentTraited, setContentTraited] = useState<{ objectsContent: objectsImageSimple[]; totalHeight: number; role: string }>({ objectsContent: [], totalHeight: 0, role: 'photographer' });

    let hasImage = false;
    let hasVideo = false;

    const containerRef = useRef<HTMLDivElement>(null);

    const { isMob } = useGeneralStore()

    const handleSetOverView = () => {
        setIsOverView(!isOverView);
        scrollTo(0, 0);
        setIsAtBottom(false);
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            setWindowHeight(window.innerHeight);
            setWindowWidth(window.innerWidth);
        }
    }, []);

    const router = useRouter();

    useEffect(() => {
        if (windowWidth) calculateHeights();
    }, [windowHeight, windowWidth, router])

    const { client, photographer, images, credits, next_reference, prev_reference } = data;

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
        let role = ''; // Initialize role with a default value

        const objectsContent = []
        let totalHeight = 0;
        let position = 0;

        if (images && windowHeight && windowWidth) {

            let prev = 0
            let imgHeight = 20;
            if (isMob) imgHeight = 10;
            let vidHeight = 0;

            for (const image of images) {

                if (recognizeSrcType(image.url) === 'image') {

                    hasImage = true;

                    position += prev;
                    objectsContent.push({ type: 'image', heightVh: 100, image, position });
                    imgHeight += 100;
                    prev = 100

                } else {

                    hasVideo = true;

                    const ratio = await getPlaceholder(image.mux?.playback_id);
                    const height = ((100 * window.innerWidth / 100) / ratio?.aspectRatio) / window.innerHeight * 100;

                    // if (height > 100) {
                    //     height = 100
                    // }

                    position += prev;
                    objectsContent.push({ type: 'video', heightVh: height, image, ratio, position });
                    vidHeight += height
                    prev = height
                }
            }

            totalHeight += imgHeight + vidHeight;

            if (hasImage && hasVideo) {
                role = 'Photographer & Director';
            } else if (hasImage) {
                role = 'Photographer';
            } else if (hasVideo) {
                role = 'Director';
            }
        }

        setContentTraited({ objectsContent, totalHeight, role })


    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const pageHeight = document.documentElement.scrollHeight;
            setIsAtBottom(scrollPosition >= pageHeight - window.innerHeight + 500);

            const scrollTop = window.scrollY;
            const viewportHeight = window.innerHeight;
            const fullHeight = document.documentElement.scrollHeight;
            setScrollWidth((scrollTop / (fullHeight - viewportHeight)) * 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    const replaceSpaceByPlus = (str: string) => {
        return str.replace(/\s+/g, '+');
    }

    return (
        <>
            <div className='progression-bar' style={{ width: `${scrollWidth}%` }}></div>
            <div className='hero' style={{ mixBlendMode: isAtBottom && !isOverView ? 'normal' : 'difference' }}>
                <motion.div className="hero-face-a type-21" initial={{ opacity: 1, y: 0, x: '-50%' }} animate={isAtBottom && !isOverView ? { opacity: 0, y: -10, x: '-50%' } : { opacity: 1, y: 0, x: '-50%' }} transition={{ duration: 0.5, ease: "easeOut" }}>
                    {client && <h1>{client.title}</h1>}
                    {photographer && <h2>{photographer.title}</h2>}
                </motion.div>

                <motion.div className="hero-face-b"
                    initial={{ opacity: 0, y: 10, x: '-50%' }}
                    animate={isAtBottom && !isOverView ? { opacity: 1, y: isMob ? 3 : 0, x: '-50%' } : { opacity: 0, y: 10, x: '-50%' }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ pointerEvents: isAtBottom && !isOverView ? 'auto' : 'none' }}
                >
                    {prev_reference?.slug && <Link href={`/references/${prev_reference?.slug}`}>
                        {prev_reference?.thumbnail && <div className='image-wrapper'>
                            {recognizeSrcType(prev_reference?.thumbnail.url) === "image" && (
                                <Image
                                    src={prev_reference?.thumbnail.url}
                                    alt={prev_reference?.thumbnail.alt}
                                    width={prev_reference?.thumbnail.width}
                                    height={prev_reference?.thumbnail.height}
                                />
                            )}
                            {recognizeSrcType(prev_reference?.thumbnail.url) === "video" && <PlayerItem data-url={prev_reference?.thumbnail.url} mux={prev_reference?.thumbnail?.mux} index={1} mini={true} />}
                        </div>}
                        <div className='next'>
                            <p>Previous</p>
                            <p className='hoverblue type-21'>{prev_reference?.client}</p>
                        </div>
                    </Link>}
                    {next_reference?.slug && <Link href={`/references/${next_reference?.slug}`}>
                        {next_reference?.thumbnail && <div className='image-wrapper'>
                            {recognizeSrcType(next_reference?.thumbnail.url) === "image" && (
                                <Image
                                    src={next_reference?.thumbnail.url}
                                    alt={next_reference?.thumbnail.alt}
                                    width={next_reference?.thumbnail.width}
                                    height={next_reference?.thumbnail.height}
                                />
                            )}
                            {recognizeSrcType(next_reference?.thumbnail.url) === "video" && <PlayerItem data-url={next_reference?.thumbnail.url} mux={next_reference?.thumbnail?.mux} index={1} mini={true} />}
                        </div>}
                        <div className='next'>
                            <p>Next</p>
                            <p className='hoverblue type-21'>{next_reference?.client}</p>
                        </div>
                    </Link>}
                </motion.div>
            </div>
            {!isOverView && <div className='overview-button' onClick={handleSetOverView}><ButtonMosaique /></div>}
            {isOverView && <div className='overview-button' onClick={handleSetOverView}><ButtonPreview /></div>}
            <div className='images-scroll-container' ref={containerRef}>
                <div className={`images-scroll ${isOverView ? 'overview' : ''}`}>
                    {isMob && <MarginScroll
                        isOverView={isOverView}
                        containerRef={containerRef}
                    />}
                    {contentTraited.objectsContent.map((imageWrapper, index) => {
                        return <ImageScroll
                            key={`image-wrapper-${index}-${imageWrapper.image.url}`}
                            image={imageWrapper.image}
                            index={index + 1}
                            isOverView={isOverView}
                            setIsOverView={setIsOverView}
                            imageObject={imageWrapper}
                            length={images.length}
                            containerRef={containerRef}
                            loadedIndexes={loadedIndexes}
                            setLoadedIndexes={setLoadedIndexes}
                        />
                    })}
                </div>
                <div className="placeholder" style={{ height: isOverView ? '0vh' : `calc(${contentTraited.totalHeight}vh)`, position: 'relative', overflow: 'hidden' }}></div>

                {!isOverView && <div className="images-scroll-item end">
                    <div className="credits">
                        <ul>
                            {client && <li className='credits-item'>
                                <h4 className='type-11 credits-item-label'>Client</h4>
                                <Link href={`/search?q=${replaceSpaceByPlus(client.title)}&type=${client.type}&slug=${client.slug}&per=client`} className='credits-item-content hoverblue'>
                                    {client.title} <span className='grey'>↗</span>
                                </Link>
                            </li>}
                            {photographer && <li className='credits-item'>
                                <h4 className='type-11 credits-item-label'>{contentTraited.role}</h4>
                                <Link href={`/search?q=${replaceSpaceByPlus(photographer.title)}&type=${photographer.type}&slug=${photographer.slug}&per=talents`} className='credits-item-content hoverblue'>
                                    {photographer.title} <span className='grey'>↗</span>
                                </Link>
                            </li>}
                            {credits.map((credit, index) => (
                                <li className='credits-item' key={`credit-${index}${credit.label}`}>
                                    <h4 className='type-11 credits-item-label'>{unslugify(credit.label)}</h4>
                                    {credit.text !== '' && <p className='credits-item-content'>{credit.text}</p>}
                                    {credit.tags.length > 0 && (() => {
                                        const tag = credit.tags[0];
                                        const isTalent = [
                                            "director",
                                            "photographer",
                                            "styling",
                                            "photographer & director",
                                            "photographer & styling",
                                            "director & styling",
                                            "stylism"
                                        ].some(type => credit.label.toLocaleLowerCase().includes(type));

                                        return isTalent ? (
                                            <Link
                                                href={`/search?q=${replaceSpaceByPlus(tag.title)}&type=${credit.label}&slug=${tag.type}-${slugify(tag.title)}&per=talents`}
                                                className='credits-item-content hoverblue'
                                            >
                                                {tag.title} <span className='grey'>↗</span>
                                            </Link>
                                        ) : (
                                            <p className='credits-item-content'>{tag.title}</p>
                                        );
                                    })()}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>}
            </div>

        </>
    );
}
