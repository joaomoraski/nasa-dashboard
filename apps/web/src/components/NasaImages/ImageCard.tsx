import type { NasaImage } from "../../types/neoWs";
import { FavoriteButton } from "../favorite/FavoriteButton";

interface ImageCardProps {
    image: NasaImage;
}

export default function ImageCard({ image }: ImageCardProps) {
    const keywordsText = Array.isArray(image.keywords) ? image.keywords.join(", ") : "";
    const dateCreatedText = new Date(image.date_created).toLocaleDateString();

    const favorite = {
        id: 0,
        fav_type: "nasa_image",
        media_type: image.media_type,
        description: image.title,
        metadata: image,
    };

    return (
        <div className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs flex flex-col h-full">
            <a href="#">
                {image.media_type === "image" ? (
                    <img className="rounded-base w-full" src={image.href} alt={image.title} />
                ) : image.media_type === "video" ? (
                    <video className="rounded-base w-full" src={image.href} title={image.title} controls />
                ) : (
                    <p>Not supported</p>
                )}
            </a>
            <h5 className="text-blue-600 mt-6 mb-2 text-2xl font-semibold tracking-tight text-heading break-all">{image.title}</h5>
            <p className="text-body flex-grow min-h-0">{image.description}</p>
            <div className="mt-auto">
            <hr/>
            <p className="pt-2 text-sm text-left text-body">Photo Date: {dateCreatedText}</p>
            <p className="pt-2 pb-2 text-sm text-left text-body">Keywords: {keywordsText}</p>
            <hr className="mb-2"/>
            {image.photographer && (
                <p className="pb-2 text-sm text-left text-body">Photographer: {image.photographer}</p>
            )}
            <FavoriteButton favorite={favorite} />
            </div>
        </div>

    );
}