import { cn } from '@/lib/utils';
import { RoleIcon, Panel } from '@/components/lupus';
import { GamePhase, rolesColors } from '../../../utils/utils.js';
import { cap, designatedRole } from './gameLogic.js';

/*
 * Master's form (old #gameActions): night selects grouped by faction, or the day votes with the ballot radios,
 * Sam's revenge and the plague checkboxes. Same ids as the old DOM (designatedWolf, <role>_targets,
 * <player>_targets, voteRadio_N, sam_SB, <player>_plaguedCB). The round table fills the same selects.
 */

const GROUP_LABEL = { wolves: 'Wolf pack', evil: 'Evil', neutral: 'Neutral', good: 'Good', 'victory stealer': 'Victory stealer' };
const SELECT = 'lf-input min-h-11 w-full px-2 text-[15px] disabled:opacity-60 sm:w-56';
const ROW = 'action-wrapper flex flex-col gap-1.5 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3';

/** Text of a row: "Who is the target of <u>role</u>?" or "Who <u>player</u> voted out?". */
function RowText({ text, id }) {
    return (
        <label htmlFor={id} className="text-[15px] leading-snug">
            {text.pre}
            {text.role && <u className="font-bold" style={{ color: text.color }}>{text.label ?? text.role}</u>}
            {text.voter && <u>{text.voter}</u>}
            {text.post}
        </label>
    );
}

function Select({ s, onChange }) {
    return (
        <select id={s.id} className={SELECT} value={s.value} disabled={s.disabled} required
                style={s.bg ? { backgroundColor: s.bg } : undefined} onChange={(e) => onChange(s, e.target.value)}
                data-blocked={s.blocked !== null ? 'true' : undefined}>
            <option value="" disabled={s.defaultDisabled}>{s.defaultText}</option>
            {s.options.map((o, i) => <option key={i} value={o}>{o}</option>)}
        </select>
    );
}

/** Chips of the night: who is acting now (tap a chip, then a seat on the table). */
export function nightChips(f) {
    const chips = [{ key: 'designatedWolf', role: 'wolf', label: 'Designated wolf', value: f.designated }];
    f.slots.forEach((s, i) => {
        if (!s.dead && !s.disabled) chips.push({ key: i, role: s.role, label: cap(s.role), value: s.blocked !== null ? 'blocked' : s.value });
    });
    return chips;
}

