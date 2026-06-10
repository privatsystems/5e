import Footer from "@/components/footer";
import FooterMobile from "@/components/footer/footerMobile";
import ButtonClose from "@/components/reference/buttonClose";
import Transition from "@/components/transition";
import { ContactData, fetchFooterData } from "@/lib/fetch/fetchFooterData";
import { PolicyData } from "@/lib/fetch/fetchLegalNoticeData";
import { fetchLegalNoticeData } from "@/lib/fetch/fetchLegalNoticeData";
import { useGeneralStore } from "@/lib/stores/useGeneralStore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LegalNotice({ initialData, footerData }: { initialData: PolicyData, footerData: ContactData }) {

    const { isMob } = useGeneralStore();
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
                <title>{`Legal Notice | ${footerData.seo.title}`}</title>
                <meta key="og_title" property="og:title" content={`Legal Notice | ${footerData.seo.title}`} />
            </Head>
            <Transition>
                <section className="policy">
                    <div className="content type-11" dangerouslySetInnerHTML={{ __html: initialData.policy }} />
                    <div className='cross' onClick={() => router.push(localStorage.getItem("lastVisitedPage") || "/")}><ButtonClose /></div>
                </section>
                {isMob ? <FooterMobile footerData={footerData} /> : <Footer footerData={footerData} />}
            </Transition>
        </>
    )
}


export const getServerSideProps = async () => {
    try {
        const initialData = await fetchLegalNoticeData();
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