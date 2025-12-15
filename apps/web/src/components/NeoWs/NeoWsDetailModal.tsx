interface NeoWsDetailModalProps {
    selectedId: string | null
    setSelectedId: (id: string | null) => void
    detailLoading: boolean
    detailError: string | null
    detailResponse: any | null
    formatNumber: (n: number | null) => string
}

export default function NeoWsDetailModal({ selectedId, setSelectedId, detailLoading, detailError, detailResponse, formatNumber }: NeoWsDetailModalProps) {
    if (!selectedId) return null;
    return (<div
        role="dialog"
        aria-modal="true"
        style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
        }}
        onClick={() => setSelectedId(null)} // click outside closes
    >
        <div
            style={{
                background: "#111",
                border: "1px solid #333",
                borderRadius: 8,
                width: "min(900px, 100%)",
                maxHeight: "80vh",
                overflow: "auto",
                padding: 16,
            }}
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
        >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>Asteroid details: {selectedId}</h3>
                <button type="button" onClick={() => setSelectedId(null)}>
                    Close
                </button>
            </div>

            {detailLoading && <p>Loading details...</p>}
            {detailError && <p style={{ color: "tomato" }}>{detailError}</p>}

            {detailResponse && (
                <div style={{ marginTop: 16 }}>
                    {/* Basic Info */}
                    <div style={{ marginBottom: 24 }}>
                        <h4 style={{ marginBottom: 8, fontSize: "1.2em" }}>
                            {detailResponse.name}
                        </h4>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                            <div>
                                <strong>ID:</strong> {detailResponse.id}
                            </div>
                            <div>
                                <strong>Designation:</strong> {detailResponse.designation}
                            </div>
                            {detailResponse.nasa_jpl_url && (
                                <a
                                    href={detailResponse.nasa_jpl_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: "#646cff" }}
                                >
                                    View on NASA JPL →
                                </a>
                            )}
                        </div>
                        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                            {detailResponse.is_potentially_hazardous_asteroid && (
                                <span style={{
                                    background: "#ff4444",
                                    color: "white",
                                    padding: "4px 12px",
                                    borderRadius: 12,
                                    fontSize: "0.9em"
                                }}>
                                    ⚠️ Potentially Hazardous
                                </span>
                            )}
                            {detailResponse.is_sentry_object && (
                                <span style={{
                                    background: "#ffaa00",
                                    color: "white",
                                    padding: "4px 12px",
                                    borderRadius: 12,
                                    fontSize: "0.9em"
                                }}>
                                    🛰️ Sentry Object
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Physical Properties */}
                    <div style={{ marginBottom: 24, padding: 16, background: "#1a1a1a", borderRadius: 8 }}>
                        <h4 style={{ marginBottom: 12, fontSize: "1.1em" }}>Physical Properties</h4>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                            <div>
                                <div style={{ color: "#888", fontSize: "0.9em" }}>Absolute Magnitude</div>
                                <div style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                                    {detailResponse.absolute_magnitude_h?.toFixed(2) ?? "N/A"}
                                </div>
                            </div>
                            {detailResponse.estimated_diameter && (
                                <>
                                    <div>
                                        <div style={{ color: "#888", fontSize: "0.9em" }}>Diameter (km)</div>
                                        <div style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                                            {formatNumber(detailResponse.estimated_diameter.kilometers?.estimated_diameter_min)} - {formatNumber(detailResponse.estimated_diameter.kilometers?.estimated_diameter_max)} km
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ color: "#888", fontSize: "0.9em" }}>Diameter (m)</div>
                                        <div style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                                            {formatNumber(detailResponse.estimated_diameter.meters?.estimated_diameter_min)} - {formatNumber(detailResponse.estimated_diameter.meters?.estimated_diameter_max)} m
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Orbital Data */}
                    {detailResponse.orbital_data && (
                        <div style={{ marginBottom: 24, padding: 16, background: "#1a1a1a", borderRadius: 8 }}>
                            <h4 style={{ marginBottom: 12, fontSize: "1.1em" }}>Orbital Data</h4>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                                <div>
                                    <div style={{ color: "#888", fontSize: "0.9em" }}>Orbit Class</div>
                                    <div style={{ fontWeight: "bold" }}>
                                        {detailResponse.orbital_data.orbit_class?.orbit_class_type ?? "N/A"}
                                    </div>
                                    {detailResponse.orbital_data.orbit_class?.orbit_class_description && (
                                        <div style={{ fontSize: "0.85em", color: "#aaa", marginTop: 4 }}>
                                            {detailResponse.orbital_data.orbit_class.orbit_class_description}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div style={{ color: "#888", fontSize: "0.9em" }}>Eccentricity</div>
                                    <div style={{ fontWeight: "bold" }}>
                                        {detailResponse.orbital_data.eccentricity
                                            ? Number(detailResponse.orbital_data.eccentricity).toFixed(4)
                                            : "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: "#888", fontSize: "0.9em" }}>Inclination</div>
                                    <div style={{ fontWeight: "bold" }}>
                                        {detailResponse.orbital_data.inclination
                                            ? Number(detailResponse.orbital_data.inclination).toFixed(2) + "°"
                                            : "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: "#888", fontSize: "0.9em" }}>Orbital Period</div>
                                    <div style={{ fontWeight: "bold" }}>
                                        {detailResponse.orbital_data.orbital_period
                                            ? Number(detailResponse.orbital_data.orbital_period).toFixed(2) + " days"
                                            : "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: "#888", fontSize: "0.9em" }}>Semi-major Axis</div>
                                    <div style={{ fontWeight: "bold" }}>
                                        {detailResponse.orbital_data.semi_major_axis
                                            ? Number(detailResponse.orbital_data.semi_major_axis).toFixed(4) + " AU"
                                            : "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: "#888", fontSize: "0.9em" }}>Perihelion Distance</div>
                                    <div style={{ fontWeight: "bold" }}>
                                        {detailResponse.orbital_data.perihelion_distance
                                            ? Number(detailResponse.orbital_data.perihelion_distance).toFixed(4) + " AU"
                                            : "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: "#888", fontSize: "0.9em" }}>Aphelion Distance</div>
                                    <div style={{ fontWeight: "bold" }}>
                                        {detailResponse.orbital_data.aphelion_distance
                                            ? Number(detailResponse.orbital_data.aphelion_distance).toFixed(4) + " AU"
                                            : "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: "#888", fontSize: "0.9em" }}>Minimum Orbit Intersection</div>
                                    <div style={{ fontWeight: "bold" }}>
                                        {detailResponse.orbital_data.minimum_orbit_intersection ?? "N/A"} AU
                                    </div>
                                </div>
                            </div>
                            {detailResponse.orbital_data.first_observation_date && (
                                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #333" }}>
                                    <div style={{ fontSize: "0.9em", color: "#aaa" }}>
                                        First observed: {detailResponse.orbital_data.first_observation_date} |
                                        Last observed: {detailResponse.orbital_data.last_observation_date ?? "N/A"} |
                                        Observations: {detailResponse.orbital_data.observations_used ?? "N/A"}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Close Approaches */}
                    {detailResponse.close_approach_data && detailResponse.close_approach_data.length > 0 && (
                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{ marginBottom: 12, fontSize: "1.1em" }}>Close Approaches</h4>
                            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9em" }}>
                                    <thead>
                                        <tr style={{ borderBottom: "1px solid #333" }}>
                                            <th style={{ textAlign: "left", padding: "8px", color: "#888" }}>Date</th>
                                            <th style={{ textAlign: "left", padding: "8px", color: "#888" }}>Body</th>
                                            <th style={{ textAlign: "right", padding: "8px", color: "#888" }}>Velocity (km/h)</th>
                                            <th style={{ textAlign: "right", padding: "8px", color: "#888" }}>Miss Distance (km)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {detailResponse.close_approach_data.slice(0, 20).map((approach: any, idx: number) => (
                                            <tr key={idx} style={{ borderBottom: "1px solid #222" }}>
                                                <td style={{ padding: "8px" }}>
                                                    {approach.close_approach_date_full ?? approach.close_approach_date}
                                                </td>
                                                <td style={{ padding: "8px" }}>
                                                    {approach.orbiting_body}
                                                </td>
                                                <td style={{ padding: "8px", textAlign: "right" }}>
                                                    {formatNumber(
                                                        approach.relative_velocity?.kilometers_per_hour
                                                            ? Number(approach.relative_velocity.kilometers_per_hour)
                                                            : null
                                                    )}
                                                </td>
                                                <td style={{ padding: "8px", textAlign: "right" }}>
                                                    {formatNumber(
                                                        approach.miss_distance?.kilometers
                                                            ? Number(approach.miss_distance.kilometers)
                                                            : null
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {detailResponse.close_approach_data.length > 20 && (
                                    <div style={{ marginTop: 8, fontSize: "0.85em", color: "#888", textAlign: "center" }}>
                                        Showing first 20 of {detailResponse.close_approach_data.length} approaches
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
);
}