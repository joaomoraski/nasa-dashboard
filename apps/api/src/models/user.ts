import Favorite from "./favorite";

interface UserProps {
    id: number;
    email: string;
    password: string;
    apiKey: string;
    createdAt: Date;
    updatedAt: Date;
    favorites?: Favorite[];
}

interface UserResponseProps {
    id: number;
    email: string;
    apiKey: string;
    createdAt: Date;
    updatedAt: Date;
    token: string;
}

interface UserWithFavoritesResponseProps {
    id: number;
    email: string;
    apiKey: string;
    createdAt: Date;
    updatedAt: Date;
    token: string;
    favorites: Favorite[];
}

export default class User {
    id: number;
    email: string;
    password: string;
    apiKey: string;
    createdAt: Date;
    updatedAt: Date;
    favorites?: Favorite[];

    constructor(props: UserProps) {
        this.id = props.id;
        this.email = props.email;
        this.password = props.password;
        this.apiKey = props.apiKey;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.favorites = props.favorites;
    }

}

export class UserResponse {
    id: number;
    email: string;
    apiKey: string;
    createdAt: Date;
    updatedAt: Date;
    token: string;

    constructor(props: UserResponseProps) {
        this.id = props.id;
        this.email = props.email;
        this.apiKey = props.apiKey;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.token = props.token;
    }
}

export class UserWithFavoritesResponse {
    id: number;
    email: string;
    apiKey: string;
    createdAt: Date;
    updatedAt: Date;
    favorites: Favorite[];
    token: string;
    
    constructor(props: UserWithFavoritesResponseProps) {
        this.id = props.id;
        this.email = props.email;
        this.apiKey = props.apiKey;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.favorites = props.favorites;
        this.token = props.token;
    }
}

interface UserPublicProps {
    id: number;
    email: string;
    apiKey: string;
    createdAt: Date;
    updatedAt: Date;
    favorites?: Favorite[];
}

export class UserPublic {
    id: number;
    email: string;
    apiKey: string;
    createdAt: Date;
    updatedAt: Date;
    favorites?: Favorite[];

    constructor(props: UserPublicProps) {
        this.id = props.id;
        this.email = props.email;
        this.apiKey = props.apiKey;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.favorites = props.favorites;
    }
}