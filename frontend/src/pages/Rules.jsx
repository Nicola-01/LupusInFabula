import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun, Vote } from 'lucide-react';
import Navbar from '../components/Navbar.jsx';
import { Ornament, PageTitle, Panel, RoleIcon, factionFromType } from '@/components/lupus';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import '../styles/rules.css';

// Rules text: verbatim from the original page (JSX line-wrapping collapsed to single spaces).
const INTRO = 'In the remote village of Fabula, some people become werewolves at night. They attack an innocent person to satisfy their instincts. During the day, the survivors discuss what to do. At the end of the discussion, they lynch one of them. Who will survive the massacre?';
const AIM = 'There are two factions in the game: the Werewolves and the Villagers. The aim of the Werewolf faction is to eliminate all villagers. Conversely, the aim of the Villagers faction is to lynch all the Werewolves.';
const PREPARATION = 'Before the game starts, one player is chosen to be the master/moderator. He doesn’t belong to any faction, and he will only manage the game tracking everything that will happen. The other players will play the role given to them by their card and look at their own card secretly.';
const GAME = 'The game is divided into two phases: night and day. At night each role with an effect that resolves during this phase will be called by the master to perform the respective action described in the role card. Once the master has called all roles with a night effect, night will end and the day phase will begin. During the day, people will discuss and vote to lynch someone, hopefully a wolf or a member of the wolf faction.';
const NIGHT = 'The moderator declares the beginning of the night (”it is night, everyone close your eyes”). All players then close their eyes, trying not to make any kind of noise for all the duration of this phase. The master then begins to call each role with effect:';
const NIGHT_WOLVES_HEAD = 'Example of wolves calling:';
const NIGHT_WOLVES = [
    'Master: ”Wolves open their eyes and choose who to go and maul.”',
    'Wolves silently agree and point to their prey',
    'Master: ”Decide who to send among you to maul your chosen prey”',
    'Wolves indicate who among them will go',
    'Master: ”The wolves close their eyes.”',
];
const NIGHT_GOOD_HEAD = 'Example of good role calling (e.g: Seer):';
const NIGHT_GOOD = [
    'Master: ”Seer open eyes and choose whom to investigate”',
    'Seer points to the player he wants to investigate',
    'Master nods to say whether the player has a bad or good role',
    'Master: ”Seer closes eyes.”',
];
const NIGHT_NOTE = 'Note: This phase should be played even if the called role is already dead in order to not give clues to others. Once the master has called all roles with night effect, the night is over.';
const DAY = 'The master now declares the start of the day (”it’s day, everybody open your eyes”). The master then gives a recap of what happened during the past night, listing who died (if anyone died), who was anointed, etc. without giving explicit information about what happened (e.g. recap: Master: ”A died, B died, C was anointed”). Once the master has finished the recap, the still-living players can then start discussing among themselves to decide who to lynch. You may lie freely but under no circumstances may you show your card to others.';
const VOTING = 'After a maximum of three minutes of discussion, the master stops the discussion and asks each player, starting with the one to the left of the one who died first and proceeding clockwise, who he thinks should be lynched. All players, including ghosts (i.e., those who died), in their turn vote indicating who they want to lynch. At the end of the voting, the two players with the most votes will be clued (in case of a tie, the player closest to the first dead will be chosen). The two suspected players can now take a short speech defending themselves against the charges. After the two speeches are over, the remaining alive unindicted players will vote again for the new player to be lynched among the two suspects (in this case the voting will be counterclockwise starting with the alive unindicted player who was last to vote before). At this point the day is over and the master can start a new night and so on until one faction wins.';
const VOTING_NOTE = 'Note: all dead players (i.e. ghosts) for the rest of the entire game must not speak or show their role to other players.';
const VICTORY = 'The master declares the game over with a villagers victory if the villagers lynch all the werewolves. Werewolves, on the other hand, are declared winners if at any point in time they are equal in number to the still-living villagers (e.g., 2 werewolves and 2 villagers, or 1 and 1): in that case the werewolves unceremoniously maul the remaining villagers! In case there are victory stealer roles in the game, they will win if their victory condition is fulfilled, and in that case the master will declare them winners any time in the game when they have completed their victory condition.';

