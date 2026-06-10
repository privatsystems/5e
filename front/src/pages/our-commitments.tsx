import Footer from "@/components/footer"
import FooterMobile from "@/components/footer/footerMobile"
import ButtonClose from "@/components/reference/buttonClose"
import Transition from "@/components/transition"
import { ContactData, fetchFooterData } from "@/lib/fetch/fetchFooterData"
import { fetchRseData, RseData } from "@/lib/fetch/fetchRseData"
import { useGeneralStore } from "@/lib/stores/useGeneralStore"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect } from "react"

interface RseProps {
    initialData: RseData;
    footerData: ContactData;
}

export default function Rse({ initialData, footerData }: RseProps) {

    const { isMob } = useGeneralStore()

    const {
        color_back,
        color_text,
        titlep,
        text,
        files
    } = initialData

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
                <title>{`Rse | ${footerData.seo.title}`}</title>
                <meta key="og_title" property="og:title" content={`Rse | ${footerData.seo.title}`} />
            </Head>
            <Transition>
                <section className={`rse`}
                    style={{
                        backgroundColor: color_back,
                        color: color_text
                    }}
                >
                    <div className="rse__content">
                        <h1 className="rse__title type-28">{titlep}</h1>
                        <div className="rse__text" dangerouslySetInnerHTML={{ __html: text }} />
                        {files && <div className="rse__logo">
                            <label>OUR LABELS</label>
                            <div className='rse__logo__images'>
                                {files.map((file, index) => (
                                    <div className='image_wrapper' key={`logo-${file.url}`} >
                                        <Image
                                            key={index}
                                            src={file.url}
                                            alt={file.alt}
                                            width={file.width}
                                            height={file.height}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>}
                    </div>
                    <div className='cross' onClick={() => router.push(localStorage.getItem("lastVisitedPage") || "/")}><ButtonClose /></div>
                    {isMob
                        ? <FooterMobile footerData={footerData} />
                        : <Footer footerData={footerData} />
                    }
                </section>
            </Transition>
        </>
    )

}


export const getServerSideProps = async () => {
    try {
        const initialData = await fetchRseData();
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