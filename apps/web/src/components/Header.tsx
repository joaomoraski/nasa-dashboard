import { Navigation } from './Navigation';

export default function Header() {
    return (
        <header className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 border-b border-blue-800/50 shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
            <div className="container mx-auto px-6 py-4">
                <Navigation />
            </div>
        </header>
    );
}
