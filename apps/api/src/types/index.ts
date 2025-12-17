export class ApiError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

export type NasaItem = {
    href: string;
    data?: NasaImage[];
    links?: Array<{ href: string }>;
}

export type NasaImage = {
    nasa_id: string;
    href: string;
    date_created: string;
    description: string;
    description_508: string;
    keywords: string[];
    media_type: string;
    title: string;
    photographer: string;
}

export type NasaImagesApiResponse = {
    collection: {
        items: NasaItem[];
    };
};