import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./logo";
import Link from "next/link";
import { useIntroStore } from "@/lib/stores/useIntroStore";
import { useRouter } from "next/router";
import { useGeneralStore } from "@/lib/stores/useGeneralStore";

export default function Header() {

    const [isOpen, setIsOpen] = useState(false);
    const { showLogo, showNav } = useIntroStore();
    const [scrollOnTop, setScrollOnTop] = useState(false);
    const router = useRouter();
    const { isMob } = useGeneralStore();

    useEffect(() => {
        if (window.innerWidth < 800) return

        const handleScroll = () => {
            if (window.innerWidth < 800) return
            if (router.asPath == '/') {
                if (window.scrollY === 0) {
                    setIsOpen(true);
                    setScrollOnTop(true);
                } else {
                    setIsOpen(false);
                    setScrollOnTop(false);
                }
            } else {
                setIsOpen(false);
                setScrollOnTop(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isMob, router.asPath]);

    return (
        <header
            className={`header ${!showLogo && router.asPath == '/' ? "on-intro" : ""}`}
            onMouseEnter={() => { if (!isMob) setIsOpen(true) }}
            onMouseLeave={() => { if (!isMob && !scrollOnTop) setIsOpen(false) }}
            onClick={() => { if (isMob && isOpen) setIsOpen(false) }}
        >
            <div className={`header-top ${!showLogo && router.asPath == '/' ? "on-intro" : ""}`}>
                <Link className='logo' href='/'><Logo /></Link>
                {isMob && <button onClick={() => setIsOpen(!isOpen)} className="burger">
                    <div className='circle'></div>
                    <div className='circle'></div>
                    <div className='circle'></div>
                </button>}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`header-navigation nav type-36 ${!showNav && router.asPath == '/' ? "on-intro-nav" : ""}`}
                        key={`header-navigation`}
                    >
                        <ul>
                            <li>
                                <Link href="/index" className="nav-item">Index</Link>
                            </li>
                            <li>
                                <Link href="/search" className="nav-item">Search</Link>
                            </li>
                            <li>
                                <Link href="/info" className="nav-item">Info</Link>
                            </li>
                        </ul>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
}