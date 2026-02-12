import { useEffect, useState } from 'react';

type NotificationType = 'success' | 'error' | 'warning';

interface NotificationProps {
    message: string;
    type: NotificationType;
    onClose?: () => void;
    autoClose?: number; // ms time
}

export function Notification({ message, type, onClose, autoClose = 5000 }: NotificationProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Trigger animation in next tick
        const timer = setTimeout(() => setIsAnimating(true), 10);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (autoClose > 0) {
            const timer = setTimeout(() => {
                setIsAnimating(false);
                setTimeout(() => {
                    setIsVisible(false);
                    onClose?.();
                }, 300); // Wait for animation to finish
            }, autoClose);

            return () => clearTimeout(timer);
        }
    }, [autoClose, onClose]);

    if (!isVisible) {
        return null;
    }

    const typeConfig = {
        success: {
            bg: 'bg-green-500/10 border-green-500/20 text-green-200',
            icon: (
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            ),
        },
        error: {
            bg: 'bg-red-500/10 border-red-500/20 text-red-200',
            icon: (
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
            ),
        },
        warning: {
            bg: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-200',
            icon: (
                <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
            ),
        },
    };

    const config = typeConfig[type];

    return (
        <div 
            className={`flex items-center gap-3 w-full p-4 rounded-xl border backdrop-blur-md transition-all duration-300 ${config.bg} ${
                isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}
            role="alert"
        >
            <div className="shrink-0 flex items-center justify-center">
                {config.icon}
            </div>
            <div className="text-sm font-medium flex-1">{message}</div>
            {onClose && (
                <button 
                    onClick={() => {
                        setIsAnimating(false);
                        setTimeout(() => {
                            setIsVisible(false);
                            onClose();
                        }, 300);
                    }}
                    className="opacity-50 hover:opacity-100 transition-opacity"
                >
                    ✕
                </button>
            )}
        </div>
    );
}
