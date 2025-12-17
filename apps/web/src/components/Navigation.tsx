import { Link } from 'react-router-dom';

/**
 * Navigation component
 */
export function Navigation() {
    return (
        <nav style={{ display: 'flex', gap: 12 }}>
            <Link to="/apod">APOD</Link>
            <Link to="/images">NASA Images</Link>
            <Link to="/asteroids">Near Earth Asteroids</Link>
        </nav>
    );
}

