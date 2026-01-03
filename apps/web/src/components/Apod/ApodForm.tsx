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
            <button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Fetch"}
            </button>
        </form>
    );
}

