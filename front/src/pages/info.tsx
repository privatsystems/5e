import Footer from "@/components/footer";
import FooterMobile from "@/components/footer/footerMobile";
import Transition from "@/components/transition";
import { ContactData, fetchFooterData } from "@/lib/fetch/fetchFooterData";
import { useGeneralStore } from "@/lib/stores/useGeneralStore";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Info({ footerData }: { footerData: ContactData }) {

    const {
        description_agency,
        head_office,
        phone,
        email,
        milan_office_coming_soon,
        head_office_milan,
        phone_milan,
        email_milan,
        head_office_hk,
        phone_hk,
        email_hk,
        portfolio,
        careers,
        instagram,
        general_contact,
        production_locations,
        rse,
        colorBack,
        colorText,
    } = footerData;

    const router = useRouter();

    useEffect(() => {
        const oldB = localStorage.getItem("newVisitedPage");
        const newB = router.asPath;
        if (oldB !== newB) {
            localStorage.setItem("lastVisitedPage", oldB || "/");
            localStorage.setItem("newVisitedPage", newB);
        }
    }, [router.asPath]);

    const [showLocations, setShowLocations] = useState(false);

    const toggleLocations = () => {
        setShowLocations(!showLocations);
    };

    const { isMob } = useGeneralStore();

    return (
        <>
            <Head>
                <title>{`Info | ${footerData.seo.title}`}</title>
                <meta name="description" content={`${footerData.seo.description}`} />
                <meta key="og_title" property="og:title" content={`Info | ${footerData.seo.title}`} />
                <meta key="og_description" property="og:description" content={`${footerData.seo.description}`} />
                {footerData.seo.image && <meta key="og_image" property="og:image" content={`${footerData.seo.image}`} />}
            </Head>
            <Transition>
                <section className={`info`}
                    style={{ backgroundColor: colorBack, color: colorText }}>
                    {description_agency && <div className="description-wrapper type-28" dangerouslySetInnerHTML={{ __html: description_agency }} />}
                    {rse &&
                        <div className='info-rse type-13'>
                            <div className='' dangerouslySetInnerHTML={{ __html: rse }} /><Link className='hoverblue grey' href='/our-commitments'>Read more ↗</Link>
                        </div>
                    }
                    <div className='info-footer type-13'>
                        <div className='info-footer_contact'>
                            {head_office &&
                                <div className='info-footer-item info-footer_contact-headoffice'>
                                    <label>Paris</label>
                                    <div className='info-footer_contact-headoffice-postal' dangerouslySetInnerHTML={{ __html: head_office }} />
                                    <div className="info-footer_contact-headoffice-links">
                                        {phone && <a href={`tel:${phone?.replaceAll(' ', '')}`} target="_blank" rel="noopener noreferrer">{phone}</a>}
                                        {phone && email ? '\u00a0/\u00a0' : ''}
                                        {email && <a href={`mailto:${email}`} className='grey hoverblue' target="_blank" rel="noopener noreferrer">email</a>}
                                    </div>
                                </div>
                            }
                            {!milan_office_coming_soon
                                ? <div className="info-footer-item info-footer_contact-milan">
                                    <label>Milan</label>
                                    <div className='info-footer_contact-headoffice-postal' dangerouslySetInnerHTML={{ __html: head_office_milan || '' }} />
                                    <div className="info-footer_contact-headoffice-links">
                                        {phone_milan && <a href={`tel:${phone_milan?.replaceAll(' ', '')}`} target="_blank" rel="noopener noreferrer">{phone_milan}</a>}
                                        {phone_milan && email_milan ? '\u00a0/\u00a0' : ''}
                                        {email_milan && <a href={`mailto:${email_milan}`} className='grey hoverblue' target="_blank" rel="noopener noreferrer">email</a>}
                                    </div>
                                </div>
                                : <div className="info-footer-item info-footer_contact-milan">
                                    <label>Milan</label>
                                    <p>Comming Soon</p>
                                </div>
                            }
                            {head_office_hk &&
                                <div className="info-footer-item info-footer_contact-hongkong">
                                    <label>Hong Kong</label>
                                    <div className='info-footer_contact-headoffice-postal' dangerouslySetInnerHTML={{ __html: head_office_hk }} />
                                    <div className="info-footer_contact-headoffice-links">
                                        {phone_hk && <a href={`tel:${phone_hk?.replaceAll(' ', '')}`} target="_blank" rel="noopener noreferrer">{phone_hk}</a>}
                                        {phone_hk && email_hk ? '\u00a0/\u00a0' : ''}
                                        {email_hk && <a href={`mailto:${email_hk}`} className='grey hoverblue' target="_blank" rel="noopener noreferrer">email</a>}
                                    </div>
                                </div>
                            }
                        </div>
                        <div>
                            {production_locations &&
                                <div className='info-footer-item info-footer_contact-locations'>
                                    <label>
                                        We Produce Worldwide.{" "}
                                        <div className='grey hoverblue' onClick={toggleLocations} style={{ cursor: 'pointer' }}>
                                            See locations{" "}
                                            <span className='arrow'>{!showLocations ? '↑' : '↓'}</span>
                                        </div>
                                    </label>

                                    {showLocations && (
                                        <div
                                            className="locations-html"
                                            dangerouslySetInnerHTML={{ __html: production_locations }}
                                        />
                                    )}
                                </div>
                            }
                            <div className="info-footer-item info-footer_contact-emails">
                                <ul>
                                    <li>General Inquiries <br /><a className='grey hoverblue' href={`mailto:${general_contact}`} target="_blank" rel="noopener noreferrer">{general_contact}</a></li>
                                    <li>Portfolio Submission<br /><a className='grey hoverblue' href={`mailto:${portfolio}`} target="_blank" rel="noopener noreferrer">{portfolio}</a></li>
                                    <li>Careers<br /><a className='grey hoverblue' href={`mailto:${careers}`} target="_blank" rel="noopener noreferrer">{careers}</a></li>
                                </ul>
                            </div>
                            <div className="info-footer-item info-footer_contact-social">
                                <a className='hoverblue' href={`https://www.instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer">Instagram <span className='grey'>↗</span></a>
                            </div>
                        </div>
                    </div>
                    <div className='tagline blue'>Shining bright since 2011</div>

                </section>
                {isMob ? <FooterMobile footerData={footerData} /> : <Footer footerData={footerData} />}
            </Transition>
        </>
    );
}

export const getServerSideProps = async () => {
    try {
        const footerData = await fetchFooterData();
        return {
            props: {
                footerData
            }
        };
    } catch (error) {
        console.log(error)
        return { props: { initialData: null } };
    }
};