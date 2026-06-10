import React, { useEffect, useRef } from "react";

interface SectionInViewProps {
    onVisible: () => void;
    noVisible: () => void;// Action à déclencher lorsque la section devient visible
    children: React.ReactNode; // Contenu de la section
    threshold?: number; // Niveau de visibilité requis (entre 0 et 1)
    className?: string; // Classe CSS optionnelle
}

const SectionInView: React.FC<SectionInViewProps> = ({
    onVisible,
    noVisible,
    children,
    threshold = 0.1, // 10% de la section doit être visible
    className = "",
}) => {

    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Vérifie si la section est visible
                if (entry.isIntersecting) {
                    onVisible(); // Appelle l'action fournie
                } else {
                    noVisible()
                }
            },
            { threshold, rootMargin: "0px 0px -25% 0px", } // Options : seuil de visibilité
        );

        observer.observe(section);

        return () => {
            if (section) observer.unobserve(section);
        };
    }, [onVisible, threshold, noVisible]);

    return (
        <div ref={sectionRef} className={className}>
            {children}
        </div>
    );
};

export default SectionInView;
