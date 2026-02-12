import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Notification } from "../components/notification";

export default function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);
    const { login, loading, error, setError, user } = useAuth();
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            navigate("/apod", { replace: true });
        }
    }, [user, navigate]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setValidationError(null);
        setError(null);
        setShowSuccess(false);

        if (!email.trim()) {
            setValidationError("Email is required");
            return;
        }

        if (!password.trim()) {
            setValidationError("Password is required");
            return;
        }

        try {
            await login(email, password);
            setShowSuccess(true);
            setEmail("");
            setPassword("");

            // redirect after 2 seconds
            setTimeout(() => {
                navigate("/apod");
            }, 2000);
        } catch (error) {
            // error is managed by the context
        }
    }

    return (
        <div className="min-h-screen flex">
            <div className="flex-1 flex items-center justify-center bg-gray-900 p-8">
                <div className="w-full max-w-md">
                    <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400 mb-8">Sign in to your NASA Dashboard account</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Validation Error */}
                    {validationError && (
                        <Notification
                            key={`validation-${validationError}`}
                            message={validationError}
                            type="warning"
                            autoClose={4000}
                            onClose={() => setValidationError(null)}
                        />
                    )}

                    {/* Success Notification */}
                    {showSuccess && (
                        <Notification
                            key="success"
                            message="Account created successfully! Redirecting..."
                            type="success"
                            autoClose={2000}
                        />
                    )}

                    {/* Error Notification */}
                    {error && (
                        <Notification
                            key={`error-${error}`}
                            message={error}
                            type="error"
                            autoClose={5000}
                            onClose={() => setError(null)}
                        />
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="mt-4 text-center">
                            <p className="text-gray-400">Creating your account...</p>
                        </div>
                    )}

                    <p className="mt-6 text-center text-gray-400">
                        Don't have an account?{' '}
                        <a href="/register" className="text-blue-500 hover:text-blue-400 font-medium">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>

            <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-black p-8">
                <div className="text-center">
                    <img
                        src="https://apod.nasa.gov/apod/image/2512/M77_Hubble_960.jpg"
                        alt="Spiral Galaxy with an Active Center "
                        className="w-full max-w-lg rounded-lg shadow-2xl"
                    />
                    <h2 className="text-3xl font-bold text-white mt-8">Explore the Universe</h2>
                    <p className="text-gray-300 mt-4">Discover NASA's amazing space discoveries</p>
                </div>
            </div>
        </div>
    );
}
