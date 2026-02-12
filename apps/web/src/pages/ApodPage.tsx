import { useApod } from '../hooks/useApod';
import { ApodForm } from '../components/Apod/ApodForm';
import { ApodContent } from '../components/Apod/ApodContent';
import { ErrorMessage } from '../components/ErrorMessage';

export default function ApodPage() {
    const { data, loading, error, loadApod } = useApod();

    return (
        <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-4 pt-4">
                <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 drop-shadow-sm">
                    Cosmic Daily
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Discover the cosmos! Each day a different image or photograph of our fascinating universe is featured, along with a brief explanation written by a professional astronomer.
                </p>
            </div>

            <div className="w-full max-w-md mx-auto">
                <ApodForm onSubmit={(date) => loadApod(date)} loading={loading} />
            </div>

            {error && (
                <div className="w-full max-w-2xl">
                    <ErrorMessage message={error} />
                </div>
            )}

            {data && <ApodContent data={data} />}
        </div>
    );
}
