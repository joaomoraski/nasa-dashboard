import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types/auth";
import { loginUser as loginUserService, registerUser as registerUserService } from "../services/authService";
import { updateUser as updateUserService } from "../services/authService";
import type { Favorite } from "../types/favorite";
import { addFavorite as addFavoriteService, checkFavorite as checkFavoriteService, getFavoritesByUserId as getFavoritesByUserIdService } from "../services/favoriteService";
import { deleteFavorite as deleteFavoriteService } from "../services/favoriteService";

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, passwordConfirmation: string) => Promise<void>;
    logout: () => void;
    updateApiKey: (apiKey: string) => Promise<void>;
    addFavorite: (favorite: Favorite) => Promise<Favorite>;
    checkFavorite: (fav_type: string, description: string) => Promise<Favorite | null>;
    getFavorites: () => Promise<Favorite[]>;
    deleteFavorite: (id: number) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // load on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    // save to localStorage when changes
    useEffect(() => {
        if (token && user) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, [user, token]);


    const login = async (email: string, password: string) => {
        setError(null);
        setLoading(true);
        
        try {
            const response = await loginUserService(email, password);
            
            setUser({
                id: response.id,
                email: response.email,
                apiKey: response.apiKey,
                createdAt: response.createdAt,
                updatedAt: response.updatedAt,
            });
            setToken(response.token);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const register = async (email: string, password: string, passwordConfirmation: string) => {
        setError(null);
        setLoading(true);

        try {
            const response = await registerUserService(email, password, passwordConfirmation);

            if (!response) {
                throw new Error('Failed to register user');
            }

            setUser({
                id: response.id,
                email: response.email,
                apiKey: response.apiKey,
                createdAt: response.createdAt,
                updatedAt: response.updatedAt,
            });
            setToken(response.token);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setError(errorMessage);
            throw error; // re-throw to the component to detect the error
        } finally {
            setLoading(false);
        }
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    const updateApiKey = async (apiKey: string) => {
        setError(null);
        setLoading(true);

        try {
            if (!user?.id) {
                throw new Error('User not found');
            }

            const response = await updateUserService(user.id, apiKey);

            setUser({
                ...user,
                apiKey: response.apiKey,
                updatedAt: response.updatedAt,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const addFavorite = async (favorite: Favorite) => {
        try {
            if (!user?.id || !token) {
                throw new Error('User not found');
            }

            const response = await addFavoriteService(token, favorite);
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setError(errorMessage);
            throw error;
        }
    }

    const checkFavorite = async (fav_type: string, description: string) => {
        try {
            if (!user?.id || !token) {
                return null;
            }

            const response = await checkFavoriteService(token, fav_type, description);
            return response;
        } catch (error) {
            return null;
        }
    }

    const getFavorites = async () => {
        try {
            if (!user?.id || !token) {
                throw new Error('User not found');
            }

            const response = await getFavoritesByUserIdService(token, user.id);
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setError(errorMessage);
            throw error;
        }
    }

    const deleteFavorite = async (id: number) => {
        try {
            if (!user?.id || !token) {
                throw new Error('User not found');
            }

            const response = await deleteFavoriteService(token, id);
            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            error,
            setLoading,
            setError,
            login,
            register, 
            logout,
            updateApiKey,
            addFavorite,
            checkFavorite,
            getFavorites,
            deleteFavorite
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}