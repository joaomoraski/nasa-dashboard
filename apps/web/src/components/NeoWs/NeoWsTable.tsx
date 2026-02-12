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
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-white/5 text-xs uppercase font-semibold text-slate-400">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Velocity (km/h)</th>
                            <th className="px-6 py-4 text-right">Miss Distance (km)</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-white/5">
                        {items?.map((neo) => (
                            <tr key={neo.id} className="hover:bg-white/5 transition-colors duration-150">
                                <td className="px-6 py-4 font-medium text-white">{neo.name}</td>
                                <td className="px-6 py-4">{neo.date}</td>
                                <td className="px-6 py-4 text-right font-mono text-cyan-400">
                                    {formatNumber(neo.velKph)}
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-indigo-400">
                                    {formatNumber(neo.missKm)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center gap-2">
                                        {neo.hazardous && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                Hazardous
                                            </span>
                                        )}
                                        {neo.sentry && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                Sentry
                                            </span>
                                        )}
                                        {!neo.hazardous && !neo.sentry && (
                                            <span className="text-slate-600">-</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <button 
                                            type="button" 
                                            onClick={() => setSelectedId(neo.id)}
                                            className="text-cyan-400 hover:text-cyan-300 font-medium text-xs uppercase tracking-wider transition-colors"
                                        >
                                            Details
                                        </button>
                                        <div className="scale-75">
                                            <FavoriteButton favorite={{ id: 0, fav_type: "asteroid", media_type: "image", description: neo.name, metadata: neo }} />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {!loading && items?.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                    No asteroids found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
