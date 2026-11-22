/* Village logs area (old gameLog part of currentGame.jsp). Filled by the engine (gameLog.js). */
export default function GameLog() {
    return (
        <div id="gameLogExternal" className="w-full p-1 min-[768px]:w-1/2">
            <h2 className="mt-0 mb-2 text-[calc(1.3rem+.6vw)] font-medium leading-[1.2]">VILLAGE LOGS</h2>
            <div id="gameLog" className="flex flex-wrap p-2"></div>
        </div>
    );
}
