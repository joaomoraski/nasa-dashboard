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
        // clean validation error for new inputs
        setValidationError(null);

        if (e.target.name !== "search" && !e.target.value) {
            setValidationError(`${e.target.placeholder} is required`);
            return;
        }

        if (e.target.name === "startDate") {
            setStartDate(e.target.value);
        } else if (e.target.name === "endDate") {
            setEndDate(e.target.value);
        } else if (e.target.name === "search") {
            setQ(e.target.value);
        }
}

/**
 * Form component for filtering Near Earth Objects (NeoWs)
 */
export default function NeoFilterForm({ startDate, endDate, q, size, setStartDate, setEndDate, setQ, setValidationError, setPage, loadNeoWsList }: NeoFilterFormProps) {
    return <form onSubmit={(e) => handleSubmit(e, startDate, endDate, q, size, setPage, loadNeoWsList)}
            style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        <label>
            Start date:
            <input
                name="startDate"
                type="date"
                value={startDate}
                onChange={(e) => handleChange(e, setValidationError, setStartDate, setEndDate, setQ)}
                placeholder="Start date"
                style={{ marginLeft: 8 }}
            />
        </label>

        <label>
            End date:
            <input
                name="endDate"
                type="date"
                value={endDate}
                onChange={(e) => handleChange(e, setValidationError, setStartDate, setEndDate, setQ)}
                placeholder="End date"
                style={{ marginLeft: 8 }}
            />
        </label>

        <label>
            Search:
            <input
                name="search"
                type="text"
                placeholder="name"
                value={q}
                onChange={(e) => handleChange(e, setValidationError, setStartDate, setEndDate, setQ)}
                style={{ marginLeft: 8 }}
            />
        </label>

        <button type="submit">Search</button>
    </form>
}