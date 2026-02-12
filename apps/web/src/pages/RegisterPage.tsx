import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Notification } from "../components/notification";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);
    const { register, loading, error, setError, user } = useAuth();
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

        if (!confirmPassword.trim()) {
            setValidationError("Confirm password is required");
            return;
        }

        if (password !== confirmPassword) {
            setValidationError("Passwords do not match");
            return;
        }

        try {
            await register(email, password, confirmPassword);
            setShowSuccess(true);
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            
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
                    <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400 mb-8">Join NASA Dashboard and explore the cosmos</p>
                    
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
                                placeholder="Create a password"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Confirm your password"
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Sign Up
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
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-500 hover:text-blue-400 font-medium">
                            Sign in
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
