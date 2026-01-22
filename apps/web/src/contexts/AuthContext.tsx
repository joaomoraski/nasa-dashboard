import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types/auth";
import { loginUser as loginUserService, registerUser as registerUserService } from "../services/authService";
import { updateUser as updateUserService } from "../services/authService";
import type { Favorite } from "../types/favorite";

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
    addFavorite: (favorite: Favorite) => Promise<void>;
    getFavorites: () => Promise<void>;
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
        //
    }

    const getFavorites = async () => {
        // 
    }

    const deleteFavorite = async (id: number) => {
        //
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