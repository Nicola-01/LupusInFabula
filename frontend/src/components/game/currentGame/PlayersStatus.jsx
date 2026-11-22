/* Players area (old playersStatus part of currentGame.jsp). Filled by the engine (playersStatus.js). */
export default function PlayersStatus() {
    return (
        <div id="playersStatusExternal" className="mb-4 w-full p-1 min-[768px]:mb-0 min-[768px]:w-1/2">
            <h2 className="mt-0 mb-2 text-[calc(1.3rem+.6vw)] font-medium leading-[1.2]">HABITANTS STATUS</h2>
            <div id="playersStatus" className="flex flex-wrap p-2"></div>
        </div>
    );
}
