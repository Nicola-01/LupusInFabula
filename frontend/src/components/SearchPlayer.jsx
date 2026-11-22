import { useEffect, useRef, useState } from 'react';
import { contextPath, genericGETRequest, HTTP_STATUS_OK, JSON_resource_list } from '../utils/utils.js';
import { minSizeSearch, playersToIgnore } from '../utils/searchPlayer.js';
import { Button } from '@/components/ui/button';

/*
 * Player search box with the suggestion popup (port of jsp/utils/searchPlayer.jsp + js/utils/searchPlayer.js).
 * Ids kept: playerUsername (input), addPlayer (button), playerListPopup, playerList. Pages read/clear the input by id,
 * so the input stays uncontrolled.
 * Pages push the usernames to hide into playersToIgnore (utils/searchPlayer.js) and must provide onSearch
 * (the old searchThePlayer): called on Enter, on the button, and on a suggestion click.
 * Usage: <SearchPlayer onSearch={searchThePlayer} buttonText="Add!" />
 */
export default function SearchPlayer({ onSearch, buttonText = 'Add!' }) {
    const [shown, setShown] = useState([]);        // suggestions currently listed
    const [contains, setContains] = useState('');  // text to highlight in the suggestions
    const [open, setOpen] = useState(false);       // popup visible
    const [selected, setSelected] = useState(null); // username of the highlighted suggestion

    const inputRef = useRef(null);
    const listRef = useRef(null);
    // Mutable search state (the old module globals).
    const st = useRef({ players: [], searchUserContain: undefined, startedText: '', shown: [], selected: null });

    const onSearchRef = useRef(onSearch);
    useEffect(() => { onSearchRef.current = onSearch; });

    const setSel = (username) => { st.current.selected = username; setSelected(username); };

    const hidePopup = () => { setOpen(false); setSel(null); };

    // Same as populatePlayerList(players, contains): ignored players are filtered out, the popup
    // is shown when the (unfiltered) list is not empty.
    const populate = (players, text) => {
        const filtered = players.filter((p) => !playersToIgnore.includes(p.username.toLowerCase()));
        st.current.shown = filtered;
        setShown(filtered);
        setContains(text);
        setSel(null);
        setOpen(players.length > 0);
    };

    const savePlayers = (req) => {
        if (req.readyState === XMLHttpRequest.DONE && req.status === HTTP_STATUS_OK) {
            const players = [];
            const list = JSON.parse(req.responseText)[JSON_resource_list];
            if (list != null)
                for (let i = 0; i < list.length; i++)
                    players.push({ username: list[i]['player']['username'], gameId: list[i]['player']['gameId'] });
            st.current.players = players;
            populate(players, st.current.searchUserContain);
        }
    };

    const searchUser = () => {
        const s = st.current;
        const user = inputRef.current.value;
        if (user.length >= minSizeSearch) {
            if (user.includes(s.searchUserContain)) { // local research
                populate(s.players.filter((p) => p.username.toLowerCase().includes(user.toLowerCase())), user);
            } else { // database request
                s.searchUserContain = user;
                genericGETRequest(contextPath + "user/search/" + user, savePlayers);
            }
        } else
            hidePopup();
    };

    const scrollTo = (index) => {
        listRef.current?.children[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    };

    const select = (index) => {
        const username = st.current.shown[index].username;
        setSel(username);
        inputRef.current.value = username;
        scrollTo(index);
    };

    // Keyboard handling (the old code listened to keyup).
    const onKeyUp = (event) => {
        const s = st.current;
        const items = s.shown;
        const idx = s.selected == null ? -1 : items.findIndex((p) => p.username === s.selected);
        switch (event.key) {
            case 'ArrowUp': // scroll up the list
                if (idx !== -1) {
                    if (idx > 0) select(idx - 1);
                    else { setSel(null); inputRef.current.value = s.startedText; } // leave the list
                }
                break;
            case 'ArrowDown': // scroll down the list
                if (idx !== -1) {
                    if (idx + 1 < items.length) select(idx + 1);
                } else if (items.length > 0) {
                    select(0);
                }
                break;
            case 'Enter':
                s.searchUserContain = null;
                onSearchRef.current?.();
                hidePopup();
                break;
            default:
                s.startedText = inputRef.current.value;
                searchUser();
                break;
        }
    };

    // Highlights the matching part of the username (same as highlightContains, rendered without innerHTML).
    const highlight = (username) => {
        const index = contains ? username.toLowerCase().indexOf(contains.toLowerCase()) : -1;
        if (index === -1) return username;
        return (
            <>
                {username.substring(0, index)}
                <b>{username.substring(index, index + contains.length)}</b>
                {username.substring(index + contains.length)}
            </>
        );
    };

    return (
        <div className="search relative w-full">
            <input id="playerUsername" ref={inputRef} placeholder=" Search a player..." type="text"
                   data-1p-ignore data-bwignore data-lpignore="true" data-form-type="other"
                   onKeyUp={onKeyUp}
                   onFocus={() => searchUser()}
                   onBlur={() => hidePopup()}
                   className={`lf-input h-11 w-full pl-3 pr-28 text-base outline-none focus:ring-2 focus:ring-lf-focus md:h-10 md:text-sm ${open ? '!rounded-b-none' : ''}`} />
            <Button id="addPlayer" variant="felt" size="sm" className="searchUser absolute top-1/2 right-1 h-9 -translate-y-1/2 px-4 min-w-16"
                    onClick={() => onSearchRef.current?.()}>
                {buttonText}
            </Button>
            <div id="playerListPopup" className={`popup lf-paper !bg-lf-paper !text-lf-ink !rounded-sm absolute top-full left-0 right-0 z-20 mt-1 ${open ? 'block' : 'hidden'}`}>
                <ul id="playerList" ref={listRef} className="player-list list-none p-0 m-0 max-h-[210px] overflow-y-auto">
                    {shown.map((p) => (
                        <li key={p.username} id={p.username}
                            className={`px-3 py-2 cursor-pointer hover:bg-lf-hl ${selected === p.username ? 'selected bg-lf-hl' : ''}`}
                            onMouseDown={() => {
                                inputRef.current.value = p.username;
                                st.current.searchUserContain = null;
                                onSearchRef.current?.();
                                hidePopup();
                            }}>
                            <div className="playerContainer flex">
                                {highlight(p.username)}
                                {p.gameId === null
                                    ? <span className="playerStatus available ml-auto text-lf-seal-ok">Available &#128994;</span>
                                    : <span className="playerStatus inGame ml-auto text-lf-wax">In game   &#128308; </span>}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
