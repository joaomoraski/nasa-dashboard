import { useState } from 'react';
import type { FormEvent } from 'react';

interface ApodFormProps {
    onSubmit: (date?: string) => void;
    loading: boolean;
}

export function ApodForm({ onSubmit, loading }: ApodFormProps) {
    const [date, setDate] = useState("");
    const maxDate = new Date().toISOString().split("T")[0];

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (date > maxDate) {
            alert("Date cannot be in the future");
            return;
        }
        onSubmit(date || undefined);
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-sm">
            <input
                type="date"
                value={date}
                max={maxDate}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 bg-transparent text-white px-4 py-2 outline-none border-none placeholder-slate-500 min-w-0 [color-scheme:dark]"
            />
            <button 
                type="submit" 
                disabled={loading}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-900/20"
            >
                {loading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading
                    </span>
                ) : (
                    "Time Travel"
                )}
            </button>
        </form>
    );
}
