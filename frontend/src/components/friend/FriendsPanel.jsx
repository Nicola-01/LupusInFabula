import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchPlayer from '../SearchPlayer.jsx';
import { ErrorMessage, InfoMessage, SuccessMessage } from '../Messages.jsx';
import {
    contextPath, genericGETRequest, genericPOSTRequest, genericDELETERequest, getMessage,
    HTTP_STATUS_OK, HTTP_STATUS_CREATED, JSON_resource_list,
} from '../../utils/utils.js';
import { playersToIgnore, clearSearchBar } from '../../utils/searchPlayer.js';
import { populateErrorMessage, populateInfoMessage, populateSuccessMessage } from '../../utils/message.js';
import { Button } from '@/components/ui/button';
import { UserToken } from '@/components/lupus';
import { useSorttable } from '../user/externalScripts.js';

/*
 * Port of jsp/friend/friend.jsp + js/friend/friendManagement.js (the "Friends" tab of the personal area).
 * friends: null until the list is loaded (the old table was empty until then), then the array of friend objects.
 * avail: null, or a Map lower-case username -> gameId (null = free), from GET user/search/.
 */
export default function FriendsPanel({ show, user }) {
    const [friends, setFriends] = useState(null);
    const [avail, setAvail] = useState(null);
    const tableRef = useRef(null);
    const loaded = useRef(false); // the list is requested once, the first time the tab is shown
    const meName = user?.username;
    useSorttable(tableRef);

    const updateFriendAvailability = (req) => {
        if (req.readyState === XMLHttpRequest.DONE && req.status === HTTP_STATUS_OK) {
            const players = new Map();
            const list = JSON.parse(req.responseText)[JSON_resource_list];
            if (list != null) {
                for (let i = 0; i < list.length; i++)
                    players.set(list[i]['player']['username'].toLowerCase(), list[i]['player']['gameId']);
            }
            setAvail(players);
        }
    };

    const sendFriendAvailabilityRequest = () => {
        genericGETRequest(contextPath + "user/search/", updateFriendAvailability);
    };

    const fillFriendsList = (req) => {
        if (req.readyState === XMLHttpRequest.DONE && req.status === HTTP_STATUS_OK) {
            const list = JSON.parse(req.responseText)[JSON_resource_list];
            if (list == null) {
                alert("No friends");
            } else {
                const rows = list.map((item) => item['friend']);
                playersToIgnore.length = 0;
                playersToIgnore.push(meName.toLowerCase());
                rows.forEach((friend) => playersToIgnore.push(friend.username.toLowerCase()));
                setFriends(rows);
                setAvail(null);
                sendFriendAvailabilityRequest();
            }
        }
    };

    const loadFriendList = () => {
        genericGETRequest(contextPath + "user/me/friend", fillFriendsList);
    };

    useEffect(() => {
        if (!show || !meName || loaded.current) return;
        loaded.current = true;
        loadFriendList();
    }, [show, meName]);

    useEffect(() => {
        // bfcache restore: reload the list (friendManagement.js pageshow)
        const onPageShow = (event) => { if (event.persisted && loaded.current) loadFriendList(); };
        window.addEventListener('pageshow', onPageShow);
        return () => window.removeEventListener('pageshow', onPageShow);
    }, [meName]);

    const deleteFriend = (username) => {
        genericDELETERequest(contextPath + "user/me/friend", JSON.stringify({ friend: { username } }), (req) => {
            if (req.readyState === XMLHttpRequest.DONE) {
                if (req.status === HTTP_STATUS_OK) {
                    removeFromFriendsTable(username);
                    populateInfoMessage("#friendsPage .infoMessage", "Friend deleted", username + " removed from your friends");
                } else {
                    console.error("Error deleting friend:", req.status);
                }
            }
        });
    };

    const removeFromFriendsTable = (username) => {
        playersToIgnore.splice(playersToIgnore.indexOf(username.toLowerCase()), 1);
        setFriends((list) => list.filter((friend) => friend.username !== username));
    };

    const addToFriendsTable = (friend) => {
        setFriends((list) => [...(list ?? []), friend]);
        setAvail(null);
        sendFriendAvailabilityRequest();
        playersToIgnore.push(friend.username.toLowerCase());
        clearSearchBar();
    };

    const searchThePlayer = () => {
        const username = document.getElementById("playerUsername").value;
        if (username.trim() !== "") {
            genericPOSTRequest(contextPath + "user/me/friend", JSON.stringify({ friend: { username } }), (req) => {
                if (req.readyState === XMLHttpRequest.DONE) {
                    if (req.status === HTTP_STATUS_CREATED) {
                        const friend = JSON.parse(req.responseText)['friend'];
                        addToFriendsTable(friend);
                        populateSuccessMessage("#friendsPage .successMessage", "Friend added", friend.username + " added to your friends");
                    } else {
                        const msg = getMessage(req);
                        console.error("Error adding friend:", req.status);
                        populateErrorMessage("#friendsPage .errorMessage", msg.message, msg.errorCode, "Duplicate friends aren't permitted");
                    }
                }
            });
        } else {
            console.error("Username cannot be empty");
        }
    };

    // Availability cell: "Free" (new game) or "In game" (village link). Same comparison as updateFriendAvailability.
    const availability = (username) => {
        if (!avail) return null;
        const gameId = avail.get(username.toLowerCase());
        if (gameId === null)
            return <Link to="/newVillage" className="up-free">{'\u{1F7E2} Free'}</Link>;
        return <Link to={"/village/" + gameId} className="up-busy">{'\u{1F534} In game'}</Link>;
    };

    const list = friends ?? [];

    return (
        <div id="friendsPage" className={show ? 'up-section' : 'hidden'}>
            {/* addFriend: search box to add a friend */}
            <h2 className="up-h2">Add a friend</h2>
            <div id="addFriend" className="w-full">
                <SearchPlayer onSearch={searchThePlayer} buttonText="Add!" />
            </div>

            <SuccessMessage />
            <InfoMessage />
            <ErrorMessage />

            {/* listFriend: the friends table (sortable by sorttable.js, scrolls sideways on phones) */}
            <div id="listFriend" className="flex flex-col gap-3">
                <h2 className="up-h2">Your Friends</h2>
                <div id="friendsTable" className="up-table-wrap">
                    <table id="my_friends" ref={tableRef} className="sortable up-table">
                        <thead>
                            <tr>
                                <th style={{ width: '30%' }}>Username</th>
                                <th style={{ width: '15%' }}>Available</th>
                                <th style={{ width: '20%' }}>Games together</th>
                                <th style={{ width: '20%' }}>Since</th>
                                <th style={{ width: '15%' }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {friends !== null && friends.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="up-empty">Here you can find your friends.</td>
                                </tr>
                            )}
                            {list.map((friend) => (
                                <tr key={friend.username}>
                                    <td>
                                        <Link to={"/habitant/" + friend.username} className="up-name">
                                            <UserToken username={friend.username} size="sm" />
                                            {friend.username}
                                        </Link>
                                    </td>
                                    <td>{availability(friend.username)}</td>
                                    <td>{friend.commonGame}</td>
                                    <td>{friend.friendship_date}</td>
                                    <td>
                                        <Button type="button" variant="wax" size="sm" className="min-h-11 min-w-16"
                                                onClick={() => deleteFriend(friend.username)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
