import { useEffect, useRef, useState } from "react";

export default function MarginScroll({
    containerRef,
    isOverView,
}: {
    containerRef: React.RefObject<HTMLDivElement | null>;
    isOverView: boolean;
}) {
    const [position, setPosition] = useState(1);
    const ref = useRef<HTMLDivElement>(null);

    // 🔹 MARGE EN PX
    const heightPx = 100;
    const positionPx = 0; // position de départ en px

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const scrollTop =
                -containerRef.current.getBoundingClientRect().top;

            const start = positionPx;
            const end = positionPx + heightPx;

            let ratio = 1;

            if (scrollTop <= start) {
                ratio = 1;
            } else if (scrollTop >= end) {
                ratio = 0;
            } else {
                ratio = 1 - (scrollTop - start) / (end - start);
            }

            setPosition(Math.max(0, Math.min(1, ratio)));
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [containerRef]);

    return (
        <div
            ref={ref}
            className="images-scroll-item margin"
            style={{
                width: "100%",
                height: isOverView
                    ? "0px"
                    : `${heightPx * position}px`,
            }}
        />
    );
}