const plagueOrIllusionist = (role) => (role.name === 'plague spreader' ? 'VILLAGERS' : role.name === 'illusionist' ? 'WOLF PACK' : '');

// One notice board per role type; `type` is the numeric type of the roles API (faction colour/icon from factionFromType).
const BOARDS = [
    { type: 0, title: 'GOOD', description: 'Resident of the village of Fabula, who wants to protect the village from the pack of wolves.', winsWith: () => 'VILLAGERS' },
    { type: 1, title: 'EVIL', description: 'Pack of wolves that want to maul the villagers.', winsWith: () => 'WOLF PACK' },
    { type: 2, title: 'VICTORY STEALER', description: 'Villagers who play for themselves without caring about other villagers.', winsWith: () => 'ALONE' },
    { type: 3, title: 'NEUTRAL', description: 'Roles that play with the villagers or the pack of wolves, and that can cause chaos between any type of role.', winsWith: plagueOrIllusionist },
];

const CHAPTERS = [
    { id: 'intro', label: 'Intro' },
    { id: 'aim', label: 'Aim' },
    { id: 'preparation', label: 'Preparation' },
    { id: 'game', label: 'Game' },
    { id: 'victory', label: 'Victory' },
    { id: 'roles', label: 'Roles' },
];

/** Card image: low resolution first, then the full one (old asyncImage loader in js/rules.js). */
function CardImage({ name }) {
    const full = `/media/cards/${name}.png`;
    const [src, setSrc] = useState(`/media/cards/lowResolution/${name}.png`);
    useEffect(() => {
        const img = new Image();
        img.src = full;
        img.onload = () => setSrc(full);
        return () => { img.onload = null; };
    }, [full]);
    return <img className="block h-auto w-full rounded-lg border-[3px] border-lf-brass bg-white shadow-[0_6px_12px_rgba(0,0,0,.35)]" src={src} alt={`${name}'s card`} />;
}

/** One chapter sub-section (Night / Day / Voting) with its icon. */
function SubChapter({ id, title, Icon, children }) {
    return (
        <Panel as="section" id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32 p-5 sm:p-6">
            <h3 id={`${id}-title`} className="flex items-center gap-2 font-lf-heading text-lg font-bold text-lf-rubric">
                <Icon className="size-5 text-lf-brass" aria-hidden="true" />
                {title}
            </h3>
            <div className="mt-3 flex flex-col gap-3 text-[16px] leading-relaxed">{children}</div>
        </Panel>
    );
}

