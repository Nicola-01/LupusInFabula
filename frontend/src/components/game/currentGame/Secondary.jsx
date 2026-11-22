import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RoleIcon, FactionBadge, factionFromType } from '@/components/lupus';
import { GamePhase } from '../../../utils/utils.js';
import { cap } from './gameLogic.js';
import VillageLog from './VillageLog.jsx';

const TAB = 'min-h-11 rounded-sm border-2 border-lf-brass bg-lf-paper font-lf-heading font-bold text-lf-ink data-[state=active]:border-lf-felt data-[state=active]:bg-lf-felt data-[state=active]:text-lf-on-felt';
// Same group order as the old roles modal: evil, neutral, good, victory stealer.
const TYPE_ORDER = [1, 3, 0, 2];

/** Roles in game with their icon and faction. roles = [{name, type, max_number}] (GET game/configuration shape). */
export function RolesList({ roles }) {
    if (!roles) return null;
    const sorted = [...roles].filter((r) => TYPE_ORDER.includes(r.type)).sort((a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type));
    return (
        <ul data-roles className="m-0 flex list-none flex-col gap-2 p-0">
            {sorted.map((r) => (
                <li key={r.name} className="flex min-h-11 items-center gap-3 rounded-sm border border-lf-brass px-3 py-2 text-[15px]">
                    {/* shortcut: icone hardcoded, vedi docs/ui-redesign/TODO.md (colonna icona in DB) */}
                    <RoleIcon role={r.name} className="w-5 text-center text-base" />
                    <span className="min-w-0 flex-1 font-bold">{cap(r.name)}{r.max_number > 1 && ` (${r.max_number})`}</span>
                    <FactionBadge faction={factionFromType(r.type)?.id} />
                </li>
            ))}
        </ul>
    );
}

/** Log / Roles / Settings, shared by the bottom sheet (mobile) and the side panel (lg+). */
export default function Secondary({ g, master, roles, onAsk }) {
    const active = (g.settings ?? []).map((i) => i.setting).filter((s) => s.enable);
    const skipDisabled = !g.game || g.game.round > 1 || g.game.phase === GamePhase.NIGHT;
    return (
        <Tabs defaultValue="log" className="gap-3">
            <TabsList className="grid h-auto w-full grid-cols-3 gap-1 bg-transparent p-0">
                <TabsTrigger value="log" className={TAB}>Log</TabsTrigger>
                <TabsTrigger value="roles" className={TAB}>Roles</TabsTrigger>
                <TabsTrigger value="settings" className={TAB}>Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="log">
                <VillageLog logs={g.logs} master={g.endsWithMaster} />
            </TabsContent>
            <TabsContent value="roles">
                <RolesList roles={roles} />
            </TabsContent>
            <TabsContent value="settings" className="flex flex-col gap-4">
                <section>
                    <h3 className="mb-2 font-lf-heading text-sm font-bold">Active options</h3>
                    {active.length ? (
                        <ul className="m-0 list-none p-0 text-[15px]">{active.map((s) => <li key={s.setting_name}><b>{s.setting_name}</b>{s.description && `: ${s.description}`}</li>)}</ul>
                    ) : (
                        <p className="text-[15px] text-lf-ink2">No optional rules are active.</p>
                    )}
                </section>
                {master && (
                    <section id="settingsContainer" className="flex flex-col gap-2">
                        <h3 className="font-lf-heading text-sm font-bold">Master actions</h3>
                        <Button type="button" variant="brass" size="touch" id="skipDayBT" disabled={skipDisabled} onClick={() => onAsk('skipDay')}>Skip first day</Button>
                        <Button type="button" variant="brass" size="touch" id="previousRoundBT" onClick={() => onAsk('previousRound')}>Previous phase</Button>
                        <Button type="button" variant="wax" size="touch" id="endGameBT" onClick={() => onAsk('endGame')}>End game</Button>
                    </section>
                )}
            </TabsContent>
        </Tabs>
    );
}
