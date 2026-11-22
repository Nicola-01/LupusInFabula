import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/rules.css';

const CARD_IMAGE = 'block h-[280px] w-[200px] m-auto align-middle';
const SECTION_TITLE = 'text-center mb-6 font-medium leading-[1.2] text-[calc(1.3rem_+_.6vw)]';

/** Card image: low resolution first, then the full one (old asyncImage loader in js/rules.js). */
function CardImage({ name }) {
    const full = `/lupus/media/cards/${name}.png`;
    const [src, setSrc] = useState(`/lupus/media/cards/lowResolution/${name}.png`);
    useEffect(() => {
        const img = new Image();
        img.src = full;
        img.onload = () => setSrc(full);
    }, [full]);
    return <img className={CARD_IMAGE} src={src} alt={`${name}'s card`} />;
}

/** One slideshow of roles of the same type (old slideshow-container + plusSlides/showSlides). */
function RoleSlideshow({ title, description, roles, winsWith, panel }) {
    const [slide, setSlide] = useState(0);
    const step = (n) => {
        if (roles.length) setSlide((s) => (s + n + roles.length) % roles.length);
    };
    const arrow = 'absolute top-1/2 -mt-[22px] w-auto p-4 cursor-pointer select-none font-bold text-[18px] text-[rgba(33,37,41,0.75)] dark:text-[rgba(222,226,230,0.75)] transition-all duration-[600ms] hover:bg-black/30 no-underline';

    return (
        <div className={`relative m-auto max-w-[50rem] rounded-[1rem] py-[2em] px-[0.5em] max-[768px]:py-[1em] ${panel}`}>
            <h2 className={SECTION_TITLE}><strong>{title}</strong></h2>
            <div className="w-4/5 m-auto pb-6 max-[768px]:w-full">{description}</div>

            {roles.map((role, i) => (
                <div key={role.name} className={`p-2 h-[296px] w-4/5 m-auto max-[768px]:h-[592px] max-[768px]:w-full ${i === slide ? 'block' : 'hidden'}`}>
                    <div className="flex flex-wrap -mx-3">
                        <div className="w-full min-[768px]:w-5/12 shrink-0 px-3">
                            <CardImage name={role.name} />
                        </div>
                        <div className="relative w-full min-[768px]:w-7/12 shrink-0 h-[280px] px-[10px] max-[768px]:pt-[15px] max-[768px]:m-auto">
                            <h4 className="text-[1.25rem] font-medium leading-[1.2] mb-2 max-[768px]:text-center">
                                {role.name.toUpperCase()}
                            </h4>
                            <p className="m-0 leading-[1.6]">{role.description}</p>
                            <h5 className="absolute bottom-0 mb-0 text-[1rem] font-medium leading-normal">
                                WINS WITH: <strong className="font-medium">{winsWith(role)}</strong>
                            </h5>
                        </div>
                    </div>
                </div>
            ))}

            <a className={`${arrow} left-0`} onClick={() => step(-1)}>❮</a>
            <a className={`${arrow} right-0 rounded-[3px_0_0_3px]`} onClick={() => step(1)}>❯</a>
        </div>
    );
}

/**
 * Rules page (port of jsp/rules.jsp + js/rules.js + css/rules.css).
 * The roles come from GET /lupus/api/rules/roles ({roles: [[role...] x4]}), split by role.type like the JSP loops.
 */
