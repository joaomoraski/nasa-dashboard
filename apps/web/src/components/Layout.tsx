import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col text-slate-200 font-sans selection:bg-cyan-500/30">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
