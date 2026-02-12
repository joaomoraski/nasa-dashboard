export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 border-t border-blue-800/50 mt-auto py-6">
            <div className="container mx-auto px-6 text-center">
                <p className="text-gray-300 mb-2">NASA Dashboard &copy; {new Date().getFullYear()}</p>
                <p className="text-gray-400 text-sm">
                    Developed by{' '}
                    <a 
                        href="https://github.com/joaomoraski" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                        João Moraski
                    </a>
                </p>
            </div>
        </footer>
    );
}
