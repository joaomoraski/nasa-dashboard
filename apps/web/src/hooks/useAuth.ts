import { useState } from 'react';
import type { User } from '../types/auth';
import { registerUser as registerUserService } from '../services/authService';

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    error: string | null;
    registerUser: (email: string, password: string, passwordConfirmation: string) => Promise<void>; 
    loginUser: (email: string, password: string) => Promise<void>;
}

/**
 * Custom hook for fetching APOD data
 */
export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);


    const registerUser = async (email: string, password: string, confirmationPassword: string) => {
        setLoading(true);
        setError(null);

        try {
            const result = await registerUserService(email, password, confirmationPassword);
            if (!result) {
                setError('Failed to register user');
                return;
            }
            setUser(result.user);
            localStorage.setItem('token', result.token);

        } catch (error) {
            setError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }

    return { data, loading, error, loadApod };
}

