import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import PageNotFound from './PageNotFound.jsx';
import { useLoginChecker } from '../utils/session.js';
import { contextPath, genericGETRequest, HTTP_STATUS_OK } from '../utils/utils.js';
import VillagePage from '../components/game/currentGame/VillagePage.jsx';

/**
 * Village page (old jsp/game/currentGame.jsp). Routes: /village/:gameId (player) and /village/:gameId/master.
 * Village data comes from GET /api/village/<id>: {publicId, isMaster, gameOver} or 404 (PageNotFound).
 * `isMasterRoute` is the old endsWithMaster (URL), `village.isMaster` the old ${isMaster} (session).
 * State, requests and WebSocket live in components/game/currentGame/useGame.js.
 */

// Inside the page: the URL and the session decide the mode; a wrong URL is replaced (old backend redirect).
function GamePage({ isMasterRoute, onReload }) {
    const { gameId } = useParams();
    const navigate = useNavigate();
    useLoginChecker(); // redirects to the login page when logged out (loginChecker.jsp)
    const [village, setVillage] = useState(null);

    useEffect(() => {
        let alive = true;
        fetch('/api/village/' + encodeURIComponent(gameId), { credentials: 'same-origin' })
            .then((r) => (r.status === 404 ? { notFound: true } : r.ok ? r.json() : null))
            .catch(() => null)
            .then((data) => { if (alive) setVillage((prev) => data ?? prev); });
        return () => { alive = false; };
    }, [gameId]);

    const wantMaster = !!village?.isMaster;
    const wrongMode = village !== null && !village.notFound && wantMaster !== !!isMasterRoute;
    useEffect(() => {
        if (wrongMode) navigate(`/village/${encodeURIComponent(gameId)}${wantMaster ? '/master' : ''}`, { replace: true });
    }, [wrongMode, wantMaster, gameId, navigate]);

    if (village === null || wrongMode) return null;
    if (village.notFound) return <PageNotFound />;

    return (
        <div className="lf-page lf-game flex min-h-screen flex-col font-lf-body text-lf-ink">
            <Navbar />
            <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pt-4 sm:px-6">
                <VillagePage gameId={gameId} isMasterRoute={isMasterRoute} village={village} onReload={onReload} />
            </main>
        </div>
    );
}

export default function CurrentGame({ isMasterRoute }) {
    const { gameId } = useParams();
    const [reloads, setReloads] = useState(0);
    // A new game remounts the page (fresh state). A reload (old location.reload()) does too: the sockets close with the unmount.
    return <GamePage key={gameId + '#' + reloads} isMasterRoute={isMasterRoute} onReload={() => setReloads((n) => n + 1)} />;
}

/** /village without id (old redirect): the logged player's current game, or the home page. Same API as Home. */
export function JoinVillage() {
    const navigate = useNavigate();
    useEffect(() => {
        let alive = true;
        genericGETRequest(contextPath + 'game/list', (req) => {
            if (req.readyState !== XMLHttpRequest.DONE || !alive) return;
            const game = req.status === HTTP_STATUS_OK ? JSON.parse(req.responseText)['game'] : null;
            navigate(game ? '/village/' + encodeURIComponent(game.public_ID) : '/home', { replace: true });
        });
        return () => { alive = false; };
    }, [navigate]);
    return null;
}
