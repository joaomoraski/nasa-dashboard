// https://images-assets.nasa.gov/video/art001m1203451716/collection.json

import { ApiError } from "../types";

export async function fetchNasaImageMedia(href: string): Promise<any> {
    try {
        if (!href) {
            return undefined;
        }
        const response = await fetch(href);
        if (!response.ok) {
            const body = await response.text();
            throw new ApiError(response.status, `NASA error: ${body}`);
        }
        const data = await response.json();
        for (let item of data) {
            if (item && item.includes('small')) {
                if (item.includes(' ')) {
                    return item.replaceAll(' ', '%20');
                }
                return item;
            }
        }
        return "";
    } catch (error) {
        throw new ApiError(500, `Error fetching NASA image media: ${error}`);
    }
}