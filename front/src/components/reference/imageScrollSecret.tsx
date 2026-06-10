import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import recognizeSrcType from '@/util/recognizeSrcType';
import { useGeneralStore } from '@/lib/stores/useGeneralStore';
import PlayerItem from '../videos/PlayerItem';
import { objectsContent, objectsImage } from './imagesScrollSecret';

type CarouselProps = {
    imageObject?: objectsImage;
    containerRef?: React.RefObject<HTMLDivElement | null>;
    setLoadedIndexes?: React.Dispatch<React.SetStateAction<number[]>>;
    loadedIndexes?: number[];
    sectionObject?: objectsContent;
    index: number;
    setClientSelect: Dispatch<SetStateAction<string | null>>;
    setPhotographerSelect: Dispatch<SetStateAction<string | null>>;
    setLinkSelect: Dispatch<SetStateAction<string | null>>;
};

export default function ImageScrollSecret({
    setClientSelect,
    setPhotographerSelect,
    setLinkSelect,
    imageObject = {
        type: 'image',
        heightVh: 50,
        position: 0,
        image: {
            url: '',
            alt: '',
            width: 0,
            height: 0,
            mux: { id: '', playback_id: '', poster: null },
        },
        ratio: { aspectRatio: 1, blurDataURL: '' },
    },
    sectionObject,
    index,
    containerRef,
    setLoadedIndexes = () => { },
    loadedIndexes = [],
}: CarouselProps) {
    const imageRef = useRef<HTMLDivElement>(null);
    const imageElRef = useRef<HTMLImageElement>(null);

    const [position, setPosition] = useState<number>(1);
    const [initialHeight, setInitialHeight] = useState<number | null>(null); // mobile image

    const { isMob } = useGeneralStore();

    const handleLoad = (i: number) => {
        if (i > -1) setLoadedIndexes((prev) => [...prev, i + 1]);
    };

    // -------- visible callback (inchangé) ----------
    const onVisible = useCallback(() => {
        if (sectionObject === null || sectionObject === undefined) {
            setClientSelect('');
            setLinkSelect(null);
            setPhotographerSelect('');
        }

        if (!sectionObject) return;

        if (sectionObject.client && typeof sectionObject.client !== 'string') {
            setClientSelect(sectionObject.client.title);
            setLinkSelect(sectionObject.slug);
        } else {
            setClientSelect(sectionObject.client as string);
        }

        if (sectionObject.photographer && typeof sectionObject.photographer !== 'string') {
            setPhotographerSelect(sectionObject.photographer.title);
            setLinkSelect(sectionObject.slug);
        } else {
            setPhotographerSelect(sectionObject.photographer as string);
        }
    }, [sectionObject, setClientSelect, setPhotographerSelect, setLinkSelect]);

    // -------- scroll ratio (aligné sur ImageScroll) ----------
    useEffect(() => {
        const handleScroll = () => {
            if (!imageRef.current || !containerRef?.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const imageHeightPx = (imageObject?.heightVh || 50) * (window.innerHeight / 100);
            const imageTop = (imageObject?.position || 0) * (window.innerHeight / 100);
            const scrollTop = containerRect.top * -1;

            const startScroll = imageTop;
            const endScroll = imageTop + imageHeightPx;

            let ratio = 1;
            if (scrollTop <= startScroll) {
                ratio = 1;
            } else if (scrollTop >= endScroll) {
                ratio = 0;
            } else {
                const progress = 1 - (scrollTop - startScroll) / (endScroll - startScroll);
                ratio = Math.max(0, Math.min(1, progress));
            }

            setPosition(ratio);

            // visibilité (logique d'origine)
            const topPosition = imageTop;
            const bottomPosition = imageTop + imageHeightPx;
            if (topPosition - 200 <= scrollTop + 8 && bottomPosition + 200 >= scrollTop + 8) {
                onVisible();
            }
            if (index === 0 && containerRect.top > 0) onVisible();
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [index, containerRef, imageObject, onVisible]);

    // -------- helpers identiques à ImageScroll ----------
    const getVW = (p = 1) => {
        if (typeof window === 'undefined') return '100vw';
        const width = window.innerWidth;
        const height = window.innerHeight;
        const ratio = width / height;
        const vwValue = ((height * p) * ratio / width) * 100;
        return `calc(${vwValue}vw)`;
    };

    const getVideoStyles = (): { width: string; height: string } => {
        const mediaRatio = imageObject?.ratio?.aspectRatio || 1;
        const winWidth = typeof window !== 'undefined' ? window.innerWidth : 1;
        const winHeight = typeof window !== 'undefined' ? window.innerHeight : 1;
        const windowRatio = winWidth / winHeight;

        const isVertical = mediaRatio < windowRatio;

        if (isVertical) {
            // Vidéo verticale
            const height = `calc(${100 * position}vh)`;
            const width = `calc(${(winHeight * mediaRatio * position) / winWidth * 100}vw)`;
            return { height, width };
        } else {
            // Vidéo horizontale
            const height = `calc(${((100 * (winWidth / 100)) / mediaRatio) / winHeight * 100 * position}vh)`;
            const width = getVW(position);
            return { height, width };
        }
    };

    const mediaType = recognizeSrcType(imageObject?.image.url);
    const videoStyles = getVideoStyles();

    return (
        <div
            ref={imageRef}
            style={{ width: '100vw', display: 'flex', justifyContent: 'center' }}
        >
            {/* PLACEHOLDER si pas d'URL */}
            {!imageObject.image.url && (
                <div
                    id={`image-0`}
                    className="images-scroll-item"
                    style={{
                        height: isMob ? `calc(${100 * position}vh)` : `calc(${(100 * position) / 2}vh)`,
                        width: '100%',
                    }}
                />
            )}

            {/* IMAGE - MOBILE (même logique que ImageScroll) */}
            {mediaType === 'image' && isMob && (
                <motion.div
                    id={`image-${index}`}
                    className="images-scroll-item"
                    style={{
                        width: '100%',
                        height: initialHeight ? `${initialHeight * position}px` : 'auto',
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Image
                        ref={imageElRef}
                        src={imageObject.image.url}
                        alt={imageObject.image.alt || ''}
                        width={imageObject.image.width}
                        height={imageObject.image.height}
                        className="object-cover w-full h-auto"
                        sizes="100vw"
                        loading={loadedIndexes.includes(index - 1) ? 'eager' : 'lazy'}
                        quality={60}
                        onLoad={() => {
                            handleLoad(index);
                            if (imageElRef.current && !initialHeight) {
                                setInitialHeight(imageElRef.current.clientHeight);
                            }
                        }}
                        placeholder={imageObject.ratio?.blurDataURL ? 'blur' : undefined}
                        blurDataURL={imageObject.ratio?.blurDataURL || undefined}
                    />
                </motion.div>
            )}

            {/* IMAGE - DESKTOP (même logique que ImageScroll) */}
            {mediaType === 'image' && !isMob && (
                <motion.div
                    id={`image-${index}`}
                    className="images-scroll-item"
                    style={{
                        height: `calc(${100 * position} * var(--vh))`,
                        width: '100%',
                    }}
                >
                    <Image
                        src={imageObject.image.url}
                        alt={imageObject.image.alt || ''}
                        width={imageObject.image.width}
                        height={imageObject.image.height}
                        className="object-cover"
                        sizes="100vw"
                        loading={loadedIndexes.includes(index - 1) ? 'eager' : 'lazy'}
                        quality={60}
                        onLoad={() => handleLoad(index)}
                        placeholder={imageObject.ratio?.blurDataURL ? 'blur' : undefined}
                        blurDataURL={imageObject.ratio?.blurDataURL || undefined}
                    />
                </motion.div>
            )}

            {/* VIDEO - ALL (même logique que ImageScroll) */}
            {mediaType === 'video' && (
                <motion.div
                    id={`image-${index}`}
                    className="images-scroll-item video"
                    style={{
                        ...videoStyles,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        className="video_container"
                        style={{ width: 'fit-content' }}
                    >
                        <PlayerItem
                            data-url={imageObject.image.url}
                            mux={imageObject.image?.mux}
                            index={index}
                            handleLoad={handleLoad}
                            width={videoStyles.width}
                            height={videoStyles.height}
                        />
                    </div>
                </motion.div>
            )}
        </div>
    );
}
