import { Navigation } from './Navigation';

export default function Header() {
    return (
        <header className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 mb-8">
            <div className="glass-panel rounded-2xl container mx-auto px-4 py-3 flex items-center justify-between">
                <Navigation />
            </div>
        </header>
    );
}
