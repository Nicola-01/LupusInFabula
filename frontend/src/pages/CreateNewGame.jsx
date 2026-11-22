import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import SearchPlayer from '../components/SearchPlayer.jsx';
import { ErrorMessage } from '../components/Messages.jsx';
import ToggleSwitch from '../components/game/newGame/ToggleSwitch.jsx';
import NumberInput from '../components/game/newGame/NumberInput.jsx';
import AddFriendCheckbox from '../components/game/newGame/AddFriendCheckbox.jsx';
import { useLoginChecker } from '../utils/session.js';
import {
    contextPath, genericGETRequest, genericPOSTRequest, getMessage, capitalizeFirstLetter,
    HTTP_STATUS_OK, HTTP_STATUS_CREATED, JSON_resource_list,
} from '../utils/utils.js';
import { populateErrorMessage } from '../utils/message.js';
import { playersToIgnore } from '../utils/searchPlayer.js';

/* Port of jsp/game/createNewGame.jsp + js/game/createNewGame.js (+ css/game/createNewGame.css). */

// Same order as the JSP: the role columns in the DOM are good, evil, neutral, victory stealer.
const COLUMNS = [
    { id: 'goodRoles', type: 0, title: 'GOOD', bg: 'bg-roles-bg-good' },
    { id: 'evilRoles', type: 1, title: 'EVIL', bg: 'bg-roles-bg-evil' },
    { id: 'neutralRoles', type: 3, title: 'NEUTRAL', bg: 'bg-roles-bg-neutral' },
    { id: 'victoryStealerRoles', type: 2, title: 'VICTORY STEALER', bg: 'bg-roles-db-victorystealer' },
];

const GREEN = '\u{1F7E2}'; // &#128994;
const RED = '\u{1F534}';   // &#128308;

// th/td of the old common.css (padding 3px, centered, height 46px) + Bootstrap table borders.
const CELL = 'p-[3px] h-[46px] text-center align-middle border-b border-solid border-[#dee2e6] dark:border-[#495057] bg-white dark:bg-[#212529] text-black dark:text-white';
// .table-striped: 5% overlay on the odd rows (on the cells, as Bootstrap does)
const STRIPE = 'odd:[&>td]:bg-[linear-gradient(rgba(0,0,0,.05),rgba(0,0,0,.05))] dark:odd:[&>td]:bg-[linear-gradient(rgba(255,255,255,.05),rgba(255,255,255,.05))]';
const TABLE_HEAD = 'sticky top-0 z-[1]';
const ARROW = 'border border-solid border-[#ccc] bg-transparent px-[1.5em] py-0 text-[0.7em] cursor-pointer';

