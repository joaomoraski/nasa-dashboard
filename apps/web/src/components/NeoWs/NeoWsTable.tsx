import type { AsteroidPreview } from "../../types/neoWs"
import { FavoriteButton } from "../favorite/FavoriteButton";

interface NeoWsTableProps {
    items: AsteroidPreview[] | null
    loading: boolean
    formatNumber: (n: number | null) => string
    setSelectedId: (id: string) => void
}

export default function NeoWsTable({ items, loading, formatNumber, setSelectedId }: NeoWsTableProps) {
    return (
        <div style={{ overflowX: "auto" }}>
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginBottom: 12,
                }}
            >
                <thead>
                    <tr>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #444" }}>
                            Name
                        </th>
                        <th style={{ textAlign: "left", borderBottom: "1px solid #444" }}>
                            Date
                        </th>
                        <th style={{ textAlign: "right", borderBottom: "1px solid #444" }}>
                            Velocity (km/h)
                        </th>
                        <th style={{ textAlign: "right", borderBottom: "1px solid #444" }}>
                            Miss (km)
                        </th>
                        <th style={{ textAlign: "center", borderBottom: "1px solid #444" }}>
                            Flags
                        </th>
                        <th style={{ textAlign: "center", borderBottom: "1px solid #444" }}>
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {items?.map((neo) => (
                        <tr key={neo.id}>
                            <td style={{ padding: "8px 4px" }}>{neo.name}</td>
                            <td style={{ padding: "8px 4px" }}>{neo.date}</td>
                            <td style={{ padding: "8px 4px", textAlign: "right" }}>
                                {formatNumber(neo.velKph)}
                            </td>
                            <td style={{ padding: "8px 4px", textAlign: "right" }}>
                                {formatNumber(neo.missKm)}
                            </td>
                            <td style={{ padding: "8px 4px", textAlign: "center" }}>
                                {neo.hazardous ? "⚠️ hazardous " : ""}
                                {neo.sentry ? "🛰️ sentry" : ""}
                            </td>
                            <td style={{ padding: "8px 4px", textAlign: "center" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                                    <button 
                                        type="button" 
                                        onClick={() => setSelectedId(neo.id)}
                                        style={{ padding: "8px 12px", borderRadius: "4px", color: "white", cursor: "pointer" }}
                                    >
                                        Info+
                                    </button>
                                    <FavoriteButton favorite={{ id: 0, fav_type: "asteroid", media_type: "image", description: neo.name, metadata: neo }} />
                                </div>
                            </td>
                        </tr>
                    ))}

                    {!loading && items?.length === 0 && (
                        <tr>
                            <td colSpan={6} style={{ padding: 12 }}>
                                No results.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}