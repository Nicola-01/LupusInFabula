import { Link } from 'react-router-dom';
import { Panel, Ornament, UserToken, RoleIcon, factionFromType, FACTIONS } from '@/components/lupus';
import { getRoleType } from '../../../utils/utils.js';
import { cap, gameOverTexts } from './gameLogic.js';
import VillageLog from './VillageLog.jsx';

const TYPE_OF = { good: 0, evil: 1, 'victory stealer': 2, neutral: 3 };
// shortcut: winners guessed from who_win (0 good roles, 1 evil roles, 2 hamster, 3 jester); the API does not list them.
const isWinner = (who, role) => (who === 0 && getRoleType(role) === 'good') || (who === 1 && getRoleType(role) === 'evil')
    || (who === 2 && role === 'hamster') || (who === 3 && role === 'jester');

/** Game over view (mock F3 "The End"), with the texts of the old setGameOver(). */
export default function TheEnd({ game, players, me, logs, master }) {
    const t = game ? gameOverTexts(game) : null;
    const list = players ?? [];
    const winners = game ? list.filter((p) => isWinner(game.who_win, p.role)) : [];
    return (
        <div id="gameOverMessage" className="flex flex-col gap-4">
            <Panel className="flex flex-col items-center gap-4 p-6 text-center sm:p-8">
                <p className="font-lf-heading text-xs uppercase tracking-[.2em] text-lf-rubric">The last chapter</p>
                <h1 className="font-lf-title text-4xl font-bold sm:text-5xl">The End</h1>
                <Ornament className="w-full max-w-xs" />
                <p id="winning_faction" className="text-lg">
                    {t && <>{t.pre}<span id="faction_name" className="font-bold" style={{ color: t.color }}>{t.faction}</span>{t.post}</>}
                </p>
                {winners.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2">
                        {winners.map((p) => <UserToken key={p.username} username={p.username} size="md" />)}
                    </div>
                )}
                {t && <p id="gameTime" className="text-[15px] text-lf-ink2">{t.started}<br />{t.duration}</p>}
            </Panel>

            <Panel className="p-5 sm:p-7">
                <h2 className="mb-3 font-lf-heading text-xl font-bold">Revealed roles</h2>
                <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
                    {list.map((p) => {
                        const f = factionFromType(TYPE_OF[getRoleType(p.role)]) ?? FACTIONS[0];
                        return (
                            <li key={p.username} id={`${p.username}_status`} className="flex min-h-11 items-center gap-3 rounded-sm border border-lf-brass p-2"
                                style={{ borderLeft: `6px solid ${p.role ? f.color : 'var(--lf-brass)'}` }}>
                                <UserToken username={p.username} size="sm" />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold">{p.username}{p.username === me && ' (you)'}</p>
                                    <p className="flex items-center gap-1.5 text-sm">
                                        {p.role ? <><RoleIcon role={p.role} />{cap(p.role)}<span className="text-lf-ink2">· {f.label}</span></> : <span className="text-lf-ink2">Role not revealed</span>}
                                    </p>
                                </div>
                                {p.isDead && <i className="fas fa-skull" role="img" aria-label="dead" />}
                            </li>
                        );
                    })}
                </ul>
            </Panel>

            <Panel className="p-5 sm:p-7">
                <h2 className="mb-3 font-lf-heading text-xl font-bold">Chronicle</h2>
                <VillageLog logs={logs} master={master} />
            </Panel>

            <Link to="/home" className="inline-flex min-h-12 w-full items-center justify-center rounded-md border border-lf-felt bg-lf-felt font-lf-heading text-base text-lf-on-felt !text-lf-on-felt !no-underline hover:bg-lf-felt-hover">
                Back to the village
            </Link>
        </div>
    );
}
