interface ErrorMessageProps {
    message: string;
}

/**
 * Component for displaying error messages
 */
export function ErrorMessage({ message }: ErrorMessageProps) {
    return <p style={{ color: "crimson" }}>Error: {message}</p>;
}

