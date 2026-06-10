import { ContactData } from "@/lib/fetch/fetchFooterData";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type FooterProps = {
    footerData: ContactData;
};

export default function FooterMobile({ footerData }: FooterProps) {

    const {
        phone,
        email,
        milan_office_coming_soon,
        phone_milan,
        email_milan,
        phone_hk,
        email_hk,
        instagram,
        general_contact,
    } = footerData;

    const [creditActive, setCreditActive] = useState(false);
    const [parisActive, setParisActive] = useState(false);
    const [milanActive, setMilanActive] = useState(false);
    const [hkActive, setHkActive] = useState(false);

    const handleCredits = () => {
        setCreditActive(!creditActive);
    }

    const handleParis = () => {
        setParisActive(!parisActive);
        setMilanActive(false);
        setHkActive(false);
    }
    const handleMilan = () => {
        setMilanActive(!milanActive);
        setParisActive(false);
        setHkActive(false);
    }
    const handleHk = () => {
        setHkActive(!hkActive);
        setParisActive(false);
        setMilanActive(false);
    }

    return (
        <footer className="footer footer-mob type-13">
            <div className='footer-mob_left'>
                <div className="footer-1 footer-item">
                    <Image src="/images/logo_footer.svg" alt="logo" width={159} height={35} />
                </div>
            </div>
            <div className='footer-mob_right'>
                <div className='footer-mob_right_menu'>
                    <div className="footer-2 footer-item">
                        <label onClick={handleParis} className={`${parisActive ? 'grey' : ''}`}>Paris</label>
                    </div>
                    <div className="footer-3 footer-item">
                        <label onClick={handleMilan} className={`${milanActive ? 'grey' : ''}`}>Milan</label>
                    </div>
                    <div className="footer-4 footer-item">
                        <label onClick={handleHk} className={`${hkActive ? 'grey' : ''}`}>Hong Kong</label>
                    </div>
                </div>
                <div>
                    {parisActive && <div className="footer-mob_contact">
                        {phone && <a href={`tel:${phone?.replaceAll(' ', '')}`} target="_blank" rel="noopener noreferrer">{phone}&nbsp;</a>}
                        {phone && email ? ' / ' : ''}
                        {email && <a href={`mailto:${email}`} className='grey hoverblue' target="_blank" rel="noopener noreferrer">&nbsp;email</a>}
                    </div>}
                    {!milan_office_coming_soon && milanActive && <div className="footer-mob_contact">
                        {phone_milan && <a href={`tel:${phone_milan?.replaceAll(' ', '')}`} target="_blank" rel="noopener noreferrer">{phone_milan}&nbsp;</a>}
                        {phone_milan && email_milan ? ' / ' : ''}
                        {email_milan && <a href={`mailto:${email_milan}`} className='grey hoverblue' target="_blank" rel="noopener noreferrer">&nbsp;email</a>}
                    </div>}
                    {milan_office_coming_soon && milanActive && <div className="footer-mob_contact">Comming Soon</div>}
                    {hkActive && <div className="footer-mob_contact">
                        {phone_hk && <a href={`tel:${phone_hk?.replaceAll(' ', '')}`} target="_blank" rel="noopener noreferrer">{phone_hk}&nbsp;</a>}
                        {phone_hk && email_hk ? ' / ' : ''}
                        {email_hk && <a href={`mailto:${email_hk}`} className='grey hoverblue' target="_blank" rel="noopener noreferrer">&nbsp;email</a>}
                    </div>}
                </div>
            </div>
            <div className="footer-5 footer-item">
                <ul>
                    <li><a href={`https://www.instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer">Instagram</a></li>
                    <li><Link href='/our-commitments'>Our Commitments</Link></li>
                    <li><a href={`mailto:${general_contact}`} target="_blank" rel="noopener noreferrer">Contact</a></li>
                </ul>
            </div>
            <div className="footer-6 footer-item type-11">
                <ul>
                    <li onClick={handleCredits}>Credits</li>
                    <li><Link href='/legal-notice'>Legal</Link></li>
                </ul>
                {creditActive && <div className="footer-credits">
                    <a href='https://laandstudio.com/' target="_blank" rel="noopener noreferrer">Design <span className='grey hoverblue'>Laand Studio <span className='grey'>↗</span></span></a><br />
                    <a href='https://julienprivat.com/' target="_blank" rel="noopener noreferrer">Code <span className='grey hoverblue'>Julien Privat <span className='grey'>↗</span></span></a>
                </div>}
                <ul>
                    <li><p className='copyright'>Copyright Cinq Étoiles Productions 2025</p></li>
                </ul>
            </div>
        </footer>
    )
}