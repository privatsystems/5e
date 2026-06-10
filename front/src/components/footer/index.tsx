import { ContactData } from "@/lib/fetch/fetchFooterData";
import Image from "next/image";
import Link from "next/link";

type FooterProps = {
    footerData: ContactData;
};

export default function Footer({ footerData }: FooterProps) {

    const {
        head_office,
        email,
        milan_office_coming_soon,
        email_milan,
        email_hk,
        instagram,
    } = footerData;

    return (
        <footer className="footer type-11">
            <div className="footer-1 footer-item">
                <Image src="/images/logo_footer.svg" alt="logo" width={159} height={35} />
            </div>
            {head_office && <div className="footer-2 footer-item">
                <label className='footer-item-facea'>Paris</label>
                {email && <p className='footer-item-faceb'><a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer">e-mail</a></p>}
            </div>}
            {!milan_office_coming_soon
                ? <div className="footer-3 footer-item">
                    <label className='footer-item-facea'>Milan</label>
                    {email_milan && <p className='footer-item-faceb'><a href={`mailto:${email_milan}`} target="_blank" rel="noopener noreferrer">e-mail</a></p>}
                </div>
                : <div className="footer-3 footer-item">
                    <label className='footer-item-facea'>Milan</label>
                    <p className='footer-item-faceb'>Comming Soon</p>
                </div>
            }
            <div className="footer-4 footer-item">
                <label className='footer-item-facea'>Hong Kong</label>
                {email_hk && <p className='footer-item-faceb'><a href={`mailto:${email_hk}`} target="_blank" rel="noopener noreferrer">e-mail</a></p>}
            </div>
            <div className="footer-5 footer-item">
                <ul>
                    <li><a href={`https://www.instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer">Instagram</a></li>
                    <li><Link href='/our-commitments'>Our Commitments</Link></li>
                    {/* <li><span className='mirror'><span className='face-a'>Contact</span><a href={`mailto:${general_contact}`} target="_blank" rel="noopener noreferrer"><span className='face-b f-contact'>{general_contact}</span></a></span></li> */}
                </ul>
            </div>
            <div className="footer-6 footer-item">
                <ul>
                    <li><span className='mirror'><span className='face-a'>Credits</span><span className='face-b'>
                        <a href='https://laandstudio.com/' target="_blank" rel="noopener noreferrer">Design <span className='grey hoverblue'>Laand Studio <span className='grey'>↗</span></span></a><br />
                        <a href='https://julienprivat.com/' target="_blank" rel="noopener noreferrer">Code <span className='grey hoverblue'>Julien Privat <span className='grey'>↗</span></span></a>
                    </span></span></li>
                    <li><Link href='/legal-notice'>Legal</Link></li>
                </ul>
                <p className='copyright' style={{ width: 'max-content' }}>Copyright Cinq Étoiles Productions 2025</p>
            </div>
        </footer>
    )
}