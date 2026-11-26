import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Castle, History, LogOut, Plus, UserRound, Users } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { Button } from '@/components/ui/button.jsx';
import { MessageBox, Ornament, Panel } from '@/components/lupus';
import { useLoginChecker } from '../utils/session.js';
import { contextPath, genericGETRequest, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from '../utils/utils.js';
import backgroundHtml from '../components/home/villageBackground.html?raw';

// Global `a` colour/underline rules would override the button colours: the entry links get `!` overrides.
const ENTRY_TEXT = { felt: '!text-lf-on-felt', brass: '!text-lf-ink', wax: '!text-lf-wax-text' };

// Client-side Link; reloadDocument only for /logout (backend endpoint that invalidates the session).
function EntryLink({ to, variant, id, icon: Icon, reloadDocument, children }) {
    return (
        <Button asChild variant={variant} size="touch" className={`w-full !no-underline ${ENTRY_TEXT[variant]}`}>
            <Link to={to} id={id} reloadDocument={reloadDocument}>
                <Icon className="size-4" aria-hidden="true" />
                {children}
            </Link>
        </Button>
    );
}

function Block({ title, icon: Icon, children }) {
    return (
        <Panel className="flex flex-col gap-4 p-6">
            <h2 className="flex items-center gap-2 font-lf-title text-xl font-bold text-lf-rubric">
                <Icon className="size-5 text-lf-brass" aria-hidden="true" />
                {title}
            </h2>
            <Ornament />
            <div className="flex flex-col gap-3">{children}</div>
        </Panel>
    );
}

/**
 * Home page (port of jsp/home.jsp + js/homepage.js + css/homepage.css).
 * The message about the latest/current match comes from GET /game/list (same as the old script).
 */
export default function Home() {
    const { user } = useLoginChecker();
    const [notice, setNotice] = useState(null); // {kind, text, gameId}
    // shortcut: first paint uses the body theme as set so far, Navbar's loadTheme() updates the iframe afterwards.
    const theme = document.body.dataset.bsTheme || 'light';
    const html = backgroundHtml.replace('<html lang="en">', `<html lang="en" data-bs-theme="${theme}">`);

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
        <div className="lf-page relative z-0 flex min-h-screen flex-col font-lf-body text-lf-ink">
            <Navbar />
            <iframe id="background" title="background" srcDoc={html} className="fixed inset-0 z-[-1] h-full w-full border-none" />

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
                <div className="flex flex-col gap-8 md:pt-6">
                    <Panel className="flex flex-col gap-4 p-6">
                        <h1 className="font-lf-title text-2xl font-bold sm:text-3xl">
                            <span>Welcome back, </span>
                            {user && <span id="username" className="text-lf-rubric">{user.username}</span>}
                        </h1>

                        <div id="messageDiv">
                            {notice && (
                                <MessageBox
                                    kind={notice.kind}
                                    title={notice.text}
                                    details={notice.gameId && (
                                        <Link to={`/village/${notice.gameId}`} className="font-bold !text-lf-ink !underline">{notice.gameId}</Link>
                                    )}
                                />
                            )}
                        </div>
                    </Panel>

                    {/* md+: the two blocks flank the campfire, which sits in the middle of the fixed background. */}
                    <section className="grid gap-6 md:grid-cols-2" style={{ columnGap: 'min(32vw, 480px)' }}>
                        <Block title="Habitant" icon={UserRound}>
                            <EntryLink to="/habitant/me" variant="felt" icon={UserRound}>Personal Area</EntryLink>
                            <EntryLink to={user ? "/habitant/" + encodeURIComponent(user.username) : "/habitant/"} variant="felt" icon={History}>Statistics and History</EntryLink>
                            <EntryLink to="/logout" reloadDocument variant="wax" icon={LogOut} id="logoutBT">Logout</EntryLink>
                        </Block>

                        <Block title="Village" icon={Castle}>
                            <EntryLink to="/rules" variant="felt" icon={BookOpen}>Rulebook</EntryLink>
                            <EntryLink to="/newVillage" variant="felt" icon={Plus}>Create a village</EntryLink>
                            <EntryLink to="/village" variant="brass" icon={Users}>Join your village</EntryLink>
                        </Block>
                    </section>
                </div>
            </main>

        </div>
    );
}
