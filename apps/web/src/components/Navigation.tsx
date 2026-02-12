import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    const navLinkClass = (path: string) => `
        px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
        ${isActive(path)
            ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }
    `;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="w-full flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 no-underline group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300">
                    🚀
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-white tracking-wide">NASA</span>
                    <span className="text-xs text-cyan-400 font-medium tracking-widest uppercase">Dashboard</span>
                </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-2 p-1 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-sm">
                <Link to="/apod" className={navLinkClass('/apod')}>APOD</Link>
                <Link to="/images" className={navLinkClass('/images')}>Images</Link>
                <Link to="/asteroids" className={navLinkClass('/asteroids')}>Asteroids</Link>
            </nav>

            <div className="flex items-center gap-3">
                {user ? (
                    <>
                        <Link 
                            to="/profile" 
                            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-transparent hover:border-white/10 transition-all ${isActive('/profile') ? 'text-cyan-400' : 'text-slate-400'}`}
                        >
                            <span className="text-sm">{user.email?.split('@')[0]}</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link 
                        to="/login" 
                        className="px-5 py-2 rounded-xl text-sm font-semibold bg-white text-slate-900 hover:bg-cyan-50 transition-colors shadow-lg shadow-white/10"
                    >
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
}
