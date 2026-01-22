import { useState } from 'react';
import type { Apod } from '../../types/apod';

interface ApodContentProps {
    data: Apod;
}

/**
 * Component for displaying APOD content
 */
export function ApodContent({ data }: ApodContentProps) {

    return (
        <div style={{ marginTop: 16 }}>
            <div className="flex justify-center items-center gap-2">
                <h2>
                    {data.title} ({data.date})
                </h2>
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