/** Faction notice board: coloured ribbon, description, then a one-role-at-a-time carousel of pinned cards. */
function NoticeBoard({ board, roles: list }) {
    const faction = factionFromType(board.type);
    const n = list.length;
    const [index, setIndex] = useState(0);
    const [height, setHeight] = useState(undefined);
    const track = useRef(null);
    const go = (d) => {
        if (!n) return;
        const el = track.current;
        const next = (index + d + n) % n;
        el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
    };
    const onScroll = () => {
        const el = track.current;
        setIndex(Math.round(el.scrollLeft / el.clientWidth));
    };
    // Board height follows the active slide only (slides are equal-width flex items, so the track would otherwise take the tallest).
    useLayoutEffect(() => {
        const slide = track.current?.children[index];
        if (!slide) return;
        const measure = () => setHeight(slide.offsetHeight);
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(slide);
        return () => ro.disconnect();
    }, [index, n]);
    const arrow = 'w-11 rounded-full px-0';

    return (
        <section className="rf-board overflow-hidden rounded-md border-[6px] border-lf-brass" aria-labelledby={`board-${board.type}`}>
            <header className="border-b-2 border-lf-brass px-4 py-3 sm:px-6" style={{ background: faction.color, color: faction.ink }}>
                <h3 id={`board-${board.type}`} className="flex items-center gap-2 font-lf-title text-xl font-bold">
                    <i className={cn('fas', faction.icon, 'w-5 text-center')} aria-hidden="true" />
                    {board.title}
                </h3>
            </header>
            <p className="lf-paper mx-4 mt-4 px-4 py-2 text-[15px] leading-snug sm:mx-6">{board.description}</p>

            <div role="region" aria-roledescription="carousel" aria-label={`${board.title} roles`} className="px-2 pt-4 pb-3 sm:px-4">
                {/* Mobile: track, then [‹] dots [›] in one row below. Desktop: arrows on the sides. */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <div
                        ref={track}
                        onScroll={onScroll}
                        style={{ height }}
                        tabIndex={0}
                        aria-label={`${board.title} roles, scroll sideways`}
                        className="flex min-w-0 snap-x snap-mandatory basis-full items-start overflow-x-auto overflow-y-hidden [scrollbar-width:none] motion-safe:scroll-smooth motion-safe:transition-[height] duration-200 order-1 md:order-2 md:flex-1 md:basis-0"
                    >
                        {list.map((role, i) => (
                            <div
                                key={role.name}
                                role="group"
                                aria-roledescription="slide"
                                aria-label={`${i + 1} of ${n}: ${role.name}`}
                                className="flex w-full shrink-0 snap-center flex-col items-center gap-5 px-2 py-2 md:flex-row md:justify-center md:gap-8"
                            >
                                <div className="relative w-[55%] max-w-[180px] shrink-0 -rotate-[1.5deg] md:w-[200px] md:max-w-none">
                                    <span className="rf-pin absolute -top-2 left-1/2 -translate-x-1/2" aria-hidden="true" />
                                    <CardImage name={role.name} />
                                </div>
                                <Panel className="relative w-full max-w-sm rotate-1 p-5 md:max-w-md">
                                    <span className="rf-pin absolute -top-2 left-4" aria-hidden="true" />
                                    <span
                                        className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full border-2 border-lf-brass shadow-[0_2px_4px_rgba(0,0,0,.3)]"
                                        style={{ background: faction.color, color: faction.ink }}
                                        aria-hidden="true"
                                    >
                                        <RoleIcon role={role.name} />
                                    </span>
                                    <h4 className="pr-10 font-lf-title text-xl font-bold">{role.name.toUpperCase()}</h4>
                                    <p className="mt-2 text-[15px] leading-relaxed">{role.description}</p>
                                    <h5 className="mt-4 flex items-center gap-2 font-lf-heading text-[15px]">
                                        <i className={cn('fas', faction.icon, 'text-lf-brass')} aria-hidden="true" />
                                        <span>WINS WITH: <strong className="font-bold">{board.winsWith(role)}</strong></span>
                                    </h5>
                                </Panel>
                            </div>
                        ))}
                    </div>
                    <Button type="button" variant="brass" size="touch" className={cn(arrow, 'order-2 md:order-1')} aria-label="Previous role" onClick={() => go(-1)} disabled={!n}>
                        <ChevronLeft aria-hidden="true" />
                    </Button>
                    <div className="order-3 flex min-w-0 max-w-full flex-wrap items-center justify-center md:order-4 md:basis-full" role="tablist" aria-label={`${board.title} roles position`}>
                        {list.map((role, i) => (
                            <button
                                key={role.name}
                                type="button"
                                role="tab"
                                aria-selected={i === index}
                                aria-label={`Show ${role.name}`}
                                aria-current={i === index ? 'true' : undefined}
                                onClick={() => track.current.scrollTo({ left: i * track.current.clientWidth, behavior: 'smooth' })}
                                className="flex size-11 items-center justify-center rounded-full focus-visible:ring-[3px] focus-visible:ring-lf-focus"
                            >
                                <span className={cn('size-2.5 rounded-full', i === index ? 'bg-lf-rubric opacity-100' : 'bg-lf-ink2 opacity-50')} />
                            </button>
                        ))}
                    </div>
                    <Button type="button" variant="brass" size="touch" className={cn(arrow, 'order-4 md:order-3')} aria-label="Next role" onClick={() => go(1)} disabled={!n}>
                        <ChevronRight aria-hidden="true" />
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default function Rules() {
    const [roles, setRoles] = useState([]);

    useEffect(() => { document.title = 'Lupus in Fabula - Rules'; }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetch('/api/rules/roles', { credentials: 'same-origin', signal: controller.signal })
            .then((r) => (r.ok ? r.json() : { roles: [] }))
            .then((data) => setRoles((data.roles ?? []).flat()))
            .catch(() => { if (!controller.signal.aborted) setRoles([]); });
        return () => controller.abort();
    }, []);

    return (
        <div className="lf-page flex min-h-screen flex-col font-lf-body text-lf-ink">
            <Navbar />

            <main className="lf-rules mx-auto flex w-full max-w-[50rem] grow flex-col gap-8 px-3 pb-10 sm:px-6">
                <PageTitle>RULES</PageTitle>

                <nav aria-label="Chapters" className="sticky top-16 z-30 -mx-1">
                    <ul className="flex list-none gap-2 overflow-x-auto py-2 [scrollbar-width:none] md:flex-wrap md:justify-center md:overflow-visible">
                        {CHAPTERS.map((c) => (
                            <li key={c.id}>
                                <a href={`#${c.id}`} className="!no-underline !text-lf-ink inline-flex min-h-11 items-center rounded-full border-2 border-lf-brass bg-lf-paper px-4 font-lf-heading text-[13px] font-semibold tracking-wider hover:bg-lf-hl">
                                    {c.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <Panel as="section" id="intro" className="scroll-mt-32 p-6 sm:p-8">
                    <h2 className="mb-3 font-lf-title text-xl font-bold"><span className="rf-illum">I</span>ntroduction to Lupus</h2>
                    <p className="text-[17px] leading-relaxed">{INTRO}</p>
                </Panel>

                <Ornament />

                <Panel as="section" id="aim" className="scroll-mt-32 p-6 sm:p-8">
                    <h2 className="mb-3 font-lf-title text-xl font-bold">Aim of the game</h2>
                    <p className="text-[17px] leading-relaxed">{AIM}</p>
                </Panel>

                <Ornament />

                <Panel as="section" id="preparation" className="scroll-mt-32 p-6 sm:p-8">
                    <h2 className="mb-3 font-lf-title text-xl font-bold">Preparation</h2>
                    <p className="text-[17px] leading-relaxed">{PREPARATION}</p>
                </Panel>

                <Ornament />

                <Panel as="section" id="game" className="scroll-mt-32 p-6 sm:p-8" aria-labelledby="game-title">
                    <h2 id="game-title" className="mb-3 font-lf-title text-xl font-bold">Game</h2>
                    <p className="text-[17px] leading-relaxed">{GAME}</p>
                    <div className="mt-6 flex flex-col gap-5">
                        <SubChapter id="night" title="Night" Icon={Moon}>
                            <p>{NIGHT}</p>
                            <p className="italic text-lf-ink2">{NIGHT_WOLVES_HEAD}</p>
                            <ul className="list-disc space-y-1 pl-6">{NIGHT_WOLVES.map((t) => <li key={t}>{t}</li>)}</ul>
                            <p className="italic text-lf-ink2">{NIGHT_GOOD_HEAD}</p>
                            <ul className="list-disc space-y-1 pl-6">{NIGHT_GOOD.map((t) => <li key={t}>{t}</li>)}</ul>
                            <hr className="border-t-2 border-lf-brass" />
                            <p>{NIGHT_NOTE}</p>
                        </SubChapter>
                        <SubChapter id="day" title="Day" Icon={Sun}>
                            <p>{DAY}</p>
                        </SubChapter>
                        <SubChapter id="voting" title="Voting" Icon={Vote}>
                            <p>{VOTING}</p>
                            <hr className="border-t-2 border-lf-brass" />
                            <p>{VOTING_NOTE}</p>
                        </SubChapter>
                    </div>
                </Panel>

                <Ornament />

                <Panel as="section" id="victory" className="scroll-mt-32 p-6 sm:p-8">
                    <h2 className="mb-3 font-lf-title text-xl font-bold">Victory Condition</h2>
                    <p className="text-[17px] leading-relaxed">{VICTORY}</p>
                </Panel>

                <Ornament />

                <section id="roles" aria-labelledby="roles-title" className="scroll-mt-32 flex flex-col gap-8">
                    <div className="text-center">
                        <h2 id="roles-title" className="font-lf-title text-3xl font-bold sm:text-4xl">ROLES</h2>
                        <Ornament className="mx-auto mt-4 max-w-md" />
                    </div>
                    {BOARDS.map((board) => (
                        <NoticeBoard key={board.type} board={board} roles={roles.filter((r) => r.type === board.type)} />
                    ))}
                </section>
            </main>

        </div>
    );
}
