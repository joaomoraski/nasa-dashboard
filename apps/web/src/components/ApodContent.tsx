import type { Apod } from '../types/apod';

interface ApodContentProps {
    data: Apod;
}

/**
 * Component for displaying APOD content
 */
export function ApodContent({ data }: ApodContentProps) {
    return (
        <div style={{ marginTop: 16 }}>
            <h2>
                {data.title} ({data.date})
            </h2>

            {data.media_type === "image" ? (
                <img src={data.url} alt={data.title} style={{ maxWidth: "100%" }} />
            ) : (
                <a href={data.url} target="_blank" rel="noreferrer">
                    Open video
                </a>
            )}

            <p style={{ marginTop: 12 }}>{data.explanation}</p>
        </div>
    );
}

