import { useState, useEffect } from 'react';

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
        setIsAnimating(true);
    }, []);

    useEffect(() => {
        if (autoClose > 0) {
            const timer = setTimeout(() => {
                setIsAnimating(false);
                setTimeout(() => {
                    setIsVisible(false);
                    onClose?.();
                }, 300);
            }, autoClose);

            return () => clearTimeout(timer);
        }
    }, [autoClose, onClose]);

    if (!isVisible) {
        return null;
    }

    const typeConfig = {
        success: {
            bg: 'bg-green-600',
            iconBg: 'bg-green-100',
            iconText: 'text-green-600',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ),
            ariaLabel: 'Success icon',
        },
        error: {
            bg: 'bg-red-600',
            iconBg: 'bg-red-100',
            iconText: 'text-red-600',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            ),
            ariaLabel: 'Error icon',
        },
        warning: {
            bg: 'bg-yellow-600',
            iconBg: 'bg-yellow-100',
            iconText: 'text-yellow-600',
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            ),
            ariaLabel: 'Warning icon',
        },
    };

    const config = typeConfig[type];

    return (
        <div 
            className={`fixed top-4 right-4 z-50 flex items-center w-full max-w-sm p-4 ${config.bg} text-white rounded-lg shadow-xl border border-gray-700 transition-all duration-300 ease-in-out ${
                isAnimating 
                    ? 'translate-x-0 opacity-100' 
                    : 'translate-x-[120%] opacity-0'
            }`}
            role="alert"
        >
            <div className={`inline-flex items-center justify-center shrink-0 w-8 h-8 ${config.iconBg} ${config.iconText} rounded-full`}>
                {config.icon}
                <span className="sr-only">{config.ariaLabel}</span>
            </div>
            <div className="ml-3 text-sm font-medium flex-1">{message}</div>
        </div>
    );
}
