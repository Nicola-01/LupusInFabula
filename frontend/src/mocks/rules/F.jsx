import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun, Vote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { roles, session } from '@/mocks/fixtures';
import { Layout, Ornament, PageTitle, Panel } from '../shell/kit/F.jsx';

// Rules-only styles: drop cap, chapter index chips, the notice board (bacheca) with planks and pins.
const CSS = `
.vf-rules .vf-illum {
  float: left; font-family: 'Cinzel Decorative', Georgia, serif; font-weight: 700; font-size: 2.6em;
  line-height: .8; padding: .08em .1em 0 0; color: var(--f-rubric);
}
.vf-rules .rf-seal-badge {
  position: absolute; top: -.75rem; right: .75rem; display: inline-flex; align-items: center; justify-content: center;
  width: 2.25rem; height: 2.25rem; border-radius: 9999px; color: var(--f-ink);
  border: 2px solid var(--f-brass); box-shadow: 0 2px 4px rgba(0, 0, 0, .3);
}
.vf-rules .vf-chip {
  display: inline-flex; align-items: center; min-height: 44px; padding: 0 14px; border-radius: 9999px;
  border: 2px solid var(--f-brass); background: var(--f-paper); color: var(--f-ink) !important;
  font-family: 'Cinzel', Georgia, serif; font-weight: 600; font-size: 13px; letter-spacing: .06em; text-decoration: none !important;
}
.vf-rules .vf-chip:hover { background: var(--f-hl); }
.vf-rules .rf-board {
  background-color: #d9b98a;
  background-image: repeating-linear-gradient(180deg, #d9b98a 0 44px, #cca774 44px 46px);
  border: 6px solid var(--f-brass); border-radius: 6px;
  box-shadow: inset 0 0 36px rgba(90, 55, 20, .35), 0 8px 16px rgba(60, 40, 20, .25);
}
[data-bs-theme="dark"] .vf-rules .rf-board {
  background-color: #3b2a1c;
  background-image: repeating-linear-gradient(180deg, #3b2a1c 0 44px, #33251a 44px 46px);
}
.vf-rules .rf-ribbon { color: var(--f-ink); border-bottom: 2px solid var(--f-brass); }
.vf-rules .rf-pin {
  display: block; width: 16px; height: 16px; border-radius: 9999px;
  background: radial-gradient(circle at 35% 35%, #f08a7a, #8b1e1e 60%);
  box-shadow: 0 2px 3px rgba(0, 0, 0, .45);
}
.vf-rules .rf-card { border: 3px solid var(--f-brass); border-radius: 8px; box-shadow: 0 6px 12px rgba(0, 0, 0, .35); background: #fff; }
.vf-rules .rf-slides { scroll-snap-type: x mandatory; scrollbar-width: none; }
.vf-rules .rf-slides::-webkit-scrollbar { display: none; }
.vf-rules .rf-slide { scroll-snap-align: center; scroll-snap-stop: always; }
.vf-rules .rf-dot { background: var(--f-ink2); opacity: .5; }
.vf-rules .rf-dot[aria-current="true"] { background: var(--f-rubric); opacity: 1; }
.vf-rules .rf-note { color: var(--f-ink); }
.vf-rules .rf-note-tilt { transform: rotate(1deg); }
.vf-rules .rf-card-tilt { transform: rotate(-1.5deg); }
@media (prefers-reduced-motion: no-preference) {
  .vf-rules .rf-slides { scroll-behavior: smooth; }
}
`;

// Original Rules.jsx text, copied verbatim (JSX line-wrapping collapsed to single spaces).
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

// icon: Font Awesome 5 free solid classes, loaded globally by frontend/index.html.
const FACTIONS = [
  { type: 0, title: 'GOOD', icon: 'fas fa-shield-alt', description: 'Resident of the village of Fabula, who wants to protect the village from the pack of wolves.', color: 'var(--roles-bg-good)', winsWith: () => 'VILLAGERS' },
  { type: 1, title: 'EVIL', icon: 'fas fa-paw', description: 'Pack of wolves that want to maul the villagers.', color: 'var(--roles-bg-evil)', winsWith: () => 'WOLF PACK' },
  { type: 2, title: 'VICTORY STEALER', icon: 'fas fa-user-secret', description: 'Villagers who play for themselves without caring about other villagers.', color: 'var(--roles-db-victoryStealer-)', winsWith: () => 'ALONE' },
  { type: 3, title: 'NEUTRAL', icon: 'fas fa-theater-masks', description: 'Roles that play with the villagers or the pack of wolves, and that can cause chaos between any type of role.', color: 'var(--roles-bg-neutral)', winsWith: (role) => (role.name === 'plague spreader' ? 'VILLAGERS' : role.name === 'illusionist' ? 'WOLF PACK' : '') },
];

