import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Notification } from "../components/notification";

function formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export default function ProfilePage() {

    const { user, updateApiKey, error, setError, loading } = useAuth();
    const [apiKey, setApiKey] = useState(user?.apiKey || '');
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.apiKey) {
            setApiKey(user.apiKey);
        }
    }, [user?.apiKey]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setValidationError(null);
        setError(null);

        if (!apiKey.trim()) {
            setValidationError("API Key cannot be empty");
            return;
        }

        if (apiKey === user?.apiKey) {
            setValidationError("API Key is the same as current value");
            return;
        }

        try {
            await updateApiKey(apiKey);
        } catch (error) {
            console.error('Error updating API key:', error);
        }
    }

    return (
        <div className="container mx-auto px-6 py-8 flex-1 flex items-center justify-center">
            {validationError && (
                <Notification 
                    key={`validation-${validationError}`}
                    message={validationError} 
                    type="warning" 
                    autoClose={4000}
                    onClose={() => setValidationError(null)}
                />
            )}
            
            {error && (
                <Notification 
                    key={`error-${error}`}
                    message={error} 
                    type="error" 
                    autoClose={5000}
                    onClose={() => setError(null)}
                />
            )}

            <div className="w-full max-w-4xl h-[70vh] bg-gray-800/40 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-800/30 p-8 flex flex-col gap-4 items-center">
                <h1 className="text-white text-3xl font-bold">Profile</h1>
                <hr className="w-full border-blue-800/30" />
                <form onSubmit={handleSubmit} className="w-full shadow-2xl border border-blue-800/30 rounded-2xl p-4 grid grid-cols-[100px_auto] gap-4 items-center">
                    <p className="text-white">Email: </p>
                    <input type="email" id="email" name="email" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            value={user?.email || ''} disabled />
                    <p className="text-white">API Key: </p>
                    <input type="text" id="apiKey" name="apiKey" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            value={apiKey} onChange={(e) => setApiKey(e.target.value)}/>
                    <p className="text-white">Created At: </p>
                    <input type="text" id="createdAt" name="createdAt" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={formatDate(user?.createdAt)} disabled />
                    <p className="text-white">Updated At: </p>
                    <input type="text" id="updatedAt" name="updatedAt" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                            value={formatDate(user?.updatedAt)} disabled />
                    <div className="col-span-2">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update API Key'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}