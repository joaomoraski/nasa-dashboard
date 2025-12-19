interface UserProps {
    id: number;
    email: string;
    password: string;
    apiKey: string;
    createdAt: Date;
    updatedAt: Date;
}

export default class User {
    id: number;
    email: string;
    password: string;
    apiKey: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(props: UserProps) {
        this.id = props.id;
        this.email = props.email;
        this.password = props.password;
        this.apiKey = props.apiKey;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    
}