const ALL_ROLES = roles.roles.flat();

const CHAPTERS = [
  { id: 'intro', label: 'Intro' },
  { id: 'aim', label: 'Aim' },
  { id: 'preparation', label: 'Preparation' },
  { id: 'game', label: 'Game' },
  { id: 'victory', label: 'Victory' },
  { id: 'roles', label: 'Roles' },
];

/** Card image: low resolution first, then the full one (same loader as Rules.jsx). */
function CardImage({ name }) {
  const full = `/media/cards/${encodeURI(name)}.png`;
  const [src, setSrc] = useState(`/media/cards/lowResolution/${encodeURI(name)}.png`);
  useEffect(() => {
    const img = new Image();
    img.src = full;
    img.onload = () => setSrc(full);
  }, [full]);
  return <img className="rf-card block h-auto w-full" src={src} alt={`${name}'s card`} />;
}

/** One chapter sub-section (Night / Day / Voting) with its icon. */
function SubChapter({ id, title, Icon, children }) {
  return (
    <Panel as="section" id={id} aria-labelledby={`${id}-title`} className="scroll-mt-44 p-5 sm:p-6">
      <h3 id={`${id}-title`} className="vf-title flex items-center gap-2 text-lg font-bold vf-rubric">
        <Icon className="size-5 vf-brass-text" aria-hidden="true" />
        {title}
      </h3>
      <div className="mt-3 flex flex-col gap-3 text-[16px] leading-relaxed">{children}</div>
    </Panel>
  );
}

