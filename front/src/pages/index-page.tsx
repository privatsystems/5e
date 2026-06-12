import Footer from "@/components/footer";
import FooterMobile from "@/components/footer/footerMobile";
import Transition from "@/components/transition";
import { ContactData, fetchFooterData } from "@/lib/fetch/fetchFooterData";
import { fetchIndexData, IndexResponse } from "@/lib/fetch/fetchIndexData";
import { useGeneralStore } from "@/lib/stores/useGeneralStore";
import { useCallback, useEffect, useState, useRef } from "react";
import NavIndex from "@/components/index/navIndex";
import { fetchMenuData } from "@/lib/fetch/fetchMenuData";
import GridIndexSmall from "@/components/index/gridIndexSmall";
import GridIndexNamed from "@/components/index/gridIndexNamed";
import { useRouter } from "next/router";
import Head from "next/head";

interface IndexProps {
    initialData: IndexResponse;
    footerData: ContactData;
}

export interface Nameprop {
    id: string;
    title: string;
    slug: string;
    typem: string;
}

export interface Nameobject {

    title: string;
    slug: string;

}

export default function Index({ initialData, footerData }: IndexProps) {
    const { isMob } = useGeneralStore();
    const router = useRouter();

    const [datas, setDatas] = useState<IndexResponse>(initialData);
    const [page, setPage] = useState(initialData.pagination.current_page);
    const [loading, setLoading] = useState(false);

    const [type, setType] = useState("all");
    const [per, setPer] = useState("all");
    const [role, setRole] = useState("all");

    const [names, setNames] = useState<Nameprop[]>([]);
    const [nameClient, setNameClient] = useState({ title: "All", slug: "all" });
    const [nameTalents, setNameTalents] = useState({ title: "All", slug: "all" });

    const isFetchingRef = useRef(false);

    const slugClient = nameClient.slug;
    const slugTalents = nameTalents.slug;

    const totalPages = datas.pagination.total_pages;

    // ✅ FETCH PAGE (safe)
    const fetchPage = useCallback(async (newPage: number) => {
        if (loading || isFetchingRef.current || newPage > datas.pagination.total_pages) {
            console.log("⛔ fetch bloqué");
            return;
        }

        console.log("📥 FETCH PAGE", newPage);
        isFetchingRef.current = true;
        setLoading(true);

        try {
            const newData = await fetchIndexData(
                newPage,
                70,
                type,
                per,
                slugClient,
                slugTalents,
                false,
                role
            );

            if (!newData || newData.data.length === 0) {
                console.log("🏁 FIN DES DONNÉES");
                isFetchingRef.current = false;
                setLoading(false);
                return;
            }

            console.log("✅ DATA RECEIVED", newData);

            setDatas(prev => ({
                data: [...prev.data, ...newData.data], // concat simple
                pagination: newData.pagination
            }));

            setPage(newPage);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    }, [loading, type, per, slugClient, slugTalents, role, datas.pagination.total_pages]);

    // ✅ RESET + NOUVELLE RECHERCHE
    const refreshData = useCallback(async () => {
        if (isFetchingRef.current) return;
        if (loading) return; // protège contre double trigger
        console.log("🚨 REFRESH DATA TRIGGERED");
        setLoading(true);

        try {
            const newData = await fetchIndexData(
                1,
                70,
                type,
                per,
                slugClient,
                slugTalents,
                true,
                role
            );

            console.log("🔄 REFRESH DATA RECEIVED", newData);

            setDatas(newData); // reset complet car filtre changé
            setPage(1);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [type, per, slugClient, slugTalents, role, loading]);

    // ✅ MENU
    const updateMenu = useCallback(async () => {
        try {
            const namesData = await fetchMenuData(
                type,
                per,
                role,
                slugClient,
                slugTalents
            );
            setNames(namesData);
        } catch (e) {
            console.error(e);
        }
    }, [type, per, role, slugClient, slugTalents]);

    // ✅ OBSERVER (infinite scroll)
    useEffect(() => {
        console.log("Observer triggered, page", page, "loading", loading, "isFetching", isFetchingRef.current);
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !loading && !isFetchingRef.current) {
                    fetchPage(page + 1);
                }
            },
            { rootMargin: "200px" }
        );

        const el = document.getElementById("load-more");
        if (el) observer.observe(el);

        return () => {
            if (el) observer.unobserve(el);
        };
    }, [page, fetchPage, loading]);

    // ✅ UPDATE URL (clean)
    useEffect(() => {
        router.replace({
            pathname: router.pathname,
            query: {
                type,
                per,
                role,
                nameClient: slugClient,
                nameTalents: slugTalents,
                page
            }
        }, undefined, { shallow: true });
    }, [type, per, role, slugClient, slugTalents, page]);

    // ✅ UPDATE DATA SI FILTRES
    const prevFilters = useRef("");

    useEffect(() => {
        const currentFilters = JSON.stringify({
            type,
            per,
            role,
            slugClient,
            slugTalents
        });

        console.log("FILTER CHECK", currentFilters);

        if (prevFilters.current === currentFilters) {
            console.log("⛔ refreshData bloqué");
            return;
        }

        console.log("✅ refreshData autorisé");

        prevFilters.current = currentFilters;

        refreshData();
    }, [type, per, role, slugClient, slugTalents]);

    // ✅ MENU
    useEffect(() => {
        updateMenu();
    }, [updateMenu]);

    return (
        <>
            <Head>
                <title>{`Index | ${footerData.seo.title}`}</title>
            </Head>

            <Transition>
                <section className="index">
                    <NavIndex
                        setType={setType}
                        type={type}
                        setPer={setPer}
                        per={per}
                        setRole={setRole}
                        role={role}
                        setNameClient={setNameClient}
                        setNameTalents={setNameTalents}
                        nameClient={nameClient}
                        nameTalents={nameTalents}
                        names={names}
                        fetchInitialPage={refreshData}
                        setDatas={setDatas}
                    />

                    {slugClient === "all" && slugTalents === "all" && (
                        <GridIndexSmall datas={datas} type={type} />
                    )}

                    {(slugClient !== "all" || slugTalents !== "all") && (
                        <GridIndexNamed
                            datas={datas}
                            per={per}
                            type={type}
                            setType={setType}
                            nameTalent={nameTalents.title}
                            nameClient={nameClient.title}
                        />
                    )}

                    {(loading || page < totalPages) && (
                        <div id="load-more" />
                    )}
                </section>

                {isMob ? (
                    <FooterMobile footerData={footerData} />
                ) : (
                    <Footer footerData={footerData} />
                )}
            </Transition>
        </>
    );
}

export const getServerSideProps = async () => {
    try {
        const [initialData, footerData] = await Promise.all([
            fetchIndexData(1, 50, "all", "all", "all", "all", false, "all"),
            fetchFooterData()
        ]);

        return { props: { initialData, footerData } };
    } catch {
        return { props: { initialData: null, footerData: null } };
    }
};