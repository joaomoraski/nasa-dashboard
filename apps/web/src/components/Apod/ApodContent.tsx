import type { Apod } from '../../types/apod';
import { FavoriteButton } from '../favorite/FavoriteButton';
    
interface ApodContentProps {
    data: Apod;
}

export function ApodContent({ data }: ApodContentProps) {
    const favorite = {
        id: 0,
        fav_type: "apod",
        media_type: data.media_type,
        description: data.title,
        metadata: data,
    };

    return (
        <div className="glass-panel rounded-3xl overflow-hidden w-full max-w-5xl animate-float">
            {/* Media Section */}
            <div className="relative w-full aspect-video bg-black/50 group">
                {data.media_type === "image" ? (
                    <img 
                        src={data.url} 
                        alt={data.title} 
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <iframe
                        src={data.url}
                        title={data.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                )}
                
                <div className="absolute top-4 right-4 z-10">
                   <div className="bg-black/30 backdrop-blur-md rounded-full p-1 border border-white/10 hover:bg-black/50 transition-colors">
                        <FavoriteButton favorite={favorite} />
                   </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-10 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                            {data.title}
                        </h2>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {data.date}
                        </span>
                    </div>
                </div>

                <div className="prose prose-invert max-w-none">
                    <p className="text-slate-300 leading-relaxed text-lg">
                        {data.explanation}
                    </p>
                </div>

                {data.copyright && (
                    <div className="pt-6 text-sm text-slate-500 font-medium">
                        &copy; {data.copyright}
                    </div>
                )}
            </div>
        </div>
    );
}
