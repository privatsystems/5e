import Footer from "@/components/footer";
import FooterMobile from "@/components/footer/footerMobile";
import GridIndexNamedSearch from "@/components/index/gridIndexNamedSearch";
import ResultItem from "@/components/search/resultItem";
import Transition from "@/components/transition";
import { ContactData, fetchFooterData } from "@/lib/fetch/fetchFooterData";
import { IndexResponse } from "@/lib/fetch/fetchIndexData";
import { fetchReferenceSearchedData } from "@/lib/fetch/fetchReferenceSearchedData";
import { fetchSearchData } from "@/lib/fetch/fetchSearchData";
import { useGeneralStore } from "@/lib/stores/useGeneralStore";
import slugify from "@/util/slugify";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";

export interface SearchProps {
    title: string;
    typem: string;
    slug: string;
    per: string;
}

export default function Search({ footerData }: { footerData: ContactData }) {
    const [pattern, setPattern] = useState("");
    const [searchResults, setSearchResults] = useState<SearchProps[]>([]);
    const [searchSelect, setSearchSelect] = useState<SearchProps | null>(null);
    const [references, setReferences] = useState<IndexResponse | null>(null);

    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [initialLoad, setInitialLoad] = useState(false);

    const [isFocused, setIsFocused] = useState(false);
    const { isMob } = useGeneralStore();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();

    /**
     * ✅ Recherche des suggestions
     */
    const fetchResult = useCallback(async (search: string) => {
        try {
            const newData = await fetchSearchData(search);
            setSearchResults(newData);
        } catch (error) {
            console.error("Erreur de chargement des données", error);
        }
    }, []);

    /**
     * ✅ Récupère les références (avec pagination)
     */
    const fetchReferencesAttached = useCallback(async (prop: string, newPage: number, totalPages: number) => {
        console.log("fetchReferencesAttached called with:", prop, newPage, totalPages, loading);
        if (loading || newPage > totalPages) return;

        setLoading(true);
        try {
            const newData = await fetchReferenceSearchedData(slugify(prop), newPage);

            setReferences(prevData =>
                prevData && newPage > 1
                    ? {
                        data: [...prevData.data, ...newData.data],
                        pagination: {
                            ...prevData.pagination,
                            current_page: newData.pagination.current_page,
                            total_pages: newData.pagination.total_pages,
                        },
                    }
                    : newData
            );

            setTotalPages(newData.pagination.total_pages);
            setPage(newPage);
        } catch (error) {
            console.error("Erreur de chargement des données", error);
        } finally {
            setLoading(false);
        }
    }, []); // ✅ aucune dépendance → stable

    /**
     * ✅ Observe le bouton load-more pour infinite scroll
     */
    useEffect(() => {
        const target = document.getElementById("load-more");
        if (!target) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !loading && page < totalPages) {
                fetchReferencesAttached(router.query.q as string, page + 1, totalPages);
            }
        }, { threshold: 0.1, rootMargin: "0px 0px 300px 0px" });

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [page, loading, totalPages, router.query.q, fetchReferencesAttached]);

    /**
     * ✅ Quand on tape dans la barre de recherche
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPattern(value);
        fetchResult(value);
        setIsFocused(true);

        router.push({
            pathname: router.pathname,
            query: { q: value },
        }, undefined, { shallow: true });
    };

    /**
     * ✅ Quand on clique sur un résultat
     */
    const handleSelect = (result: SearchProps) => {
        setPattern(result.title);
        setSearchSelect(result);
        setReferences(null);
        setPage(1);
        setTotalPages(1);
        setLoading(false);
        setIsFocused(false);
        setInitialLoad(false);
        inputRef.current?.blur();

        router.push({
            pathname: router.pathname,
            query: {
                q: result.title,
                type: result.typem,
                slug: result.slug,
                per: result.per,
            },
        }, undefined, { shallow: true });
    };

    /**
     * ✅ Charger les suggestions au montage si query.q existe
     */
    useEffect(() => {
        if (router.query.q) {
            const searchQuery = router.query.q as string;
            setPattern(searchQuery);
            fetchResult(searchQuery);
        }
    }, [router.query.q, fetchResult]);

    /**
     * ✅ Charger les références au premier montage avec query params
     */
    useEffect(() => {
        if (!initialLoad && router.query.q && router.query.type && router.query.slug && router.query.per) {
            setInitialLoad(true);
            setSearchSelect({
                title: router.query.q as string,
                typem: router.query.type as string,
                slug: router.query.slug as string,
                per: router.query.per as string,
            });
            fetchReferencesAttached(router.query.q as string, 1, 1);
        }
    }, [router.query.q, router.query.type, router.query.slug, router.query.per, initialLoad, fetchReferencesAttached]);

    /**
     * ✅ Historique localStorage
     */
    useEffect(() => {
        const oldB = localStorage.getItem("newVisitedPage");
        const newB = router.asPath;
        if (oldB !== newB) {
            localStorage.setItem("lastVisitedPage", oldB || "/");
            localStorage.setItem("newVisitedPage", router.asPath);
        }
    }, [router.asPath]);

    return (
        <>
            <Head>
                <title>{`Search | ${footerData.seo.title}`}</title>
                <meta key="og_title" property="og:title" content={`Search | ${footerData.seo.title}`} />
            </Head>
            <Transition>
                <section className="search">
                    <div className="search_wrapper">
                        <div className="search_form">
                            <input
                                ref={inputRef}
                                type="text"
                                className="search_part-input type-32"
                                value={pattern}
                                placeholder={isMob ? "Your search" : "Type your search"}
                                onChange={handleInputChange}
                                onFocus={() => setIsFocused(true)}
                            />
                        </div>

                        {isFocused && searchResults.length > 0 && (
                            <div className="search_results">
                                {searchResults.map((result, index) => (
                                    result.per && (
                                        <div className="search__result" key={index} onClick={() => handleSelect(result)}>
                                            <ResultItem result={result} setReferences={setReferences} setSearchSelect={setSearchSelect} />
                                        </div>
                                    )
                                ))}
                            </div>
                        )}

                        {references && searchSelect && pattern !== "" && (
                            <div className="search_selected">
                                <GridIndexNamedSearch datas={references} per={searchSelect.per} />
                            </div>
                        )}
                    </div>
                    {page < totalPages && <div id="load-more" style={{ height: 50 }}></div>}
                    {isMob ? <FooterMobile footerData={footerData} /> : <Footer footerData={footerData} />}
                </section>
            </Transition>
        </>
    );
}

export const getServerSideProps = async () => {
    try {
        const footerData = await fetchFooterData();
        return { props: { footerData } };
    } catch (error) {
        console.log(error);
        return { props: { footerData: null } };
    }
};
