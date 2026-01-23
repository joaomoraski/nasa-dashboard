import type { Apod } from '../../types/apod';
import { FavoriteButton } from '../favorite/FavoriteButton';
    
interface ApodContentProps {
    data: Apod;
}

/**
 * Component for displaying APOD content
 */
export function ApodContent({ data }: ApodContentProps) {
    const favorite = {
        id: 0,
        fav_type: "apod",
        media_type: data.media_type,
        description: data.title,
        metadata: data,
    };

    return (
        <div style={{ marginTop: 16 }}>
            <div className="flex justify-center items-center gap-2">
                <h2>
                    {data.title} ({data.date})
                </h2>
                <FavoriteButton favorite={favorite} />
            </div>
            {data.media_type === "image" ? (
                <div className="flex justify-center items-center rounded-lg" style={{ marginTop: 12 }}>
                    <img src={data.url} alt={data.title} style={{ maxWidth: "50%", borderRadius: 8 }} />
                </div>
            ) : (
                <div className="flex justify-center" style={{ marginTop: 12 }}>
                    <a href={data.url} target="_blank" rel="noreferrer">
                        Open video
                    </a>
                </div>
            )}

            <p style={{ marginTop: 12 }}>{data.explanation}</p>
        </div>
    );
}

