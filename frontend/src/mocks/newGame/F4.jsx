import { useState } from 'react';
import { toast } from 'sonner';
import { Check, ChevronDown, Flame, Minus, Plus, Search, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { roles as rolesFixture, session, settings as settingsFixture } from '@/mocks/fixtures';
import { Layout, Ornament, PageTitle, Panel, Toaster, notify, outlineBtn, primaryBtn } from '@/mocks/shell/kit/F.jsx';

// Round table + presets. Plain CSS scoped to the `f4-` prefix; the kit classes (vf-*) do the theming.
const CSS = `
.f4-table { position: relative; width: min(300px, 100%); aspect-ratio: 1; margin: 0 auto; }
.f4-ring {
  position: absolute; inset: 14%; border-radius: 9999px; border: 3px double var(--f-brass);
  background: radial-gradient(circle at 50% 45%, var(--f-felt) 0 55%, rgba(0,0,0,.25) 100%);
  box-shadow: inset 0 0 24px rgba(0,0,0,.35), 0 4px 10px rgba(60,40,20,.25);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
  color: var(--f-on-felt);
}
.f4-ring svg { width: 2rem; height: 2rem; color: #f0b25a; }
.f4-seat {
  position: absolute; width: 2.75rem; height: 2.75rem; transform: translate(-50%, -50%);
  font-size: 15px; cursor: pointer; padding: 0;
}
.f4-seat:hover { filter: brightness(1.12); }
.f4-seat-name {
  position: absolute; top: 1.5rem; left: 50%; transform: translateX(-50%);
  font-size: 12px; white-space: nowrap; color: var(--f-ink); font-weight: 700;
}
.f4-field {
  height: 2.75rem; width: 100%; padding: 0 .75rem 0 2.25rem; font-size: 1rem;
  background: var(--f-paper); color: var(--f-ink); border: 2px solid var(--f-brass); border-radius: 6px;
}
.f4-field::placeholder { color: var(--f-ink2); opacity: 1; }
.f4-search { position: absolute; left: .75rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: var(--f-ink2); pointer-events: none; }
.f4-row { display: flex; align-items: center; gap: .75rem; min-height: 2.75rem; cursor: pointer; }
.f4-row span { font-size: 16px; }
.f4-check { width: 1.375rem; height: 1.375rem; flex-shrink: 0; border: 2px solid var(--f-brass); border-radius: 3px; background: var(--f-paper); }
.f4-check[data-state="checked"] { background: var(--f-felt); border-color: var(--f-felt); color: var(--f-on-felt); }
.f4-check svg { width: 1rem; height: 1rem; }
.f4-preset {
  display: flex; flex-direction: column; gap: .5rem; padding: .75rem; text-align: left; width: 100%;
  border-width: 3px; border-style: double; cursor: pointer; color: var(--f-ink);
}
.f4-preset[aria-checked="true"] { outline: 2px solid var(--f-felt); outline-offset: 2px; }
.f4-preset-name { font-family: 'Cinzel', Georgia, serif; font-weight: 700; font-size: 1rem; letter-spacing: .04em; }
.f4-preset-desc { font-size: 14px; line-height: 1.3; color: var(--f-ink2); }
.f4-groups { display: flex; flex-wrap: wrap; gap: .375rem; }
.f4-group { display: flex; flex-wrap: wrap; gap: .25rem; padding: .25rem; border: 1px solid rgba(92, 70, 48, .35); border-radius: 3px; }
.f4-thumb { display: flex; flex-direction: column; align-items: center; width: 2.25rem; }
.f4-thumb img { width: 2.25rem; height: 3.25rem; object-fit: cover; border-radius: 3px; box-shadow: 0 1px 2px rgba(0,0,0,.35); }
.f4-thumb b { font-size: 12px; line-height: 1.1; color: var(--f-ink); }
.f4-link {
  align-self: flex-start; min-height: 2.75rem; padding: 0 .25rem; font-size: 15px; font-weight: 700;
  color: var(--f-felt); text-decoration: underline; text-underline-offset: 3px; background: none; border: 0; cursor: pointer;
}
[data-bs-theme="dark"] .f4-link { color: #8fd09a; }
.f4-role { display: flex; align-items: center; gap: .5rem; min-height: 3.5rem; border-top: 1px dashed rgba(92, 70, 48, .45); }
.f4-role:first-child { border-top: 0; }
.f4-role-thumb { width: 2.25rem; height: 3.25rem; object-fit: cover; border-radius: 3px; flex-shrink: 0; box-shadow: 0 1px 2px rgba(0,0,0,.35); }
.f4-role-name { flex: 1; min-width: 0; font-size: 16px; }
.f4-stepper { display: flex; align-items: center; gap: .25rem; flex-shrink: 0; }
.f4-stepper svg { width: 1rem; height: 1rem; }
.f4-num {
  width: 3rem; height: 2.75rem; padding: 0; text-align: center; font-weight: 700; font-size: 16px; -moz-appearance: textfield;
  background: var(--f-paper); color: var(--f-ink); border: 2px solid var(--f-brass); border-radius: 6px;
}
.f4-num::-webkit-outer-spin-button, .f4-num::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.f4-faction-head { display: flex; flex: 1; align-items: baseline; justify-content: space-between; gap: .5rem; min-width: 0; }
.f4-faction-head b { font-family: 'Cinzel', Georgia, serif; font-size: .9375rem; letter-spacing: .08em; text-transform: uppercase; }
.f4-faction-head span { font-size: 14px; font-weight: 700; }
.f4-switch { width: 2.75rem; height: 1.5rem; flex-shrink: 0; border: 2px solid var(--f-brass); background: #b9a58a; }
.f4-switch[data-state="checked"] { background: var(--f-felt); border-color: var(--f-felt); }
.f4-switch > span { width: 1rem; height: 1rem; background: #f4e9d1; box-shadow: 0 1px 3px rgba(0, 0, 0, .35); }
.f4-switch > span[data-state="checked"] { transform: translateX(1.2rem); }
[data-bs-theme="dark"] .f4-switch { background: #5c4a36; }
.f4-ok { color: #3f5f3a; }
[data-bs-theme="dark"] .f4-ok { color: #6fa36f; }
.f4-warn { color: var(--f-rubric); }
.f4-bar-reason { font-size: 15px; color: var(--f-rubric); }
.f4-bar-summary { font-size: 15px; color: var(--f-ink2); }
.f4-undo { min-height: 2.5rem; margin-top: .5rem; padding: 0 .75rem; font-size: 14px; }
`;

const FONTS = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@600;700&family=Alegreya:wght@400;700&display=swap';

// Same minimum as the real page (createNewGame.js: totPlayers >= 5).
const MIN_PLAYERS = 5;
// Demo friends (fixture friends.json is empty); same shape the page reads: item.friend.username.
const FRIENDS = ['Aldo', 'Bianca', 'Chiara', 'Dario', 'Elena', 'Fabio', 'Gaia'].map((u) => ({ friend: { username: u } }));
const INITIAL_PLAYERS = FRIENDS.slice(0, 7).map((i) => i.friend.username);

// Same order and colour vars as the real page (good, evil, neutral, victory stealer). type comes from roles.json.
const FACTIONS = [
  { key: 'good', type: 0, title: 'Good', color: 'var(--roles-bg-good)' },
  { key: 'evil', type: 1, title: 'Evil', color: 'var(--roles-bg-evil)' },
  { key: 'neutral', type: 3, title: 'Neutral', color: 'var(--roles-bg-neutral)' },
  { key: 'victory', type: 2, title: 'Victory stealer', color: 'var(--roles-db-victoryStealer-)' },
];
const ROLES = rolesFixture.roles.flat();
const SETTINGS = settingsFixture['resource-list'].map((i) => i.setting);

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const roleImg = (name, size = 'lowResolution/') => `/media/cards/${size}${encodeURIComponent(name)}.png`;

// Presets are computed from N players. Wolves ~ N/4 (at least 1), one seer; Chaos adds neutral + victory stealer.
function presetCounts(id, n) {
  const wolves = Math.max(1, Math.round(n / 4));
  if (id === 'classic') return { wolf: wolves, seer: 1, farmer: Math.max(0, n - wolves - 1) };
  return { wolf: wolves, seer: 1, illusionist: 1, jester: 1, farmer: Math.max(0, n - wolves - 3) };
}

const PRESETS = [
  { id: 'classic', name: 'Classic', desc: 'About 1 wolf every 4 players, one seer, the rest farmers.' },
  { id: 'chaos', name: 'Chaos', desc: 'Classic plus a neutral illusionist and a jester who steals the win.' },
  { id: 'custom', name: 'Custom', desc: 'Choose every role yourself, one faction at a time.' },
];

// Friends are checkboxes in a sheet, but the table only holds what the master chose.
export default function MockNewGameF4() {
  const master = session.user.username;
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [sheetQuery, setSheetQuery] = useState('');
  const [preset, setPreset] = useState('classic');
  // Manual role counts, used once the preset is Custom. Starts as the Classic composition for 7 players.
  const [custom, setCustom] = useState({ wolf: 2, seer: 1, farmer: 4 });
  // Demo param ?custom=1 (default on) renders the Customize accordion open on Evil.
  const [showCustom, setShowCustom] = useState(() => new URLSearchParams(window.location.search).get('custom') !== '0');
  const [openFaction, setOpenFaction] = useState('evil');
  const [settingsOn, setSettingsOn] = useState(() => Object.fromEntries(SETTINGS.map((s) => [s.setting_name, s.enable])));

  const N = players.length;
  const effective = preset === 'custom' ? custom : presetCounts(preset, N);
  const totRoles = ROLES.reduce((sum, r) => sum + (effective[r.name] ?? 0), 0);
  const diff = Math.abs(totRoles - N);
  const enough = N >= MIN_PLAYERS;
  const matched = totRoles === N;
  const enabled = enough && matched;
  const activeSettings = Object.values(settingsOn).filter(Boolean).length;

  const addPlayer = (u) => setPlayers((l) => (l.includes(u) ? l : [...l, u]));
  const removePlayer = (u) => {
    setPlayers((l) => l.filter((x) => x !== u));
    notify('info', `${u} left the table`, (
      <button type="button" className="vf-btn vf-btn-outline f4-undo" onClick={() => { addPlayer(u); toast.dismiss(`left-${u}`); }}>
        Undo
      </button>
    ), `left-${u}`);
  };

  const pickPreset = (id) => {
    if (id === 'custom') setCustom(effective);
    setPreset(id);
    setShowCustom(id === 'custom');
  };
  // Customize on a preset copies its composition into the manual counts and opens the accordion.
  const customize = () => {
    setCustom(effective);
    setPreset('custom');
    setShowCustom(true);
  };
  const setCount = (name, n) => {
    const max = ROLES.find((r) => r.name === name).max_number;
    setCustom({ ...effective, [name]: Math.max(0, Math.min(max, n)) });
    setPreset('custom');
  };

  const reason = !enough
    ? `Add ${MIN_PLAYERS - N} more player${MIN_PLAYERS - N === 1 ? '' : 's'} (minimum ${MIN_PLAYERS}).`
    : !matched
      ? totRoles > N
        ? `Remove ${diff} role${diff === 1 ? '' : 's'}: one role per player.`
        : `Add ${diff} role${diff === 1 ? '' : 's'}: one role per player.`
      : null;

  const create = () => notify('success', 'Village created', `${N} players and ${totRoles} roles are ready.`);

  const shownFriends = FRIENDS.map((i) => i.friend.username).filter((f) => f.toLowerCase().includes(sheetQuery.trim().toLowerCase()));

  // Groups the composition by faction, in the real page's column order.
  const groups = (counts) => FACTIONS.map((f) => ({
    ...f,
    items: ROLES.filter((r) => r.type === f.type && (counts[r.name] ?? 0) > 0).map((r) => ({ role: r, n: counts[r.name] })),
  })).filter((g) => g.items.length);

  return (
    <Layout user={master}>
      <style>{CSS}</style>
      <link rel="stylesheet" href={FONTS} />
      <PageTitle sub="You are the master of this village.">Create a new village</PageTitle>

      <div className="mt-8 grid items-start gap-6 pb-28 lg:grid-cols-2 lg:pb-0">
        {/* Section 1: players around the fire */}
        <Panel as="section" aria-labelledby="f4-players" className="flex flex-col gap-5 p-5">
          <div className="flex flex-col gap-1">
            <h2 id="f4-players" className="vf-title text-lg vf-rubric">Who&apos;s at the fire?</h2>
            <Ornament className="mt-1" />
          </div>

          <div className="f4-table" role="group" aria-label={`${N} players seated`}>
            <div className="f4-ring">
              <Flame aria-hidden="true" />
              <span className="vf-title text-sm">{N} seated</span>
            </div>
            {players.map((u, i) => {
              const angle = -Math.PI / 2 + (i * 2 * Math.PI) / N;
              const x = 50 + 40 * Math.cos(angle);
              const y = 50 + 40 * Math.sin(angle);
              return (
                <div key={u} className="absolute" style={{ left: `${x}%`, top: `${y}%`, width: 0, height: 0 }}>
                  <button
                    type="button"
                    className="vf-token f4-seat"
                    style={{ left: 0, top: 0 }}
                    aria-label={`Remove ${u} from the table`}
                    title={`Remove ${u}`}
                    onClick={() => removePlayer(u)}
                  >
                    {u.charAt(0).toUpperCase()}
                  </button>
                  <span className="f4-seat-name" aria-hidden="true">{u}</span>
                </div>
              );
            })}
          </div>

          <p className="text-center text-[15px] vf-ink2">
            Tap a seat to send that player away. At least {MIN_PLAYERS} are needed.
          </p>

          <Sheet>
            <SheetTrigger asChild>
              <Button type="button" className={cn(outlineBtn, 'h-12 w-full text-base')}>
                <span aria-hidden="true">+</span> Add players
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="variant-F vf-paper flex max-h-[85dvh] flex-col gap-0 rounded-t-sm p-0">
              <SheetTitle className="vf-title border-b-2 vf-brass-border px-5 py-4 text-lg vf-rubric">Add players</SheetTitle>
              <SheetDescription className="sr-only">Pick friends to seat at the table.</SheetDescription>
              <div className="flex flex-col gap-3 overflow-y-auto p-5">
                <div className="relative">
                  <Search className="f4-search" aria-hidden="true" />
                  <input
                    type="search"
                    value={sheetQuery}
                    placeholder="Search friends"
                    aria-label="Search friends"
                    className="f4-field"
                    onChange={(e) => setSheetQuery(e.target.value)}
                  />
                </div>
                {shownFriends.length === 0 && <p className="text-[15px] vf-ink2">No friend matches.</p>}
                {shownFriends.map((f) => (
                  <Label key={f} htmlFor={`f4-friend-${f}`} className="f4-row">
                    <Checkbox
                      id={`f4-friend-${f}`}
                      className="f4-check"
                      checked={players.includes(f)}
                      onCheckedChange={(v) => (v ? addPlayer(f) : setPlayers((l) => l.filter((x) => x !== f)))}
                    />
                    <span>{f}</span>
                  </Label>
                ))}
              </div>
              <div className="border-t-2 vf-brass-border p-4">
                <SheetClose asChild>
                  <Button type="button" className={cn(primaryBtn, 'h-12 w-full text-base')}>
                    Done ({N} seated)
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </Panel>

        {/* Right column on desktop: roles, options, then the summary bar as a card. */}
        <div className="flex flex-col gap-6">
          {/* Section 2: roles as presets */}
          <Panel as="section" aria-labelledby="f4-roles" className="flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-2">
              <h2 id="f4-roles" className="vf-title text-lg vf-rubric">Roles</h2>
              <p aria-live="polite" className={cn('flex items-center gap-2 text-[16px] font-bold', matched ? 'f4-ok' : 'f4-warn')}>
                {matched ? <Check className="size-5" aria-hidden="true" /> : <TriangleAlert className="size-5" aria-hidden="true" />}
                <span>Roles {totRoles} / {N} players</span>
                {matched && <span className="sr-only">(equal)</span>}
              </p>
            </div>

            <div role="radiogroup" aria-label="Role preset" className="grid gap-3 lg:grid-cols-3">
              {PRESETS.map((p) => {
                const selected = preset === p.id;
                const counts = p.id === 'custom' ? custom : presetCounts(p.id, N);
                const list = groups(counts);
                const summary = list.flatMap((g) => g.items.map((it) => `${cap(it.role.name)} x${it.n}`)).join(', ');
                return (
                  <div key={p.id} className="vf-paper relative">
                    <button
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => pickPreset(p.id)}
                      className="f4-preset"
                    >
                      <span className="f4-preset-name">{p.name}{selected && <Check className="ml-2 inline size-4 align-[-2px] f4-ok" aria-hidden="true" />}</span>
                      <span className="f4-preset-desc">{p.desc}</span>
                      <span className="f4-groups" aria-hidden="true">
                        {list.map((g) => (
                          <span key={g.key} className="f4-group" style={{ background: g.color }}>
                            {g.items.map((it) => (
                              <span key={it.role.name} className="f4-thumb">
                                <img src={roleImg(it.role.name)} alt="" />
                                <b>×{it.n}</b>
                              </span>
                            ))}
                          </span>
                        ))}
                      </span>
                      <span className="sr-only">{summary || 'No roles yet'}</span>
                    </button>
                    {p.id !== 'custom' && (
                      <button type="button" className="f4-link mx-3 mb-2" onClick={customize}>
                        Customize
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {showCustom && (
              <Accordion type="single" collapsible value={openFaction} onValueChange={setOpenFaction} className="flex flex-col gap-2">
                {FACTIONS.map((f) => {
                  const rs = ROLES.filter((r) => r.type === f.type);
                  const n = rs.reduce((s, r) => s + (effective[r.name] ?? 0), 0);
                  return (
                    <AccordionItem key={f.key} value={f.key} className="vf-paper border-b-0 px-4" style={{ background: f.color }}>
                      <AccordionTrigger className="items-center py-3 text-[var(--f-ink)]">
                        <span className="f4-faction-head">
                          <b>{f.title}</b>
                          <span>{n} {n === 1 ? 'role' : 'roles'}</span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-2">
                        <ul className="flex flex-col">
                          {rs.map((r) => {
                            const v = effective[r.name] ?? 0;
                            return (
                              <li key={r.name} className="f4-role">
                                <img className="f4-role-thumb" src={roleImg(r.name)} alt="" />
                                <span className="f4-role-name">{cap(r.name)}</span>
                                <div className="f4-stepper">
                                  <Button type="button" variant="outline" className={cn(outlineBtn, 'h-11 w-11')} aria-label={`Remove one ${r.name}`} disabled={v === 0} onClick={() => setCount(r.name, v - 1)}>
                                    <Minus aria-hidden="true" />
                                  </Button>
                                  <input
                                    type="number"
                                    min={0}
                                    max={r.max_number}
                                    value={v}
                                    aria-label={`Number of ${r.name}`}
                                    className="f4-num"
                                    onChange={(e) => setCount(r.name, Number(e.target.value) || 0)}
                                  />
                                  <Button type="button" variant="outline" className={cn(outlineBtn, 'h-11 w-11')} aria-label={`Add one ${r.name}`} disabled={v >= r.max_number} onClick={() => setCount(r.name, v + 1)}>
                                    <Plus aria-hidden="true" />
                                  </Button>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </Panel>

          {/* Section 3: options, collapsed */}
          <Panel as="section" aria-labelledby="f4-options" className="p-5">
            <h2 id="f4-options" className="sr-only">Options</h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="options" className="border-b-0">
                <AccordionTrigger className="items-center text-base">
                  <span className="f4-faction-head">
                    <b className="vf-title text-base">Options</b>
                    <span>{SETTINGS.length} options, {activeSettings} on</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3">
                    {SETTINGS.map((s) => (
                      <div key={s.setting_name} className="flex items-center justify-between gap-3">
                        <Label htmlFor={`f4-set-${s.setting_name}`} className="text-[15px] leading-snug">{s.description}</Label>
                        <Switch
                          id={`f4-set-${s.setting_name}`}
                          className="f4-switch"
                          checked={!!settingsOn[s.setting_name]}
                          onCheckedChange={(v) => setSettingsOn((g) => ({ ...g, [s.setting_name]: v }))}
                        />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Panel>

          {/* Summary bar: fixed at the bottom on phones, a sticky card on desktop. */}
          <section
            aria-label="Create village"
            className="vf-paper fixed inset-x-3 bottom-3 z-30 flex flex-col gap-2 p-3 shadow-[0_-4px_12px_rgba(60,40,20,.18)] lg:sticky lg:top-24 lg:inset-auto lg:bottom-auto lg:z-0 lg:p-5 lg:shadow-[0_6px_14px_rgba(60,40,20,.18)]"
          >
            <p className="f4-bar-summary">
              <b className="text-[var(--f-ink)]">{N} players</b> · {totRoles} roles · {activeSettings} options on
            </p>
            {reason && <p className="f4-bar-reason">{reason}</p>}
            <Button type="button" className={cn(primaryBtn, 'h-12 w-full text-base')} disabled={!enabled} onClick={create}>
              Create village
            </Button>
          </section>
        </div>
      </div>

      <Toaster />
    </Layout>
  );
}
