import { Nameobject, Nameprop } from "@/pages/index-page";
import ScrollBox from "./scrollBox";
import { IndexResponse } from "@/lib/fetch/fetchIndexData";

interface navIndexProps {

    setType: (type: string) => void;
    type: string;
    setPer: (pers: string) => void;
    per: string;
    setRole: (role: string) => void;
    role: string;
    setNameClient: (name: Nameobject) => void;
    setNameTalents: (name: Nameobject) => void;
    names?: Nameprop[];
    nameClient: Nameobject;
    nameTalents: Nameobject;
    fetchInitialPage: () => void;
    setDatas: (datas: IndexResponse) => void;
}

export default function NavIndex({ setType, type, setPer, per, setRole, role, setNameClient, setNameTalents, names, nameClient, nameTalents, fetchInitialPage, setDatas }: navIndexProps) {

    const clear = () => {
        setDatas({ data: [], pagination: { current_page: 0, total_pages: 0, total_items: 0, items_per_page: 0 } })
        fetchInitialPage()
        setPer('all')
        setNameClient({ title: 'all', slug: 'all' })
        setNameTalents({ title: 'all', slug: 'all' })
        setRole('all')
        setType('all')
    }

    const handleClickTalentFilter = () => {

        if (per == 'talents') {
            clear()
        } else {
            setPer('talents');
            setRole('all')
            setType('all')
            setNameClient({ title: 'all', slug: 'all' })
            setDatas({ data: [], pagination: { current_page: 0, total_pages: 0, total_items: 0, items_per_page: 0 } })
        }

    }

    const handleClickClientFilter = () => {
        if (per == 'client') {
            clear()
        } else {
            setPer('client');
            setRole('all')
            setType('all')
            setNameTalents({ title: 'all', slug: 'all' })
            setDatas({ data: [], pagination: { current_page: 0, total_pages: 0, total_items: 0, items_per_page: 0 } })
        }
    }

    return (
        <nav className='index-navigation type-13'>
            <div className='index-navigation-sort'>
                <label>Sort by</label>
                <ul>
                    <li className={`${type !== 'photography' && type !== 'film' ? 'active' : ''}`} onClick={() => setType('all')}>All</li>
                    <li className={`${type == 'photography' ? 'active' : ''}`} onClick={() => setType('photography')}>Photography</li>
                    <li className={`${type == 'film' ? 'active' : ''}`} onClick={() => setType('film')}>Film</li>
                </ul>
            </div>
            <div className='index-navigation-filter'>
                <label>Filter by</label>
                <ul>
                    <li className={`${per == 'client' ? 'active' : ''}`} onClick={handleClickClientFilter}>Clients [<span className={` option-client ${per == 'client' ? 'active' : ''}`}>{nameClient.title}</span>]</li>
                    <li className={`${per == 'talents' ? 'active' : ''}`} onClick={handleClickTalentFilter}>Talents [<span className={` option-talents ${per == 'talents' ? 'active' : ''}`}>{nameTalents.title}</span>]</li>
                    {nameTalents.slug !== 'all' || nameClient.slug !== 'all' ? <li className='clear-button' onClick={clear}>clear</li> : ''}
                </ul>
            </div>
            {
                per === 'client' && nameClient.slug === 'all' && nameTalents.slug === 'all' ?
                    <div className='index-navigation-role'>
                        <ul>
                            <li className={`${role == 'all' ? 'active' : ''}`} onClick={() => { setRole('all') }}>All</li>
                            <li className={`${role == 'brand' ? 'active' : ''}`} onClick={() => { setRole('brand') }}>Brands</li>
                            <li className={`${role == 'publication' ? 'active' : ''}`} onClick={() => { setRole('publication') }}>Publications</li>
                        </ul>
                    </div>
                    : ''
            }
            {
                per === 'client' ?
                    <ScrollBox>
                        <ul>
                            {/* {names && names.length > 0 && <li className={`${nameClient.slug == 'all' ? 'active' : ''}`} onClick={() => setNameClient({ title: 'all', slug: 'all' })}>All, </li>} */}
                            {names && names.map((item, index) => (
                                <li
                                    className={`${nameClient.slug == item.id ? 'active' : ''}`}
                                    key={`name-${index}${item.slug}`}
                                    onClick={() => setNameClient({ title: item.title, slug: item.id })}
                                >
                                    {item.title}
                                    {names.length - 1 !== index && <span style={{ color: '#000' }}>, </span>}
                                </li>
                            ))}
                        </ul>
                    </ScrollBox>
                    : ''
            }
            {
                per === 'talents' && nameClient.slug === 'all' && nameTalents.slug === 'all' ?
                    <div className='index-navigation-role'>
                        <ul>
                            <li className={`${role == 'photographer' ? 'active' : ''}`} onClick={() => { setRole('photographer') }}>Photographers</li>
                            <li className={`${role == 'director' ? 'active' : ''}`} onClick={() => { setRole('director') }}>Directors</li>
                            <li className={`${role == 'stylism' ? 'active' : ''}`} onClick={() => { setRole('stylism') }}>Stylists</li>
                        </ul>
                    </div>
                    : ''
            }
            {
                per === 'talents' ?
                    <ScrollBox>
                        <ul>
                            {/* {names && names.length > 0 ? <li className={`${nameTalents.slug == 'all' ? 'active' : ''}`} onClick={() => setNameTalents({ title: 'all', slug: 'all' })}>All, </li> : ''} */}
                            {names && names.map((item, index) => (
                                <li className={`${nameTalents.slug == item.id ? 'active' : ''}`} key={`name-${index}${item.slug}`} onClick={() => setNameTalents({ title: item.title, slug: item.id })}>{item.title}{names.length - 1 !== index && <span style={{ color: '#000' }}>, </span>}</li>
                            ))}
                        </ul>
                    </ScrollBox>
                    : ''
            }
        </nav >
    )

}