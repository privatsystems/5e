import Footer from "@/components/footer";
import FooterMobile from "@/components/footer/footerMobile";
import ImagesScrollSecret from "@/components/reference/imagesScrollSecret";
import Transition from "@/components/transition";
import { fetchFooterData, ContactData } from "@/lib/fetch/fetchFooterData";
import { fetchSecretPageData, ProspectionPageData } from "@/lib/fetch/fetchSecretPageData";
import { useGeneralStore } from "@/lib/stores/useGeneralStore";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

type SecretProps = {
    data: ProspectionPageData;
    footerData: ContactData;
}

export default function Presentation({ data, footerData }: SecretProps) {

    const dataMemo = useMemo(() => data, [data]);
    const { isMob } = useGeneralStore();
    const [passOk, setPassOk] = useState(false);

    const router = useRouter()

    useEffect(() => {
        const oldB = localStorage.getItem("newVisitedPage");
        const newB = router.asPath;
        if (oldB !== newB) {
            localStorage.setItem("lastVisitedPage", oldB || "/");
            localStorage.setItem("newVisitedPage", router.asPath);
        }
    }, [router.asPath]);


    const share = useRouter();
    const messageRef = useRef<HTMLSpanElement>(null);

    const base = "https://5e-alpha.vercel.app";

    const links = base + share.asPath;
    const copylink = () => {
        navigator.clipboard.writeText(links)
        if (messageRef.current) {
            messageRef.current.innerText = "Link copied"
        }
    }

    const { contents, password } = dataMemo;

    const onChangePass = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === password) {
            setPassOk(true);
        }
    }

    if (!passOk) {
        return (
            <div className="password-container type-32">
                <div className="password-form type-32">
                    <input className='type-32' type="password" onChange={onChangePass} placeholder="Enter password" />
                </div>
            </div>
        )
    }

    return (
        <>
            <Head>
                <meta name="robots" content="noindex"></meta>
                <title>{`${dataMemo !== null ? dataMemo.title + ' | ' : ''}${footerData.seo.title}`}</title>
            </Head>
            <Transition>
                <section className='reference'>
                    <ImagesScrollSecret data={dataMemo} />
                    <div className="credits prospection-credits">
                        <h3>Projects seen</h3>
                        <ul>
                            {contents.map((contentItem, index) => {
                                if (contentItem.slug) {
                                    return (
                                        <li className='credits-item' key={`credit-${index}${contentItem.slug}`}>
                                            <h4 className='type-11 credits-item-label'>{contentItem.client && typeof contentItem.client !== 'string' ? contentItem.client?.title : contentItem.client as string}</h4>

                                            <Link href={`/references/${contentItem.slug}`} className='credits-item-content hoverblue'>
                                                {contentItem.photographer && typeof contentItem.photographer !== 'string' ? contentItem.photographer?.title : contentItem.photographer as string} <span className='grey'>↗</span>
                                            </Link>
                                        </li>
                                    )
                                } else {
                                    return (
                                        <li className='credits-item' key={`credit-${index}${contentItem.slug}`}>
                                            <h4 className='type-11 credits-item-label'>{contentItem.client && typeof contentItem.client !== 'string' ? contentItem.client?.title : contentItem.client as string}</h4>

                                            <h5 className='credits-item-content'>
                                                {contentItem.photographer && typeof contentItem.photographer !== 'string' ? contentItem.photographer?.title : contentItem.photographer as string}
                                            </h5>
                                        </li>
                                    )
                                }
                            })}
                        </ul>
                        <h3 className='get'>Get in touch</h3>
                        <a href={`mailto:${dataMemo.contact}`} className='hoverblue grey type-15' target="_blank" rel="noopener noreferrer">{dataMemo.contact}</a>
                        <div className='share-part' onClick={copylink}>
                            <Image
                                src='/file1.png'
                                alt='share'
                                width={40}
                                height={40}
                                style={{
                                    height: '40px',
                                    width: '40px',
                                }}
                            />
                            <span ref={messageRef}>Share link</span>
                        </div>
                    </div>
                    {isMob ? <FooterMobile footerData={footerData} /> : <Footer footerData={footerData} />}
                </section>
            </Transition>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    try {
        const prosp = params?.prosp;
        const prospData = await fetchSecretPageData(prosp);
        const footerData = await fetchFooterData();

        return {
            props: {
                data: prospData,
                footerData,
            },
        };
    } catch (err) {
        console.error("Erreur getServerSideProps", err);
        return {
            notFound: true,
        };
    }
};