import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadTheme } from './Navbar.jsx';
import { hideAllMessages } from '../utils/message.js';

/*
 * Per-page side effects of a client-side navigation (the full reload used to do this for free).
 * Mounted once inside the router, before <Routes>: its effect runs before the page's own effects,
 * so messages a page populates on mount stay visible.
 */
export default function RouteEffects() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = 'Lupus in Fabula'; // index.html default; pages with their own title set it in their mount effect
        hideAllMessages();
        loadTheme();
    }, [pathname]);
    return null;
}
