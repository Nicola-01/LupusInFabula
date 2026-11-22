import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useLoginChecker } from '../utils/session.js';
import { contextPath, genericGETRequest, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from '../utils/utils.js';
import backgroundHtml from '../components/home/homeBackground.html?raw';

// Same colors as Bootstrap alert-info / alert-success / alert-warning (subtle palette, light and dark).
const ALERT = {
    info: 'text-[#055160] bg-[#cff4fc] border-[#9eeaf9] dark:text-[#6edff6] dark:bg-[#032830] dark:border-[#087990]',
    success: 'text-[#0a3622] bg-[#d1e7dd] border-[#a3cfbb] dark:text-[#75b798] dark:bg-[#051b11] dark:border-[#0f5132]',
    warning: 'text-[#664d03] bg-[#fff3cd] border-[#ffe69c] dark:text-[#ffda6a] dark:bg-[#332701] dark:border-[#997404]',
};
const BUTTON = 'block w-full max-w-[200px] mx-auto my-[10px] p-[10px] rounded-[5px] border-none cursor-pointer transition-all duration-300 hover:bg-navbar-inverted-second-bg';
const BUTTON_COLORS = 'bg-navbar-inverted-bg text-bg-first-color';
const LOGOUT_COLORS = 'bg-navbar-second-bg text-text-color';

/**
 * Home page (port of jsp/home.jsp + js/homepage.js + css/homepage.css).
 * The message about the latest/current match comes from GET /lupus/game/list (same as the old script).
 */
export default function Home() {
    const { user } = useLoginChecker();
    const [notice, setNotice] = useState(null); // {kind, text, gameId}

    useEffect(() => { document.title = 'Lupus in Fabula - Home'; }, []);

    // Old inline script: the username is kept in localStorage for the other pages.
    useEffect(() => {
        if (user) localStorage.setItem('playerName', user.username);
    }, [user]);

    // Same logic as setHomeMessage() in js/homepage.js.
    useEffect(() => {
        genericGETRequest(contextPath + 'game/list', (req) => {
            if (req.readyState !== XMLHttpRequest.DONE) return;
            if (req.status === HTTP_STATUS_OK) {
                const game = JSON.parse(req.responseText)['game'];
                const isLatest = game.who_win !== -1;
                setNotice({
                    kind: isLatest ? 'info' : 'success',
                    text: isLatest ? 'Your latest match is:' : 'You are currently playing a match:',
                    gameId: game.public_ID,
                });
            } else if (req.status === HTTP_STATUS_NOT_FOUND) {
                setNotice({ kind: 'warning', text: 'You are not currently playing in any game' });
            }
        });
    }, []);

    return (
        <div className="relative z-0 flex flex-col min-h-screen bg-bg-first-color font-['Jost',sans-serif] leading-[1.5] text-text-color">
            <Navbar />
            <iframe id="background" title="background" srcDoc={backgroundHtml} className="fixed inset-0 w-full h-full z-[-1] border-none" />

            <main className="grow w-full relative z-[1] max-w-[800px] mx-auto p-5 mt-0 min-[768px]:mt-12 min-[768px]:pt-3">
                <h1 className="text-[calc(1.25rem_+_1vw)] font-medium leading-[1.2] mb-6">
                    <span>Welcome back, </span>
                    {user && <span id="username" className="font-bold">{user.username}</span>}
                </h1>

                <div id="messageDiv" className={`mb-2 min-[768px]:mb-12 ${notice ? `relative p-4 border border-solid rounded-md ${ALERT[notice.kind]}` : ''}`}>
                    {notice && (notice.gameId ? <>{notice.text} <a href={`/lupus/village/${notice.gameId}`} className="underline text-[#0d6efd] dark:text-[#6ea8fe]">{notice.gameId}</a></> : notice.text)}
                </div>

                <section className="flex flex-wrap justify-center items-center -mx-3 pt-3">
                    <div className="box rounded-lg text-center leading-[1.6] backdrop-blur-[5px] border-[0.13em] border-solid border-bg-second-color w-full min-[768px]:w-5/12 min-[768px]:m-auto mb-4 p-6">
                        <h2 className="text-[calc(1.3rem_+_.6vw)] font-medium leading-[1.2] mb-2">Habitant</h2>
                        <a href="/lupus/habitant/me" className="no-underline">
                            <button className={`${BUTTON} ${BUTTON_COLORS}`}>Personal Area</button>
                        </a>
                        <a href="/lupus/habitant/" className="no-underline">
                            <button className={`${BUTTON} ${BUTTON_COLORS}`}>Statistics and History</button>
                        </a>
                        <a href="/lupus/logout" className="no-underline">
                            <button id="logoutBT" className={`${BUTTON} ${LOGOUT_COLORS}`}>Logout</button>
                        </a>
                    </div>
                    <div className="box rounded-lg text-center leading-[1.6] backdrop-blur-[5px] border-[0.13em] border-solid border-bg-second-color w-full min-[768px]:w-5/12 min-[768px]:m-auto p-6">
                        <h2 className="text-[calc(1.3rem_+_.6vw)] font-medium leading-[1.2] mb-2">Village</h2>
                        <a href="/lupus/rules" className="no-underline">
                            <button className={`${BUTTON} ${BUTTON_COLORS}`}>Rulebook</button>
                        </a>
                        <a href="/lupus/newVillage" className="no-underline">
                            <button className={`${BUTTON} ${BUTTON_COLORS}`}>Create a village</button>
                        </a>
                        <a href="/lupus/village" className="no-underline">
                            <button className={`${BUTTON} ${BUTTON_COLORS}`}>Join your village</button>
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
