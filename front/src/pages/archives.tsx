import ArchiveItems from "@/components/archives/archivesItem";
import { fetchArchivesData, yearReference } from "@/lib/fetch/fetchArchivesData";
import { fetchFooterData } from "@/lib/fetch/fetchFooterData";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Archives({ initialData }: { initialData: yearReference[] }) {

    const [refOpen, setRefOpen] = useState<string | null>(null);

    const router = useRouter()

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
                <meta name="robots" content="noindex"></meta>
            </Head>
            <div className='archives'>
                {initialData.map((year, index) => (
                    <div className='archives-year' key={`year-${index}-${year.year}`}>
                        <h2>{year.year}</h2>
                        <ul>
                            {year.references.map((project, index) => (
                                <ArchiveItems key={`${index}-${project.project}`} project={project} setRefOpen={setRefOpen} refOpen={refOpen} />
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    )

}

export const getServerSideProps = async () => {
    try {
        const initialData = await fetchArchivesData();
        const footerData = await fetchFooterData();
        return {
            props: {
                initialData,
                footerData
            }
        };
    } catch (error) {
        console.log(error)
        return { props: { initialData: null } };
    }
};