export default function CreateNewGame() {
    useLoginChecker();

    const [roles, setRoles] = useState([]);            // sorted role objects from GET game/create
    const [settings, setSettings] = useState([]);      // setting objects from GET game/settings
    const [counts, setCounts] = useState({});          // role name -> cardinality (switch: 0/1)
    const [gameSettings, setGameSettings] = useState({}); // setting_name -> bool
    const [friends, setFriends] = useState(null);      // friend usernames, null until loaded
    const [checked, setChecked] = useState({});        // friend username -> checkbox state
    const [players, setPlayers] = useState([]);        // usernames in table order
    const [avail, setAvail] = useState(null);          // Map(lower username -> gameId | null), null before 1st answer

    // Latest values for the XHR callbacks (the old page globals).
    const playersRef = useRef([]);
    const friendsRef = useRef([]);
    const loaded = useRef(false);

    const setPlayersAll = (list) => { playersRef.current = list; setPlayers(list); };
    const setCheckedFor = (name, value) => setChecked((c) => ({ ...c, [name]: value }));
    const setCount = (name, value) => setCounts((c) => ({ ...c, [name]: value }));

    const sendAvailabilityRequest = () => {
        genericGETRequest(contextPath + "user/search/", updateAvailability);
    };

    // Same as updateAvailability(): players not in the server list are removed from the table.
    const updateAvailability = (req) => {
        if (req.readyState === XMLHttpRequest.DONE && req.status === HTTP_STATUS_OK) {
            const map = new Map();
            const list = JSON.parse(req.responseText)[JSON_resource_list];
            if (list != null)
                for (let i = 0; i < list.length; i++)
                    map.set(list[i]['player']['username'].toLowerCase(), list[i]['player']['gameId']);

            [...playersRef.current].forEach((p) => {
                if (!map.has(p.toLowerCase())) removeFromPlayersTable(p);
            });
            setAvail(map);
        }
    };

    // Same as addToPlayersTable().
    const addToPlayersTable = (username) => {
        const list = playersRef.current;
        if (list.some((p) => p.toLowerCase() === username.toLowerCase()))
            return;

        playersToIgnore.push(username.toLowerCase());
        setPlayersAll([...list, username]);

        if (friendsRef.current.includes(username))
            setCheckedFor(username, true);

        sendAvailabilityRequest();
    };

    // Same as removeFromPlayersTable().
    const removeFromPlayersTable = (username) => {
        const list = playersRef.current;
        const i = list.indexOf(username);
        if (i !== -1) {
            setPlayersAll(list.filter((_, j) => j !== i));
            // sic: misplaced paren, kept from js/game/createNewGame.js:543
            playersToIgnore.splice(playersToIgnore.indexOf(username.toLowerCase(), 1));
        }
    };

    // Same as removeRow() (remove button of a player row).
    const removeRow = (index) => {
        const list = playersRef.current;
        const username = list[index];
        setPlayersAll(list.filter((_, j) => j !== index));

        // sic: misplaced paren, kept from js/game/createNewGame.js:562
        playersToIgnore.splice(playersToIgnore.indexOf(username.toLowerCase(), 1));

        friendsRef.current.forEach((f) => { if (f === username) setCheckedFor(f, false); });
    };

    // Same as checkBoxPress() (friend "add" toggle).
    const checkBoxPress = (name, value) => {
        setCheckedFor(name, value);
        if (value) addToPlayersTable(name);
        else removeFromPlayersTable(name);
    };

    // Same as moveUp() / moveDown(): swap with the neighbour row.
    const moveRow = (from, to) => {
        if (to < 0 || to >= playersRef.current.length) return;
        const list = [...playersRef.current];
        [list[from], list[to]] = [list[to], list[from]];
        setPlayersAll(list);
    };

    // Used by SearchPlayer (onSearch): same as searchThePlayer().
    const searchThePlayer = () => {
        const input = document.getElementById("playerUsername");
        const username = input.value;
        if (username !== "") {
            addToPlayersTable(username);
            input.value = "";
        }
        friendsRef.current.forEach((f) => { if (f === username) setCheckedFor(f, true); });
    };

    const fillFriends = (req) => {
        if (req.readyState === XMLHttpRequest.DONE && req.status === HTTP_STATUS_OK) {
            const list = JSON.parse(req.responseText)[JSON_resource_list];
            if (list == null) {
                alert("No game settings available");
            } else {
                const names = list.map((item) => item['friend'].username);
                friendsRef.current = names;
                setFriends(names);
                sendAvailabilityRequest();
            }
        }
    };

    const fillGameRoles = (req) => {
        if (req.readyState === XMLHttpRequest.DONE && req.status === HTTP_STATUS_OK) {
            const list = JSON.parse(req.responseText)[JSON_resource_list];
            if (list == null) {
                alert("No game settings available");
            } else {
                const sorted = [...list].sort((a, b) => b.role.max_number - a.role.max_number);
                setRoles(sorted.map((item) => item['role']));
            }
        }
    };

    const fillGameSettings = (req) => {
        if (req.readyState === XMLHttpRequest.DONE && req.status === HTTP_STATUS_OK) {
            const list = JSON.parse(req.responseText)[JSON_resource_list];
            if (list == null) {
                alert("No game settings available");
                return;
            }
            setSettings(list.map((item) => item['setting']));
        }
    };

    const gameCreation = (req) => {
        if (req.readyState !== XMLHttpRequest.DONE) return;
        if (req.status === HTTP_STATUS_CREATED) {
            const game = JSON.parse(req.responseText)['game'];
            window.location.replace(contextPath + "village/" + game.public_ID);
        } else {
            const message = getMessage(req);
            if (message != null) {
                populateErrorMessage(".errorMessage", message.message, message.errorCode, message.errorDetails);
            } else {
                const listMsg = JSON.parse(req.responseText)[JSON_resource_list];
                if (listMsg != null) {
                    let msgs = "";
                    let errorCodes = "";
                    let errorDetails = "";
                    for (let i = 0; i < listMsg.length; i++) {
                        const m = listMsg[i]['message'];
                        msgs += m.message + "<br>";
                        if (!errorCodes.includes(m['error-code']))
                            errorCodes += ", " + m['error-code'];
                        if (!errorDetails.includes(m['error-details']))
                            errorDetails += "<br>" + m['error-details'];
                    }
                    populateErrorMessage(".errorMessage", msgs, errorCodes.substring(2), errorDetails.substring(4));
                }
            }
        }
    };

    useEffect(() => {
        if (loaded.current) return;
        loaded.current = true;
        genericGETRequest(contextPath + "game/create", fillGameRoles);
        genericGETRequest(contextPath + "game/settings", fillGameSettings);
        genericGETRequest(contextPath + "user/me/friend", fillFriends);

        // list of players to be ignored by the search player (the current player)
        const me = localStorage.getItem("playerName");
        if (me) playersToIgnore.push(me.toLowerCase());
    }, []);

    // Role cards in the DOM order of the JSP (good, evil, neutral, victory stealer).
    const roleOrder = COLUMNS.flatMap((col) => roles.filter((r) => r.type === col.type));
    const totRoles = roleOrder.reduce((sum, r) => sum + (counts[r.name] ?? 0), 0);
    const totPlayers = players.length;
    const enabled = totPlayers >= 5 && totPlayers === totRoles;

    // Same as sendSettings().
    const sendSettings = () => {
        const roleCardinality = roleOrder.map((r) => ({ role: r.name, cardinality: counts[r.name] ?? 0 }));
        const player = playersRef.current.map((username) => ({ username: username.trim() }));
        const gameSettingsList = settings.map((s) => ({ setting: s.setting_name, status: gameSettings[s.setting_name] ?? false }));
        const json = { roleCardinality, player, gameSettings: gameSettingsList };
        genericPOSTRequest(contextPath + "game/create", JSON.stringify(json), gameCreation);
    };

    return (
        <>
            <Navbar />

            {/* pt-2: Bootstrap navbar margin-bottom is 1.5rem, the Tailwind mb-4 of Navbar is 1rem */}
            <main className="font-['Jost',sans-serif] text-text-color w-full mx-auto px-3 min-[576px]:max-w-[540px] min-[768px]:max-w-[720px] min-[992px]:max-w-[960px] min-[1200px]:max-w-[1140px]">
                <h1 className="text-[calc(1.25rem_+_1vw)] font-medium leading-[1.2] mt-0 mb-2">SELECT THE HABITANTS</h1>
                <div className="flex flex-wrap -mx-3">
                    <div className="relative w-full min-[768px]:w-1/2 shrink-0 max-w-full p-1 order-2 min-[768px]:order-1">
                        <div id="players" className="p-2 mb-12 h-full rounded-2xl bg-bg-second-color">
                            <h2 className="text-center my-2 text-[calc(1.3rem_+_.6vw)] font-medium leading-[1.2]">HABITANTS IN GAME</h2>
                            <div className="h-[25em] overflow-auto mb-4">
                                <table id="players_tb" className="w-full mb-0 align-top border-collapse text-text-color">
                                    <thead className={TABLE_HEAD}>
                                        <tr>
                                            <th className={`${CELL} w-[10%]`}>Order</th>
                                            <th className={`${CELL} w-[60%]`}>Username</th>
                                            <th className={`${CELL} w-[15%]`}>Available</th>
                                            <th className={`${CELL} w-[15%]`}>Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {players.length === 0 && friends !== null && (
                                            <tr className={STRIPE}>
                                                <td colSpan={4} className={CELL}>
                                                    Here you will see the players who will be in the game. <br />Add at least 5!
                                                </td>
                                            </tr>
                                        )}
                                        {players.map((username, i) => (
                                            <tr key={username} className={STRIPE}>
                                                <td className={CELL}>
                                                    <div className="flex flex-col w-[3em] mx-auto">
                                                        <button className={`${ARROW} rounded-[1em_1em_0_0]`} onClick={() => moveRow(i, i - 1)}>▲</button>
                                                        <button className={`${ARROW} rounded-[0_0_1em_1em]`} onClick={() => moveRow(i, i + 1)}>▼</button>
                                                    </div>
                                                </td>
                                                <td className={CELL}>{username}</td>
                                                <td className={CELL}>
                                                    {avail && avail.has(username.toLowerCase())
                                                        ? (avail.get(username.toLowerCase()) === null ? GREEN : RED)
                                                        : ''}
                                                </td>
                                                <td className={CELL}>
                                                    <button className="inline-block relative p-[0.3em] border-0 border-transparent rounded-[0.7em] bg-[rgba(100,77,237,0.08)] transition-all duration-200 ease-linear"
                                                            onClick={() => removeRow(i)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" height="25" width="25">
                                                            <path fill="#6361D9" fillRule="evenodd" clipRule="evenodd" d="M8.78842 5.03866C8.86656 4.96052 8.97254 4.91663 9.08305 4.91663H11.4164C11.5269 4.91663 11.6329 4.96052 11.711 5.03866C11.7892 5.11681 11.833 5.22279 11.833 5.33329V5.74939H8.66638V5.33329C8.66638 5.22279 8.71028 5.11681 8.78842 5.03866ZM7.16638 5.74939V5.33329C7.16638 4.82496 7.36832 4.33745 7.72776 3.978C8.08721 3.61856 8.57472 3.41663 9.08305 3.41663H11.4164C11.9247 3.41663 12.4122 3.61856 12.7717 3.978C13.1311 4.33745 13.333 4.82496 13.333 5.33329V5.74939H15.5C15.9142 5.74939 16.25 6.08518 16.25 6.49939C16.25 6.9136 15.9142 7.24939 15.5 7.24939H15.0105L14.2492 14.7095C14.2382 15.2023 14.0377 15.6726 13.6883 16.0219C13.3289 16.3814 12.8414 16.5833 12.333 16.5833H8.16638C7.65805 16.5833 7.17054 16.3814 6.81109 16.0219C6.46176 15.6726 6.2612 15.2023 6.25019 14.7095L5.48896 7.24939H5C4.58579 7.24939 4.25 6.9136 4.25 6.49939C4.25 6.08518 4.58579 5.74939 5 5.74939H6.16667H7.16638ZM7.91638 7.24996H12.583H13.5026L12.7536 14.5905C12.751 14.6158 12.7497 14.6412 12.7497 14.6666C12.7497 14.7771 12.7058 14.8831 12.6277 14.9613C12.5495 15.0394 12.4436 15.0833 12.333 15.0833H8.16638C8.05588 15.0833 7.94989 15.0394 7.87175 14.9613C7.79361 14.8831 7.74972 14.7771 7.74972 14.6666C7.74972 14.6412 7.74842 14.6158 7.74584 14.5905L6.99681 7.24996H7.91638Z" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div id="playersCount" className="absolute w-[calc(100%_-_16px)] text-center text-[1.3em] mt-2">
                                Total number of habitants: <span className="font-bold">{totPlayers}</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full min-[768px]:w-1/2 shrink-0 max-w-full p-1 order-1 min-[768px]:order-2">
                        <div id="friends" className="p-2 mb-12 h-full rounded-2xl bg-bg-second-color">
                            <h2 className="text-center my-2 text-[calc(1.3rem_+_.6vw)] font-medium leading-[1.2]">YOUR FRIENDS</h2>
                            <div className="h-[25em] overflow-auto mb-4">
                                <table id="friends_tb" className="w-full mb-0 align-top border-collapse text-text-color">
                                    <thead className={TABLE_HEAD}>
                                        <tr>
                                            <th className={`${CELL} w-[60%]`}>Username</th>
                                            <th className={`${CELL} w-[20%]`}>Available</th>
                                            <th className={CELL}>Add</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {friends !== null && friends.length === 0 && (
                                            <tr className={STRIPE}>
                                                <td colSpan={3} className={CELL}>Here you can find your friends.</td>
                                            </tr>
                                        )}
                                        {(friends ?? []).map((username) => (
                                            <tr key={username} className={STRIPE}>
                                                <td className={CELL}>{username}</td>
                                                <td className={CELL}>
                                                    {avail
                                                        ? (avail.get(username.toLowerCase()) === null ? GREEN : RED)
                                                        : ''}
                                                </td>
                                                <td className={CELL}>
                                                    <AddFriendCheckbox username={username} checked={!!checked[username]}
                                                                       onChange={(v) => checkBoxPress(username, v)} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <SearchPlayer onSearch={searchThePlayer} buttonText="Add!" />
                        </div>
                    </div>
                </div>

                <h1 className="mt-6 text-[calc(1.25rem_+_1vw)] font-medium leading-[1.2] mb-2">SELECT THE ROLES</h1>
                <div className="flex flex-wrap -mx-3 mb-4">
                    {COLUMNS.map((col) => (
                        <div key={col.id} className="w-full min-[768px]:w-1/2 min-[992px]:w-1/4 shrink-0 max-w-full p-1">
                            <div id={col.id} className={`h-full rounded-2xl p-4 ${col.bg}`}>
                                <h2 className="text-center my-[10px] h-[75px] max-[992px]:h-10 text-[calc(1.3rem_+_.6vw)] font-medium leading-[1.2]">{col.title}</h2>
                                {roles.filter((r) => r.type === col.type).map((role) => (
                                    <div key={role.name} className="flex items-center not-last:mb-[.7em]">
                                        {capitalizeFirstLetter(role.name)}
                                        {role.max_number === 1
                                            ? <ToggleSwitch checked={(counts[role.name] ?? 0) === 1}
                                                            onChange={(v) => setCount(role.name, v ? 1 : 0)} />
                                            : <NumberInput value={counts[role.name] ?? 0} max={role.max_number}
                                                           onChange={(v) => setCount(role.name, v)} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div id="rolesCount" className="w-full shrink-0 max-w-full px-3 mt-2 text-center text-[1.3em]">
                        Total number of roles: <span className="font-bold">{totRoles}</span>
                    </div>
                </div>

                <h1 className="mt-6 text-[calc(1.25rem_+_1vw)] font-medium leading-[1.2] mb-2">OTHER GAME SETTINGS</h1>
                <div id="otherGameSettings" className="flex flex-wrap -mx-3 mb-4 p-4 rounded-2xl bg-bg-second-color">
                    {settings.map((s) => (
                        <div key={s.setting_name} className="flex items-center w-full shrink-0 max-w-full p-0 not-last:mb-[.7em]">
                            <span>{s.description}</span>
                            <ToggleSwitch checked={!!gameSettings[s.setting_name]}
                                          onChange={(v) => setGameSettings((g) => ({ ...g, [s.setting_name]: v }))} />
                        </div>
                    ))}
                </div>

                <ErrorMessage />
                <div className="flex justify-center mb-5">
                    <button id="sendSettings" disabled={!enabled} onClick={sendSettings}
                            className="group flex items-center justify-center min-w-[140px] max-w-full box-border p-[3px] rounded-lg border-0 bg-[linear-gradient(144deg,#AF40FF,#5B42F3_33%,#3f72f1_66%,#00DDEB)] text-white text-[18px] leading-[1em] whitespace-nowrap select-none cursor-pointer transition-all duration-300 hover:outline-0 active:outline-0 enabled:active:scale-90 disabled:cursor-not-allowed disabled:bg-none">
                        <span className="block w-full h-full px-6 py-4 rounded-md bg-[rgb(5,6,45)] transition-all duration-300 group-enabled:group-hover:bg-transparent group-disabled:bg-[rgb(162,15,18)]">
                            Create new village!
                        </span>
                    </button>
                </div>
            </main>

            <Footer />
        </>
    );
}
