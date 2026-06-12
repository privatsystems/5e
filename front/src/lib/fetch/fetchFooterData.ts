export interface ContactData {
    description_agency?: string;
    head_office?: string;
    phone?: string;
    email?: string;
    milan_office_coming_soon?: boolean;
    head_office_milan?: string | null;
    phone_milan?: string | null;
    email_milan?: string | null;
    head_office_hk?: string | null;
    phone_hk?: string | null;
    email_hk?: string | null;
    general_contact?: string;
    portfolio?: string;
    careers?: string;
    instagram?: string | null;
    production_locations?: string;
    services?: string[];
    colorBack?: string;
    colorText?: string;
    rse?: string;
    seo: {
        title: string
        tagline: string
        description: string
        image: string | null
    }
}


export const fetchFooterData = async (): Promise<ContactData> => {
    try {
        const res = await fetch('https://back.5eproductions.com/contact.json', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
    } catch (e) {
        console.error(e);
        throw new Error("Erreur de chargement");
    }
};