import { IndexResponse } from "@/lib/fetch/fetchIndexData";
import GridIndexSmallItem from "./gridIndexSmallItem";

interface GridIndexSmallProps {
    datas: IndexResponse;
    type: string;
}

export default function GridIndexSmall({ datas, type }: GridIndexSmallProps) {

    console.log(datas)

    return (
        <div
            className='grid-index gap-35 type-9'
        >
            {datas.data.map((item, index) => {
                if (item.thumbnail && item.thumbnail.url) {
                    return <GridIndexSmallItem key={`item-grid-${index}${item?.thumbnail?.url}`} item={item} type={type} index={index} />
                }
            })}
        </div >
    )

}