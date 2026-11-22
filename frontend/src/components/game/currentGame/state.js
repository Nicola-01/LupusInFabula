/*
 * Mutable state shared by the currentGame engine modules (the old script-level globals of
 * js/game/currentGame.js, gameActions.js, playersStatus.js, gameLog.js and gameWebSocket.js).
 * Only one game page is mounted at a time, so a module-level object is enough.
 */
export const state = {
    gameID: null,
    endsWithMaster: false,
    // gameActions.js
    wolfPack: [],
    gameRound: undefined,
    gamePhase: undefined,
    currentVoteSection: 0,
    playersOrder: [],
    samPlayer: undefined,
    plagueSpreaderPlayer: undefined,
    // playersStatus.js
    playerRole: [],
    // gameLog.js
    logs: [],
    divLogs: null,
    // gameWebSocket.js (one socket per initGameWS call, as before)
    sockets: [],
};
