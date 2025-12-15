interface NeoFilterFormProps {
    startDate: string;
    endDate: string;
    q: string;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
    setQ: (q: string) => void;
}

/**
 * Form component for filtering Near Earth Objects (NeoWs)
 */
export default function NeoFilterForm({ startDate, endDate, q, setStartDate, setEndDate, setQ }: NeoFilterFormProps) {
    return <form
        onSubmit={(e) => {
            // don't actually need to submit because we fetch on state change,
            // but this prevents full page reload.
            e.preventDefault();
        }}
        style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}
    >
        <label>
            Start date:
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ marginLeft: 8 }}
            />
        </label>

        <label>
            End date:
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ marginLeft: 8 }}
            />
        </label>

        <label>
            Search:
            <input
                type="text"
                placeholder="name or id"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ marginLeft: 8 }}
            />
        </label>
    </form>
}