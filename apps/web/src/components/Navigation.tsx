import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Navigation component
 */
export function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 no-underline">
                <div className="text-2xl font-bold text-white">
                    🚀 NASA
                </div>
                <span className="text-gray-400">Dashboard</span>
            </Link>
            
            <div className="flex items-center gap-1">
                <Link 
                    to="/apod" 
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isActive('/apod') 
                            ? 'bg-blue-600' 
                            : 'hover:bg-gray-800'
                    }`}
                >
                    APOD
                </Link>
                <Link 
                    to="/images" 
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isActive('/images') 
                            ? 'bg-blue-600' 
                            : 'hover:bg-gray-800'
                    }`}
                >
                    Images
                </Link>
                <Link 
                    to="/asteroids" 
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isActive('/asteroids') 
                            ? 'bg-blue-600' 
                            : 'hover:bg-gray-800'
                    }`}
                >
                    Asteroids
                </Link>
                {user ? (
                    <>
                        <Link 
                            to="/profile" 
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                isActive('/profile') 
                                    ? 'bg-blue-600' 
                                    : 'hover:bg-gray-800'
                            }`}
                        >
                            Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-red-600 bg-red-700 text-white"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link 
                        to="/login" 
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            isActive('/login') 
                                ? 'bg-blue-600' 
                                : 'hover:bg-gray-800'
                        }`}
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}

