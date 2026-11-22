import { useEffect, useRef, useState } from 'react';
import SearchPlayer from '../SearchPlayer.jsx';
import { ErrorMessage, InfoMessage, SuccessMessage } from '../Messages.jsx';
import {
    contextPath, genericGETRequest, genericPOSTRequest, genericDELETERequest, getMessage,
    HTTP_STATUS_OK, HTTP_STATUS_CREATED, JSON_resource_list,
} from '../../utils/utils.js';
import { playersToIgnore, clearSearchBar } from '../../utils/searchPlayer.js';
import { populateErrorMessage, populateInfoMessage, populateSuccessMessage } from '../../utils/message.js';
import { ROW, TABLE, cell } from '../user/shared.js';
import { useSorttable } from '../user/externalScripts.js';

/*
 * Port of jsp/friend/friend.jsp + js/friend/friendManagement.js (the "Friends" tab of the personal area).
 * friends: null until the list is loaded (the old table was empty until then), then the array of friend objects.
 * avail: null, or a Map lower-case username -> gameId (null = free), from GET user/search/.
 */
export default function FriendsPanel({ show }) {
    const [friends, setFriends] = useState(null);
    const [avail, setAvail] = useState(null);
    const tableRef = useRef(null);
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
                playersToIgnore.push(localStorage.getItem("playerName").toLowerCase());
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
        loadFriendList();
        // bfcache restore: reload the list (friendManagement.js pageshow)
        const onPageShow = (event) => { if (event.persisted) loadFriendList(); };
        window.addEventListener('pageshow', onPageShow);
        return () => window.removeEventListener('pageshow', onPageShow);
    }, []);

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
            return <a href={contextPath + "newVillage"} className="no-underline text-[rgba(0,200,0,1)] hover:font-bold">{'\u{1F7E2} Free'}</a>;
        return <a href={contextPath + "village/" + gameId} className="no-underline text-[rgba(200,0,0,1)] hover:font-bold">{'\u{1F534} In game'}</a>;
    };

    const list = friends ?? [];

    return (
        <div id="friendsPage" className={show ? 'block pb-2' : 'hidden'}>
            {/* addFriend: search box to add a friend */}
            <div id="addFriend" className={`${ROW} justify-center h-[70px]`}>
                <div className="shrink-0 w-3/4 px-3 relative">
                    <SearchPlayer onSearch={searchThePlayer} buttonText="Add!" />
                </div>
            </div>

            <SuccessMessage />
            <InfoMessage />
            <ErrorMessage />

            {/* listFriend: the friends table */}
            <div id="listFriend" className="flex flex-wrap justify-center mx-auto mt-4">
                <h2 className="w-full px-3 text-center text-[calc(1.3rem_+_0.6vw)] font-medium leading-[1.2] mt-0 mb-2">Your Friends</h2>
                <div id="friendsTable" className="w-full p-0 max-h-[500px] overflow-y-auto">
                    <table id="my_friends" ref={tableRef} className={`sortable ${TABLE} mb-0`}>
                        <thead className="sticky top-0 z-[1]">
                            <tr>
                                <th style={{ width: '30%' }} className={cell(2)}>Username</th>
                                <th style={{ width: '15%' }} className={cell(2)}>Available</th>
                                <th style={{ width: '20%' }} className={cell(2)}>Games together</th>
                                <th style={{ width: '20%' }} className={cell(2)}>Since</th>
                                <th style={{ width: '15%' }} className={cell(2)}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {friends !== null && friends.length === 0 && (
                                <tr>
                                    <td colSpan={5} className={cell(1)}>Here you can find your friends.</td>
                                </tr>
                            )}
                            {list.map((friend, i) => (
                                <tr key={friend.username}>
                                    <td className={cell(i + 1)}>
                                        <a href={contextPath + "habitant/" + friend.username}
                                           className="text-text-color no-underline hover:font-bold hover:text-navbar-inverted-bg">{friend.username}</a>
                                    </td>
                                    <td className={cell(i + 1)}>{availability(friend.username)}</td>
                                    <td className={cell(i + 1)}>{friend.commonGame}</td>
                                    <td className={cell(i + 1)}>{friend.friendship_date}</td>
                                    <td className={cell(i + 1)}>
                                        <button type="button"
                                                className="block m-auto px-2.5 py-1.5 rounded-[20px] border-0 cursor-pointer bg-navbar-second-bg text-white transition-all duration-300 ease-[ease] hover:scale-105 hover:bg-red-color"
                                                onClick={() => deleteFriend(friend.username)}>Delete</button>
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
