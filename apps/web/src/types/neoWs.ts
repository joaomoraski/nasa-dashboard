export type AsteroidPreview = {
    id: string;
    name:string;
    date: string;
    hazardous: boolean;
    sentry: boolean;
    diameterMinM: number | null;
    diameterMaxM: number | null;
    missKm: number | null;
    velKph: number | null;
    approachDateFull: string | null;
}

export type Meta = {
    page: number;
    size: number;
    total: number;
    totalPages: number;
    start: number;
    end: number;
}

export type NeoWsResponse = {
    meta: Meta;
    items: AsteroidPreview[];
}