/** Faction notice board: coloured ribbon, description, then a one-role-at-a-time carousel of pinned cards. */
function Bacheca({ faction, roles: list }) {
  const n = list.length;
  const [index, setIndex] = useState(0);
  const [height, setHeight] = useState(undefined);
  const track = useRef(null);
  const go = (d) => {
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
    const el = track.current;
    const slide = el.children[index];
    const measure = () => setHeight(slide.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(slide);
    return () => ro.disconnect();
  }, [index]);
  const arrow = 'vf-paper inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[var(--f-ink)] disabled:opacity-50';

  return (
    <section className="rf-board overflow-hidden" aria-labelledby={`faction-${faction.type}`}>
      <header className="rf-ribbon px-4 py-3 sm:px-6" style={{ background: faction.color }}>
        <h3 id={`faction-${faction.type}`} className="vf-title flex items-center gap-2 text-xl font-bold">
          <i className={`${faction.icon} w-5 text-center`} aria-hidden="true" />
          {faction.title}
        </h3>
      </header>
      <p className="vf-paper mx-4 mt-4 px-4 py-2 text-[15px] leading-snug sm:mx-6">{faction.description}</p>

      <div role="region" aria-roledescription="carousel" aria-label={`${faction.title} roles`} className="px-2 pt-4 pb-3 sm:px-4">
        {/* Mobile: track, then [‹] dots [›] in one row below. Desktop: arrows outside the content on the sides. */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div
            ref={track}
            onScroll={onScroll}
            style={{ height }}
            tabIndex={0}
            aria-label={`${faction.title} roles, scroll sideways`}
            className="rf-slides flex min-w-0 basis-full items-start overflow-x-auto overflow-y-hidden motion-safe:transition-[height] duration-200 order-1 md:order-2 md:flex-1 md:basis-0"
          >
            {list.map((role, i) => (
              <div
                key={role.name}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${n}: ${role.name}`}
                className="rf-slide flex w-full shrink-0 flex-col items-center gap-5 px-2 py-2 md:flex-row md:justify-center md:gap-8"
              >
                <div className="relative w-[55%] max-w-[180px] shrink-0 rf-card-tilt md:w-[200px] md:max-w-none">
                  <span className="rf-pin absolute -top-2 left-1/2 -translate-x-1/2" aria-hidden="true" />
                  <CardImage name={role.name} />
                </div>
                <div className="vf-paper rf-note-tilt relative w-full max-w-sm p-5 md:max-w-md">
                  <span className="rf-pin absolute -top-2 left-4" aria-hidden="true" />
                  <span className="rf-seal-badge" style={{ background: faction.color }} aria-hidden="true">
                    <i className={faction.icon} />
                  </span>
                  <h4 className="vf-title pr-10 text-xl font-bold">{role.name.toUpperCase()}</h4>
                  <p className="mt-2 text-[15px] leading-relaxed">{role.description}</p>
                  <h5 className="vf-title mt-4 flex items-center gap-2 text-[15px] font-normal">
                    <i className={`${faction.icon} vf-brass-text`} aria-hidden="true" />
                    <span>WINS WITH: <strong className="font-bold">{faction.winsWith(role)}</strong></span>
                  </h5>
                </div>
              </div>
            ))}
          </div>
        <button type="button" className={cn(arrow, 'order-2 md:order-1')} aria-label="Previous role" onClick={() => go(-1)}>
          <ChevronLeft aria-hidden="true" />
        </button>
        <button type="button" className={cn(arrow, 'order-4 md:order-3')} aria-label="Next role" onClick={() => go(1)}>
          <ChevronRight aria-hidden="true" />
        </button>
        <div className="order-3 flex items-center gap-0.5 md:order-4 md:basis-full md:justify-center" role="tablist" aria-label={`${faction.title} roles position`}>
          {list.map((role, i) => (
            <button
              key={role.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show ${role.name}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => track.current.scrollTo({ left: i * track.current.clientWidth, behavior: 'smooth' })}
              className="flex size-6 items-center justify-center"
            >
              <span className="rf-dot size-2.5 rounded-full" />
            </button>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}

export default function MockRulesF() {
  const username = session.user.username;

  return (
    <Layout user={username}>
      <style>{CSS}</style>
      <div className="vf-rules flex flex-col gap-8">
        <PageTitle>RULES</PageTitle>

        <nav aria-label="Chapters" className="sticky top-[7.5rem] z-30 -mx-1 md:top-[4.75rem]">
          <ul className="flex list-none flex-wrap justify-center gap-2 py-2">
            {CHAPTERS.map((c) => (
              <li key={c.id}><a href={`#${c.id}`} className="vf-chip">{c.label}</a></li>
            ))}
          </ul>
        </nav>

        <Panel as="section" id="intro" className="scroll-mt-44 p-6 sm:p-8">
          <h2 className="vf-title mb-3 text-xl font-bold"><span className="vf-illum" aria-hidden="true">I</span>ntroduction to Lupus</h2>
          <p className="text-[17px] leading-relaxed">{INTRO}</p>
        </Panel>

        <Ornament />

        <Panel as="section" id="aim" className="scroll-mt-44 p-6 sm:p-8">
          <h2 className="vf-title mb-3 text-xl font-bold">Aim of the game</h2>
          <p className="text-[17px] leading-relaxed">{AIM}</p>
        </Panel>

        <Ornament />

        <Panel as="section" id="preparation" className="scroll-mt-44 p-6 sm:p-8">
          <h2 className="vf-title mb-3 text-xl font-bold">Preparation</h2>
          <p className="text-[17px] leading-relaxed">{PREPARATION}</p>
        </Panel>

        <Ornament />

        <Panel as="section" id="game" className="scroll-mt-44 p-6 sm:p-8" aria-labelledby="game-title">
          <h2 id="game-title" className="vf-title mb-3 text-xl font-bold">Game</h2>
          <p className="text-[17px] leading-relaxed">{GAME}</p>
          <div className="mt-6 flex flex-col gap-5">
            <SubChapter id="night" title="Night" Icon={Moon}>
              <p>{NIGHT}</p>
              <p className="vf-ink2 italic">{NIGHT_WOLVES_HEAD}</p>
              <ul className="list-disc space-y-1 pl-6">{NIGHT_WOLVES.map((t) => <li key={t}>{t}</li>)}</ul>
              <p className="vf-ink2 italic">{NIGHT_GOOD_HEAD}</p>
              <ul className="list-disc space-y-1 pl-6">{NIGHT_GOOD.map((t) => <li key={t}>{t}</li>)}</ul>
              <hr className="vf-brass-border border-t-2" />
              <p>{NIGHT_NOTE}</p>
            </SubChapter>
            <SubChapter id="day" title="Day" Icon={Sun}>
              <p>{DAY}</p>
            </SubChapter>
            <SubChapter id="voting" title="Voting" Icon={Vote}>
              <p>{VOTING}</p>
              <hr className="vf-brass-border border-t-2" />
              <p>{VOTING_NOTE}</p>
            </SubChapter>
          </div>
        </Panel>

        <Ornament />

        <Panel as="section" id="victory" className="scroll-mt-44 p-6 sm:p-8">
          <h2 className="vf-title mb-3 text-xl font-bold">Victory Condition</h2>
          <p className="text-[17px] leading-relaxed">{VICTORY}</p>
        </Panel>

        <Ornament />

        <section id="roles" aria-labelledby="roles-title" className="scroll-mt-44 flex flex-col gap-8">
          <div className="text-center">
            <h2 id="roles-title" className="vf-display text-3xl sm:text-4xl">ROLES</h2>
            <Ornament className="mx-auto mt-4 max-w-md" />
          </div>
          {FACTIONS.map((faction) => (
            <Bacheca key={faction.type} faction={faction} roles={ALL_ROLES.filter((r) => r.type === faction.type)} />
          ))}
        </section>
      </div>
    </Layout>
  );
}
