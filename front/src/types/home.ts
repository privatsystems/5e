import { ImageProps } from "./general";

export interface PageData {
    type: string;
    title: string;
    slug: string;
    id: string;
}

export interface Project {
    title: string;
    slug: string;
    photographer: PageData | null;
    projet: PageData | null;
    client: PageData | null;
    id: string;
    image_count: number; // ← si dispo dans l'API
}

export interface ImageProject {
    type: "imagesprojet";
    project: Project | null;
    thumbnails: ImageProps[];
    thumbnail_type: "full" | "half" | "third" | "fourth";
}

export interface Column {
    item: ImageProject[];
}

export interface LayoutData {
    column: Column[];
}

export interface PaginatedResponse {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    data: LayoutData[];
    intro_images: ImageProps[];
    intro_images_mob: ImageProps[];
}
