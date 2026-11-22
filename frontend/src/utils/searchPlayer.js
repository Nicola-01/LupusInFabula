/**
 * Player search helpers (utils for components/SearchPlayer.jsx, port of js/utils/searchPlayer.js).
 */

/** Minimum size of the search string. */
export const minSizeSearch = 1;

/**
 * Usernames to hide from the search results (lower case). Pages push into it, as the old pages did.
 * @type {string[]}
 */
export const playersToIgnore = [];

/**
 * Wraps the part of the username that matches `contains` in <b> (case-insensitive).
 *
 * @param {string} player - The player username.
 * @param {string} contains - The string to highlight.
 * @returns {string} HTML string.
 */
export function highlightContains(player, contains) {
    const index = player.toLowerCase().indexOf(contains.toLowerCase());
    if (index !== -1) {
        const prefix = player.substring(0, index);
        const highlighted = player.substring(index, index + contains.length);
        const suffix = player.substring(index + contains.length);
        return prefix + "<b>" + highlighted + "</b>" + suffix;
    } else {
        return player;
    }
}

/** Clears the search input (id playerUsername). */
export function clearSearchBar() {
    document.getElementById("playerUsername").value = "";
}
