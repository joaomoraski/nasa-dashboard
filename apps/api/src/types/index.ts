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

// NeoWs API Types
export interface NeoObject {
    id: string;
    name: string;
    is_potentially_hazardous_asteroid: boolean;
    is_sentry_object: boolean;
    estimated_diameter?: {
        meters?: {
            estimated_diameter_min?: number;
            estimated_diameter_max?: number;
        };
    };
    close_approach_data?: Array<{
        orbiting_body: string;
        miss_distance?: {
            kilometers?: string;
        };
        relative_velocity?: {
            kilometers_per_hour?: string;
        };
        close_approach_date_full?: string;
    }>;
}

export interface NeoWsApiResponse {
    near_earth_objects?: Record<string, NeoObject[]>;
    links?: unknown;
    element_count?: number;
}