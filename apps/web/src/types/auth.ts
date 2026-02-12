export type User = {
    id: number;
    email: string;
    apiKey: string;
    createdAt: Date;
    updatedAt: Date;
}

export type UserResponse = {
    id: number;
    email: string;
    apiKey: string;
    createdAt: Date;
    updatedAt: Date;
    token: string;
}