export function NowActing({ f, active, setActive }) {
    return (
        <div>
            <h2 className="mb-2 font-lf-heading text-sm font-bold">Now acting</h2>
            <div role="group" aria-label="Now acting" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
                {nightChips(f).map((c) => {
                    const on = active === c.key;
                    return (
                        <button key={c.key} type="button" aria-pressed={on} onClick={() => setActive(c.key)}
                                className={cn('flex min-h-11 shrink-0 items-center gap-2 rounded-full border-2 px-3 text-sm font-bold',
                                    on ? 'border-lf-felt bg-lf-felt text-lf-on-felt' : 'border-lf-brass bg-lf-paper text-lf-ink')}>
                            <RoleIcon role={c.role} />
                            {c.label}
                            <span className="font-normal opacity-85">{c.value ? `→ ${c.value}` : 'pick'}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function NightForm({ g }) {
    const f = g.form;
    const dRole = designatedRole(f);
    const groups = ['wolves', 'evil', 'neutral', 'good', 'victory stealer'];
    return (
        <div className="flex flex-col gap-3">
            {groups.map((grp) => {
                const slots = f.slots.filter((s) => s.group === grp);
                if (grp !== 'wolves' && slots.length === 0) return null;
                return (
                    <section key={grp} id={grp === 'wolves' ? 'designatedWolves' : undefined}
                             className={cn('rounded-sm border-l-4 pl-3', grp === 'wolves' || grp === 'evil' ? 'evilRoles' : grp === 'neutral' ? 'neutralRoles' : grp === 'good' ? 'goodRoles' : 'victoryStealerRoles')}
                             style={{ borderColor: rolesColors.get(grp === 'wolves' ? 'evil' : grp === 'victory stealer' ? 'neutral' : grp) }}>
                        <h3 className="font-lf-heading text-sm font-bold">{GROUP_LABEL[grp]}</h3>
                        {grp === 'wolves' && (
                            <div id="designatedWolfDiv" className={ROW}>
                                <label htmlFor="designatedWolf" className="text-[15px] leading-snug">
                                    Which <u className="font-bold" style={{ color: rolesColors.get("wolf") }}>wolf</u> will do the action?
                                </label>
                                <select id="designatedWolf" className={SELECT} value={f.designated} required onChange={(e) => g.onDesignated(e.target.value)}>
                                    <option value="" disabled>Select option</option>
                                    {f.wolfPack.map((w) => <option key={w.player} value={w.player}>{w.player}</option>)}
                                </select>
                            </div>
                        )}
                        {slots.map((s) => (
                            <div key={f.slots.indexOf(s)} className={cn(ROW, s.wolf && s.role !== dRole && 'opacity-70')}>
                                <RowText text={s.text} id={s.id} />
                                <Select s={s} onChange={g.onNightSelect} />
                            </div>
                        ))}
                    </section>
                );
            })}
        </div>
    );
}

function DayForm({ g }) {
    const f = g.form;
    const RADIO = ['VOTE', '1 BALLOT', '2 BALLOT'];
    return (
        <div className="flex flex-col gap-3">
            <div className="sections radio-inputs grid grid-cols-3 gap-1 rounded-sm border-2 border-lf-brass p-1" role="radiogroup" aria-label="Vote section">
                {RADIO.map((label, i) => (
                    <label key={i} htmlFor={`voteRadio_${i}`}
                           className={cn('radio flex min-h-11 cursor-pointer items-center justify-center rounded-sm font-lf-heading text-sm font-bold has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-lf-focus',
                               f.radios.checked === i ? 'bg-lf-felt text-lf-on-felt' : 'text-lf-ink', f.radios.disabled[i] && 'cursor-not-allowed opacity-50')}>
                        <input type="radio" name="radio" id={`voteRadio_${i}`} className="sr-only" checked={f.radios.checked === i}
                               disabled={f.radios.disabled[i]} onChange={() => {}} onClick={() => g.onRadio(i)} />
                        <span>{label}</span>
                    </label>
                ))}
            </div>
            {f.sections.map((sec, k) => (
                <div key={k} id={`votes_${sec.sub}`} className="votes" style={sec.hidden ? { display: 'none' } : undefined}>
                    {sec.rows.map((r, i) => (
                        <div key={i} className={ROW}>
                            <RowText text={r.text} id={r.id} />
                            <Select s={r} onChange={g.onDaySelect} />
                        </div>
                    ))}
                </div>
            ))}
            {f.sam && (
                <div className="samDiv rounded-sm border-l-4 pl-3" style={{ display: f.samShown ? 'block' : 'none', borderColor: rolesColors.get('sam') }}>
                    <div className={ROW}>
                        <RowText text={f.sam.text} id="sam_SB" />
                        <Select s={f.sam} onChange={g.onDaySelect} />
                    </div>
                </div>
            )}
            {f.plague && (
                <div className="plagueDiv rounded-sm border-l-4 pl-3" style={{ borderColor: rolesColors.get('plague spreader') }}>
                    {f.plague.map((r, i) => (
                        <div key={i} className={ROW}>
                            <span className="text-[15px]"><u>{r.player}</u> died of the plague?</span>
                            <label htmlFor={`${r.player}_plaguedCB`} className="flex min-h-11 cursor-pointer items-center gap-2 text-[15px]">
                                <input type="checkbox" id={`${r.player}_plaguedCB`} player={r.player} original={String(r.original)}
                                       className={cn('inp-cbx plague_CB size-5 accent-[var(--lf-felt)]', r.original && 'originalPlagued')}
                                       checked={r.checked} onChange={() => g.onPlague(r)} />
                                Died of plague
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/** The master's form panel. */
export default function MasterActions({ g }) {
    if (!g.form) return null;
    return (
        <Panel as="section" aria-labelledby="actions-h" className="p-4 sm:p-5">
            <h2 id="actions-h" className="mb-2 font-lf-heading text-lg font-bold">Habitants actions</h2>
            <div id="gameActions">
                {g.form.phase === GamePhase.NIGHT ? <NightForm g={g} /> : <DayForm g={g} />}
            </div>
        </Panel>
    );
}

