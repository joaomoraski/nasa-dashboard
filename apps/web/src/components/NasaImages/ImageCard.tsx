import type { NasaImage } from "../../types/neoWs";
import { FavoriteButton } from "../favorite/FavoriteButton";

interface ImageCardProps {
    image: NasaImage;
}

export default function ImageCard({ image }: ImageCardProps) {
    const keywordsText = Array.isArray(image.keywords) ? image.keywords.slice(0, 3).join(", ") : "";
    const dateCreatedText = new Date(image.date_created).toLocaleDateString();

    const favorite = {
        id: 0,
        fav_type: "nasa_image",
        media_type: image.media_type,
        description: image.title,
        metadata: image,
    };

    return (
        <div className="group relative glass-panel rounded-2xl overflow-hidden h-full flex flex-col hover:shadow-cyan-500/20 hover:border-cyan-500/30 transition-all duration-300">
            <div className="relative aspect-video overflow-hidden bg-black">
                {image.media_type === "image" ? (
                    <img 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        src={image.href} 
                        alt={image.title} 
                        loading="lazy"
                    />
                ) : image.media_type === "video" ? (
                    <video className="w-full h-full object-cover" src={image.href} title={image.title} controls />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">Not supported</div>
                )}
                
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <div className="bg-black/40 backdrop-blur-md rounded-full p-1">
                        <FavoriteButton favorite={favorite} />
                     </div>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h5 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight group-hover:text-cyan-400 transition-colors">
                    {image.title}
                </h5>
                
                <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-grow">
                    {image.description}
                </p>

                <div className="pt-4 border-t border-white/5 space-y-2 mt-auto">
                    <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>{dateCreatedText}</span>
                        {image.photographer && <span className="truncate max-w-[50%]">{image.photographer}</span>}
                    </div>
                    {keywordsText && (
                        <div className="text-xs text-cyan-500/80 truncate">
                            {keywordsText}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
