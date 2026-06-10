import { GetServerSideProps } from "next";

import { fetchReferenceData, ReferenceData } from "@/lib/fetch/fetchReferenceData";
import { ContactData, fetchFooterData } from "@/lib/fetch/fetchFooterData";

import { useState } from "react";
import { useRouter } from "next/router";

import Transition from "@/components/transition";
import ImagesScroll from "@/components/reference/imagesScroll";
import Head from "next/head";
import ButtonClose from "@/components/reference/buttonClose";

interface ReferenceProps {
    data: ReferenceData;
    footerData: ContactData;
}

export default function Reference({ data, footerData }: ReferenceProps) {
    const [isOverView, setIsOverView] = useState(false);
    const router = useRouter();

    const handleClick = () => {
        const back = localStorage.getItem("newVisitedPage");
        router.push(back || "/");
    };

    return (
        <>
            <Head>
                <title>{`${data ? `${data?.client?.title} by ${data?.photographer?.title} | ` : ""}${footerData.seo.title}`}</title>
                <meta name="description" content={footerData.seo.description} />
                <meta key="og_title" property="og:title" content={`${data ? `${data?.client?.title} by ${data?.photographer?.title} | ` : ""}${footerData.seo.title}`} />
                <meta key="og_description" property="og:description" content={footerData.seo.description} />
                {data.images.length > 0 && <meta key="og_image" property="og:image" content={data.images[0].url} />}
            </Head>
            <Transition>
                <section className="reference">
                    <ImagesScroll data={data} isOverView={isOverView} setIsOverView={setIsOverView} />
                    <div className="cross" onClick={handleClick}><ButtonClose /></div>
                </section>
            </Transition>
        </>
    );
}

// SSR
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    try {
        const reference = params?.reference;
        const referenceData = await fetchReferenceData(reference);
        const footerData = await fetchFooterData();

        if (!referenceData) {
            return { notFound: true };
        }

        return {
            props: {
                data: referenceData,
                footerData
            }
        };
    } catch (err) {
        console.error("Erreur getServerSideProps", err);
        return { notFound: true };
    }
};
