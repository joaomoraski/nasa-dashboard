import type { NasaImage } from "../../types/neoWs";

interface ImageCardProps {
    image: NasaImage;
}

export default function ImageCard({ image }: ImageCardProps) {

    const keywordsText = Array.isArray(image.keywords) ? image.keywords.join(", ") : "";
    const dateCreatedText = new Date(image.date_created).toLocaleDateString();

    return (
        <div className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs">
            <a href="#">
                {image.media_type === "image" ? (
                    <img className="rounded-base" src={image.href} alt={image.title} />
                ) : image.media_type === "video" ? (
                    <video className="rounded-base" src={image.href} title={image.title} controls />
                ) : (
                    <p>Not supported</p>
                )}
            </a>
            <h5 className="text-blue-600 mt-6 mb-2 text-2xl font-semibold tracking-tight text-heading break-all">{image.title}</h5>
            <p className="text-body">{image.description}</p>
            <hr/>
            <p className="pt-2 text-sm text-left text-body">Data da foto: {dateCreatedText}</p>
            <p className="pt-2 pb-2 text-sm text-left text-body">Palavras-chave: {keywordsText}</p>
            <hr/>
            {image.photographer && (
                <p className="pt-2 text-sm text-left text-body">Fotógrafo: {image.photographer}</p>
            )}
        </div>

    );
}