/* Game over banner (old gameOver.jsp). The texts are filled by the engine (currentGame.js setGameOver). */
export default function GameOver() {
    return (
        <div id="gameOverMessage" className="mb-12 mt-4 text-center">
            <div className="text-[calc(1.475rem+2.7vw)] font-bold leading-[1.2] min-[1200px]:text-[3.5rem]">THE GAME IS OVER</div>
            <div id="winning_faction" className="mb-4 text-[calc(1.425rem+2.1vw)] font-light leading-[1.2] min-[1200px]:text-[3rem]"></div>
            <div id="gameTime"></div>
        </div>
    );
}
