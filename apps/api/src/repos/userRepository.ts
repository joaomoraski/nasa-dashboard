import User from "../models/user";

export default interface IUserRepo {
    registerUser(email: string, password: string): Promise<User>;
    getUserById(id: number): Promise<User>;
    getUserByIdWithFavorites(id: number): Promise<User>;
}

export class UserRepository implements IUserRepo {
    async registerUser(email: string, password: string): Promise<User> {
        return new User({ id: 0, email: email, password: password, apiKey: "", createdAt: new Date(), updatedAt: new Date() });
    }
    async getUserById(id: number): Promise<User> {
        return new User({ id: id, email: "", password: "", apiKey: "", createdAt: new Date(), updatedAt: new Date() });
    }
    async getUserByIdWithFavorites(id: number): Promise<User> {
        return new User({ id: id, email: "", password: "", apiKey: "", createdAt: new Date(), updatedAt: new Date() });
    }
    async updateUser(user: User): Promise<User> {
        return new User({ id: user.id, email: user.email, password: user.password, apiKey: user.apiKey, createdAt: user.createdAt, updatedAt: user.updatedAt });
    }
    async deleteUser(id: number): Promise<void> {
        return;
    }
}