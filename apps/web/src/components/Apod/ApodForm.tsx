import { useState } from 'react';
import type { FormEvent } from 'react';

interface ApodFormProps {
    onSubmit: (date?: string) => void;
    loading: boolean;
}

/**
 * Form component for selecting APOD date
 */
export function ApodForm({ onSubmit, loading }: ApodFormProps) {
    const [date, setDate] = useState("");

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        onSubmit(date || undefined);
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? "Loading..." : "Fetch"}
            </button>
        </form>
    );
}

