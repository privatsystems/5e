import { useState, useRef, useCallback } from "react";

export function useSlidingInfinite<T>(pageSize = 20, keepPages = 2) {
    const [items, setItems] = useState<T[]>([]);
    const pageRef = useRef(1);
    const totalPagesRef = useRef(Infinity);
    const loadingRef = useRef(false);

    const load = useCallback(async (loader: (page: number) => Promise<{
        data: T[];
        totalPages: number;
    }>) => {
        if (loadingRef.current) return;
        if (pageRef.current > totalPagesRef.current) return;

        loadingRef.current = true;

        const { data, totalPages } = await loader(pageRef.current);
        totalPagesRef.current = totalPages;

        setItems(prev => {
            const next = [...prev, ...data];

            // ✨ sliding window = coupe l’historique au fur et à mesure
            if (next.length > pageSize * keepPages) {
                return next.slice(-pageSize * keepPages);
            }
            return next;
        });

        pageRef.current += 1;
        loadingRef.current = false;
    }, [pageSize, keepPages]);

    return { items, load };
}