export default function Rules() {
    const [roles, setRoles] = useState([]);

    useEffect(() => { document.title = 'Lupus in Fabula - Rules'; }, []);

    useEffect(() => {
        fetch('/lupus/api/rules/roles', { credentials: 'same-origin' })
            .then((r) => (r.ok ? r.json() : { roles: [] }))
            .then((data) => setRoles((data.roles ?? []).flat()))
            .catch(() => setRoles([]));
    }, []);

    const ofType = (type) => roles.filter((role) => role.type === type);
    const plagueOrIllusionist = (role) => (role.name === 'plague spreader' ? 'VILLAGERS' : role.name === 'illusionist' ? 'WOLF PACK' : '');

    return (
        <div className="min-h-screen bg-bg-first-color text-text-color font-['Jost',sans-serif] leading-[1.5]">
            <Navbar />

            <main className="lupus-rules w-full px-3 font-['Montserrat',sans-serif]">
                <h1 className="flex justify-center items-center p-[1em] mb-2 font-medium leading-[1.2] text-[calc(1.25rem_+_1vw)]">RULES</h1>
                <ol className="list" style={{ '--length': 7 }} role="list">
                    <li className="rules" style={{ '--i': 0 }}>
                        <h2><strong>Introduction to Lupus</strong></h2>
                        <p className="m-0 leading-[1.6]">In the remote village of Fabula, some people become werewolves at night. They attack an innocent person
                            to satisfy their instincts. During the day, the survivors discuss what to do. At the end of the
                            discussion, they lynch one of them. Who will survive the massacre?</p>
                    </li>

                    <li className="rules" style={{ '--i': 1 }}>
                        <h2><strong>Aim of the game</strong></h2>
                        <p className="m-0 leading-[1.6]">There are two factions in the game: the Werewolves and the Villagers. The aim of the Werewolf faction is
                            to eliminate all villagers. Conversely, the aim of the Villagers faction is to lynch all the
                            Werewolves.</p>
                    </li>
                    <li className="rules" style={{ '--i': 2 }}>
                        <h2><strong>Preparation</strong></h2>
                        <p className="m-0 leading-[1.6]">Before the game starts, one player is chosen to be the master/moderator. He doesn’t belong to any
                            faction, and he will only manage the game tracking everything that will happen. The other players will
                            play the role given to them by their card and look at their own card secretly.</p>
                    </li>
                    <li className="rules" style={{ '--i': 3 }}>
                        <h2><strong>Game</strong></h2>
                        <p className="m-0 leading-[1.6]">The game is divided into two phases: night and day. At night each role with an effect that resolves
                            during this phase will be called by the master to perform the respective action described in the role
                            card.
                            Once the master has called all roles with a night effect, night will end and the day phase will begin.
                            During the day, people will discuss and vote to lynch someone, hopefully a wolf or a member of the wolf
                            faction.</p>
                        <ol className="sublist" role="list">
                            <li className="subrules" style={{ '--i': 4 }}>
                                <h2><strong>Night</strong></h2>
                                <p className="m-0 leading-[1.6]">The moderator declares the beginning of the night (”it is night, everyone close your eyes”). All
                                    players
                                    then close their eyes, trying not to make any kind of noise for all the duration of this phase.
                                    The
                                    master then begins to call each role with effect:<br />
                                    Example of wolves calling:<br />
                                    - Master: ”Wolves open their eyes and choose who to go and maul.”<br />
                                    - Wolves silently agree and point to their prey<br />
                                    - Master: ”Decide who to send among you to maul your chosen prey”<br />
                                    - Wolves indicate who among them will go<br />
                                    - Master: ”The wolves close their eyes.”<br />
                                    Example of good role calling (e.g: Seer):<br />
                                    - Master: ”Seer open eyes and choose whom to investigate”<br />
                                    - Seer points to the player he wants to investigate<br />
                                    - Master nods to say whether the player has a bad or good role<br />
                                    - Master: ”Seer closes eyes.”<br /></p>
                                <hr />
                                <p className="m-0 leading-[1.6]">Note: This phase should be played even if the called role is already dead in order to not give clues
                                    to others. Once the master has called all roles with night effect, the night is over.</p>
                            </li>
                            <li className="subrules" style={{ '--i': 5 }}>
                                <h2><strong>Day</strong></h2>
                                <p className="m-0 leading-[1.6]">The master now declares the start of the day (”it’s day, everybody open your eyes”). The master
                                    then gives a recap of what happened during the past night, listing who died (if anyone died),
                                    who was anointed, etc. without giving explicit information about what happened (e.g. recap:
                                    Master: ”A died, B died, C was anointed”). Once the master has finished the recap, the
                                    still-living players can then start discussing among themselves to decide who to lynch. You may
                                    lie freely but under no circumstances may you show your card to others.</p>
                            </li>
                            <li className="subrules" style={{ '--i': 6 }}>
                                <h2><strong>Voting</strong></h2>
                                <p className="m-0 leading-[1.6]">After a maximum of three minutes of discussion, the master stops the discussion and asks each
                                    player, starting with the one to the left of the one who died first and proceeding clockwise,
                                    who he thinks should be lynched. All players, including ghosts (i.e., those who died), in their
                                    turn vote indicating who they want to lynch. At the end of the voting, the two players with the
                                    most votes will be clued (in case of a tie, the player closest to the first dead will be
                                    chosen). The two suspected players can now take a short speech defending themselves against the
                                    charges.
                                    After the two speeches are over, the remaining alive unindicted players will vote again for the
                                    new player to be lynched among the two suspects (in this case the voting will be
                                    counterclockwise starting with the alive unindicted player who was last to vote before). At this
                                    point the day is over and the master can start a new night and so on until one faction wins.
                                    <br /></p>
                                <hr />
                                <p className="m-0 leading-[1.6]">Note: all dead players (i.e. ghosts) for the rest of the entire game must not speak or show their
                                    role
                                    to other players.</p>
                            </li>
                        </ol>
                    </li>
                    <li className="rules" style={{ '--i': 7 }}>
                        <h2><strong>Victory Condition</strong></h2>
                        <p className="m-0 leading-[1.6]">The master declares the game over with a villagers victory if the villagers lynch all the werewolves.
                            Werewolves, on the other hand, are declared winners if at any point in time they are equal in number to
                            the still-living villagers (e.g., 2 werewolves and 2 villagers, or 1 and 1): in that case the werewolves
                            unceremoniously maul the remaining villagers! In case there are victory stealer roles in the game, they
                            will win if their victory condition is fulfilled, and in that case the master will declare them winners
                            any time in the game when they have completed their victory condition.
                        </p>
                    </li>
                </ol>

                <br />

                <h1 id="roles" className="flex justify-center items-center p-[1em] mb-2 font-medium leading-[1.2] text-[calc(1.25rem_+_1vw)]">ROLES</h1>
                <RoleSlideshow
                    title="GOOD"
                    description="Resident of the village of Fabula, who wants to protect the village from the pack of wolves."
                    roles={ofType(0)} winsWith={() => 'VILLAGERS'} panel="bg-[var(--roles-bg-good)]" />

                <br />

                <RoleSlideshow
                    title="EVIL"
                    description="Pack of wolves that want to maul the villagers."
                    roles={ofType(1)} winsWith={() => 'WOLF PACK'} panel="bg-[var(--roles-bg-evil)]" />

                <br />

                <RoleSlideshow
                    title="VICTORY STEALER"
                    description="Villagers who play for themselves without caring about other villagers."
                    roles={ofType(2)} winsWith={() => 'ALONE'} panel="bg-[var(--roles-db-victoryStealer-)]" />

                <br />

                <RoleSlideshow
                    title="NEUTRAL"
                    description="Roles that play with the villagers or the pack of wolves, and that can cause chaos between any type of role."
                    roles={ofType(3)} winsWith={plagueOrIllusionist} panel="bg-[var(--roles-bg-neutral)]" />
            </main>

            <Footer />
        </div>
    );
}
