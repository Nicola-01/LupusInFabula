import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { InfoMessage } from '../components/Messages.jsx';
import PageNotFound from './PageNotFound.jsx';
import { useLoginChecker } from '../utils/session.js';
import { startGame } from '../components/game/currentGame/currentGame.js';
import GameHeader from '../components/game/currentGame/GameHeader.jsx';
import GameActions from '../components/game/currentGame/GameActions.jsx';
import PlayerRole from '../components/game/currentGame/PlayerRole.jsx';
import RolesModal from '../components/game/currentGame/RolesModal.jsx';
import GameOver from '../components/game/currentGame/GameOver.jsx';
import PlayersStatus from '../components/game/currentGame/PlayersStatus.jsx';
import GameLog from '../components/game/currentGame/GameLog.jsx';
import '../styles/currentGame.css';

/**
 * Village page (old jsp/game/currentGame.jsp). Routes: /village/:gameId (player) and /village/:gameId/master.
 * Village data comes from GET /lupus/api/village/<id>: {publicId, isMaster, gameOver} or 404 (PageNotFound).
 * `isMasterRoute` is the old endsWithMaster (URL), `isMaster` the old ${isMaster} (session).
 * The game logic runs in components/game/currentGame/ and is started once the page is rendered.
 */
export default function CurrentGame({ isMasterRoute }) {
    const { gameId } = useParams();
    useLoginChecker(); // redirects to the login page when logged out (loginChecker.jsp)
    const [village, setVillage] = useState(null);

    useEffect(() => {
        let alive = true;
        fetch('/lupus/api/village/' + encodeURIComponent(gameId), { credentials: 'same-origin' })
            .then((r) => (r.status === 404 ? { notFound: true } : r.ok ? r.json() : null))
            .catch(() => null)
            .then((data) => { if (alive) setVillage(data); });
        return () => { alive = false; };
    }, [gameId]);

    const ready = village !== null && !village.notFound;

    useEffect(() => {
        if (!ready) return undefined;
        return startGame(gameId, isMasterRoute);
    }, [ready, gameId, isMasterRoute]);

    if (village === null) return null;
    if (village.notFound) return <PageNotFound />;

    const isOver = village.gameOver !== null && village.gameOver >= 0;

    return (
        <div className="current-game flex min-h-screen flex-col">
            <Navbar />

            <main className="container mx-auto w-full grow px-3 min-[576px]:max-w-[540px] min-[768px]:max-w-[720px] min-[992px]:max-w-[960px] min-[1200px]:max-w-[1140px] min-[1400px]:max-w-[1320px]">
                <InfoMessage />

                <div id="actionResults"></div>

                {isOver ? (
                    <GameOver />
                ) : (
                    <>
                        <GameHeader isMaster={village.isMaster} gameId={gameId} />

                        {village.isMaster ? (
                            <GameActions />
                        ) : (
                            <>
                                <PlayerRole />
                                <RolesModal gameId={gameId} />
                            </>
                        )}
                    </>
                )}

                <div className="flex flex-wrap -mx-3">
                    <PlayersStatus />
                    <GameLog />
                </div>
            </main>

            <Footer />
        </div>
    );
}
