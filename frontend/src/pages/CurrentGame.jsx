import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import PageNotFound from './PageNotFound.jsx';
import { useLoginChecker } from '../utils/session.js';
import VillagePage from '../components/game/currentGame/VillagePage.jsx';

/**
 * Village page (old jsp/game/currentGame.jsp). Routes: /village/:gameId (player) and /village/:gameId/master.
 * Village data comes from GET /api/village/<id>: {publicId, isMaster, gameOver} or 404 (PageNotFound).
 * `isMasterRoute` is the old endsWithMaster (URL), `village.isMaster` the old ${isMaster} (session).
 * State, requests and WebSocket live in components/game/currentGame/useGame.js.
 */
export default function CurrentGame({ isMasterRoute }) {
    const { gameId } = useParams();
    useLoginChecker(); // redirects to the login page when logged out (loginChecker.jsp)
    const [village, setVillage] = useState(null);

    useEffect(() => {
        let alive = true;
        fetch('/api/village/' + encodeURIComponent(gameId), { credentials: 'same-origin' })
            .then((r) => (r.status === 404 ? { notFound: true } : r.ok ? r.json() : null))
            .catch(() => null)
            .then((data) => { if (alive) setVillage(data); });
        return () => { alive = false; };
    }, [gameId]);

    if (village === null) return null;
    if (village.notFound) return <PageNotFound />;

    return (
        <div className="lf-page lf-game flex min-h-screen flex-col font-lf-body text-lf-ink">
            <Navbar />
            <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pt-4 sm:px-6">
                <VillagePage gameId={gameId} isMasterRoute={isMasterRoute} village={village} />
            </main>
        </div>
    );
}
