import { toggleCard } from './playersStatus.js';
import { ErrorMessage } from '../../Messages.jsx';

/*
 * The player's own card (old playerRole.jsx). The role text and the card faces are filled by the engine
 * (playersStatus.js); double click on the card or the eye button flips it (toggleCard).
 */
export default function PlayerRole() {
    return (
        <>
            <div className="mb-4 flex flex-wrap items-center justify-center -mx-3">
                <div className="mx-auto w-full p-2 text-center min-[768px]:w-5/6 min-[992px]:w-2/3" style={{ margin: 'auto' }}>
                    <div id="playerRole" className="mb-2 w-full text-center text-[2em]"></div>

                    <div id="cardContainer" className="card-container">
                        <div id="card" className="card mx-auto" onDoubleClick={() => toggleCard()}>
                            <div className="card-face card-front">
                                {/* Front of card */}
                            </div>
                            <div className="card-face card-back" style={{ backgroundImage: "url(/lupus/media/cards/card_back/lupusBack.png)" }}>
                                {/* Back of card */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ErrorMessage />
        </>
    );
}
