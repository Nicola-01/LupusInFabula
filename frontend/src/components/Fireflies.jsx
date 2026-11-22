import '../styles/fireflies.css';

/**
 * Animated fireflies background (port of the 25 <div class="firefly"> of jsp/login.jsp).
 * Animations live in styles/fireflies.css (keyframes need plain CSS).
 * @param {{count?: number}} props - number of fireflies (default 25).
 */
export default function Fireflies({ count = 25 }) {
    return (
        <div className="fireflies">
            {Array.from({ length: count }, (_, i) => (
                <div key={i} className="firefly" />
            ))}
        </div>
    );
}
