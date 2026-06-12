import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import recognizeSrcType from '@/util/recognizeSrcType';
import PlayerItem from '../videos/PlayerItem';
import { ImageProps } from '@/types/general';
import { objectsImage } from './imagesScrollSecret';
import { useGeneralStore } from '@/lib/stores/useGeneralStore';

type CarouselProps = {
    image: ImageProps;
    imageObject?: objectsImage;
    index: number;
    isOverView: boolean;
    setIsOverView: React.Dispatch<React.SetStateAction<boolean>>;
    length: number;
    containerRef: React.RefObject<HTMLDivElement | null>;
    setLoadedIndexes: React.Dispatch<React.SetStateAction<number[]>>;
    loadedIndexes: number[];
};

export default function ImageScroll({
    image,
    index,
    isOverView,
    setIsOverView,
    length,
    containerRef,
    setLoadedIndexes,
    loadedIndexes,
    imageObject,
}: CarouselProps) {
    const [position, setPosition] = useState<number>(1);
    const [hovered, setHovered] = useState<number>(1);
    const [initialHeight, setInitialHeight] = useState<number | null>(null);

    const imageRef = useRef<HTMLDivElement>(null);
    const imageElRef = useRef<HTMLImageElement>(null);

    const { isMob } = useGeneralStore();

    const handleClickImage = () => {
        if (isOverView) {
            setIsOverView(false);
            setTimeout(() => window.scrollTo(0, index * window.innerHeight), 1);
        }
    };

    const handleLoad = (index: number) => {
        setLoadedIndexes((prev) => [...prev, index + 1]);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (!imageRef.current || !containerRef.current) return;

            const containerRect = containerRef.current.getBoundingClientRect();
            const imageHeightPx = (imageObject?.heightVh || 50) * (window.innerHeight / 100);
            const imageTop = (imageObject?.position || 0) * (window.innerHeight / 100);
            const scrollTop = (containerRect.top * -1) - 100;

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
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [containerRef, imageObject]);

    const getVW = (position = 1) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const ratio = width / height;
        const vwValue = ((height * position) * ratio / width) * 100;
        return `calc(${vwValue}vw)`;
    };

    const getVideoStyles = (): { width: string; height: string } => {
        const mediaRatio = imageObject?.ratio?.aspectRatio || 1;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        const windowRatio = winWidth / winHeight;

        const isVertical = mediaRatio < windowRatio;
        const overviewHeight = (window.innerHeight / length) * hovered;

        if (isVertical) {
            // Vidéo verticale
            const height = isOverView ? 'auto' : `calc(${100 * position}vh)`;
            const width = isOverView ? `${overviewHeight * mediaRatio}px` : `calc(${(winHeight * mediaRatio * position) / winWidth * 100}vw)`;
            return { height, width };
        } else {
            // Vidéo horizontale
            const height = isOverView ? 'auto' : `calc(${((100 * (winWidth / 100)) / mediaRatio) / winHeight * 100 * position}vh)`;
            const width = isOverView ? 'auto' : getVW(position);
            return { height, width };
        }
    };

    const videoStyles = getVideoStyles();

    return (
        <div
            ref={imageRef}
            style={{ width: '100vw', display: 'flex', justifyContent: 'center' }}
        >
            {/* IMAGE - MOBILE */}
            {recognizeSrcType(image.url) === 'image' && isMob && (
                <motion.div
                    id={`image-${index}`}
                    className="images-scroll-item"
                    style={{
                        width: '100%',
                        height: isOverView
                            ? `calc(((100 * var(--vh)) / ${length}) * ${hovered})`
                            : initialHeight ? `${initialHeight * position}px` : 'auto',
                        // height: initialHeight ? `${initialHeight * position}px` : 'auto',
                        overflow: 'hidden',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Image
                        ref={imageElRef}
                        src={image.url}
                        alt={image.alt || ''}
                        width={image.width}
                        height={image.height}
                        className="object-cover w-full h-auto"
                        onMouseEnter={() => setHovered(2)}
                        onMouseLeave={() => setHovered(1)}
                        onClick={handleClickImage}
                        sizes="100vw"
                        loading={loadedIndexes.includes(index - 1) ? 'eager' : 'lazy'}
                        quality={60}
                        onLoad={() => {
                            handleLoad(index);
                            if (imageElRef.current && !initialHeight) {
                                if (index == 1) {
                                    setInitialHeight(imageElRef.current.clientHeight);
                                } else {
                                    setInitialHeight(imageElRef.current.clientHeight);
                                }
                            }
                        }}
                    />
                </motion.div>
            )}

            {/* IMAGE - DESKTOP */}
            {recognizeSrcType(image.url) === 'image' && !isMob && (
                <motion.div
                    id={`image-${index}`}
                    className="images-scroll-item"
                    style={{
                        height: isOverView
                            ? `calc(((100 * var(--vh)) / ${length}) * ${hovered})`
                            : `calc(${100 * position} * var(--vh))`,
                        width: '100%',
                    }}
                >
                    <Image
                        src={image.url}
                        alt={image.alt || ''}
                        width={image.width}
                        height={image.height}
                        className="object-cover"
                        onMouseEnter={() => setHovered(2)}
                        onMouseLeave={() => setHovered(1)}
                        onClick={handleClickImage}
                        sizes="100vw"
                        loading={loadedIndexes.includes(index - 1) ? 'eager' : 'lazy'}
                        quality={60}
                        onLoad={() => handleLoad(index)}
                    />
                </motion.div>
            )}

            {/* VIDEO - ALL */}
            {recognizeSrcType(image.url) === 'video' && (
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
                        onMouseEnter={() => setHovered(2)}
                        onMouseLeave={() => setHovered(1)}
                        onClick={handleClickImage}
                    >
                        <PlayerItem
                            data-url={image.url}
                            mux={image?.mux}
                            index={index}
                            isOverView={isOverView}
                            hovered={hovered}
                            length={length}
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
