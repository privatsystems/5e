export interface ImageProps {

    url: string;
    width: number;
    height: number;
    filename?: string;
    alt: string;
    mux?: {
        id: string;
        playback_id: string;
        poster: number | null;
    }
    ratio?: number;
    type?: string;
    heightVh?: number;

}