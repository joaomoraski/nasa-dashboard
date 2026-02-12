export default function Footer() {
    return (
        <footer className="mt-auto py-8 text-center text-slate-500 text-sm">
            <div className="container mx-auto px-6">
                <p className="mb-2">NASA Dashboard &copy; {new Date().getFullYear()}</p>
                <p>
                    Developed by{' '}
                    <a 
                        href="https://github.com/joaomoraski" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-500 hover:text-cyan-400 transition-colors font-medium"
                    >
                        João Moraski
                    </a>
                </p>
            </div>
        </footer>
    );
}
