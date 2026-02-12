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

            setTimeout(() => {
                navigate("/apod");
            }, 2000);
        } catch (error) {
            // error is managed by the context
        }
    }

    return (
        <div className="min-h-screen flex text-slate-200 font-sans">
            <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
                 {/* Background Elements */}
                 <div className="absolute top-0 left-0 w-full h-full bg-slate-950 z-0"></div>
                 <div className="absolute -top-20 -left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl z-0"></div>
                 <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl z-0"></div>

                <div className="w-full max-w-md relative z-10 space-y-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">Welcome Back</h1>
                        <p className="text-slate-400 text-lg">Sign in to your NASA Dashboard account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 glass-panel p-8 rounded-3xl border border-white/5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 ml-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="glass-input w-full px-5 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 [color-scheme:dark]"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-300 ml-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="glass-input w-full px-5 py-3 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 [color-scheme:dark]"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 px-4 rounded-xl transition duration-200 shadow-lg shadow-cyan-900/30 transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                     Signing in...
                                </span>
                            ) : "Sign In"}
                        </button>
                    </form>

                    {/* Notifications */}
                    <div className="space-y-2">
                        {validationError && (
                            <Notification
                                key={`validation-${validationError}`}
                                message={validationError}
                                type="warning"
                                autoClose={4000}
                                onClose={() => setValidationError(null)}
                            />
                        )}
                        {showSuccess && (
                            <Notification
                                key="success"
                                message="Welcome back! Redirecting..."
                                type="success"
                                autoClose={2000}
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
                    </div>

                    <p className="text-center text-slate-400">
                        Don't have an account?{' '}
                        <a href="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>

            <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-black">
                <div className="absolute inset-0 bg-[url('https://apod.nasa.gov/apod/image/2512/M77_Hubble_960.jpg')] bg-cover bg-center opacity-60"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                
                <div className="relative z-10 text-center p-12 max-w-2xl glass-panel rounded-3xl border border-white/10 backdrop-blur-md">
                    <h2 className="text-4xl font-bold text-white mb-6">Explore the Universe</h2>
                    <p className="text-slate-200 text-xl leading-relaxed">
                        "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself."
                    </p>
                    <p className="text-slate-400 mt-4 font-medium">— Carl Sagan</p>
                </div>
            </div>
        </div>
    );
}
