interface NeoFilterFormProps {
    startDate: string;
    endDate: string;
    q: string;
    size: number;
    validationError: string | null;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
    setQ: (q: string) => void;
    setValidationError: (error: string | null) => void;
    setPage: (page: number) => void;
    loadNeoWsList: (startDate: string, endDate: string, page: number, size: number, q: string) => void;
}

function handleSubmit(
    e: React.FormEvent<HTMLFormElement>, 
    startDate: string,
    endDate: string,
    q: string,
    size: number,
    setPage: (page: number) => void,
    loadNeoWsList: (startDate: string, endDate: string, page: number, size: number, q: string) => void) { 
    e.preventDefault();

    setPage(1);
    loadNeoWsList(startDate, endDate, 1, size, q);
}

function handleChange(e: React.ChangeEvent<HTMLInputElement>, setValidationError: (error: string | null) => void, 
    setStartDate: (date: string) => void, setEndDate: (date: string) => void, setQ: (q: string) => void) {
        setValidationError(null);
        const maxDate = new Date().toISOString().split("T")[0];

        if (e.target.name !== "search" && !e.target.value) {
            setValidationError(`${e.target.placeholder} is required`);
            return;
        }

        if (e.target.name === "startDate" || e.target.name === "endDate") {
            if (e.target.value > maxDate) {
                setValidationError("Date cannot be in the future");
                // Don't return here, let the state update but show error
            }
        }

        if (e.target.name === "startDate") {
            setStartDate(e.target.value);
        } else if (e.target.name === "endDate") {
            setEndDate(e.target.value);
        } else if (e.target.name === "search") {
            setQ(e.target.value);
        }
}

export default function NeoFilterForm({ startDate, endDate, q, size, setStartDate, setEndDate, setQ, setValidationError, setPage, loadNeoWsList }: NeoFilterFormProps) {
    const maxDate = new Date().toISOString().split("T")[0];

    return (
        <form 
            onSubmit={(e) => handleSubmit(e, startDate, endDate, q, size, setPage, loadNeoWsList)}
            className="glass-panel p-6 rounded-2xl mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-end lg:gap-6"
        >
            <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Start Date</label>
                <input
                    name="startDate"
                    type="date"
                    value={startDate}
                    max={maxDate}
                    onChange={(e) => handleChange(e, setValidationError, setStartDate, setEndDate, setQ)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all [color-scheme:dark]"
                />
            </div>

            <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">End Date</label>
                <input
                    name="endDate"
                    type="date"
                    value={endDate}
                    max={maxDate}
                    onChange={(e) => handleChange(e, setValidationError, setStartDate, setEndDate, setQ)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all [color-scheme:dark]"
                />
            </div>

            <div className="flex-[2] space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Search Asteroids</label>
                <input
                    name="search"
                    type="text"
                    placeholder="Search by name..."
                    value={q}
                    onChange={(e) => handleChange(e, setValidationError, setStartDate, setEndDate, setQ)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                />
            </div>

            <button 
                type="submit"
                className="w-full lg:w-auto bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 px-8 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-900/20"
            >
                Search
            </button>
        </form>
    );
}
