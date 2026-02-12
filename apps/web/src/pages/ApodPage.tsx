import { useApod } from '../hooks/useApod';
import { ApodForm } from '../components/Apod/ApodForm';
import { ApodContent } from '../components/Apod/ApodContent';
import { ErrorMessage } from '../components/ErrorMessage';

/**
 * APOD (Astronomy Picture of the Day) page
 */
export default function ApodPage() {
    const { data, loading, error, loadApod } = useApod();

    return (
        <div className="w-full px-6 py-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-6">NASA APOD</h1>

                <ApodForm onSubmit={(date) => loadApod(date)} loading={loading} />

                {error && <ErrorMessage message={error} />}

                {data && <ApodContent data={data} />}
            </div>
        </div>
    );
}
