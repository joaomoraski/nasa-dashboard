import { API_URL } from '../config/api';
import type { UserResponse } from '../types/auth';

export interface AuthServiceError {
    message: string;
}

export async function registerUser(email: string, password: string, passwordConfirmation: string): Promise<UserResponse | null> {
    const resp = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, passwordConfirmation }),
    });
    
    const body = await resp.json();
    
    if (!resp.ok) {
        // Backend retorna { error: "mensagem" }
        throw new Error(body.error || 'Failed to register user');
    }
    
    return body;
}

export async function loginUser(email: string, password: string): Promise<UserResponse> {
    const resp = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    
    const body = await resp.json();
    
    if (!resp.ok) {
        // Backend retorna { error: "mensagem" }
        throw new Error(body.error || 'Failed to login');
    }
    
    return body;
}

export async function updateUser(id: number, apiKey: string): Promise<UserResponse> {
    const resp = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ apiKey }),
    });
    
    const body = await resp.json();
    
    if (!resp.ok) {
        throw new Error(body.error || 'Failed to update user');
    }
    
    return body;
}