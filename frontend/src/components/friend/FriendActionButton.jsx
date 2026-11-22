import { useEffect, useState } from 'react';
import {
    contextPath, genericGETRequest, genericPOSTRequest, genericDELETERequest, getMessage,
    HTTP_STATUS_OK, HTTP_STATUS_CREATED, JSON_resource_list,
} from '../../utils/utils.js';

/*
 * Port of js/friend/friendActionButton.js: "Add friend" / "Remove friend" button of the statistics page
 * (rendered inside #friendButtonContainer). Not shown for the logged user's own page.
 */
export default function FriendActionButton({ username }) {
    // resource-list of GET user/me/friend; null = not loaded or failed (the old code showed no button then)
    const [list, setList] = useState(null);

    const checkFriend = (req) => {
        if (req.readyState === XMLHttpRequest.DONE && req.status === HTTP_STATUS_OK)
            setList(JSON.parse(req.responseText)[JSON_resource_list]);
    };

    const loadFriendList = () => {
        genericGETRequest(contextPath + "user/me/friend", checkFriend);
    };

    useEffect(() => {
        loadFriendList();
    }, [username]);

    const removeFriend = () => {
        genericDELETERequest(contextPath + "user/me/friend", JSON.stringify({ friend: { username } }), (req) => {
            if (req.readyState === XMLHttpRequest.DONE) {
                if (req.status === HTTP_STATUS_OK) {
                    setList(null); // the old button was removed, then re-created by loadFriendList()
                    loadFriendList();
                } else {
                    console.error("Error deleting friend:", req.status);
                }
            }
        });
    };

    const addFriend = () => {
        genericPOSTRequest(contextPath + "user/me/friend", JSON.stringify({ friend: { username } }), (req) => {
            if (req.readyState === XMLHttpRequest.DONE) {
                if (req.status === HTTP_STATUS_CREATED) {
                    setList(null);
                    loadFriendList();
                } else {
                    // The original calls populateErrorMessage("#friendsPage .errorMessage", ...), an element that does
                    // not exist on this page, so nothing is shown to the user. Kept as is (bug reported).
                    getMessage(req);
                }
            }
        });
    };

    if (list == null || username === localStorage.getItem("playerName")) return null;

    const isFriend = list.some((friend) => friend['friend'].username === username);
    return (
        <button type="button" id="friendActionButton" onClick={isFriend ? removeFriend : addFriend}
                className={`block ml-auto w-[145px] h-10 px-2.5 py-1.5 rounded-[20px] border-0 cursor-pointer text-text-color-fixed transition-all duration-300 ease-[ease] hover:scale-105 ${isFriend ? '!bg-red-color' : 'bg-navbar-second-bg'}`}>
            {isFriend ? 'Remove friend' : 'Add friend'}
        </button>
    );
}
