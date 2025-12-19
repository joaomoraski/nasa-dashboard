import User from "./user"

interface FavoritesProps {
    id: number,
    userId: number,
    fav_type: string,
    media_type: string,
    description: string,
    metadata: any,
    createdAt: Date,
    updatedAt: Date,
}

export default class Favorites {
    id: number;
    userId: number;
    fav_type: string;
    media_type: string;
    description: string;
    metadata: any;
    createdAt: Date;
    updatedAt: Date;

    constructor(props: FavoritesProps) {
        this.id = props.id;
        this.userId = props.userId;
        this.fav_type = props.fav_type;
        this.media_type = props.media_type;
        this.description = props.description;
        this.metadata = props.metadata;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }
}